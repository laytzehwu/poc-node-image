class Route {
    constructor(url, parent = null) {
        this.url = url;
        if (parent && !(parent instanceof Route)) {
            throw new Error('Invalid parent');
        }
        this.parent = parent;
    }

    getParentUrl() {
        return this.parent ? this.parent.getUrl() : '';
    }

    getLastSegment() {
        return this.url.substr(this.url.lastIndexOf('/'));
    }

    getUrl() {
        return this.getParentUrl() + this.url;
    }

    getSlash() {
        return '/';
    }

    getRootRelativeUrl(root) {
        if (root instanceof Route) {
            return this.getUrl().substr(root.getUrl().length);
        } else {
            return this.getUrl();
        }
    }
}

const baseRoute = new Route('/v0');
const apigeeTokensRoute = new Route('/auth/experianone/v1');
const apigeeTokensCreateRoute = new Route('/token', apigeeTokensRoute);
const apigeeTokensLogoutRoute = new Route('/revokeToken', apigeeTokensRoute);
// reset
const resetRoute = new Route('/reset', baseRoute);
// tokens
const tokensRoute = new Route('/tokens', baseRoute);
const tokensCreateRoute = new Route('/create', tokensRoute);
const tokensRefreshRoute = new Route('/refresh', tokensRoute);
const logoutRoute = new Route('/logout', tokensRoute);
// factors
const factorsRoute = new Route('/factors', baseRoute);
const factorsActivateRoute = new Route('/uftbnvjjtjFTaEN200h7/activate', factorsRoute);
const factorsVerifyRoute = new Route('/uftbnvjjtjFTaEN200h7/verify', factorsRoute);
// apigee factors
const apigeeFactorsRoute = new Route('/factors', apigeeTokensRoute);
const apigeeFactorsActivateRoute = new Route('/ostffjoz3nK7Q6YqG0h7/activate', apigeeFactorsRoute);
const apigeeFactorsVerifyRoute = new Route('/ostffjoz3nK7Q6YqG0h7/verify', apigeeFactorsRoute);
// user
const userRoute = new Route('/user', baseRoute);
// env vars
const envvarsRoute = new Route('/envvars', baseRoute);
// homeUrl
const homeUrlRoute = new Route('/user/home', baseRoute);
// userPreferenceUrl
const preferencesRoute = new Route('/user/preferences', baseRoute);

module.exports = {
    resetRoute,
    userRoute,
    tokensRoute,
    tokensCreateRoute,
    tokensRefreshRoute,
    logoutRoute,
    envvarsRoute,
    factorsRoute,
    factorsActivateRoute,
    factorsVerifyRoute,
    apigeeTokensRoute,
    apigeeTokensCreateRoute,
    apigeeTokensLogoutRoute,
    apigeeFactorsRoute,
    apigeeFactorsActivateRoute,
    apigeeFactorsVerifyRoute,
    homeUrlRoute,
    preferencesRoute,
};
