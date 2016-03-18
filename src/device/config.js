var config = {
	aws: {
		'host': 'YOUR-DEVICE-REST-API-ENDPOINT-HOST',
		'port': 8883,
		'clientId': 'device-' + new Date().getTime(),
		'thingName': 'YOUR-DEVICE-THING-NAME',
		'caCert': __dirname + '/certs/root-CA.crt',
		'clientCert': __dirname + '/certs/certificate.pem.crt',
		'privateKey': __dirname + '/certs/private.pem.key',
    	'region': 'us-east-1',
    	debug: false
	},
	port: 8080,
	device: {
		id: 'device-12345',
		name: 'Stoker'
	},
	stoker: {
		ip: 'YOUR-STOKER-IP-ADDRESS',
		interval: 15,
		debug: false
	}
}

module.exports = config;