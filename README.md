# Echo Iot Demo
A demo of integrating the Amazon Echo with an Amazon IoT connected device.

This demonstration is an integration between an Amazon Echo and a [Rock's BBQ](https://www.rocksbarbque.com/) Stoker II Power Draft System via an IoT connected device - a Raspberry Pi 2 in this instance.

You will need to complete the following steps to re-create the integration.

* [Required Accounts](#accounts)
* [Alexa Skills Application](#alexa)
* [AWS Lambda Functions](#lambda)
* [AWS IoT](#iot)

3. Update the following source files with the appropriate account data.
  * src/device/config.js
    * YOUR-DEVICE-REST-API-ENDPOINT-HOST
    * YOUR-DEVICE-THING-NAME
  * src/aws/lambda/quemesh/config.js
    * YOUR-AMAZON-ECHO-APP-ID
    * YOUR-FIREBASE-APP-NAME
    * YOUR-FIREBASE-EMAIL
    * YOUR-FIREBASE-PASSWORD
  * src/aws/lambda/quemesh/device.js
    * YOUR-DEVICE-REST-API-ENDPOINT-HOST
  * src/aws/lambda/deviceStateSave/config.js
    * YOUR-FIREBASE-APP-NAME
    * YOUR-FIREBASE-EMAIL
    * YOUR-FIREBASE-PASSWORD
  * src/aws/alexa/tests/*.json
    * YOUR-AMAZON-ECHO-APP-ID
    * YOUR-AMAZON-ECHO-SDK-ACCOUNT-ID

<a name="accounts"></a>
## Required Accounts
  * [Amazon AWS Account](https://www.amazon.com/ap/signin)
  * [Firebase Account](https://www.firebase.com/login/)

<a name="alexa"></a>
## Alexa Skills Application

<a name="lambda"></a>
## AWS Lambda Functions
  * deviceStateSave ([Source](https://github.com/javaday/EchoIotDemo/tree/master/src/aws/lambda/deviceStateSave))
  * quemesh ([Source](https://github.com/javaday/EchoIotDemo/tree/master/src/aws/lambda/quemesh))

<a name="iot"></a>
## AWS IoT
  * Connect a device and download the certs.
    * Download to src/device/certs/
    * Rename to 
  * Create a rule (SELECT * FROM 'quemesh-device-state') to forward messages to the 'deviceStateSave' lambda function.

src/device/certs/
	root-CA.crt
	certificate.pem.crt
	private.pem.key

	

