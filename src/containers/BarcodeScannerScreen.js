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
  Platform,
  Keyboard,
  NetInfo,
  BackHandler, 
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
// import RNCamera from 'react-native-camera';
// import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Camera,BarCodeScanner, Permissions } from 'expo';

import { Actions } from 'react-native-router-flux';
import styles from "../styles/BarcodeScannerStyle";
import {apiUrl,netErrorMsg} from "../config/constant";


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";

export default class BarcodeScannerScreen extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          torchMode: 'off',
          type: 'back',
          hasCameraPermission: "",
          hasCameraRollPermission:"",
          barcode:'',
          loading:false,
          netStatus:'none'
       }
       
    }
    goBack = () => { 
      this.setState({barcode:""});
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

      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({hasCameraPermission: status === 'granted'});

      const { Rollstatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({hasCameraRollPermission: Rollstatus === 'granted'});
    }
    async componentDidMount() {
      NetInfo.getConnectionInfo().then((connectionInfo) => {
        console.log("............+++++++++",connectionInfo.type)
      this.setState({'netStatus':connectionInfo.type})
      });
            
      NetInfo.addEventListener('connectionChange',this.handleConnectivityChange);

    }
    componentWillReceiveProp(nextProps)
    {
      console.log("....",nextProps)
      console.log("props................barcode")
      console.log(this.props);
    }
    handleConnectivityChange = (connectionInfo) => {
           
           console.log("change event.....",connectionInfo.type);
           this.setState({'netStatus':connectionInfo.type})
    }
    updateBarcodeState = () => {
      console.log("updating barcode state........................")
      this.setState({barcode:""});
    } 
    delay(time) {
      return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(), time);
      });
    }
  _handleBarCodeRead = async ({ type, data }) => {
    
        if(!this.state.loading)
        {

          
          await this.delay(500);

          console.log(this.state.barcode+" ....== "+data)
          if (this.state.barcode == data){console.log("............match"); return; }
          await this.setState({barcode: data});
            
            console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
            
              if(!this.state.loading)
              {
                
                  this.setState({loading:true});

                    console.log({
                                searchword:this.state.barcode,
                                userId:userId,
                                offset:"0",
                                isUpdated:"1"

                              })
                    if(this.state.netStatus != "none")
                    {
                      console.log(this.state.barcode," == ",data)
                      await fetch(apiUrl+'search', {  
                                method: 'POST',
                                headers: {
                                  'Accept': 'application/json',
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  searchword:this.state.barcode,
                                  userId:userId,
                                  offset:"0",
                                  isUpdated:"1"

                                })
                              })
                              .then((response) => response.json())
                              .then((responseJson) => {
                                  // alert(responseJson.result[0].productName)
                                  // console.log(responseJson);
                                  console.log("Search Total data : "+responseJson.total);
                                  

                                   
                                  if(responseJson.success == 1)
                                  {
                                    var handleClick = this.updateBarcodeState.bind(this);
                                    if(responseJson.total > 0)
                                    {
                                      // this.setState({isDataAvailable:false});
                                      Actions.SearchProduct({'scanFlag':'Yes',searchKey:this.state.barcode,'handleClick':handleClick});
                                      // Actions.AddProduct({searchKey:this.state.barcode,'handleClick':handleClick});
                                      this.setState({loading:false});
                                    }
                                    else
                                    {
                                      Actions.AddProduct({searchKey:this.state.barcode,'handleClick':handleClick});
                                      this.setState({loading:false});
                                    }

                                  } 
                                  else
                                  {
                                    this.setState({loading:false});
                                    this.setState({barcode:""});
                                  } 
                                  //   // console.log(responseJson.result);
                                    
                                  //      this.setState({
                                  //         products: [...this.state.products, ...responseJson.result]
                                  //       })
                                     
                                  //   // console.log(this.state.products);
                                  // }
                                  // else
                                  // {
                                  //     Alert.alert(
                                  //       'Verity One',
                                  //       responseJson.message,
                                  //       [
                                  //         // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                  //         // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                  //         {text: 'OK', onPress: () => console.log('OK Pressed')},
                                  //       ],
                                  //       { cancelable: true }
                                  //     )
                                  // }
                              

                              
                            })
                            .catch((error) => {
                              console.error(error);
                              this.setState({loading:false});
                              this.setState({barcode:""});
                            }); 
                          }
                      }
                      else
                      {
                        this.setState({loading:false});

                        console.log("search connection")
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
    onClickTorch = () => { 
      
      if(this.state.torchMode == "on"){this.setState({torchMode:'off'});}
      else {this.setState({torchMode:'on'});}

      console.log(this.state.torchMode);
    }

    onClickType = () => { 
      
      if(this.state.type == "back"){this.setState({type:'front'});}
      else {this.setState({type:'back'});}

    }
  
  
  render() {
      const { hasCameraPermission } = this.state.hasCameraPermission;

      const { hasCameraRollPermission } = this.state.hasCameraRollPermission;

    if (hasCameraPermission === "" || hasCameraRollPermission === "") {
      return <Text>Requesting for camera permission.</Text>;
    } else if (hasCameraPermission === false || hasCameraRollPermission === false) {
      return <Text>No access to camera.</Text>;
    } else {
      return (
        <View style={styles.mainContainer}>
       
            <View style={[styles.row]}>
              
              <BarCodeScanner
                torchMode={this.state.torchMode}
                type={this.state.type}
                onBarCodeRead={this._handleBarCodeRead}
                style={[StyleSheet.absoluteFill, styles.container]}>

                    
                    
                    <View style={[styles.layerTop]}>
                        <TouchableOpacity onPress={() => this.goBack()}><Image 
                                    source={require('../../assets/images/backWhiteImage.png')}
                                    style={styles.ImageIconStyle} 
                                    /></TouchableOpacity>
                  
                        <TouchableOpacity  activeOpacity={1} onPress={
                                      () => this.onClickType()}>  
                            
                            <Image 
                                    source={require('../../assets/images/whiteRefresh.png')} 
                                    style={styles.ImageIconStyle} 
                                    />
                          </TouchableOpacity>

                        <TouchableOpacity  activeOpacity={1} onPress={
                                      () => this.onClickTorch()}>  
                            <Image 
                                    source={require('../../assets/images/whiteFlash.png')} 
                                    style={styles.flashImageIconStyle} 
                                    />
                        </TouchableOpacity>
                    </View>
                  {/* Opacity Code Starts */}  
                    
                  <View style={styles.layerCenter}>
                      <View style={styles.layerLeft} />
                      <View style={styles.focused}> 
                            <View
                              style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "red",
                              }}>
                              <Image 
                                          source={require('../../assets/images/laser.gif')} 
                                          style={{height:7,width:'100%',resizeMode:'cover'}} 
                                          />
                              
                            </View>
                            
                      </View>
                      <View style={styles.layerRight} />
                  </View>
                  <View style={styles.layerBottom} />
                  
                  {/* Opacity Code Ends */}
              </BarCodeScanner>
              
            </View>
            {(this.state.loading &&                     
              <View style={[styles.loading]}>
                        <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
              </View>
            )}
        </View>
      );
    }
  }




}

