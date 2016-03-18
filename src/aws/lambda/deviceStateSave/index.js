//var doc = require('dynamodb-doc');
var Firebase = require('firebase');
var config = require('./config');
var _ = require('lodash');

exports.handler = function(event, context) {

	var ref = new Firebase(config.firebase.url);
	
	var deviceName = event.device;
	var probeName = event.probe;
	
	ref.authWithPassword(
		{
			'email': config.firebase.email,
			'password': config.firebase.pwd
		},
		function(error, authData) {
		
			if(error) {
				context.fail('Firebase Auth Exception: ' + error);
			}
			else {
				var userRef = ref.child(authData.uid);
				
				userRef.once('value',
					function(userSnapshot) {
						
						if(userSnapshot.exists()) {
							
							if(userSnapshot.child(deviceName).exists()) {
								
								var deviceRef = userSnapshot.child(deviceName).ref();
								
								deviceRef.child(probeName).set(_.omit(event, 'name'), function(error) {
									if(error) {
										context.fail('Probe Update Exception: ' + error);
									}
									else {
										deviceRef.child('lastUpdate').set(new Date().getTime(), function(error) {
											if(error) {
												context.fail('Device Update Exception: ' + error);
											}
											else {
												context.succeed();
											}
										});
									}
								});
							}
							else {
								context.fail('No readings could be found for the ' + deviceName + ' controller.');
							}
						}
						else {
							context.fail('A queue mesh account could not be found with the supplied credentials.');
						}
					}
				);				
			}
		}
	);
};