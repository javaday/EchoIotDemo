# Echo Iot Demo
A demo of integrating the Amazon Echo with an Amazon IoT connected device.

This demonstration is an integration between an Amazon Echo and a [Rock's BBQ](https://www.rocksbarbque.com/) Stoker II Power Draft System via an IoT connected device - a Raspberry Pi 2 in this instance.

You will need to complete the following steps to re-create the integration.

1. Create the necessary accounts.
  * [Amazon AWS Account](https://www.amazon.com/ap/signin)
  * [Firebase Account](https://www.firebase.com/login/)
2. Create the AWS lambda functions.
  * deviceStateSave [Source](https://github.com/javaday/EchoIotDemo/tree/master/src/aws/lambda/deviceStateSave)
3. Configure an IoT thing in Amazon IoT.
  * Create a thing resource.
  * Connect a device and download the certs.
  * Create a rule to forward messages to the 'deviceStateSave' lambda function.
4. 

You will need to replace the settings in ALL-CAPS in the following files:

src/device/config.js
	YOUR-DEVICE-REST-API-ENDPOINT-HOST
	YOUR-DEVICE-THING-NAME
	
src/device/certs/
	root-CA.crt
	certificate.pem.crt
	private.pem.key

src/aws/lambda/quemesh/config.js
	YOUR-AMAZON-ECHO-APP-ID
	YOUR-FIREBASE-APP-NAME
	YOUR-FIREBASE-EMAIL
	YOUR-FIREBASE-PASSWORD
	
src/aws/lambda/quemesh/device.js
	YOUR-DEVICE-REST-API-ENDPOINT-HOST
	
src/aws/lambda/deviceStateSave/config.js
	YOUR-FIREBASE-APP-NAME
	YOUR-FIREBASE-EMAIL
	YOUR-FIREBASE-PASSWORD
	
src/aws/alexa/tests/*.json
	YOUR-AMAZON-ECHO-APP-ID
	YOUR-AMAZON-ECHO-SDK-ACCOUNT-ID
