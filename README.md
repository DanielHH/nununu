# Nununu
Nununu is designed to be a complete order and and payment service primarily
geared towards food trucks. Initially the aim is to provide this service to the
food trucks at campus Valla at Linköping University.

## Functional specification:
Nununu consists of two mobile applications. One is intended to be used by food truck
personnel and the other application is intended for their customers. Through
these applications food trucks will be able to configure their own menus,
receive incoming orders and process them. Their customers, through their version
of the app, will be presented with all available food trucks, view their menu and
make an order. Once the food has been prepared by the food trucks a notification
will be sent to the customer indicating that the food is ready to be picked up.

## Technological specification:
In order to achieve the functional specifications we've chose to work in the
following fashion.

#### Client framework
##### Q: What framework have you chosen?
##### A: We've chosen to work with **React Native**
##### Q: Why?
##### A: Everyone has smartphones and react native allows us to exist on both iOS and the android platform with only one code base.
##### Q: Why not just make a web-app?
##### A: Two reasons (1) Push notifications (2) performance.

#### Server framework
##### Q: What framework have you chosen?
##### A: We've chosen to work with **Flask**
##### Q: Why?
##### A: We like python and we have some prior experience using Flask
##### Q: But wait... Flask is synchronous?
##### A: Yes, but there are ways to make it asynchronous using third party libraries.

## Screencasts
Demonstration of apps: https://youtu.be/YUqSnBlcv0o

Code: https://youtu.be/XVho5d8Yo9Q