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
  NetInfo,
  BackHandler,
  DeviceEventEmitter
} from 'react-native';

// fireabse work s
import * as firebase from 'firebase';
import firebaseService from '../config/firebaseService';
// firebase work e
import {Actions} from 'react-native-router-flux';
import Modal from "react-native-modal";

import { Dialog,ConfirmDialog } from 'react-native-simple-dialogs';
// import {BackPress} from './Functions';


import Toast, {DURATION} from 'react-native-easy-toast';
import Expo from 'expo';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

import styles from "../styles/loginStyle";
import {apiUrl,netErrorMsg,facebookId,androidGoogleClientId,iosGoogleClientId,firebaseConfig} from "../config/constant";

// import { SocialIcon } from 'react-native-elements'; // apply css for social button
export default class Login extends Component<{}> {

  

    constructor(props) {
      super(props);
        this.state = {
          email:'',
          password:'',
          forgotEmail:'',
          versionName:'',
          loading:false,
          isModalVisible: false,
          netStatus:'none',
          dialogVisible:false,
          errorForgotEmail:""
        }
        
    }

    componentWillMount() {

      // firebase work s    
        // firebase.initializeApp(firebaseConfig);
        // firebase.auth().onAuthStateChanged((user) => {
        //     console.log("state chamged")
        //     if (user != null) {
        //         console.log("We are authenticated now!");
        //         console.log(user.uid);
        //         // DO FIREBASE CODE HERE
        //     }
        //     // Do other things
        // });
        // firebase work e
      
      var userId=""
      AsyncStorage.getItem('firebaseId', (err, value) => {
        console.log('Firebase Id:', value);
      });
      AsyncStorage.getItem('userId',
          (err, value) => {
              if (value != "" && value != null && value != "null") {
                  console.log("during auto login user id: " + value);
                  userId = value;
                  NetInfo.getConnectionInfo().then((connectionInfo) => {
                    if (connectionInfo.type != "none") {

                        this.setState({
                            loading: true
                        });
                        setTimeout(function () {
                            Actions.dashboard();
                        }, 3000);
                    }
                    else
                    {
                        Alert.alert(
                            'Verity One',
                            "The Internet connection appears to be offline.", [
                                {
                                    text: 'OK',
                                    onPress: () => console.log('OK Pressed')
                                },
                            ], {
                                cancelable: true
                            }
                        )
                    }
                });
              }
              // else
              // {
              //  Actions.login()
              // }
          });

      
             
    }
    async componentDidMount() {
      NetInfo.getConnectionInfo().then((connectionInfo) => {
        // console.log(connectionInfo.type)
      this.setState({'netStatus':connectionInfo.type})
      });
            
      NetInfo.addEventListener('connectionChange',this.handleConnectivityChange);
      console.log("//////////////.....................")
      console.log("did mount 1")
      DeviceEventEmitter.removeAllListeners('hardwareBackPress')
      console.log("did mount 2")
      DeviceEventEmitter.addListener('hardwareBackPress', this.goBack)
      console.log("did mount 3")

    }


    componentWillUnmount = () => {

        console.log("unmount 1")
      DeviceEventEmitter.removeAllListeners('hardwareBackPress')
      console.log("unmount 1")
      
    }


    handleConnectivityChange = (connectionInfo) => {
           
           console.log("connectivity change event.....");
           this.setState({'netStatus':connectionInfo.type})
    }
      
    goBack = () => {

        console.log(".............back from login",this.state.dialogVisible)
        if(this.state.dialogVisible  == true)
        {
            console.log(".............back from login1")
            this.setState({dialogVisible:false})
        }
        else if(Actions.currentScene  == "dashboard" || Actions.currentScene  == "login")
        {
            // are you sure to exit app? coding here
            console.log(".............back from login2")

            Alert.alert(
                'Verity One',
                'Are you sure to exit app?',
                [
                  {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'Yes', onPress: () => {
        
                    BackHandler.exitApp()
        
                  }},
                ],
                { cancelable: true })
            
            
        }
        else
        {
            
            console.log(".............back from login5")
            
            Actions.pop()
        }
        
    }
      

