const backendServer = require('./server');

const cfg = require('./config');

backendServer(cfg.Port.BACKEND);
