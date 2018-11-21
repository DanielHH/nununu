// In App.js in a new project

import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator} from "react-navigation";
import HomeScreen from "./screens/HomeScreen"

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
});

export default AppNavigator;
