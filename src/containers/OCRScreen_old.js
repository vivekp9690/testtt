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
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
// import RNCamera from 'react-native-camera';
// import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Camera,BarCodeScanner, Permissions } from 'expo';

import { Actions } from 'react-native-router-flux';
import styles from "../styles/OCRScreenStyle";
import {apiUrl} from "../config/constant";

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
          barcode:'',
          loading:false
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
      
    }

    

  _handleBarCodeRead = async ({ type, data }) => {
        if(!this.state.loading)
        {

          console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
          
          if (this.state.barcode == data){ return; }
          
          await this.setState({barcode: data});

          console.log(this.state.barcode+" == "+data)
            if(this.state.barcode != "")
            {
                this.setState({loading:true});

                  console.log({
                              searchword:this.state.barcode,
                              userId:userId,
                              offset:"0",
                              isUpdated:"1"

                            })

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
              
            } 

    } 
    
  
  
  render() {
      const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.mainContainer}>
      
            <View style={styles.headerStyle}>

                    
              <TouchableOpacity onPress={() => this.goBack()}><Image 
                            source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                            style={styles.ImageIconStyle} 
                            /></TouchableOpacity>
              
              <View style={{ width:width-50,alignItems:'center'}}>
                <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20,color:'#4ac0f7'}}>OCR Scan</Text>
              </View> 
               
            </View> 
            <View style={[styles.row,styles.headerStyle]}>
              
              <Image style={{width:150,height:130}} source = {{uri: this.props.image}} />
              
            </View>

            <View style={[styles.activityIndicatorWrapper]}>
                      <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
            </View>

        </View>
      );
    }
  }




}

