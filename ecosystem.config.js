module.exports = 
{
  apps : 
  [
    {
      name: 'Geohash-Atacker',
      script: 'geohash.js',    
      args: '',
      instances: 1,
      autorestart: true,
      watch: true,
      pid: '~/.local/share/geohash.pid',
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
