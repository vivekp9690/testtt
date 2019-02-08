
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar 
} from 'react-native';


import Routes from './src/Routes';
import { Font,Asset } from 'expo';


export default class App extends Component<{}> {



  componentDidMount() {
    Font.loadAsync({
      'FontAwesome': require('./assets/fonts/FontAwesome.ttf'),
      'sansserif': require('./assets/fonts/sansserif.ttf'),
      'sansserifBold': require('./assets/fonts/REFSANB.ttf'),
      
    });

    Asset.loadAsync([
      require('./assets/images/backWhiteImage.png'),
      require('./assets/images/whiteFlash.png'),
      require('./assets/images/whiteRefresh.png'),
      require('./assets/images/laser.gif')

    ]);
  }

  
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
           backgroundColor="#ffffff"
           barStyle="dark-content"
           androidStatusBarColor="#ffffff"
         />
        <Routes/>
         
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
  }
});
