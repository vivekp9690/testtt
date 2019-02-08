import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  NetInfo,
  ActivityIndicator,
  AsyncStorage,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';

import {GiftedChat} from 'react-native-gifted-chat';

import Backend from '../config/Backend';
import {apiUrl,netErrorMsg} from "../config/constant";

import { Actions } from 'react-native-router-flux';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
export default class Chat extends Component<{}> {

    constructor(props) {
        super(props);
          this.state = {
            messages: [],
            emptyMessage:"",
            loading:false
            
          }
  
          
      }
    componentWillMount() {
       
  }
  componentWillUnmount()
  {
    AsyncStorage.setItem('isChatOpen', 'No');
  }
  goBack() {
    // AsyncStorage.setItem('isChatOpen', 'No');
    Actions.pop();
  }

  render() {
    let userId = Backend.getloggedInUserId();
    console.log("chat.........",userId, this.props.userName);
    return (
        <View style={styles.mainContainer}>
            <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:30,paddingLeft:10 }}>
                <TouchableOpacity onPress={this.goBack}><Image 
                    source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                    style={styles.ImageIconStyle} 
                    /></TouchableOpacity>

                <View style={{ width:width-90,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20,fontFamily: 'sansserifBold',fontWeight:'bold',color:'#4ac0f7'}}>Admin</Text>
                </View>
            </View>  
            {( this.state.emptyMessage != "" &&
              <View style={[styles.container,styles.row,styles.emptyMessageStyle]}>
                <Text style={{fontSize:20}}>{this.state.emptyMessage}</Text>
              </View>
            )}  
            <GiftedChat 
              forceGetKeyboardHeight={true}
              messages={this.state.messages}
              textProps={{
                style: {
                  fontFamily: 'sansserif'
                },
              }}
              onSend={(message) => {
                  //send message to firebase
                  NetInfo.getConnectionInfo().then((connectionInfo) => {
                      // console.log(message)

                      if (connectionInfo.type != "none") {
                          Backend.sendMessage(message);
                      }
                      else {
                          Alert.alert('Verity One', netErrorMsg, [{
                            text: 'OK',
                            onPress: () => console.log('OK Pressed')
                          }], {
                            cancelable: true
                          });
                      } 
                  });
              }}
              user={{
                  _id: userId,
                  name: this.props.userName,
                  // receiverId:"631"
              }}
            />
            {( Platform.OS === 'ios' && 
                <KeyboardAvoidingView behavior={'position'} enabled/>
            )} 
            {( Platform.OS === 'android' && 
                <KeyboardAvoidingView behavior={'padding'} enabled/>
            )} 
            
          
            {
              (this.state.loading &&
                <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
                </View>)
            }
        </View>    
    );
  }

  keyboardDidShowListener = e => {
    this.setState({
      keyboardOpen: true,
      keyboardHeight: e.endCoordinates.height,
    });
  };
  componentDidMount() {
    this.setState({'loading':true});

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShowListener,
    );


    Backend.loadMessages((message) => {
      
      if(Object.keys(message).length !== 0)
      {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, message),
          };
        });
      }
      if(this.state.messages.length == 0)
      {
        this.setState({"emptyMessage":"No messages available."})
      }
      else
      {
        this.setState({"emptyMessage":""})
      }

      this.setState({'loading':false})
    });

  }
  componentWillUnmount() {
    Backend.closeChat();
  }
}

// Chat.defaultProps = {
//     name : 'John',
// };

// Chat.propTypes = {
//     name : React.PropTypes.string,
// };
const styles = StyleSheet.create({
    row: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
      width:width,
      // paddingHorizontal:10
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
    emptyMessageStyle:{
      // height:height,
      // flex: 10,
    },
    mainContainer : {
      backgroundColor:'#ffffff',
      height:height,
      
       // paddingTop: Constants.statusBarHeight,
    },
    labelText : {
      marginVertical: 15,
      fontWeight:'bold',
      fontFamily:'sansserifBold',
      fontSize:20,
      color:'#4ac0f7'
    },
    activityIndicatorWrapper: {
        backgroundColor: 'transparent',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:40,
        paddingHorizontal:'50%'
      },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
  });
  