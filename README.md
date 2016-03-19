# Echo Iot Demo
A demo of integrating the Amazon Echo with an Amazon IoT connected device.

This demonstration is an integration between an Amazon Echo and a [Rock's BBQ](https://www.rocksbarbque.com/) Stoker II Power Draft System via an IoT connected device - a Raspberry Pi 2 in this instance.

* [Required Accounts](#accounts)
* [Alexa Skills Application](#alexa)
* [AWS IoT](#iot)

<a name="accounts"></a>
## Required Accounts
You will need an Amazon AWS developer account and a Firebase account. You will also need to create a Firebase application.
  * [Amazon AWS Account](https://www.amazon.com/ap/signin)
  * [Firebase Account](https://www.firebase.com/login/)

**Note:** The following source files will need to be updated with the respective account data. You won't know the DEVICE and ECHO settings until you complete [Alexa Skills Application](#alexa) and [AWS IoT](#iot) steps below.
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

<a name="alexa"></a>
## Alexa Skills Application
1. Use this tutorial as a guide: [Developing an Alexa Skill as a Lambda Function](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function)
2. Create the following lambda functions:
  * deviceStateSave ([Source](https://github.com/javaday/EchoIotDemo/tree/master/src/aws/lambda/deviceStateSave))
  * quemesh ([Source](https://github.com/javaday/EchoIotDemo/tree/master/src/aws/lambda/quemesh))
3. Use the [intents.txt](https://github.com/javaday/EchoIotDemo/blob/master/src/aws/alexa/intents.txt) for the Intents Schema.
4. Use the [listOfAlarms.txt](https://github.com/javaday/EchoIotDemo/blob/master/src/aws/alexa/listOfAlarms.txt), [listOfControllers.txt](https://github.com/javaday/EchoIotDemo/blob/master/src/aws/alexa/listOfControllers.txt), and [listOfProbes.txt](https://github.com/javaday/EchoIotDemo/blob/master/src/aws/alexa/listOfProbes.txt) for the Custom Slot Types.
4. Use the [uterances.txt](https://github.com/javaday/EchoIotDemo/blob/master/src/aws/alexa/utterances.txt) for the Sample Utterances.

<a name="iot"></a>
## AWS IoT
  * Connect a device and download the certs.
    * Download to src/device/certs/
    * Rename to:
      * root-CA.crt
      * certificate.pem.crt
      * private.pem.key
  * Create a rule (SELECT * FROM 'quemesh-device-state') to forward messages to the 'deviceStateSave' lambda function.

	
	
	

	

