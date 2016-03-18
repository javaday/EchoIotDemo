var http = require('http');
var _ = require('lodash');
var config = require('./config');
var Device = require('./device');
var Stoker = require('./stoker');

var device = new Device(config);
var stoker = new Stoker(config.stoker.ip, config.stoker.debug);

device.connect(function() {
	
	device.update = updateProbe;
	
	var timer = setInterval(function () {

		stoker.getState(function(error, state) {
			
			if(error) {
				console.log('Stoker Error:', error);
				clearInterval(timer);
			}
			else {
				
				var timestamp = new Date().getTime();
				
				_.forEach(state.sensors, function(sensor) {
					
					sensor.device = config.device.name;
					sensor.timestamp = timestamp;
					
					//console.log('Publishing: ', sensor);
					
					device.publish('quemesh-device-state', JSON.stringify(sensor));
				});
				
			}
		});

	}, config.stoker.interval * 1000);

});

function updateProbe(state) {
	
	stoker.setSensorConfig(state, function(error, newState) {
		
	});
}

var server = http.createServer(function(request, response) {
	response.end('It Works!! Path Hit: ' + request.url);
});

server.listen(config.port, function(){
    console.log("Server listening on: http://localhost:%s", config.port);
});