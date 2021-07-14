/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    'http://52.77.209.254:8088/gmt/': {
      target: 'http://52.77.209.254:8088',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  test: {
    '/gmt/': {
      target: 'http://52.77.209.254:8088',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/gmt/': {
      target: 'http://52.77.209.254:8088',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
