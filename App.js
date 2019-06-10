import React from "react";
import {
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

import firebase from "firebase";
import { config } from "./config";

import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Profil from "./screens/Profil";
import Translate from "./screens/Translate";

firebase.initializeApp(config);

const Auth = createStackNavigator(
  {
    //Constant which holds all the screens like index of any book
    SignIn: { screen: SignIn },
    //First entry by default be our first screen
    //if we do not define initialRouteName
    SignUp: { screen: SignUp }
  },
  {
    initialRouteName: "SignIn",
    headerMode: "none"
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Profil: Profil,
    Translate: Translate
  },
  { initialRouteName: "Translate" },
  {
    navigationOptions: {
      header: null
    }
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      Auth: {
        screen: Auth
      },
      TabNavigator: {
        screen: TabNavigator
      }
    },
    {
      initialRouteName: "Auth"
    }
  )
);
