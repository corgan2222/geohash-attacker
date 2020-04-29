# geohash-attacker
TCP Server wich looks for Geo information from a IP, wich is given by rsyslog if someone failed to login into ssh/mail
store this infos in InfluxDB 
view in grafana

Setup: 
- git clone https://github.com/corgan2222/geohash-attacker
- cd geohash-attacker
- cp config.sample.json config.json
- edit config.json and put in your data

prepared for PM2
- just run #pm2 start ecosystem.config.js 

settings for rsyslog.conf
https://github.com/corgan2222/geohash-attacker/tree/master/rsyslog
