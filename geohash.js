
// ip-geohash-influx

// Create a TCP Server to receive Log Messages 
// reads the IP from the Log and grab Geo Information from ipstack.com
// write geo infos into influx

//var a = "Jul  3 16:13:28 knaak sshd[23273]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=179.184.161.53";

//https://ipstack.com/usage


var geohash = require("ngeohash");
const axios = require("axios");
const Influx = require("influx");

// TCP handles
const net = require('net');

const config = require('./config.json');
const tcpserver_host = config.tcpserver.host;
const tcpserver_port = config.tcpserver.port;
const influxserver_host = config.influxserver.host;
const ipstack_url = config.ipstack.url;
const ipstack_key = config.ipstack.key;

//const port = 7070;
//const host = "127.0.0.1";


//create TCP Server 
const server = net.createServer();
server.listen(tcpserver_port, tcpserver_host, () => 
{
        console.log('TCP Server is running on '+ tcpserver_host + ' port: ' + tcpserver_port + '.');        
});

let sockets = [];

server.on('connection', function(sock) 
{
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    
    sockets.push(sock);
    sock.on('data', function(data) 
    {
       
        console.log(data);        
        let message = JSON.parse("" + data)
        console.log(message);

        var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;                
        var a = message.ip;
        var t = a.match(r);
        var ip = (t[0]);
        var accessKey = ipstack_key[Math.floor(Math.random()*ipstack_key.length)];        

        console.log(ip);        
        console.log(message.username);
        console.log(message.port);               

        // IP Stack API Initialization.
        const instance = axios.create({
            baseURL: ipstack_url
        });
        instance
            .get(`/${ip}?access_key=${accessKey}`)
            .then(function(response) 
            {
                const apiResponse = response.data;

                let hash = geohash.encode(apiResponse.latitude, apiResponse.longitude);
                const influx = new Influx.InfluxDB(influxserver_host)    

                influx.writePoints(
                    [{
                        measurement: "geossh",
                        fields: {
                            value: 1
                        },
                        tags: {
                            geohash: hash,
                            geohash_lat: apiResponse.latitude,
                            geohash_lon: apiResponse.longitude,
                            continent_name: apiResponse.continent_name,
                            country_code: apiResponse.country_code,
                            country_name: apiResponse.country_name,
                            region_code: apiResponse.region_code,
                            region_name: apiResponse.region_name,
                            city: apiResponse.city,
                            zip: apiResponse.zip,
                            country_flag: apiResponse.location.country_flag,                            
                            country_flag_emoji: apiResponse.location.country_flag_emoji,                            
                            username: message.username,
                            port: message.port,
                            ip: ip,
                            info: ip + ' ' + apiResponse.city + ' (' + apiResponse.country_code + ')' 
                        }
                    }]
                ).catch(error => console.log({ error }));
  
                console.log(apiResponse)                
            })
            .catch(function(error) {
                console.log(error);
            });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
  })