## Prerequisites
* Install the Expo app (by Expo Project) on your smartphone. 

## How to build on Android
1. Enter the NununuCompany-folder in a terminal.
2. Run 'npm install' to install all necessary dependencies.
3. Run 'npm start' (or 'expo start')
4. Open the Expo app on your smartphone, press 'Scan QR Code' and point your camera to the QR code shown in the terminal.

### Problems
If you get the following error message: "Tried to register two views with the same name RNGestureHandler", 
go into node_modules/expo/node_modules and delete the folder react-native-gesture-handler.