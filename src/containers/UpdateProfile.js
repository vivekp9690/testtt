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
  ActivityIndicator,
  Picker,
  Platform,
  NetInfo,
 
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';

import {apiUrl,netErrorMsg} from "../config/constant";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";
export default class UpdateProfile extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          name:'',
          birthday:'',
          mobileNumber:'',
          loading:false


       }
    
        
    }
    goBack() {
      Actions.pop();
    }
    
   async componentWillMount() {
      
     await AsyncStorage.getItem('userId',
      (err,value) => {
        if(value != "")
        {
          userId=value;
        }
        
      });

     await AsyncStorage.getItem('name',
      (err,value) => {
        if(value != "")
        {
          this.setState({'name':value})
        }
        
      });

      await AsyncStorage.getItem('birthDay',
      (err,value) => {
        if(value != "")
        {
          this.setState({'birthday':value})
        }
        
      });
      await AsyncStorage.getItem('mobileNumber',
      (err,value) => {
        if(value != "")
        {
          this.setState({'mobileNumber':value})
        }
        
      });
      
      
      
  }
  
   

    onClickSave = async () => {
    
    let errcnt=0;
    
    
    if(!this.state.loading)
    {
        
      NetInfo.getConnectionInfo().then((connectionInfo) => {
            // console.log(connectionInfo.type)
        if(connectionInfo.type != "none")
        {    
            if(this.props.item.itemName == "Name" )
            {  
              if(this.state.name == "")
              {
                  Alert.alert(
                          'Verity One',
                          'Please enter name.',
                          [
                            // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                            // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                          ],
                          { cancelable: true }
                        )
                  errcnt++;
                  return;
              }
              
            }  

            if(this.props.item.itemName == "Birthday" )
            {
              if(this.state.birthday == "")
              {
                  Alert.alert(
                          'Verity One',
                          'Please select your birthday.',
                          [
                            // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                            // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                          ],
                          { cancelable: true }
                        )
                  errcnt++;
                  return;
              }
              
            }  
            if(this.props.item.itemName == "Mobile Number" )
            {
              if(this.state.mobileNumber == "")
              {
                  Alert.alert(
                          'Verity One',
                          'Please enter mobile number.',
                          [
                            // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                            // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                          ],
                          { cancelable: true }
                        )
                  errcnt++;
                  return;
              }
              
            }
            
           

            if(errcnt == 0)
            {

                console.log(JSON.stringify({
                          userId:userId,  
                          name:this.state.name,
                          birthday:this.state.birthday,
                          mobileNumber:this.state.mobileNumber,

                        }

                  ));
                  this.setState({loading:true});
              // Actions.confirmation(); 
                  fetch(apiUrl+'updateProfile', {
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          userId:userId,  
                          name:this.state.name,
                          birthDay:this.state.birthday,
                          mobileNumber:this.state.mobileNumber,

                        })
                     
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                     
                    // Showing response message coming from server after inserting records.
                      console.log(responseJson);
                      this.setState({loading:false});
                      
                      if(responseJson.success == 1)
                      {
                          AsyncStorage.setItem('name', responseJson.profile.name);
                          AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
                          AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);
                        this.props.refreshStateDataClick(responseJson.profile.name,responseJson.profile.birthDay,responseJson.profile.mobileNumber);
                        Actions.pop();
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
                    }).catch((error) => {
                      console.error(error);
                      this.setState({loading:false});
                    });

            } 
        }
        else
        {
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
    
  } 
  
  render(){

    return(
      
      <View style={styles.mainContainer}>
      
            <View style={styles.headerStyle}>

                    
              <TouchableOpacity onPress={this.goBack}><Image 
                          source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                          style={styles.ImageIconStyle} 
                          /></TouchableOpacity>

              <Text style={{alignSelf:'center',fontSize:20,fontFamily: 'sansserifBold',color:'#4ac0f7',fontWeight:'bold'}} >Edit
                </Text>

                
                  <Text onPress={
                            () => this.onClickSave()} style={{alignSelf:'center',fontSize:20,fontFamily: 'sansserifBold',fontWeight:'bold'}}>Save</Text>
                  
                

            </View>
             
            <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            >
                
            {( this.props.item.itemName == "Name" &&
                <TextInput style={[styles.inputBox]} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder={this.props.item.itemName}
                    selectionColor="#000"
                    ref={(input) => {
                      this.reviewDesc = input}}
                    value={this.state.name}
                    clearButtonMode= "while-editing"
                    onChangeText={(name) => {this.setState({name: name})}}
                    /> 
            )}

            {( this.props.item.itemName == "Mobile Number" &&
                <TextInput style={[styles.inputBox]} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Mobile Number"
                    selectionColor="#000"
                    ref={(input) => {
                      this.reviewDesc = input}}
                    value={this.state.mobileNumber}
                    clearButtonMode= "while-editing"
                    onChangeText={(Number) => {this.setState({mobileNumber: Number})}}
                    /> 
            )} 
            {( this.props.item.itemName == "Birthday" &&
                <DatePicker
                    style={{
                    width:width-20,
                    height:30,
                    backgroundColor:'#ffffff',
                    borderWidth:1,
                    marginVertical: 10,
                    borderRadius:5}}
                    date={this.state.birthday}
                    mode="date"
                    placeholder="Birthday"
                    format="MM-DD-YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        height: 0,
                        width: 0
                      },
                      dateInput: {
                        borderWidth:0,
                        alignSelf:'flex-start'
                      },
                      dateText:{
                        color: '#c7c8ca',
                        alignSelf:'flex-start',
                        color:'#000000',
                        paddingHorizontal:16,
                        marginTop: -8
                      },
                      placeholderText: {
                            fontSize: 16,
                            fontFamily: 'sansserif',
                            color: '#999999',
                            alignSelf:'flex-start',
                            paddingHorizontal:16,
                            marginTop: -8
                        }

                    }}
                    ref={(input) => {
                      this.birthday = input
                    }}
                    onDateChange={(date) => {this.setState({birthday: date})}}
                />
            )}            
                
                
                  
                  <View style={[styles.activityIndicatorWrapper]}>
                      <ActivityIndicator size="large" color="#fff" animating={this.state.loading} />
                  </View>


                  
                  
                  
            </KeyboardAvoidingView>
            <View style={{flex:1,flexDirection: 'row',}}>
          
            </View>
            <View style={{flex:1,flexDirection: 'row',}}>
              
            </View> 
            
             
      </View> 
    
      )
  }
}

const styles = StyleSheet.create({
  
  imageBox: {
    flex: 1,
    height: 100,
    backgroundColor: '#333'
  },
  logo: {
    backgroundColor: '#ffffff',
    alignItems:'center',
    justifyContent:'center'
  },
  ImageIconStyle: {
     padding: 10,
     margin: 5,
     height: 30,
     width: 30,
     borderRadius:5,
     resizeMode : 'stretch',
   
  },
  mainContainer : {
    backgroundColor:'#045781',
    height:height,
    alignItems:'center',
    justifyContent :'center',
    paddingHorizontal:2
  },
  container : {
    justifyContent:'flex-start',
    alignItems: 'flex-start',
    backgroundColor:'#045781',
    width:width,
    // height:height,
    paddingHorizontal:5 
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 10 : 15,
    height: Platform.OS === 'ios' ? '100%' : 300,
  },
  labelText : {
    marginVertical: 15,
    fontSize:20,
    fontFamily: 'sansserif',
    color:'#000',
  },
  fieldLabelText : {
    fontSize:20,
    fontFamily: 'sansserif',
    color:'#000',
    
  },
  inputBox: {
    flexGrow: 0.1,
    width:width-20,
    height:30,
    backgroundColor:'#ffffff',
    borderWidth:1,
    borderRadius:5,
    borderColor:'#000',
    fontSize:16,
    fontFamily: 'sansserif',
    color:'#000000',
    marginVertical: 10,
    paddingHorizontal:16,
  },
  headerStyle:{
    flexDirection:'row',
    width:width,
    alignSelf:'flex-start',
    justifyContent: 'space-between',
    paddingTop:28,
    paddingBottom:2,
    paddingHorizontal:10,
    backgroundColor:'#ffffff',
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
