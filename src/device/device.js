(function() {
	'use strict';
	
	var awsIot = require('aws-iot-device-sdk');
	var config = require("./config");
	
	var Device = function(config) {
		
		this.config = config;
		this.lastTimestamp = 0;
		this.iot = null;
		this.state = {
			deviceId: '',
			timestamp: 0
		};
	}
	
	Device.prototype.connect = function(done) {
		
		var self = this;
		
		//this.iot = awsIot.device(this.config.aws);
		this.iot = awsIot.thingShadow(this.config.aws);
		
		this.iot.on('connect', function() {
			
			console.log('Connected to AWS');
			
			self.iot.register(self.config.aws.thingName);
			
			self.iot.on('delta',  function(thingName, stateObject) {
				
				console.log('received delta on ' + thingName + ': ' + JSON.stringify(stateObject));
				
				self.iot.update(self.config.aws.thingName, stateObject.state);
			});

			self.iot.on('status', function(thingName, stat, clientToken, stateObject) {
				console.log('received '+stat+' on '+thingName+': '+ JSON.stringify(stateObject));
			});

			self.iot.on('update', function(thingName, stateObject) {
				console.log('received update on '+thingName+': '+ JSON.stringify(stateObject));
			});

			self.iot.on('timeout', function(thingName, clientToken) {
				console.log('received timeout on '+thingName+ ' with token: '+ clientToken);
			});	
				
			self.iot.on('message', function(topic, message) {
				console.log('received topic: ' + topic + ', message: ' + message);
			});
			
			done();
		});
	};
	
	Device.prototype.publish = function(topic, message) {
		this.iot.publish(topic, message);
	};
	
	Device.prototype.update = function(state) {
		
	};
	
	module.exports = Device;
	
})();
