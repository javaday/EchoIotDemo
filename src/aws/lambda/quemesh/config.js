var config = {
	aws: {
		thingName: 'quemesh-device'
	},
	alexa: {
		'appId': 'amzn1.echo-sdk-ams.app.YOUR-AMAZON-ECHO-APP-ID'
	},
	firebase: {
		url: 'https://YOUR-FIREBASE-APP-NAME.firebaseIO.com',
		email: 'YOUR-FIREBASE-EMAIL',
		pwd: 'YOUR-FIREBASE-PASSWORD'
	},
	iot: {
		endpoint: 'YOUR-DEVICE-REST-API-ENDPOINT-HOST'
	}
}

module.exports = config;