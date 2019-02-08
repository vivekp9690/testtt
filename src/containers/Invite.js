import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator ,
  Platform,
  Share
} from 'react-native';

const Share_Text="Do you want to know more about your food or other products? Download Verity One and find out!";

import Expo, { Constants } from 'expo';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Actions } from 'react-native-router-flux';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";
export default class ReCall extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          list:'',
          referalCode:'',
         }
    }
   async componentWillMount() {
     await AsyncStorage.getItem('referalCode',
      (err,value) => {
        if(value != "")
        {
          referalCode=value;
        }
     });
     
    this.setState({'referalCode':referalCode});
  } 
  goBack() {
    Actions.pop();
  }
  doInvite(){
    
    let and_store='https://play.google.com/store/apps/details?id=com.certified.verityscanningOne&referalCode';
    let ios_store='https://itunes.apple.com/us/app/verity-one/id1124462403?mt=8&referalCode';
    let env_OS = Platform.OS==='ios' ? ios_store : and_store;
    Share.share({
      message: Share_Text +'\n'+env_OS+'='+this.state.referalCode,
      title: 'My Referal Code Verity',
     }, {
      dialogTitle: 'Use my referal code',
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter',
        'com.apple.uikit.activity.mail'
      ],
      tintColor: 'green'
    }).then(this._showResult)
    .catch(err => console.log(err))
        
  }
 
  render(){

    return(
      <View style={styles.mainContainer}>
      
        <View style={styles.headerView}>

                
        <TouchableOpacity onPress={this.goBack}>
                <Image 
                      source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                      style={styles.ImageIconStyle} 
                      /></TouchableOpacity>

                <View style={{ width:width-90,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20,fontWeight:'bold',color:'#4ac0f7',fontFamily: 'sansserifBold'}}>Invite</Text>
                </View>
        </View> 
        
        
            <View style={[styles.row,styles.container,styles.box_new]}>
            
              <TouchableOpacity activeOpacity={1} onPress = {()=>this.doInvite()}>
                <Image style={styles.image}  source={require('../images/invite.png')}  />
                
              </TouchableOpacity> 
              
            </View>
            <TouchableOpacity activeOpacity={1}  onPress = {()=>this.doInvite()}>
                  <Text style={styles.shareText} > Click To Share!</Text>
            </TouchableOpacity> 
            
            <View style={styles.referalView}>
              <TouchableOpacity activeOpacity={1}  onPress = {()=>this.doInvite()}>
                  <Text style={styles.labelText}>REF -{this.state.referalCode}</Text>
                  </TouchableOpacity> 
            </View>
            
            <View style={styles.row}>
            
            </View>
            <View style={styles.row}>
              
            </View>
            
      </View> 
      )
  }
}

const styles = StyleSheet.create({
  btn:{
    backgroundColor:'#000'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    //marginBottom: 10,
    width:width,
    //paddingHorizontal:10
  },
  headerView:{
    flexDirection:'row',
    width:width,
    alignSelf:'flex-start',
    paddingTop:30,
    paddingLeft:10,
    backgroundColor:"#fff" 
  },
  referalView:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 60,alignItems:'center',
    width:width,flex:Platform.OS === 'ios' ? 0.2 : 0.2,height:50,backgroundColor:"#fff"
  },
  container : {
    flex:0.5,
    justifyContent:'center',
    alignItems: 'center',
    // backgroundColor:'#ffffff',
      },
  ImageIconStyle: {
    //  padding: 10,
    //  margin: 5,
     marginTop: 5,
     paddingTop: 10,
     height: 40,
     width: 40,
     borderRadius:5,
     resizeMode : 'stretch',
   
  },
  mainContainer : {
    backgroundColor:'#4ac0f7',
    height:height,
    alignItems:'center',
    justifyContent :'center',
     // paddingTop: Constants.statusBarHeight,
  },
  shareText : {
    fontWeight:'bold',
    marginTop:4,
    fontSize:20,
    color:'#fff',
    fontFamily: 'sansserifBold'
   
  },
   labelText : {
    fontWeight:'bold',
    fontSize:22,
    color:'#4ac0f7',
    fontFamily: 'sansserifBold'
    // backgroundColor:"#fff"
   
  },
  box_new: {
    
    width:'100%',
    marginTop:60,flex:Platform.OS === 'ios' ? 0.4 : 0.7,
    // marginLeft: 5,
    // marginRight: 7,
    // marginBottom: 7,
  }, 
  image:{
      width:150,
      height:150,
      margin:0,
      padding:0,
      resizeMode : 'stretch',
   }
});