import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  Button,
  View,
  StatusBar ,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  AsyncStorage,
  Image,
  Dimensions,
  Keyboard,
  Platform,
  NetInfo,
  ActivityIndicator
} from 'react-native';
import Modal from "react-native-modal";

import firebase from '../config/firebaseService';


import Backend from '../config/Backend';

import { Actions } from 'react-native-router-flux';
import { ImagePicker,Camera, Permissions, Notifications } from 'expo';

import Icon from 'react-native-vector-icons/FontAwesome';
import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

import {BackPress} from './Functions';
import styles from "../styles/DashboardStyle";
import {apiUrl,netErrorMsg} from "../config/constant";


const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
var windowDimensions = Dimensions.get('window');
const DashboardData="";
var firebaseId="";
var userName="";
var email="";
var isManager="0";
var userId="";
export default class Dashboard extends Component<{}> {
  
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            DashboardData: "",
            viewArray: [],
            data: "0",
            loading:false,
            hasCameraPermission: "",
            hasCameraRollPermission: "",
            hasNotificationPermission:"",
            scanModule:false,
            scanImage:"",
            searchModule:false,
            searchImage:"",
            aboutUsModule:false,
            aboutUsImage:"",
            chatModule:false,
            chatImage:"",
            recallModule:false,
            recallImage:"",
            inviteModule:false,
            inviteImage:"",
            verityTokenModule:false,
            verityTokenImage:"",
            topHeaderImage:"",
            settingIcon:"",
            backgroundColor:"#4ac0f7"
        }
       
    }
  goBack() {
      Actions.pop();
  }
  
  handleConnectionChange = (isConnected) => {
      this.setState({
          netStatus: isConnected
      });
      console.log("change event.....");
      console.log(`is connected: ${this.state.netStatus}`);
  }
  async componentWillMount() {

      Keyboard.dismiss()
        // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        //   await NetInfo.isConnected.fetch().done(
        //     (isConnected) => { console.log("mount event....."); console.log(isConnected); }
        //   );
        // NetInfo.isConnected.fetch().done((isConnected) => {
        //   console.log("connected ",isConnected)
        // if (isConnected)
        // {
        //   //Put your code here when internet is connected
        // }else{
        //  // Alert for no internet
        // }
        // });
       
       await AsyncStorage.getItem('firebaseId',
           (err, value) => {
               if (value != "") {
                   firebaseId = value;
               }
           });
           await AsyncStorage.getItem('isManager',
           (err, value) => {
               if (value != "") {
                isManager = value;
               }
           });    
      await AsyncStorage.getItem('name',
           (err, value) => {
               if (value != "") {
                userName = value;
               }
           }); 
           await AsyncStorage.getItem('email',
           (err, value) => {
               if (value != "") {
                email = value;
               }
           });         
       await AsyncStorage.getItem('userId',
           (err, value) => {
               if (value != "") {
                    userId = value;
                   if(isManager == "0"){
                     Backend.setloggedInUserId(userId)
                   }
                   console.log("Dashboard USer ID:" + userId);
                   // console.log({apiUrl});
                   NetInfo.getConnectionInfo().then((connectionInfo) => {
                       // console.log(connectionInfo.type)
                       if (connectionInfo.type != "none") {
                        this.setState({loading: true});
                           fetch(apiUrl + 'getConfigurations', {
                                   method: 'POST',
                                   headers: {
                                       'Accept': 'application/json',
                                       'Content-Type': 'application/json',
                                   },
                                   body: JSON.stringify({
                                       imageType: "1",
                                       userId: userId
                                   })
                               })
                               .then((response) => response.json())
                               .then((responseJson) => {
                                   if (responseJson.success == 1) {

                                       // GoogleSignin.signOut()
                                       // .then(() => {
                                       //   console.log('out');
                                       // })
                                       // .catch((err) => {

                                       // });
                                       console.log(responseJson.result.screen);


                                       // AsyncStorage.getItem('userId', (err, result) => {
                                       //   console.log(result);
                                       // });
                                       for (let details of responseJson.result.screen) {
                                           if (details.screenName == "About Us") {
                                               AsyncStorage.setItem('aboutUsScreen', JSON.stringify(details));
                                           } else if (details.screenName == "Settings") {
                                               AsyncStorage.setItem('settingScreen', JSON.stringify(details));
                                           } else if (details.screenName == "Dashboard") {
                                               console.log("...........................")
                                               // console.log(details.items[0]);
                                              // console.log(details.items)
                                              if(details.topHeaderImage)
                                              {
                                                this.setState({topHeaderImage: details.topHeaderImage })
                                              }
                                              if(details.backgroundColor)
                                              {
                                                this.setState({backgroundColor: details.backgroundColor })
                                              }
                                              if(details.settingIcon)
                                              {
                                                this.setState({settingIcon: details.settingIcon })
                                              }
                                              for (let items of details.items) {
                                                if(items.itemName == "Scan")
                                                {
                                                  
                                                  this.setState({scanModule: true })
                                                  this.setState({scanImage:items.image})
                                                }
                                                else if(items.itemName == "Search")
                                                {
                                                  this.setState({searchModule: true })
                                                  this.setState({searchImage:items.image})
                                                }
                                                else if(items.itemName == "About Us")
                                                {
                                                  this.setState({aboutUsModule: true })
                                                  this.setState({aboutUsImage:items.image})
                                                }
                                                else if(items.itemName == "Chat")
                                                {
                                                  this.setState({chatModule: true })
                                                  this.setState({chatImage:items.image})
                                                }
                                                else if(items.itemName == "Recall")
                                                {
                                                  this.setState({recallModule: true })
                                                  this.setState({recallImage:items.image})
                                                }
                                                else if(items.itemName == "Invite")
                                                {
                                                  this.setState({inviteModule: true })
                                                  this.setState({inviteImage:items.image})
                                                }
                                                else if(items.itemName == "VERITY Token")
                                                {
                                                  this.setState({verityTokenModule: true })
                                                  this.setState({verityTokenImage:items.image})
                                                }
                                              }  
                                              //  var rows = Math.round(details.items.length / 3); // define number of rows
                                              //  var cols = 3; // define number of columns
                                              //  var cnt = 0;
                                              //  for (var tr = 0; tr < rows; tr++) {

                                              //      DashboardData += "<View style={styles.row}>";
                                              //      for (var td = 0; td < cols; td++) {


                                              //          DashboardData += "<TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={() => this._toggleModal()}><Image style={styles.image}  source={{uri: " + details.items[cnt].image + "}} /><View style={[styles.textView]}><Text style={[styles.btnText]}>" + details.items[cnt].itemName + "</Text></View></TouchableOpacity>";

                                              //          cnt++;
                                              //      }
                                              //      DashboardData += "</View>";
                                              //  }
                                              //  this.setState({
                                              //      viewArray: details.items
                                              //  })
                                              //  this.setState({
                                              //      DashboardData: DashboardData
                                              //  })
                                              this.setState({loading: false});
                                           }
                                       }
                                   } else {
                                    this.setState({loading: false});
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
                                   }
                               })
                               .catch((error) => {
                                this.setState({loading: false});
                                   console.error(error);
                                   
                               });
                       } else {
                        this.setState({loading: false});
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
                   });
               }
           });
       const {
           status
       } = await Permissions.askAsync(Permissions.CAMERA);
       this.setState({
           hasCameraPermission: status === 'granted'
       });
       const {
           Rollstatus
       } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
       this.setState({
           hasCameraRollPermission: Rollstatus === 'granted'
       });

       let { notificationStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

       this.setState({
            hasNotificationPermission: notificationStatus === 'granted'
        });
  }
  // async componentDidMount() {
  //   console.log("did mount...........")
  //   console.log(checkConnection());


  // }  
 
  onRecallClick(){
    
    Actions.ReCall();      
  }
  onInviteClick(){
    Actions.Invite();      
  }
  _toggleModal = () =>
  {
    // this.setState({ isModalVisible: !this.state.isModalVisible });
    this.slideDialog.show();
  }
  onBarcodeScanClick =() =>
  {
      Actions.BarcodeScannerScreen();
      this.slideDialog.dismiss();
      // this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  onOCRScanClick =() =>
  {
    // Actions.BarcodeScreen();
    this.slideDialog.dismiss();
    this.slideAnimationDialog.show();
    // Actions.OCRScreen();
  }
  showSlideAnimationDialog = () => {
    
      this.slideAnimationDialog.show();
  }
  _pickImageFromGallery = async () => {
    
    this.slideAnimationDialog.dismiss();
    // launchCameraAsync
    // launchImageLibraryAsync
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64 : true
      });
      console.log(Object.keys(result));
     console.log(result);
      // result=JSON.parse(result);
      if (!result.cancelled) {
        // let imageobj={
        //   "image":result.uri
        // }
        this.slideDialog.dismiss();
         Actions.OCRScreen({uri: result.uri, 'base64':result.base64});
        
      }

  }; 
  _takeImage= async () => {

    this.slideAnimationDialog.dismiss();
    let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64 : true
      });

      // console.log(result);

      if (!result.cancelled) {
        // let imageobj={
        //   "image":result.uri
        // }
        this.slideDialog.dismiss();
         Actions.OCRScreen({uri: result.uri, 'base64':result.base64});
        
      }
  } 
  onVerityTokenClick()
  {
    Actions.VerityToken();
  }

  renderElement= () =>
  {
    console.log("sdf" +this.state.data);
    console.log(this.state.viewArray)
    this.state.viewArray.map(( item, key ) =>{
      alert("hello")
    return <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={() => this._toggleModal()}><Image style={styles.image}  source={{uri: item.image}} /><View style={[styles.textView]}><Text style={[styles.btnText]}>item.itemName</Text></View></TouchableOpacity>

    })
  }
  async onLogoutClick()
  {
    // Alert.alert(
    //   '',
    //   'Are you sure you want to logout?',
    //   [
    //     {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //     {text: 'Yes', onPress: () => {
            await AsyncStorage.clear();
            
            // setTimeout(function(){ 
                Actions.login(); 
      //       },2000);
      //   }},
      // ],
      // { cancelable: true })
    

  }
  onAbountUsClick = () =>
  {
    
    Actions.AboutUs()
  }
  onChatClick = () => {
    // console.log("name")
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      // console.log(connectionInfo.type)
      if (connectionInfo.type != "none") {
        console.log(" chat click >>>>>>> ", firebaseId);
        if (firebaseId) {
          console.log(isManager,userId)
          if(isManager == "1" || userId == "631")
          {
            Actions.UserList()
          }
          else
          {
            Actions.Chat({'userName':userName})
            
          }
          
        } else {
          console.log("email............",email)
          firebase.auth().signInWithEmailAndPassword(email, '123456')
            .then((userData) => {
              console.log("firebase User id :---- ", userData.user.uid)
              console.log({
                firebaseId: userData.user.uid
              });
              if (userData.user.uid != "" && userData.user.uid != null) {
                AsyncStorage.setItem('firebaseId', userData.user.uid);
                console.log(isManager,userId)
                    if(isManager == "1" || userId == "631")
                    {
                      Actions.UserList()
                    }
                    else
                    {
                      Actions.Chat({'userName':userName})
                      
                    }
              }
            })
            .catch(() => {
              firebase.auth().createUserWithEmailAndPassword(email, '123456')
                .then((userData) => {
                  //  console.log("catch success firebase user ",userData); 
                  console.log("catch firebase User id :---- ", userData.user.uid)
                  console.log({
                    firebaseId: userData.user.uid
                  });
                  if (userData.user.uid != "" && userData.user.uid != null) {
                    AsyncStorage.setItem('firebaseId', userData.user.uid);
                    console.log(isManager,userId)
                    if(isManager == "1" || userId == "631")
                    {
                      Actions.UserList()
                    }
                    else
                    {
                      Actions.Chat({'userName':userName})
                      
                    }
                  }
                })
                .catch((e) => {
                  
                  console.log("errrr ", e);
                  
                });
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
    });

  }
  onSettingClick = () =>
  {
    
    Actions.Setting()
  }
  onSearchClick()
  {
    Actions.SearchProduct({'scanFlag':'No',searchKey:''});
  }
	render() {
    var cnt=0;
    
    // let Render_Animated_View = this.state.viewArray.map(( item, key ) =>
    //     {
    //         // if(( key ) % 2 == 0)
    //         // {
    //         //   return(

                    
    //         //         <View style={styles.row}><TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={() => this._toggleModal()}><Image style={styles.image}  source={{uri: item.image}} /><View style={[styles.textView]}><Text style={[styles.btnText]}>item.itemName</Text></View></TouchableOpacity></View>
    //         //   );
    //         // }
    //         // else

    //         let key1=key+1;
    //         if(key1 == 7)
    //         {
    //           return;
    //         }
    //         const css_start = (key1 == 1 || key1 == 4 || key1 == 7 || key1 == 10 ) ? <View style={styles.row}> : "";
    //          const css_end = (key1 == 3 || key1 == 6 || key1 == 9 || key1 == 12 ) ? </View> : "";
            

            
    //           return(
    //               {( key == 1 &&

    //                 <View style={{flexDirection: 'column'}}><TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={() => this._toggleModal()}><Image style={styles.image}  source={{uri: item.image}} /><View style={[styles.textView]}><Text style={[styles.btnText]}>{item.itemName}</Text></View></TouchableOpacity></View>

    //               )}
    //               {( key != 1 &&  
    //                 <View style={{flexDirection: 'column'}}><TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={() => this._toggleModal()}><Image style={styles.image}  source={{uri: item.image}} /><View style={[styles.textView]}><Text style={[styles.btnText]}>{item.itemName}</Text></View></TouchableOpacity></View>

    //               )}  
    //           );
              
                
            
    //     });
     const { hasCameraPermission } = this.state.hasCameraPermission;

      const { hasCameraRollPermission } = this.state.hasCameraRollPermission;
      const { hasNotificationPermission } = this.state.hasNotificationPermission;
    if (hasCameraPermission === "" || hasCameraRollPermission === "") {
      return <Text>Requesting for camera permission.</Text>;
    } else if (hasCameraPermission === false || hasCameraRollPermission === false) {
      return <Text>No access to camera.</Text>;
    } else {       
		return(
        

        <View style={{flex: 1,
          flexDirection: 'column',
          top:20,
          backgroundColor:this.state.backgroundColor}}>
          
          {(this.state.settingIcon != "" && 
            <View style={styles.row,styles.imageBox, styles.setting}>
              <TouchableOpacity activeOpacity={1} onPress={() => this.onSettingClick()}>
              <Image style={{width:30,height:30}} source = {{uri: this.state.settingIcon}} />
              </TouchableOpacity> 
            </View>
          )}  
          {(this.state.topHeaderImage != "" && 
            <View style={styles.row,styles.imageBox, styles.logo}>
              <Image style={styles.logoImage} source = {{uri: this.state.topHeaderImage}} />
            </View>
          )}
          
          <View style={[styles.row,styles.row2]}>
            {(this.state.scanModule && this.state.scanImage !="" &&
              <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={() => this._toggleModal()}>
                <Image style={styles.image}  source={{uri: this.state.scanImage}} />
                    
                  <View style={[styles.textView]}>
                    <Text style={[styles.btnText]}>Scan</Text>
                  </View>
              </TouchableOpacity> 
              
            )}

            {(this.state.searchModule && this.state.searchImage!="" &&
              <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={this.onSearchClick}>
                <Image style={styles.image}  source={{uri: this.state.searchImage}} />
                <View style={[styles.textView]}>
                    <Text style={[styles.btnText]}>Search</Text>
                </View>    
              </TouchableOpacity>
            )} 

            {(this.state.aboutUsModule && this.state.aboutUsImage!= "" && 
              <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress = {
                          () => this.onAbountUsClick()}>
                <Image style={styles.image}  source={{uri: this.state.aboutUsImage}} />
                    
                <View style={[styles.textView]}>
                    <Text style={[styles.btnText]}>About Us</Text>
                </View>
              </TouchableOpacity>
            )} 
          </View>
          <View style={[styles.row,styles.row2]}>

            {(this.state.chatModule && this.state.chatImage!="" && 
              <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={() => this.onChatClick()}>
                <Image style={styles.image}  source={{uri: this.state.chatImage}} />
                
                <View style={[styles.textView]}>
                    <Text style={[styles.btnText]}>Chat</Text>
                </View>    
                
              </TouchableOpacity>  
            )}  

            {(this.state.recallModule && this.state.recallImage!="" && 
              <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={this.onRecallClick}>
                <Image style={styles.image}  source={{uri: this.state.recallImage}} />
                
                <View style={[styles.textView]}>
                    <Text style={[styles.btnText]}>Recall</Text>
                </View>    
                
              </TouchableOpacity> 
            )}

            {(this.state.inviteModule &&  this.state.inviteImage!="" && 
              <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={this.onInviteClick}>
                <Image style={styles.image}  source={{uri: this.state.inviteImage}} />
                
                <View style={[styles.textView]}>
                    <Text style={[styles.btnText]}>Invite</Text>
                </View>    
                
              </TouchableOpacity> 
            )}  
          </View>
          {(this.state.verityTokenModule && this.state.verityTokenImage!="" &&
            <View style={[styles.row,styles.row2]}>

              
                <TouchableOpacity style={[styles.row,styles.box_new]} activeOpacity={1} onPress={this.onVerityTokenClick}>
                  <Image style={styles.image}  source={{uri: this.state.verityTokenImage}} />
                  
                  <View style={[styles.textView]}>
                      <Text style={[styles.btnText]}>VERITY Token</Text>
                  </View>    
                  
                </TouchableOpacity>

              
              <View style={[styles.row,styles.box_new]}></View>
              <View style={[styles.row,styles.box_new]}></View>

            </View>
          )}
          <View style={styles.row}>
            
          </View>
          <View style={styles.row}>
            
          </View>
          <TouchableWithoutFeedback  onPress={() => this.setState({ isModalVisible: false })}>
          <Modal isVisible={this.state.isModalVisible} onRequestClose = {() => { console.log("Modal has been closed.") } }
            style={ {zIndex: 1, elevation: 1 }}
          >
               
                        <View style={{ backgroundColor:'#ffffff',borderRadius:4,opacity: 0.7}}>
                          <View style={{padding:5}}>
                            <TouchableOpacity activeOpacity={1} onPress={this.onBarcodeScanClick}>
                              <Text style={{textAlign:'center',fontSize:16}}>Barcode Scan</Text>
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: "#000",
                            }}
                          />
                          <View style={{padding:5}}>
                            <TouchableOpacity activeOpacity={1} onPress={this.onOCRScanClick}>
                              <Text style={{textAlign:'center',fontSize:16}}>OCR Scan</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                  </Modal>


         </TouchableWithoutFeedback> 
         <TouchableWithoutFeedback >
         <PopupDialog
              width={Dimensions.width}
              height={50}
              containerStyle={ {zIndex: 1, elevation: 1 ,opacity: 0.7}}
              ref={(popupDialog) => {
                this.slideDialog = popupDialog;
              }}
              dismissOnHardwareBackPress={true}
              // dismissOnTouchOutside={false}
              dialogAnimation={slideAnimation}
            >

                <View style={{ backgroundColor:'#ffffff',borderRadius:4,opacity: 0.9}}>
                  <View style={{padding:3}}>
                    <TouchableOpacity activeOpacity={1} onPress={this.onBarcodeScanClick}>
                      <Text style={{textAlign:'center',fontSize:16}}>Barcode Scan</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "100%",
                      backgroundColor: "#000",
                    }}
                  />
                  <View style={{padding:3}}>
                    <TouchableOpacity activeOpacity={1} onPress={this.onOCRScanClick}>
                      <Text style={{textAlign:'center',fontSize:16}}>OCR Scan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
          
        </PopupDialog> 
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
            <PopupDialog
                  width={250}
                  height={110}
                  dialogStyle={{ position: 'absolute', bottom: '40%' ,zIndex:10}}
                  ref={(popupDialog) => {
                    this.slideAnimationDialog = popupDialog;
                  }}
                  // dismissOnTouchOutside={false}
                  dismissOnHardwareBackPress={true}
                  dialogAnimation={slideAnimation}
                >

                    <View style={[styles.modelRow]}>
                      <Text style={{color:'#b8babc'}}> Verity One</Text>
                    </View>
                    <View style={[styles.modelRow]}>
                    <TouchableOpacity  onPress = {
                              () => this._takeImage()} >
                        <Text style={styles.modelText}>Take a picture</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.modelLastRow]}>
                    <TouchableOpacity  onPress = {
                              () => this._pickImageFromGallery()} >
                        <Text style={styles.modelText}>Select photo from library</Text>
                      </TouchableOpacity>
                    </View>
              
            </PopupDialog> 
        </TouchableWithoutFeedback>
                {(this.state.loading && 
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
                  </View>
                )}


            </View>	   
			)}
	}
}



