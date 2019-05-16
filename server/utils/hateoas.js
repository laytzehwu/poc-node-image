const RequestMethod = require('./http').RequestMethod;

function filterLinks (links) {
        return links.filter((link) => {
            return (typeof link.isApplicable === 'function') ? link.isApplicable() : true;
        });
    }

function createLinks (request, resource, links, mapping) {
    const urlPrefix = getUrlPrefix(request);

    return filterLinks(links).reduce((result, value) => {
        let href;

        // Create fully qualified URL
        href = value.href.startsWith('/') ? urlPrefix + value.href : value.href;

        // Resolve placeholders in URL based on the provided mapping
        if (mapping) {
            for (let [placeholder, descriptor] of Object.entries(mapping)) {
                let placeholderValue = descriptor.value || resource[descriptor.property];
                href = href.replace(new RegExp(`:${placeholder}`, 'g'), placeholderValue);
            }
        }

        result.push({
            rel: value.rel,
            href: href,
            method: value.method
        });

        return result;
    }, []);
}

function getUrlPrefix (request) {
    return request.protocol + '://' + request.get('host');
}

function updateQueryStringParameter (url, key, value) {
    let re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    let separator = url.indexOf('?') !== -1 ? '&' : '?';
    if (url.match(re)) {
        return url.replace(re, '$1' + key + '=' + value + '$2');
    } else {
        return url + separator + key + '=' + value;
    }
}

function wrapResource ({
    content,
    links,
    linkParametersMapping,
    request,
    linksProperty = '_links'
} = {}) {
    let clonedContent = Object.assign({}, content);

    if (clonedContent && clonedContent.hasOwnProperty(linksProperty)) {
        throw new Error(`Resource already contains a property with name '${linksProperty}'`);
    }

    let mappedLinks = createLinks(request, clonedContent, links, linkParametersMapping);
    clonedContent[linksProperty] = mappedLinks;

    return clonedContent;
}

function wrapResources ({
    content,
    links,
    linkParametersMapping,
    request,
    linksProperty = '_links'
} = {}) {
    let result;

    if (Array.isArray(content)) {
        result = content.map(item => wrapResource({
            content: item,
            links,
            linkParametersMapping,
            request,
            linksProperty
        }));
    } else {
        result = wrapResource({
            content,
            links,
            linkParametersMapping,
            request,
            linksProperty
        });
    }

    return result;
};

function wrapAsPageResource ({
    content,
    request,
    pageSize,
    page,
    collectionKey,
    currentPageProperty = 'currentPage',
    totalPagesProperty = 'totalPages',
    totalItemsProperty = 'totalItems',
    pageProperty = 'page',
    pageSizeProperty = 'size',
    contentProperty = '_embedded',
    linksProperty = '_links',
    includeTotalItems = false
} = {}) {
    const urlPrefix = getUrlPrefix(request);
    const originalUrl = urlPrefix + request.originalUrl;
    let wrapper = {};
    let embedded = {};
    let result;
    let links = [{
        rel: 'self',
        href: originalUrl
    }];
    let firstPage, previousPage, currentPage, nextPage, lastPage, offset, url;

    // If query parameters are defined for pagination then assembe the wrapper
    if (!isNaN(page) && !isNaN(pageSize)) {
        nextPage = ((page + 1) * pageSize >= content.length) ? page : (page + 1);
        firstPage = 0;
        previousPage = (page - 1) > 0 ? (page - 1) : 0;
        lastPage = Math.floor(content.length / pageSize) - (content.length % pageSize === 0 && content.length > 0 ? 1 : 0);
        currentPage = page + 1;
        offset = page * pageSize;

        result = content.filter((value, index) => {
            return (index >= offset) && index < (offset + pageSize);
        });

        url = updateQueryStringParameter(originalUrl, pageSizeProperty, pageSize);

        if (firstPage < page) {
            links.push({
                rel: 'first',
                href: updateQueryStringParameter(url, pageProperty, firstPage)
            });
        }
        if (previousPage < page) {
            links.push({
                rel: 'prev',
                href: updateQueryStringParameter(url, pageProperty, previousPage)
            });
        }
        if (nextPage > page) {
            links.push({
                rel: 'next',
                href: updateQueryStringParameter(url, pageProperty, nextPage)
            });
        }
        if (lastPage > page) {
            links.push({
                rel: 'last',
                href: updateQueryStringParameter(url, pageProperty, lastPage)
            });
        }

        wrapper[totalPagesProperty] = Math.ceil(content.length / pageSize);
        wrapper[currentPageProperty] = currentPage;
    }
    // otherwise return the whole dataset without pagination
    else {
        result = content;
    }

    if (typeof collectionKey === 'string') {
        embedded[collectionKey] = result;
        wrapper[contentProperty] = embedded;
    } else {
        wrapper[contentProperty] = result;
    }
    wrapper[linksProperty] = links.reduce((result, value) => {
        result.push({
            rel: value.rel,
            href: value.href,
            method: RequestMethod.GET
        });
        return result;
    }, []);
    if (includeTotalItems) {
        wrapper[totalItemsProperty] = content.length;
    }

    return wrapper;
}

module.exports = {
    getUrlPrefix,
    wrapAsPageResource,
    wrapResource,
    wrapResources
};
