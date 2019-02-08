import React, { Component } from 'react';
import I18n from 'react-native-i18n';

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
  ActivityIndicator,
  NetInfo, 
} from 'react-native';

import { Constants } from 'expo';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Actions } from 'react-native-router-flux';

import {apiUrl,netErrorMsg} from "../config/constant";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";
export default class ReCall extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          list:'',
          loading:false
         }
    }
   
    async componentWillMount() {
      
     
     
     await AsyncStorage.getItem('userId',
      (err,value) => {
        if(value != "")
        {
          userId=value;
        }
     });

     NetInfo.getConnectionInfo().then((connectionInfo) => {
            // console.log(connectionInfo.type)
            if(connectionInfo.type != "none")
            {
              this.setState({loading:true}); 
                  fetch(apiUrl+'getAllRssFeed', {  
                            method: 'POST',
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              userId:userId
                            })
                          })
                          .then((response) => response.json())
                          .then((responseJson) => {
                              // console.log(responseJson);
                              if(responseJson.success == 1)
                              {
                                 this.setState({'list':responseJson});
                              }
                              else
                              {
                                  Alert.alert(
                                    'Verity One',
                                    responseJson.message,
                                    [
                                      // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                      // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    { cancelable: true }
                                  )
                              }

                              this.setState({loading:false}); 
                          
                        })
                        .catch((error) => {
                          console.error(error);
                          this.setState({loading:false});
                  }); 
            }
            else
            {
              this.setState({loading:false});
              Alert.alert(
                        'Verity One',
                        netErrorMsg,
                        [
                          // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                          // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: true }
                      )
            }
        });     
    } 

  goBack() {
    Actions.pop();
  }
  
  openWebView(itemName,redirectUrl){
    Actions.ReCallLinkData({itemName:itemName,redirectUrl : redirectUrl});
  }
  renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#CED0CE",
          }}
        />
      );
    };
  render(){

    return(
      <View style={styles.mainContainer}>
      
        <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:30,paddingLeft:10 }}>

                
                 <TouchableOpacity onPress={this.goBack}>
                    <Image 
                      source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                      style={styles.ImageIconStyle} 
                      />
                  </TouchableOpacity>
                 <View style={{ width:width-90,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20,fontFamily: 'sansserifBold',fontWeight:'bold',color:'#4ac0f7'}}>ReCalls</Text>
                  </View>     
        </View> 
        
            <View style={[styles.row,styles.flatcontainer]}>
               <FlatList
                data={this.state.list.items}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => 
                  <View style={styles.flatview}>
                    <TouchableOpacity activeOpacity={1} onPress = {() => this.openWebView(item.itemName,item.redirectUrl)}>
                      <View style={styles.innerView}>
                        <View style={styles.itemStyleLeft}>
                          <Text style={styles.codeLabel}>{item.itemName}</Text>
                        </View>
                        
                        <View style={styles.itemStyleRight}>
                          <Icon name="angle-right" size={25} color="#CED0CE" />
                        </View>
                      </View>  
                    </TouchableOpacity>
                  </View>
                }
                
                keyExtractor={item => item.itemId}
                onEndThreshold={0}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
                refreshing={false}
                ItemSeparatorComponent={this.renderSeparator}
              />  
            </View>
            {(this.state.loading && 
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
                  </View>
                )}
            <View style={{flex:1,flexDirection: 'row',}}>
            </View>
            <View style={{flex:1,flexDirection: 'row',}}>
              
            </View> 
      </View> 
      )
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    width:width,
    paddingHorizontal:10
  },
  flatcontainer:{
    height:height,
    flex:10,

  },
  flatview: {
    justifyContent: 'center',
    // paddingTop: 30,
    borderRadius: 2,
    flexGrow:3,
    backgroundColor:'#ffffff',
    margin: 5,
    padding: 10,
    paddingRight:10,
    borderRadius: 2,
    borderColor: '#9f9f9f',
    borderBottomWidth: 0,
    // shadowColor: '#666',
    // shadowRadius: 3,
    // elevation: 1,
    // // shadowOffset: { width: 2, height: 3 },
    // // shadowOpacity: 0.9,
    // shadowOffset: { width: 1, height: 3 },
    // shadowOpacity: 0.8

  },
  codeLabel: {
    color:'#000',
    fontSize:20,
    fontFamily: 'sansserif'
  },
  innerView:
  {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    
    
  },
  itemStyleLeft:{
    justifyContent: 'center',width:'90%'  
  },
  itemStyleRight:{
    justifyContent: 'center',width:'10%',alignItems:'flex-end',  
  },
  container : {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#ffffff',
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
    backgroundColor:'#ffffff',
    height:height,
    alignItems:'center',
    justifyContent :'center',
     // paddingTop: Constants.statusBarHeight,
  },
  labelText : {
    fontWeight:'bold',
    fontSize:20,
    fontFamily: 'sansserifBold',
    color:'#4ac0f7'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
});