    signup= () => {
      if(!this.state.loading)
      {
        Actions.signup()
      }  
    }
  
  
    async facebookLogin() {
        if (!this.state.loading) {
            if (this.state.netStatus != "none") {
                this.setState({
                    loading: true
                });
                try {
                    const {
                        type,
                        token
                    } = await Expo.Facebook.logInWithReadPermissionsAsync(facebookId, {
                        permissions: ['public_profile', 'email'],
                    });
                    if (type === 'success') {
                        // Get the user's name using Facebook's Graph API
                        const response = await fetch(
                            `https://graph.facebook.com/me?access_token=${token}&fields=email,name,picture`);
                        const fbData = await response.json();

                        console.log(fbData);
                        console.log("firebase credential ", token);
                        // firebase work s    
                        const credential = await firebase.auth.FacebookAuthProvider.credential(token);
                        const firebaseData = await firebase.auth().signInAndRetrieveDataWithCredential(credential)
                            .then((result) => {
                                console.log("firebase success...........")
                                console.log(result)
                                console.log(fbData.email)
                                console.log({
                                    name: fbData.name,
                                    password: "",
                                    email: fbData.email,
                                    birthDay: "",
                                    mobileNumber: "",
                                    socialType: "1",
                                    isSocial: "YES",
                                    firebaseId: result.user.uid,
                                    profileImage: fbData.picture.data.url
                                })
                                if (fbData.email) {
                                     fetch(apiUrl + 'signin', {
                                            method: 'POST',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                name: fbData.name,
                                                password: "",
                                                email: fbData.email,
                                                birthDay: "",
                                                mobileNumber: "",
                                                socialType: "1",
                                                isSocial: "YES",
                                                firebaseId: result.user.uid,
                                                profileImage: fbData.picture.data.url
                                            })
                                        })
                                        .then((response) => response.json())
                                        .then((responseJson) => {
                                            this.setState({
                                                loading: false
                                            });
                                            if (responseJson.success == 1) {
                                                // GoogleSignin.signOut()
                                                // .then(() => {
                                                //   console.log('out');
                                                // })
                                                // .catch((err) => {
                                                // });
                                                console.log("profile response")
                                                console.log(responseJson.profile);
                                                // var userData={
                                                //   'userId':responseJson.profile.userId,
                                                //   'email':responseJson.profile.email,
                                                //   'name': esponseJson.profile.name
                                                // };
                                                if (responseJson.profile.userId != "" && responseJson.profile.userId != null) {
                                                    AsyncStorage.setItem('userId', responseJson.profile.userId);
                                                }
                                                if (responseJson.profile.name != "" && responseJson.profile.name != null) {
                                                    AsyncStorage.setItem('name', responseJson.profile.name);
                                                }
                                                if (responseJson.profile.email != "" && responseJson.profile.email != null) {
                                                    AsyncStorage.setItem('email', responseJson.profile.email);
                                                }
                                                if (responseJson.profile.birthDay != "" && responseJson.profile.birthDay != null) {
                                                    AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
                                                }
                                                if (responseJson.profile.mobileNumber != "" && responseJson.profile.mobileNumber != null) {
                                                    AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);
                                                }
                                                if (responseJson.profile.firebaseId != "" && responseJson.profile.firebaseId != null) {
                                                    AsyncStorage.setItem('firebaseId', responseJson.profile.firebaseId);
                                                }
        
                                                if (responseJson.profile.isManager != "" && responseJson.profile.isManager != null) {
                                                    AsyncStorage.setItem('isManager', responseJson.profile.isManager);
                                                }
                                                // AsyncStorage.getItem('userId', (err, result) => {
                                                //   console.log(result);
                                                // });
                                                Actions.dashboard();
                                                this.email.setNativeProps({
                                                    text: ''
                                                })
                                                this.password.setNativeProps({
                                                    text: ''
                                                })
                                                this.setState({
                                                    email: '',
                                                    password: ''
                                                });
                                            } else {
                                                Alert.alert(
                                                    'Verity One',
                                                    'There is no user record corresponding to this identifier. The user may have been deleted.', [
                                                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                        {
                                                            text: 'OK',
                                                            onPress: () => console.log('OK Pressed')
                                                        },
                                                    ], {
                                                        cancelable: true
                                                    }
                                                )
                                            }
                                        })
                                        .catch((error) => {
                                            this.setState({
                                                loading: false
                                            });

                                            Alert.alert(
                                                'Verity One',
                                                'Something went wrong, Please try again.', [
                                                    // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                                    // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                    {
                                                        text: 'OK',
                                                        onPress: () => console.log('OK Pressed')
                                                    },
                                                ], {
                                                    cancelable: true
                                                }
                                            )
                                            console.error(error);
                                        });
                                } else {
                                    Alert.alert(
                                        'Verity One',
                                        'Something went wrong, Please try again.', [
                                            // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                            // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                            {
                                                text: 'OK',
                                                onPress: () => console.log('OK Pressed')
                                            },
                                        ], {
                                            cancelable: true
                                        }
                                    )
                                }
        
                                this.setState({
                                    loading: false
                                });
                            })
                            .catch((error) => {
                                console.log("fb error ", error)
                                                if (fbData.email) {
                                                    fetch(apiUrl + 'signin', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Accept': 'application/json',
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            name: fbData.name,
                                                            password: "",
                                                            email: fbData.email,
                                                            birthDay: "",
                                                            mobileNumber: "",
                                                            socialType: "1",
                                                            isSocial: "YES",
                                                            firebaseId: "",
                                                            profileImage: fbData.picture.data.url
                                                        })
                                                    })
                                                    .then((response) => response.json())
                                                    .then((responseJson) => {
                                                        this.setState({
                                                            loading: false
                                                        });
                                                        if (responseJson.success == 1) {
                                                            // GoogleSignin.signOut()
                                                            // .then(() => {
                                                            //   console.log('out');
                                                            // })
                                                            // .catch((err) => {
                                                            // });
                                                            console.log("profile response")
                                                            console.log(responseJson.profile);
                                                            // var userData={
                                                            //   'userId':responseJson.profile.userId,
                                                            //   'email':responseJson.profile.email,
                                                            //   'name': esponseJson.profile.name
                                                            // };
                                                            if (responseJson.profile.userId != "" && responseJson.profile.userId != null) {
                                                                AsyncStorage.setItem('userId', responseJson.profile.userId);
                                                            }
                                                            if (responseJson.profile.name != "" && responseJson.profile.name != null) {
                                                                AsyncStorage.setItem('name', responseJson.profile.name);
                                                            }
                                                            if (responseJson.profile.email != "" && responseJson.profile.email != null) {
                                                                AsyncStorage.setItem('email', responseJson.profile.email);
                                                            }
                                                            if (responseJson.profile.birthDay != "" && responseJson.profile.birthDay != null) {
                                                                AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
                                                            }
                                                            if (responseJson.profile.mobileNumber != "" && responseJson.profile.mobileNumber != null) {
                                                                AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);
                                                            }
                                                            if (responseJson.profile.firebaseId != "" && responseJson.profile.firebaseId != null) {
                                                                AsyncStorage.setItem('firebaseId', responseJson.profile.firebaseId);
                                                            }
                    
                                                            if (responseJson.profile.isManager != "" && responseJson.profile.isManager != null) {
                                                                AsyncStorage.setItem('isManager', responseJson.profile.isManager);
                                                            }

                                                            if (responseJson.profile.referalCode != "" && responseJson.profile.referalCode != null) {
                                                                AsyncStorage.setItem('referalCode', responseJson.profile.referalCode);
                                                            }
                                                            // AsyncStorage.getItem('userId', (err, result) => {
                                                            //   console.log(result);
                                                            // });
                                                            Actions.dashboard();
                                                            this.email.setNativeProps({
                                                                text: ''
                                                            })
                                                            this.password.setNativeProps({
                                                                text: ''
                                                            })
                                                            this.setState({
                                                                email: '',
                                                                password: ''
                                                            });
                                                        } else {
                                                            Alert.alert(
                                                                'Verity One',
                                                                'There is no user record corresponding to this identifier. The user may have been deleted.', [
                                                                    // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                                                    // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                                    {
                                                                        text: 'OK',
                                                                        onPress: () => console.log('OK Pressed')
                                                                    },
                                                                ], {
                                                                    cancelable: true
                                                                }
                                                            )
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        this.setState({
                                                            loading: false
                                                        });

                                                        Alert.alert(
                                                            'Verity One',
                                                            'Something went wrong, Please try again.', [
                                                                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                                                // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                                {
                                                                    text: 'OK',
                                                                    onPress: () => console.log('OK Pressed')
                                                                },
                                                            ], {
                                                                cancelable: true
                                                            }
                                                        )
                                                        console.error(error);
                                                    });
                                            } else {
                                                Alert.alert(
                                                    'Verity One',
                                                    'Something went wrong, Please try again.', [
                                                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                        {
                                                            text: 'OK',
                                                            onPress: () => console.log('OK Pressed')
                                                        },
                                                    ], {
                                                        cancelable: true
                                                    }
                                                )
                                            }
                                this.setState({
                                    loading: false
                                });
                            });
                        console.log(".........",firebase.auth().currentUser.uid); 
                        // firebase work e
                        
                    } else {

                        this.setState({
                            loading: false
                        });
                    }
                } catch (e) {

                    this.setState({
                        loading: false
                    });
                    console.log({
                        error: true
                    });
                }
            } else {
                Alert.alert(
                    'Verity One',
                    netErrorMsg, [
                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed')
                        },
                    ], {
                        cancelable: true
                    }
                )
            }
        }
    }
    async googleLogin() {
        if (!this.state.loading) {
            if (this.state.netStatus != "none") {
                this.setState({
                    loading: true
                });
                try {
                    
                    const result = await Expo.Google.logInAsync({
                        androidStandaloneAppClientId: androidGoogleClientId,
                        iosStandaloneAppClientId: iosGoogleClientId,
                        scopes: ['profile', 'email'],
                    });
                    
                    if (result.type === 'success') {
                        
                        console.log("google res.........",result);
                        console.log(".........firebase result ..")

                        // firebase work s
                        const { idToken, accessToken } = result;
                        
                        const credential = await firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
                        firebase
                            .auth()
                            .signInAndRetrieveDataWithCredential(credential)
                            .then((firebaseUserData) => {
                                
                                console.log("firebase success...........")
                                console.log(firebaseUserData)
                                var user = result.user;
                                        fetch(apiUrl + 'signin', {
                                            method: 'POST',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                name: user.name,
                                                password: "",
                                                email: user.email,
                                                birthDay: "",
                                                mobileNumber: "",
                                                socialType: "0",
                                                isSocial: "YES",
                                                firebaseId: firebaseUserData.user.uid,
                                                profileImage: user.photoUrl
                                            })
                                        })
                                        .then((response) => response.json())
                                        .then((responseJson) => {
                                            
                                            this.setState({
                                                loading: false
                                            });
                                            if (responseJson.success == 1) {
                                                
                                                
                                                console.log("----profile-------")
                                                console.log(responseJson.profile);
                                                // var userData={
                                                //   'userId':responseJson.profile.userId,
                                                //   'email':responseJson.profile.email,
                                                //   'name': esponseJson.profile.name
                                                // };
                                                if (responseJson.profile.userId != "" && responseJson.profile.userId != null) {
                                                    AsyncStorage.setItem('userId', responseJson.profile.userId);
                                                }
                                                if (responseJson.profile.name != "" && responseJson.profile.name != null) {
                                                    AsyncStorage.setItem('name', responseJson.profile.name);
                                                }
                                                if (responseJson.profile.email != "" && responseJson.profile.email != null) {
                                                    AsyncStorage.setItem('email', responseJson.profile.email);
                                                }
                                                if (responseJson.profile.birthDay != "" && responseJson.profile.birthDay != null) {
                                                    AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
                                                }
                                                if (responseJson.profile.mobileNumber != "" && responseJson.profile.mobileNumber != null) {
                                                    AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);
                                                }
                                                if (responseJson.profile.firebaseId != "" && responseJson.profile.firebaseId != null) {
                                                    AsyncStorage.setItem('firebaseId', responseJson.profile.firebaseId);

                                                }

                                                if (responseJson.profile.isManager != "" && responseJson.profile.isManager != null) {
                                                    AsyncStorage.setItem('isManager', responseJson.profile.isManager);
                                                }

                                                if (responseJson.profile.referalCode != "" && responseJson.profile.referalCode != null) {
                                                    AsyncStorage.setItem('referalCode', responseJson.profile.referalCode);
                                                }
                                                // AsyncStorage.getItem('userId', (err, result) => {
                                                //   console.log(result);
                                                // });

                                                
                                                Actions.dashboard();
                                                this.email.setNativeProps({
                                                    text: ''
                                                })
                                                this.password.setNativeProps({
                                                    text: ''
                                                })
                                                this.setState({
                                                    password: '',
                                                    email: ''
                                                });
                                                this.setState({
                                                });

                                            } else {
                                                Alert.alert(
                                                    'Verity One',
                                                    'There is no user record corresponding to this identifier. The user may have been deleted.', [
                                                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                        {
                                                            text: 'OK',
                                                            onPress: () => console.log('OK Pressed')
                                                        },
                                                    ], {
                                                        cancelable: true
                                                    }
                                                )
                                            }
                                        })
                                        .catch((error) => {
                                            
                                            this.setState({
                                                loading: false
                                            });
                                            console.error(error);
                                        });


                            })
                            .catch(error => {
                                console.log("firebase cred err:", error);
                                
                                var user = result.user;
                                        fetch(apiUrl + 'signin', {
                                            method: 'POST',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                name: user.name,
                                                password: "",
                                                email: user.email,
                                                birthDay: "",
                                                mobileNumber: "",
                                                socialType: "0",
                                                isSocial: "YES",
                                                firebaseId: "",
                                                profileImage: user.photoUrl
                                            })
                                        })
                                        .then((response) => response.json())
                                        .then((responseJson) => {

                                            
                                            this.setState({
                                                loading: false
                                            });
                                            if (responseJson.success == 1) {

                                                
                                                // GoogleSignin.signOut()
                                                // .then(() => {
                                                //   console.log('out');
                                                // })
                                                // .catch((err) => {
                                                // });
                                                console.log("----profile-------")
                                                console.log(responseJson.profile);
                                                // var userData={
                                                //   'userId':responseJson.profile.userId,
                                                //   'email':responseJson.profile.email,
                                                //   'name': esponseJson.profile.name
                                                // };
                                                if (responseJson.profile.userId != "" && responseJson.profile.userId != null) {
                                                    AsyncStorage.setItem('userId', responseJson.profile.userId);
                                                }
                                                if (responseJson.profile.name != "" && responseJson.profile.name != null) {
                                                    AsyncStorage.setItem('name', responseJson.profile.name);
                                                }
                                                if (responseJson.profile.email != "" && responseJson.profile.email != null) {
                                                    AsyncStorage.setItem('email', responseJson.profile.email);
                                                }
                                                if (responseJson.profile.birthDay != "" && responseJson.profile.birthDay != null) {
                                                    AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
                                                }
                                                if (responseJson.profile.mobileNumber != "" && responseJson.profile.mobileNumber != null) {
                                                    AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);
                                                }
                                                if (responseJson.profile.firebaseId != "" && responseJson.profile.firebaseId != null) {
                                                    AsyncStorage.setItem('firebaseId', responseJson.profile.firebaseId);

                                                }

                                                if (responseJson.profile.isManager != "" && responseJson.profile.isManager != null) {
                                                    AsyncStorage.setItem('isManager', responseJson.profile.isManager);
                                                }
                                                // AsyncStorage.getItem('userId', (err, result) => {
                                                //   console.log(result);
                                                // });

                                                
                                                Actions.dashboard();
                                                this.email.setNativeProps({
                                                    text: ''
                                                })
                                                this.password.setNativeProps({
                                                    text: ''
                                                })
                                                this.setState({
                                                    password: '',
                                                    email: ''
                                                });
                                                this.setState({
                                                });

                                            } else {
                                                Alert.alert(
                                                    'Verity One',
                                                    'There is no user record corresponding to this identifier. The user may have been deleted.', [
                                                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                        {
                                                            text: 'OK',
                                                            onPress: () => console.log('OK Pressed')
                                                        },
                                                    ], {
                                                        cancelable: true
                                                    }
                                                )
                                            }
                                        })
                                        .catch((error) => {

                                            
                                            this.setState({
                                                loading: false
                                            });
                                            console.error(error);
                                        });
                                // this.setState({
                                //     loading: false
                                // });

                                
                            });

                        // firebase work e 
                        
                    } else {
                        
                        this.setState({
                            loading: false
                        });
                        
                    }
                } catch (e) {

                    this.setState({
                        loading: false
                    });
                    console.log("catch.....",e);
                }
            } else {
                Alert.alert(
                    'Verity One',
                    netErrorMsg, [
                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed')
                        },
                    ], {
                        cancelable: true
                    }
                )
            }
        }
    }
    normalLogin =  () => {
        console.log("login click");

        if (!this.state.loading) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            let errcnt = 0;

            if (this.state.email == "") {
                Alert.alert(
                    'Verity One',
                    'Please enter your email address.', [
                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed')
                        },
                    ], {
                        cancelable: true
                    }
                )
                errcnt++;
                return;
            }
            if (reg.test(this.state.email) === false) {
                Alert.alert(
                    'Verity One',
                    'Please enter valid email address.', [
                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed')
                        },
                    ], {
                        cancelable: true
                    }
                )
                errcnt++;
                return;
            }

            if (this.state.password == "") {
                Alert.alert(
                    'Verity One',
                    'Please enter password.', [
                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed')
                        },
                    ], {
                        cancelable: true
                    }
                )
                errcnt++;
                return;
            }
            if (errcnt == 0) {
                if (this.state.netStatus != "none") {
                    this.setState({
                        loading: true
                    });

                    // let firebaseUserID="";
                    // firebaseService.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                    // .then((userData) => {
                    //    firebaseUserID = userData.user.uid;
                    //    console.log("firebase User id :---- ",firebaseUserID)
                    //    console.log({
                    //       email: this.state.email,
                    //       password:this.state.password,
                    //       firebaseId:firebaseUserID
                    //     });   
                    //    this.normalSigninFun(firebaseUserID)
                    //   })
                    // .catch((e) => {
                    //     console.log(e)
                    //     firebaseService.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                    //         .then((userData) => {
                    //           //  console.log("catch success firebase user ",userData); 
                    //            firebaseUserID = userData.user.uid;
                    //            console.log("catch firebase User id :---- ",firebaseUserID)
                    //            console.log({
                    //             email: this.state.email,
                    //             password:this.state.password,
                    //             firebaseId:firebaseUserID
                    //           });  
                    //            this.normalSigninFun(firebaseUserID) 
                    //         })
                    //         .catch((e) => {
                    //             console.log("signin errrr ",e)
                    //             this.setState({loading:false});
                    //         });
                    // });
                    fetch(apiUrl + 'normalLogin', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: this.state.email,
                                password: this.state.password,
                            })
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            // console.log("Successfull Login: ", responseJson);

                            this.setState({
                                loading: false
                            });
                            if (responseJson.success == 1) {

                                console.log(responseJson.profile);
                                if (responseJson.profile.firebaseId != "" && responseJson.profile.firebaseId != null) {
                                    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                                        .then((userData) => {
                                        console.log("normal login firebase User id :---- ", userData.user.uid)
                                        
                                        
                                        })
                                }        
                                // var userData={
                                //   'userId':responseJson.profile.userId,
                                //   'email':responseJson.profile.email,
                                //   'name': esponseJson.profile.name
                                // };
                                // AsyncStorage.setItem('userId', responseJson.profile.userId);
                                // AsyncStorage.setItem('name', responseJson.profile.name);
                                // AsyncStorage.setItem('email', responseJson.profile.email);
                                // AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
                                // AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);
                                if (responseJson.profile.userId != "" && responseJson.profile.userId != null) {
                                    AsyncStorage.setItem('userId', responseJson.profile.userId);
                                }
                                if (responseJson.profile.name != "" && responseJson.profile.name != null) {
                                    AsyncStorage.setItem('name', responseJson.profile.name);
                                }
                                if (responseJson.profile.email != "" && responseJson.profile.email != null) {
                                    AsyncStorage.setItem('email', responseJson.profile.email);
                                }
                                if (responseJson.profile.birthDay != "" && responseJson.profile.birthDay != null) {
                                    AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
                                }
                                if (responseJson.profile.mobileNumber != "" && responseJson.profile.mobileNumber != null) {
                                    AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);
                                }
                                if (responseJson.profile.firebaseId != "" && responseJson.profile.firebaseId != null) {
                                    AsyncStorage.setItem('firebaseId', responseJson.profile.firebaseId);
                                }
                                if (responseJson.profile.isManager != "" && responseJson.profile.isManager != null) {
                                    AsyncStorage.setItem('isManager', responseJson.profile.isManager);
                                }

                                if (responseJson.profile.referalCode != "" && responseJson.profile.referalCode != null) {
                                    AsyncStorage.setItem('referalCode', responseJson.profile.referalCode);
                                }
                                Actions.dashboard();
                                this.email.setNativeProps({
                                    text: ''
                                })
                                this.password.setNativeProps({
                                    text: ''
                                })
                                this.setState({
                                    password: '',
                                    email: ''
                                });
                                // AsyncStorage.getItem('userId', (err, result) => {
                                //   console.log(result);
                                // });
                            } else {
                                Alert.alert(
                                    'Verity One',
                                    'There is no user record corresponding to this identifier. The user may have been deleted.', [
                                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                        {
                                            text: 'OK',
                                            onPress: () => console.log('OK Pressed')
                                        },
                                    ], {
                                        cancelable: true
                                    }
                                )
                            }



                        })
                        .catch((error) => {
                            console.error(error);
                            this.setState({
                                loading: false
                            });
                        });
                } else {
                    Alert.alert(
                        'Verity One',
                        netErrorMsg, [
                            // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                            // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed')
                            },
                        ], {
                            cancelable: true
                        }
                    )
                }
            }
        }
        // .then(function(response) {
        //     // var userData=response.json();

        //   console.log( response.json())
        // })
    }
    normalSigninFun = (firebaseUserID) =>{
        fetch(apiUrl + 'normalLogin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                firebaseId:firebaseUserID
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log("Successfull Login: ", responseJson);

            this.setState({
                loading: false
            });
            if (responseJson.success == 1) {

                console.log(responseJson.profile);
                if (responseJson.profile.firebaseId != "" && responseJson.profile.firebaseId != null) {
                    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                        .then((userData) => {
                        console.log("normal login firebase User id :---- ", userData.user.uid)
                        
                        
                        })
                }        
                // var userData={
                //   'userId':responseJson.profile.userId,
                //   'email':responseJson.profile.email,
                //   'name': esponseJson.profile.name
                // };
                // AsyncStorage.setItem('userId', responseJson.profile.userId);
                // AsyncStorage.setItem('name', responseJson.profile.name);
                // AsyncStorage.setItem('email', responseJson.profile.email);
                // AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
                // AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);
                if (responseJson.profile.userId != "" && responseJson.profile.userId != null) {
                    AsyncStorage.setItem('userId', responseJson.profile.userId);
                }
                if (responseJson.profile.name != "" && responseJson.profile.name != null) {
                    AsyncStorage.setItem('name', responseJson.profile.name);
                }
                if (responseJson.profile.email != "" && responseJson.profile.email != null) {
                    AsyncStorage.setItem('email', responseJson.profile.email);
                }
                if (responseJson.profile.birthDay != "" && responseJson.profile.birthDay != null) {
                    AsyncStorage.setItem('birthDay', responseJson.profile.birthDay);
                }
                if (responseJson.profile.mobileNumber != "" && responseJson.profile.mobileNumber != null) {
                    AsyncStorage.setItem('mobileNumber', responseJson.profile.mobileNumber);
                }
                if (responseJson.profile.firebaseId != "" && responseJson.profile.firebaseId != null) {
                    AsyncStorage.setItem('firebaseId', responseJson.profile.firebaseId);
                }
                if (responseJson.profile.isManager != "" && responseJson.profile.isManager != null) {
                    AsyncStorage.setItem('isManager', responseJson.profile.isManager);
                }
                Actions.dashboard();
                this.email.setNativeProps({
                    text: ''
                })
                this.password.setNativeProps({
                    text: ''
                })
                this.setState({
                    password: '',
                    email: ''
                });
                // AsyncStorage.getItem('userId', (err, result) => {
                //   console.log(result);
                // });
            } else {
                Alert.alert(
                    'Verity One',
                    'There is no user record corresponding to this identifier. The user may have been deleted.', [
                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed')
                        },
                    ], {
                        cancelable: true
                    }
                )
            }



        })
        .catch((error) => {
            console.error(error);
            this.setState({
                loading: false
            });
        });
    }
    emailChange = (text) => {
        this.setState({
            email: text
        });
    }
    passwordChange = (text) => {
        this.setState({
            password: text
        });
    }

    forgotEmailChange = (text) => {
        this.setState({
            forgotEmail: text
        });
    }


    _toggleModal = () => {
        if (!this.state.loading) {
            // this.setState({
            //     isModalVisible: !this.state.isModalVisible
            // });
            this.setState({
                dialogVisible: !this.state.dialogVisible
            });
        }
    }

    _toggleModalOkClick = () => {

       
        console.log(this.state.forgotEmail);

        if (this.state.netStatus != "none") {

            if(this.state.forgotEmail == "")
            {
                this.setState({errorForgotEmail:"Email address is required."})
            }
            else
            {
                this.setState({errorForgotEmail:""})
                fetch(apiUrl + 'forgotPassword', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: this.state.forgotEmail
                        })
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        if (responseJson.success == 1) {

                            

                            this.setState({
                                forgotEmail: ''
                            });

                            this.setState({
                                dialogVisible: false
                            });

                            setTimeout(() => {

                                Alert.alert(
                                    'Verity One',
                                    'An email has been sent to your email address for Password Reset.', [
                                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                        {
                                            text: 'OK',
                                            onPress: () => console.log('OK Pressed')
                                        },
                                    ], {
                                        cancelable: true
                                    }
                                )
                            }, 500)    

                        } else {
                            this.setState({
                                dialogVisible: false
                            });
                            this.setState({
                                forgotEmail: ''
                            });
                            setTimeout(() => {
                                
                            
                                Alert.alert(
                                    'Verity One',
                                    responseJson.message, [
                                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                        {
                                            text: 'OK',
                                            onPress: () => console.log('OK Pressed')
                                        },
                                    ], {
                                        cancelable: true
                                    }
                                )
                            }, 500)
                        }



                    })
                    .catch((error) => {
                        console.error(error);
                        this.setState({
                            forgotEmail: ''
                        });
                        this.setState({
                            dialogVisible: !this.state.dialogVisible
                        });
                        this.setState({errorForgotEmail:""})
                    });
            }    
            // this.setState({
            //     isModalVisible: !this.state.isModalVisible
            // });

            
        } else {
            Alert.alert(
                'Verity One',
                netErrorMsg, [
                    // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                    // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed')
                    },
                ], {
                    cancelable: true
                }
            )
            this.setState({
                isModalVisible: !this.state.isModalVisible
            });
        }



    }

  render(){
    /*<Toast
                    ref="toast"
                    style={{backgroundColor:'#000000'}}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'#ffffff'}}
                />*/
    return(
      <View style={styles.mainContainer}>
            
            <View style={styles.row,styles.imageBox, styles.logo}>
                    <Image style={{width:152,height:65}} source = {{uri: 'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711036_homeLogo@2x.png'}} />
            </View> 
            <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
          >

                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Email"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    keyboardType="email-address"
                    onSubmitEditing={()=> this.password.focus()}
                    onChangeText={this.emailChange}
                    ref={(input) => {
                      this.email = input
                    }}
                    />
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Password"
                    secureTextEntry={true}
                    selectionColor="#000"
                    placeholderTextColor = "#999999"
                    ref={(input) => this.password = input}
                    onChangeText={this.passwordChange}
                    />  

                  <TouchableOpacity onPress={this._toggleModal}><Text style={styles.forgotPassword}> Forgot Password?</Text></TouchableOpacity> 
                  
                 <TouchableOpacity style={styles.button} onPress = {
                        () => this.normalLogin()}>
                   <Text style={styles.buttonText} >Login</Text>
                 </TouchableOpacity>


                 <Text style={{color:'#706f6f',fontWeight:'400',fontSize:16,padding:10,fontFamily: 'sansserif'}}> OR </Text> 

                 
                 <View style={{ flexDirection:'row' }}>

                      <View style={{ flexDirection:'column',padding:10 }}> 
                         <TouchableOpacity style={[styles.FacebookStyle]} onPress = {
                        () => this.googleLogin()} activeOpacity={0.5} >
               
                           <Image 
                            source={require('../images/google-icon.png')} 
                            style={styles.ImageIconStyle} 
                            />
                   
                         </TouchableOpacity>
                      </View> 
                      <View style={{ flexDirection:'column',padding:10 }}>
                         <TouchableOpacity style={[styles.FacebookStyle]} activeOpacity={0.5} onPress = {
                        () => this.facebookLogin()}>
               
                           <Image 
                            source={require('../images/facebook.png')} 
                            style={styles.ImageIconStyle} 
                            />
                   
                         </TouchableOpacity>
                      </View>

                        
                 </View>
                 


                 <TouchableOpacity onPress={this.signup}><Text style={styles.signupButton}> Not Registered? Start Here</Text></TouchableOpacity>
                 {(this.state.loading && 
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
                  </View>
                )}

                  <Modal style={{borderRadius:4}} isVisible={this.state.isModalVisible} onRequestClose={() => { this.setState({'isModalVisible':false}) } }>
                        <View style={{ backgroundColor:'#ffffff',padding:22 }}>
                          <Text style={{textAlign:'center',fontSize:16,paddingBottom:8,fontFamily: 'sansserifBold'}}>Forgot Password</Text>
                          <Text style={{textAlign:'center',fontSize:16,paddingBottom:8,fontFamily: 'sansserif'}}>Please enter your email address</Text>
                          <TextInput style={[styles.forgotEmail,{borderRadius:0}]} 
                            underlineColorAndroid='rgba(0,0,0,0)' 
                            placeholder="Enter email address"
                            placeholderTextColor = "#999999"
                            selectionColor="#000"
                            keyboardType="email-address"
                            onChangeText={this.forgotEmailChange}
                            
                            />
                          <TouchableOpacity onPress={this._toggleModal}>
                            <Text style={{textAlign:'left'}}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={this._toggleModalOkClick}>
                            <Text style={{textAlign:'center'}}>Ok</Text>
                          </TouchableOpacity>
                          
                        </View>
                  </Modal> 
                  
                  <ConfirmDialog
                    title="Forgot Password"
                    visible={this.state.dialogVisible}
                    onTouchOutside={() => {this.setState({dialogVisible: false}); this.setState({errorForgotEmail: ""}); }}
                    negativeButton={{
                        title: "Cancel",
                        onPress: () => {this.setState({dialogVisible: false}); this.setState({errorForgotEmail: ""}); } 
                    }}
                    positiveButton={{
                        title: "Ok",
                        
                        onPress: () => {this._toggleModalOkClick()}
                    }} >
                    <View>
                    <Text style={{textAlign:'center',fontSize:16,paddingBottom:8,fontFamily: 'sansserif'}}>Please enter your email address</Text>
                          <TextInput style={[styles.forgotEmail,{borderRadius:0}]} 
                            underlineColorAndroid='rgba(0,0,0,0)' 
                            placeholder="Enter email address"
                            placeholderTextColor = "#999999"
                            selectionColor="#000"
                            keyboardType="email-address"
                            onChangeText={this.forgotEmailChange}
                            
                            />
                    {(this.state.errorForgotEmail != "" && 
                        <Text style={{textAlign:'center',fontSize:16,paddingBottom:2,fontFamily: 'sansserif',color:'red'}}>{this.state.errorForgotEmail}</Text>    
                    )}        
                    </View>
                </ConfirmDialog>
            </KeyboardAvoidingView> 
            <View style={styles.signupTextCont}>
              
            </View>
            
      </View>      

      )
  }
}

