(function() {
	'use strict';
	
	var _ = require('lodash');
	var request = require('request');
	
	var Stoker = function(ip, debug) {
		
		this.debug = debug || false;
		
		this.ip = ip;
		this.state = {
			sensors: []
		};
	}

    Stoker.prototype.getState = function(callback) {
		
		var self = this;
		
		var timestamp = new Date().getTime();
		var url = 'http://' + self.ip + '/stoker.json?version=true&nocache=' + timestamp;
		
		var debugData = { 
			sensors: [
				{ 
					id: 'F10000110A69A830',
					probe: 'Brisket',
					type: 'None',
					targetTemp: 225,
					highTemp: 200,
					lowTemp: 32,
					currentTemp: 65.6 
				}
			]
		};
		
		if(self.debug) {
			callback(null, debugData);
		}
		else {
			request(url, function (error, response, body) {
				if (!error) {
					
					self.state.sensors = [];
					
					var data = JSON.parse(body).stoker;
					
					_.forEach(data.sensors, function(sensor) {
						self.state.sensors.push({
							id: sensor.id,
							probe: sensor.name,
							type: sensor.al === 2 ? 'Fire' : sensor.al === 1 ? 'Food' : 'None',
							targetTemp: sensor.ta,
							highTemp: sensor.th,
							lowTemp: sensor.tl,
							currentTemp: sensor.tc
						});
					});

					callback(null, self.state);
				} 
				else {
					callback(error, self.state);
				}
			});
		}
    };
	
	Stoker.prototype.setSensorConfig = function(sensor, callback) {
		
		var self = this;
		
		var config = {
			stoker: {
				sensors: [
					{
						id: sensor.id,
						name: sensor.name,
						al: sensor.type === 'Fire' ? 2 : sensor.type === 'Food' ? 1 : 0,
						ta: sensor.targetTemp,
						th: sensor.highTemp,
						tl: sensor.lowTemp,
					}
				]
			}
		};

		var options = {
			url: 'http://' + self.ip + '/stoker.Json_Handler',
			method: 'POST',
			json: config
		};
		
		request(options, function (error, response, body) {
			if (!error) {
				if(response.statusCode === 200) {
					console.log('Config Success');
				}
				else {
					console.log('Config Error');
				}
				
				callback(null, self.state);
			} 
			else {
				console.log('Error: ', error);
				callback(error, self.state);
			}
		});
	}

	module.exports = Stoker;
	
})();