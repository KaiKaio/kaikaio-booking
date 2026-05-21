module.exports = {
  apps: [
    {
      name: 'kaikaio-booking-h5',
      script: 'kaikaio-booking-h5-server.js'
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '47.99.134.126',
      ref: 'origin/master',
      repo: 'git@git.zhlh6.cn:Nick930826/kaikaio-booking-h5.git',
      path: '/workspace/kaikaio-booking-h5',
      'post-deploy': 'git reset --hard && git checkout master && git pull && npm i --production=false && pm2 startOrReload ecosystem.config.js', // -production=false 下载全量包
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}