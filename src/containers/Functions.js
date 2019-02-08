import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
  BackHandler,
  NetInfo
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Modal from "react-native-modal";




import Toast, {DURATION} from 'react-native-easy-toast';
import Expo from 'expo';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export function BackPress(currentScreen) {
      console.log("current Screen: "+currentScreen);
      console.log("function back...................")
      // Alert.alert(
      // 'Exit App',
      // 'Do you want to exit?',
      // [
      //   {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      //   {text: 'Yes', onPress: () => BackHandler.exitApp()},
      // ],
      // { cancelable: true })
      if(currentScreen == "Login" || currentScreen == "Dashboard")
      {
        BackHandler.exitApp();
      }
      else
      {
        Actions.pop();
      }
      return true;
}

// export function checkConnection() {
  
//       NetInfo.getConnectionInfo().then((connectionInfo) => {
//             // console.log(connectionInfo)
//             connectionType=connectionInfo.type;
//             // AsyncStorage.setItem('connectionType', connectionInfo.type);
//             console.log(connectionType)
//             return connectionType;
//             //console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
//           });

//           // NetInfo.addEventListener(
//           //   'connectionChange',
//           //   this.handleFirstConnectivityChange
//           // );
      
// }
   

// export function handleFirstConnectivityChange(connectionInfo) {
//         // this.setState({
//         //     connectionInfo: connectionInfo.type
//         // })
//         AsyncStorage.setItem('connectionType', connectionInfo.type);
//         console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);

//       }   