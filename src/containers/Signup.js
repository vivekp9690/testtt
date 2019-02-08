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
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  NetInfo,
  BackHandler,
  DeviceEventEmitter
  
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from '../config/firebaseService';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';

import styles from "../styles/signupStyle";
import {apiUrl,netErrorMsg} from "../config/constant";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class SignupForm extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          name: '',
          birthday:'',
          mobile:'',
          email:'',
          password:'',
          cpassword:'',
          referalCode:'',
          loading:false,
          netStatus:"none"


       }
      
    }
    
    async componentDidMount() {
      NetInfo.getConnectionInfo().then((connectionInfo) => {
        // console.log(connectionInfo.type)
      this.setState({'netStatus':connectionInfo.type})
      });
            
      NetInfo.addEventListener('connectionChange',this.handleConnectivityChange);


      // DeviceEventEmitter.removeAllListeners('hardwareBackPress')
      // DeviceEventEmitter.addListener('hardwareBackPress', this.goBack)
        

    }
    // componentWillUnmount = () => {
    //   DeviceEventEmitter.removeAllListeners('hardwareBackPress')
      
    // }
    handleConnectivityChange = (connectionInfo) => {
           
           console.log("connectivity change event.....");
           this.setState({'netStatus':connectionInfo.type})
    }  
    
    goBack() {
      Actions.pop();
    }

    nameChange = (text) => {
      this.setState({ name: text })
      
    }
    
    birthdayChange = (text) => {
     this.setState({
      birthday:text
     });
    }
    emailChange = (text) => {
     this.setState({
      email:text
     });
    }
    mobileChange = (text) => {
     this.setState({
      mobile:text
     });
    }
    passwordChange = (text) => {
     this.setState({
     password:text
     });
    }
    cpasswordChange = (text) => {
     this.setState({
     cpassword:text
     });
    }

    referalCodeChange= (text) => {
     this.setState({
     referalCode:text
     });
    }

    signupClick = async () => {
       
    
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    let errcnt=0;
    if(!this.state.loading)
    {

        if(this.state.netStatus != "none"){
           
                if(this.state.email == "")
                {
                    Alert.alert(
                            'Verity One',
                            'Please enter your email address.',
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

                if(reg.test(this.state.email) === false)
                {
                    Alert.alert(
                            'Verity One',
                            'Please enter valid email address.',
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

                if(this.state.password == "")
                {
                    Alert.alert(
                            'Verity One',
                            'Please enter password.',
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
                if(this.state.cpassword == "")
                {
                    Alert.alert(
                            'Verity One',
                            'Please enter confirm password.',
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
                if(this.state.password != this.state.cpassword)
                {
                    Alert.alert(
                            'Verity One',
                            'Password does not match.',
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
                if((this.state.password).length < 6)
                {
                    Alert.alert(
                            'Verity One',
                            'The password must be 6 characters long or more.',
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


                if(errcnt == 0)
                {

                  // if(this.state.birthday != "")
                  // {
                  //     var todayTime = new Date(this.state.birthday);
                  //     var month = todayTime .getMonth() + 1;
                  //     var day = todayTime .getDate();
                  //     var year = todayTime .getFullYear();

                  //     if(day<10){day='0'+day} if(month<10){month='0'+month}

                  //     var userBirthday=month+"-"+day+"-"+year;  
                  // }
                  // else
                  // {
                  //     var userBirthday=this.state.birthday;
                  // }
                  
                  
                
                  this.setState({loading:true});
                  let firebaseUserID="";
                  await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                    .then((userData) => {
                       firebaseUserID = userData.user.uid;
                       console.log("firebase User id :---- ",firebaseUserID)
                       console.log({
                          name: this.state.name,
                          birthday: this.state.birthday,
                          email: this.state.email,
                          mobile: this.state.mobile,
                          password:this.state.password,
                          referalCode:this.state.referalCode,
                          firebaseId:firebaseUserID
                        });   
                       this.signInfun(firebaseUserID)
                      })
                    .catch(() => {
                        
                      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                            .then((userData) => {
                              //  console.log("catch success firebase user ",userData); 
                               firebaseUserID = userData.user.uid;
                               console.log("catch firebase User id :---- ",firebaseUserID)
                               console.log({
                                name: this.state.name,
                                birthday: this.state.birthday,
                                email: this.state.email,
                                mobile: this.state.mobile,
                                password:this.state.password,
                                referalCode:this.state.referalCode,
                                firebaseId:firebaseUserID
                              });  
                               this.signInfun(firebaseUserID) 
                            })
                            .catch((e) => {
                                console.log("errrr ",e)
                                this.setState({loading:false});
                            });
                    });

                    console.log({
                      name: this.state.name,
                      birthday: this.state.birthday,
                      email: this.state.email,
                      mobile: this.state.mobile,
                      password:this.state.password,
                      referalCode:this.state.referalCode,
                      firebaseId:firebaseUserID
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
      
    }    
    
  } 
  signInfun = async (firebaseUserID) => {
    await fetch(apiUrl+'signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
     
        name: this.state.name,
        password:this.state.password,
        email: this.state.email,
        birthday: this.state.birthday,
        mobileNumber: this.state.mobile,
        socialType:"0",
        isSocial: "NO", 
        firebaseId:firebaseUserID,
        profileImage : "",
        referalCode:this.state.referalCode 


      })
     
    })
    .then((response) => response.json())
    .then((responseJson) => {
     
    // Showing response message coming from server after inserting records.
      console.log("profile data............")
      console.log(responseJson);

      this.setState({loading:false});
      if(responseJson.success == 1)
      {
        
        if(responseJson.profile.userId != "" && responseJson.profile.userId != null ){
          AsyncStorage.setItem('userId', responseJson.profile.userId);
        } 
        if(responseJson.profile.name != "" && responseJson.profile.name != null ){ 
          AsyncStorage.setItem('name', responseJson.profile.name);
        }

        if(responseJson.profile.email != "" && responseJson.profile.email != null ){

          AsyncStorage.setItem('email', responseJson.profile.email);
        }

        if(responseJson.profile.birthDay != "" && responseJson.profile.birthDay != null ){

          AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
        }
        if(responseJson.profile.mobileNumber != "" && responseJson.profile.mobileNumber != null ){
          AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);

        }
        if(responseJson.profile.firebaseId != "" && responseJson.profile.firebaseId != null ){
          AsyncStorage.setItem('firebaseId', responseJson.profile.firebaseId);

        }
        if (responseJson.profile.isManager != "" && responseJson.profile.isManager != null) {
          AsyncStorage.setItem('isManager', responseJson.profile.isManager);
        }

        if (responseJson.profile.referalCode != "" && responseJson.profile.referalCode != null) {
          AsyncStorage.setItem('referalCode', responseJson.profile.referalCode);
        }

        Actions.dashboard();

        this.name.setNativeProps({ text: '' })
        this.mobile.setNativeProps({ text: '' })
        this.email.setNativeProps({ text: '' })
        this.password.setNativeProps({ text: '' })
        this.cpassword.setNativeProps({ text: '' })
        this.referalCode.setNativeProps({ text: '' })
        
        this.setState({name:''});
        this.setState({birthday:''});
        this.setState({mobile:''});
        this.setState({email:''});
        this.setState({password:''});
        this.setState({cpassword:''});
        this.setState({referalCode:''});

      
        // AsyncStorage.getItem('userId', (err, result) => {
        //   console.log(result);
        // });
      }
      else if(responseJson.success == 0 && responseJson.message == "User already exist")
      {

       
          Alert.alert(
            'Verity One',
            'The email address is already in use by another account.',
            [
              // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
              // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: true }
          )
      } 
      else
      {

     
        Alert.alert(
          'Verity One',
          'some error occurred, Please try after few minutes.',
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

 
  render(){

    return(

      <View style={styles.mainContainer}>
        <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:25,paddingLeft:10 }}>

                
            <TouchableOpacity onPress={this.goBack}><Image 
                      source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                      style={styles.ImageIconStyle} 
                      /></TouchableOpacity>
            <View style={{ width:width-90,alignItems:'center',justifyContent:'center'}}>
                <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20,fontWeight:'bold',color:'#4ac0f7',fontFamily: 'sansserifBold'}}>Sign Up</Text>
            </View>
        </View>
            <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps="always"
            scrollEnabled={true}
            behavior="padding"
            enableOnAndroid={true}
            innerRef={ref => {this.scroll = ref}}
            >

                
                
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Name"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    ref={(input) => {
                      this.name = input
                    }}
                    onChangeText = {this.nameChange}/>
                
                
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
               
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Mobile Number"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    ref={(input) => {
                      this.mobile = input
                    }}
                    onChangeText={this.mobileChange}
                    /> 
                        
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Email"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    keyboardType="email-address"
                    ref={(input) => {
                      this.email = input
                    }}
                    onChangeText={this.emailChange}

                    />
                <TextInput style={styles.inputBox} 
                    selectionColor="#000"
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor = "#999999"
                    ref={(input) => {
                      this.password = input
                    }}
                    onChangeText={this.passwordChange}
                    />
                <TextInput style={styles.inputBox} 
                    selectionColor="#000"
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    placeholderTextColor = "#999999"
                    ref={(input) => {
                      this.cpassword = input
                    }}
                    onChangeText={this.cpasswordChange}
                    />
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Referral Code"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    ref={(input) => {
                      this.referalCode = input
                    }}
                    onChangeText={this.referalCodeChange}
                    
                    /> 
                          
                 <TouchableOpacity style={styles.button} onPress = {
                        () => this.signupClick()} >
                   <Text style={styles.buttonText}>Register</Text>
                 </TouchableOpacity>   
                 {(this.state.loading && 
                 <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff"
                      animating={this.state.loading} />
                </View>
                )}
            </KeyboardAwareScrollView>
            <View style={{flex:1}}></View>
      </View>
      )
  }
}


