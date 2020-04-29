# geohash-attacker
TCP Server wich looks for Geo information from a IP, wich is given by rsyslog if someone failed to login into ssh/mail and store this infos in InfluxDB to view on a worldmap in grafana

Needs a (free) account from https://ipstack.com/

Setup: 
- git clone https://github.com/corgan2222/geohash-attacker
- cd geohash-attacker
- cp config.sample.json config.json
- edit config.json and put in your data (influxurl, ipstack token)

prepared for PM2
- just run #pm2 start ecosystem.config.js 

settings for rsyslog.conf
https://github.com/corgan2222/geohash-attacker/tree/master/rsyslog
