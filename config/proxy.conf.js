const serverCfg = require('../server/config');

const DEV_ASSETS_URL = `http://${serverCfg.Host.LOCALHOST}:${serverCfg.Port.ASSETS}`;
const DEV_BC_URL = `http://${serverCfg.Host.LOCALHOST}:${serverCfg.Port.BACKEND}`

const PROXY_CONFIG = [
  {
    context: [
      '/v0',
      '/auth',
    ],
    target: DEV_BC_URL,
    secure: false
  },
  {
    context: [
      '/__ASSETS_URL__'
    ],
    target: DEV_ASSETS_URL,
    secure: false,
    pathRewrite: {
      '^/__ASSETS_URL__': ""
    },
  }
]

module.exports = PROXY_CONFIG;
