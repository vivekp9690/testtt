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
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import { Actions } from 'react-native-router-flux';
import { ImagePicker,Camera, Permissions } from 'expo';


import styles from "../styles/AddProductStyle";
import {apiUrl} from "../config/constant";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";
export default class AddProduct extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          UPCcode: '',
          productTitle:'',
          loading:false,
          imageCount:'',
          image:'',
          hasCameraPermission: null,
          hasRollPermission:null
          

       }
    }
    
   async componentWillMount() {
      
     // console.log(this.props);
     
     await AsyncStorage.getItem('userId',
      (err,value) => {
        if(value != "")
        {
          userId=value;
        }
        
      });
      
      if(this.props.searchKey != "")
      {
        this.setState({UPCcode:this.props.searchKey});
        
      }

      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({hasCameraPermission: status === 'granted'});

      const { status_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({hasRollPermission: status_roll === 'granted'});
      
  }
  
   
    UPCcodeChange = (text) => {
     this.setState({UPCcode:text});
    }

    productTitleChange = (text) => {
     this.setState({productTitle:text});
    }

    onSubmitProduct = () => {
    
    let errcnt=0;
    
    
    if(!this.state.loading)
    {
        
                  
        if(this.state.UPCcode == "")
        {
            Alert.alert(
                    'Verity One',
                    'Please enter UPC code.',
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

        if(this.state.productTitle == "")
        {
            Alert.alert(
                    'Verity One',
                    'Please enter product title.',
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
            let localUri = this.state.image;
            let filename = localUri.split('/').pop();

            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            let formData = new FormData();
            formData.append('photo', { uri: localUri, name: filename, type });
            console.log(JSON.stringify({
                    
                    userId:userId,
                    UPCcode:this.state.UPCcode,
                    productName:this.state.productTitle,
                    imageCount:1,
                    formData:formData

                  }));
              this.setState({loading:true});
          // Actions.confirmation(); 
              fetch(apiUrl+'addNewProduct', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                  },
                  body: JSON.stringify({
                    
                    userId:userId,
                    UPCcode:this.state.UPCcode,
                    productName:this.state.productTitle,
                    imageCount:1,
                    

                  }),formData:formData
                 
                })
                .then((response) => response.json())
                .then((responseJson) => {
                 
                // Showing response message coming from server after inserting records.
                  console.log(responseJson);
                  this.setState({loading:false});
                  
                  if(responseJson.success == 1)
                  {
                    
                    Alert.alert(
                      'Verity One',
                      responseJson.message,
                      [
                        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => Actions.pop()},
                      ],
                      { cancelable: true }
                    )
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
    
  }

  goBack = () => {

      if(this.props.searchKey != "")
      {
        this.props.handleClick();
      }
      Actions.pop();

    } 

  _pickImage = async () => {
    console.log("hello");
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      console.log(result);

      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
  };  

  
  render(){
    
    return(
      
      <View style={styles.mainContainer}>
      
            <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:25,paddingLeft:10 }}>

                    
              <TouchableOpacity onPress={() => this.goBack()}><Image 
                          source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}}
                          style={styles.ImageIconStyle} 
                          /></TouchableOpacity>
              <View style={{ width:width-50,alignItems:'center'}}>
                <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20}}>Add Product</Text>
              </View>            
            </View>
             
            <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            >
                
                <TextInput style={[styles.inputBox]} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="UPC code"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    ref={(input) => {
                      this.reviewTitle = input
                    }}
                    editable={false} selectTextOnFocus={false}
                    value={this.state.UPCcode}
                    onChangeText = {this.UPCcodeChange}/>

                <TextInput style={[styles.inputBox]} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Product title"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    ref={(input) => {
                      this.reviewTitle = input
                    }}
                    onChangeText = {this.productTitleChange}/>    
                        
                  <View style={styles.row}>

                    
                    <TouchableOpacity style={styles.row} activeOpacity={1} onPress = {
                      () => this._pickImage()}>
                      <View style={[styles.box]}>
                          <Image 
                          source={require('../images/add_plus-512.png')} 
                          style={styles.fileUploadIcon} 
                          />
                      </View>
                    </TouchableOpacity> 

                    {(this.state.image!="" &&
                        <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />
                        )}     
                  </View>
                
                  
                  <View style={[styles.activityIndicatorWrapper]}>
                      <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
                  </View>  
                  
                  
                  
            </KeyboardAvoidingView>
            <View style={styles.row}>
               <TouchableOpacity style={[styles.row,styles.btnSend]} onPress = {
                      () => this.onSubmitProduct()} >
                 <Text style={styles.buttonText}>Submit</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.row,styles.btnCancel]} onPress = {
                      () => { this.props.handleClick(); Actions.pop();  }} >
                 <Text style={styles.buttonText}>Cancel</Text>
               </TouchableOpacity> 
            </View>
            
            
      </View> 
    
      )
  }
}


