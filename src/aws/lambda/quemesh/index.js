
var config = require('./config');
var _ = require('lodash');

// Route the incoming request based on type (LaunchRequest, IntentRequest, etc.) 
// The JSON body of the request is provided in the event parameter.

exports.handler = function (event, context) {
    try {
        if (event.session.application.applicationId !== config.alexa.appId) {
             context.fail('Invalid Application ID');
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request, event.session, function callback(sessionAttributes, speechletResponse) {
				context.succeed(buildResponse(sessionAttributes, speechletResponse));
			});
        }
		else if (event.request.type === 'IntentRequest') {
            onIntent(event.request, event.session, function callback(sessionAttributes, speechletResponse) {
				context.succeed(buildResponse(sessionAttributes, speechletResponse));
			});
        }
		else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail('Exception: ' + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ('ControllerStatusIntent' === intentName) {
        getControllerStatus(intent, session, callback);
    }
    else if ('ProbeTempIntent' === intentName) {
        getProbeTemp(intent, session, callback);
    }
    else if ('ProbeTargetIntent' === intentName) {
        setProbeTarget(intent, session, callback);
    }
    else if ('ProbeHighTempIntent' === intentName) {
        setProbeHighTemp(intent, session, callback);
    }
    else if ('ProbeLowTempIntent' === intentName) {
        setProbeLowTemp(intent, session, callback);
    }
	else if ('AMAZON.HelpIntent' === intentName) {
        getWelcomeResponse(callback);
    }
	else {
        throw 'Invalid Intent';
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    // Add cleanup logic here
}

function getWelcomeResponse(callback) {
	
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = 'Welcome';
    var speechOutput = 'Welcome to Queue Mesh. ' +
        'You can get your controller status by saying, what is my stoker status.';
        
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = 'You can also get a probe temperature by saying, what is my stoker brisket temperature.';
    var shouldEndSession = false;

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getControllerStatus(intent, session, callback) {
	
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = '';

	var deviceName = _.capitalize(intent.slots.controller.value);
	
	getDevice(deviceName, function(error, device) {
		
		if(error) {
			speechOutput = error;
		}
		else {
			speechOutput = 'Here is your ' + deviceName + ' status. ';
			
			_.forOwn(_.omit(device, ['lastUpdate']), function(probe, key) {
				
				speechOutput += 'Your ' + probe.probe + ' is currently ' + probe.currentTemp + ' degrees, ';
				
				if(probe.type === 'Food') {
					
					var diff = parseFloat(Math.abs(probe.currentTemp - probe.targetTemp).toFixed(1));
					
					if(probe.currentTemp < probe.targetTemp) {
						speechOutput += 'it is ' + diff + ' degrees below its target of ' + probe.targetTemp + ' degrees. ';
					}
					else if(probe.currentTemp > probe.targetTemp) {
						speechOutput += 'it is ' + diff + ' degrees above its target of ' + probe.targetTemp + ' degrees. ';
						
						if(diff >= 15) {
							speechOutput += 'Your ' + probe.probe  + ' is probably ruined by now. ';
						}
						else if(diff >= 10) {
							speechOutput += 'You should really check your ' + probe.probe  + ' now. ';
						}
						else if(diff >= 5) {
							speechOutput += 'You should check your ' + probe.probe  + '. ';
						}
					}
					else {
						speechOutput += 'it is now done. ';
					}							
				}
				else {
					
					if(probe.currentTemp === probe.targetTemp) {
						speechOutput += 'it is on target. ';
					}
					else {
						var diff = probe.currentTemp - probe.targetTemp;
						
						if(diff < 0) {
							speechOutput += 'it is ' + Math.abs(diff).toFixed(1) + ' degrees below its target of ' + probe.targetTemp + ' degrees. ';
						}
						else {
							speechOutput += 'it is ' + Math.abs(diff).toFixed(1) + ' degrees above its target of ' + probe.targetTemp + ' degrees. ';
						}
					}
				}
			});
			
			callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
		}
	});
}

function getProbeTemp(intent, session, callback) {
    
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = '';

	var deviceName = _.capitalize(intent.slots.controller.value);
	var probeName = _.capitalize(intent.slots.probe.value);
	
	getProbe(deviceName, probeName, function(error, probe) {
		
		if(error) {
			speechOutput = error;
		}
		else {
			
			speechOutput = 'Your ' + deviceName + ' ' + probe.probe + ' is currently ' + probe.currentTemp + ' degrees, ';
			
			if(probe.currentTemp < probe.targetTemp) {
				speechOutput += 'it is not done.';
			}
			
			if(probe.currentTemp >= probe.targetTemp) {
				speechOutput += 'it is done.';
			}							
		}
		
		callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
	});
}

function setProbeTarget(intent, session, callback) {
    
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = '';
	
	var Device = require('./device');

	var deviceName = _.capitalize(intent.slots.controller.value);
	var probeName = _.capitalize(intent.slots.probe.value);
	var targetTemp = intent.slots.target.value;

	getProbe(deviceName, probeName, function(error, probe) {
		
		if(error) {
			speechOutput = error;
		}
		else {
			var device = new Device(config);
			
			probe.targetTemp = targetTemp;
			
			var desiredState = {
				state: {
					desired: _.omit(probe, ['currentTemp', 'timestamp'])
				}
			};
			
			device.setup(function() {
				device.update(JSON.stringify(desiredState), function(err) {
					if(err) {
						console.log('Shadow Update Error: ', err);
						speechOutput = 'There was an update error.';
					}
					else {
						speechOutput = 'I told your ' + deviceName + ' controller to set the ' + probeName + ' target temperature to ' + targetTemp + ' degrees.';
					}
						
					callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
				});
			});
		}
	});
}

function setProbeHighTemp(intent, session, callback) {
    
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = '';
	
	var Device = require('./device');

	var deviceName = _.capitalize(intent.slots.controller.value);
	var probeName = _.capitalize(intent.slots.probe.value);
	var targetTemp = intent.slots.target.value;

	getProbe(deviceName, probeName, function(error, probe) {
		
		if(error) {
			speechOutput = error;
		}
		else {
			var device = new Device(config);
			
			probe.highTemp = targetTemp;
			
			var desiredState = {
				state: {
					desired: _.omit(probe, ['currentTemp', 'timestamp'])
				}
			};
			
			device.setup(function() {
				device.update(JSON.stringify(desiredState), function(err) {
					if(err) {
						console.log('Shadow Update Error: ', err);
						speechOutput = 'There was an update error.';
					}
					else {
						speechOutput = 'I told your ' + deviceName + ' controller to set the ' + probeName + ' high temperature to ' + targetTemp + ' degrees.';
					}
						
					callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
				});
			});
		}
	});
}

function setProbeLowTemp(intent, session, callback) {
    
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = '';
	
	var Device = require('./device');

	var deviceName = _.capitalize(intent.slots.controller.value);
	var probeName = _.capitalize(intent.slots.probe.value);
	var targetTemp = intent.slots.target.value;

	getProbe(deviceName, probeName, function(error, probe) {
		
		if(error) {
			speechOutput = error;
		}
		else {
			var device = new Device(config);
			
			probe.lowTemp = targetTemp;
			
			var desiredState = {
				state: {
					desired: _.omit(probe, ['currentTemp', 'timestamp'])
				}
			};
			
			device.setup(function() {
				device.update(JSON.stringify(desiredState), function(err) {
					if(err) {
						console.log('Shadow Update Error: ', err);
						speechOutput = 'There was an update error.';
					}
					else {
						speechOutput = 'I told your ' + deviceName + ' controller to set the ' + probeName + ' low temperature to ' + targetTemp + ' degrees.';
					}
						
					callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
				});
			});
		}
	});
}

//-------------------- Helper Functions --------------------

function getDevice(deviceName, done) {
	
	var Firebase = require('firebase');
	
	var ref = new Firebase(config.firebase.url);
	
	ref.authWithPassword(
		{
			'email': config.firebase.email,
			'password': config.firebase.pwd
		},
		function(error, authData) {
		
			if(error) {
				done('The fire base authorization failed', null);
			}
			else {
				var userRef = ref.child(authData.uid);
				
				userRef.once('value',
					function(userSnapshot) {
						
						if(userSnapshot.exists()) {
							
							if(userSnapshot.child(deviceName).exists()) {
								
								var device = userSnapshot.child(deviceName).val();
								
								done(null, device);
							}
							else {
								done('No readings could be found for the ' + deviceName + ' controller.', null);
							}
						}
						else {
							done('A queue mesh account could not be found with the supplied credentials.', null);
						}
					}
				);				
			}
		}
	);
}

function getProbe(deviceName, probeName, done) {
	
	var Firebase = require('firebase');
	
	var ref = new Firebase(config.firebase.url);
	
	ref.authWithPassword(
		{
			'email': config.firebase.email,
			'password': config.firebase.pwd
		},
		function(error, authData) {
		
			if(error) {
				done('The fire base authorization failed', null);
			}
			else {
				var userRef = ref.child(authData.uid);
				
				userRef.once('value',
					function(userSnapshot) {
						
						if(userSnapshot.exists()) {
							
							if(userSnapshot.child(deviceName).exists()) {
								
								if(userSnapshot.child(deviceName + '/' + probeName).exists()) {
									
									var probe = userSnapshot.child(deviceName + '/' + probeName).val();
									
									done(null, probe);
								}
								else {
									done('No readings could be found for the ' + deviceName + ' controller ' + probeName + ' probe.', null);
								}
							}
							else {
								done('No readings could be found for the ' + deviceName + ' controller.', null);
							}
						}
						else {
							done('A queue mesh account could not be found with the supplied credentials.', null);
						}
					}
				);				
			}
		}
	);
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output
        },
        card: {
            type: 'Simple',
            title: 'SessionSpeechlet - ' + title,
            content: 'SessionSpeechlet - ' + output
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}