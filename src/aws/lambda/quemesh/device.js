(function() {
	'use strict';
	
	var AWS = require('aws-sdk');
	var _ = require('lodash');
	var config = require("./config");
	
	var Device = function(config) {
		
		this.config = config;
		this.iot = null;
	}

	Device.prototype.setup = function(done) {
		
		this.iot = new AWS.IotData({endpoint: this.config.iot.endpoint});
		
		done();
	};
	
	Device.prototype.update = function(message, done) {
		
		var params = {
			payload: message,
			thingName: this.config.aws.thingName
		};
		
		this.iot.updateThingShadow(params, function(err, data) {
			done(err);
		});
	};

	module.exports = Device;
	
})();