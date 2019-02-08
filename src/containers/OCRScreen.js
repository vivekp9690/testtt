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
  LayoutAnimation,
  PermissionsAndroid,
  ScrollView,
  AppRegistry,
  NetInfo
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
// import RNCamera from 'react-native-camera';
// import PropTypes from 'prop-types';




import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Camera,BarCodeScanner, Permissions } from 'expo';

import { Actions } from 'react-native-router-flux';
import styles from "../styles/OCRScreenStyle";
import {apiUrl,netErrorMsg,ocrGoogleAPIURL,ocrAndroidKEY,ocrIOSKEY,ocrBundleID} from "../config/constant";
// import {RNFetchBlob} from "react-native-fetch-blob";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";

export default class OCRScreen extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {

          torchMode: 'off',
          type: 'back',
          hasCameraPermission: null,
          ocrText:'',
          loading:false,
          hasScanned: false,
          loadingMsg: '',
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

      this.setState({loading:true});
      this.setState({loadingMsg:'Loading...'});

      
      var ocrAPIKEY=Platform.OS === 'ios' ? ocrIOSKEY : ocrAndroidKEY;

      // console.log(ocrGoogleAPIURL+" " + ocrAPIKEY+" "+ocrBundleID)
      // console.log(this.props)
      var url = ocrGoogleAPIURL + ocrAPIKEY;

       NetInfo.getConnectionInfo().then((connectionInfo) => {
            // console.log(connectionInfo.type)
            if(connectionInfo.type != "none")
            {


                fetch(url, {  
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Ios-Bundle-Identifier': ocrBundleID
                  },
                  bodyParser : {
                    json: {limit: '50mb', extended: true},
                    urlencoded: {limit: '50mb', extended: true}
                  },
                  body: JSON.stringify({
                            "requests": [{
                                "image": {
                                    "content": this.props.base64
                                },
                                "features": [{
                                    "type": "TEXT_DETECTION"
                                }]
                            }]
                          })
                  
                })
                .then((response) => response.json())     
                .then((responseJson) => {
                  // console.log(responseJson);
                  if(responseJson.responses)
                  {
                    // console.log(responseJson.responses);
                    // console.log(responseJson.responses[0].length);
                    console.log(Object.keys(responseJson.responses[0]).length === 0);
                    if(Object.keys(responseJson.responses[0]).length === 0)
                    {
                       
                      Alert.alert(
                                      'Verity One',
                                      "Image does not contain recognized characters. Please try another one.",
                                      [
                                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                                      ],
                                      { cancelable: true }
                                    );
                      this.setState({loading:false});
                      this.setState({loadingMsg:''});
                        
                    }
                    else
                    {

                      console.log("ocr result "+responseJson.responses[0].fullTextAnnotation.text);
                        // console.log(responseJson.responses.fullTextAnnotation.text)
                        var searchString = responseJson.responses[0].fullTextAnnotation.text;
                        console.log("...........search string ");
                        console.log(searchString.replace(/\s/g,''))

                        console.log("-------------------------")

                        if(/^\d+$/.test(searchString.replace(/\s/g,'')))
                        {
                          console.log("number.............")
                          this.setState({'ocrText':searchString.replace(/\s/g,'')})
                        }
                        else
                        {
                          console.log("string.............")
                          this.setState({'ocrText':searchString.trim()})
                        }
                        
                        this._getSearchData();
                      
                    }
                  }
                  else
                  {
                    // console.log(responseJson.error)
                    Alert.alert(
                                    'Verity One',
                                    responseJson.error.message,
                                    [
                                      // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                      // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    { cancelable: true }
                                  );
                    this.setState({loading:false});
                    this.setState({loadingMsg:''});
                  }
                  
                })
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
    async componentDidMount() {
      NetInfo.getConnectionInfo().then((connectionInfo) => {
        // console.log(connectionInfo.type)
      this.setState({'netStatus':connectionInfo.type})
      });
            
      NetInfo.addEventListener('connectionChange',this.handleConnectivityChange);

    }

    handleConnectivityChange = (connectionInfo) => {
           
           console.log("change event.....");
           this.setState({'netStatus':connectionInfo.type})
    }
    

  _getSearchData = async () => {
        
      if(this.state.netStatus != "none")
      {  
                  await fetch(apiUrl+'search', {  
                            method: 'POST',
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              searchword:this.state.ocrText,
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
                                // var handleClick = this.updateBarcodeState.bind(this);
                                if(responseJson.total > 0)
                                {
                                  // this.setState({isDataAvailable:false});
                                  Actions.SearchProduct({'scanFlag':'Yes',searchKey:this.state.ocrText});
                                  // Actions.AddProduct({searchKey:this.state.barcode,'handleClick':handleClick});
                                  this.setState({loading:false});
                                  this.setState({loadingMsg:''});
                                }
                                else
                                {
                                  Actions.AddProduct({searchKey:this.state.ocrText});
                                  this.setState({loading:false});
                                  this.setState({loadingMsg:''});
                                }

                              } 
                              else
                              {
                                this.setState({loading:false});
                                this.setState({loadingMsg:''});
                                
                              } 
                          

                          
                        })
                        .catch((error) => {
                          console.error(error);
                          this.setState({loading:false});
                          this.setState({loadingMsg:''});
                        }); 
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
  render() {
      

    
      return (
        <View style={styles.mainContainer}>
      
            <View style={styles.headerStyle}>

                    
              <TouchableOpacity onPress={() => this.goBack()}><Image 
                            source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                            style={styles.ImageIconStyle} 
                            /></TouchableOpacity>
              
              <View style={{ width:width-90,alignItems:'center',justifyContent:'center'}}>
                <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20,color:'#4ac0f7',fontFamily: 'sansserifBold'}}>OCR Scan</Text>
              </View> 
               
            </View> 
            <View style={[styles.row,styles.headerStyle]}>
              
              <Image style={{width:150,height:130}} source = {{uri: this.props.uri}} />
              
            </View>
            
            <View style={[styles.activityIndicatorWrapper]}>
                      <ActivityIndicator size="large" color="#0000ff" style = {{ opacity :1}} animating={this.state.loading} />
                      <Text>{this.state.loadingMsg}</Text>
            </View>

            <View style={styles.row}>
            
            </View>
            <View style={styles.row}>
            
            </View>
        </View>
      );
    
  }




}

