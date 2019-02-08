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
  FlatList,
  BackHandler,
  NetInfo 
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import { Actions } from 'react-native-router-flux';
import { ImagePicker,Camera, Permissions } from 'expo';

import Icon from 'react-native-vector-icons/FontAwesome';

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';
// import MyPop from 'react-native-popupwindow';
// var ImagePicker = require('react-native-image-picker');

// var options = {
//   title: 'Select Avatar',
//   customButtons: [
//     {name: 'fb', title: 'Choose Photo from Facebook'},
//   ],
//   storageOptions: {
//     skipBackup: true,
//     path: 'images'
//   }
// };



import styles from "../styles/AddProductStyle";
import {apiUrl,netErrorMsg} from "../config/constant";

const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });

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
          image:[],
          hasCameraPermission: null,
          hasRollPermission:null,
          deletedImage:null,
          netStatus:"none"
          

       }
       this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    
   async componentWillMount() {
      
     // console.log(this.state.image);
     BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
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
  async componentDidMount() {
      NetInfo.getConnectionInfo().then((connectionInfo) => {
        // console.log(connectionInfo.type)
      this.setState({'netStatus':connectionInfo.type})
      });
            
      NetInfo.addEventListener('connectionChange',this.handleConnectivityChange);

    }

    handleConnectivityChange = (connectionInfo) => {
           
           this.setState({'netStatus':connectionInfo.type})
    }
  
   
    UPCcodeChange = (text) => {
     this.setState({UPCcode:text});
    }

    productTitleChange = (text) => {
     this.setState({productTitle:text});
    }

    onSubmitProduct = async () => {
    
        let errcnt=0;
        
        
        if(!this.state.loading)
        {
            
            if(this.state.netStatus != "none")
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
                  let fileArray={};

                  let filesData = new FormData();


                  filesData.append('userId', userId);
                  filesData.append('UPCcode', this.state.UPCcode);
                  filesData.append('productName', this.state.productTitle);
                  filesData.append('imageCount', this.state.image.length);
                        
                  await this.state.image.map((item,index) => {
                    let localUri = item.image;
                    let filename = localUri.split('/').pop();

                    let match = /\.(\w+)$/.exec(filename);
                    let type = match ? `image/${match[1]}` : `image`;

                    
                    filesData.append('productImage'+index, { uri: localUri, name: filename, type });

                    
                  }) 
                  console.log("file data................")
                  console.log(filesData)
                  
                      this.setState({loading:true});
                 
                   

                   await fetch(apiUrl+'addNewProduct', {  
                    // await fetch('http://www.idreamtechnosoft.com/apps/reactapi/addproduct.php', {  
                        method: 'POST',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'multipart/form-data'
                        },
                        body: filesData
                        
                      })
                      .then((response) => response.json())
                      .then((responseJson) => {
                          
                          // alert(responseJson.result[0].productName)
                          console.log("response product........")
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
                                {text: 'OK', onPress: () => {Actions.dashboard();} },
                              ],
                              { cancelable: true }
                            )
                           
                          // console.log(this.state.reasonDetails);
                          // console.log(this.state.reasonId);
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

                      
                    })
                    .catch((error) => {
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
        }    
    
  }

  goBack = () => {

      if(this.props.searchKey != "")
      {
        if(this.props.handleClick)
        {
          this.props.handleClick();
        }
        
      }
      Actions.pop();

    }

    componentWillUnmount()
    {
      if(this.props.scanFlag == "Yes")
      {
        if(this.props.handleClick)
        {

          this.props.handleClick();
        }
      }
    }
    handleBackButtonClick() {

      console.log("add product...................")
      this.goBack();
      return true;
    } 

  _pickImageFromGallery = async () => {
    
    this.slideAnimationDialog.dismiss();
    // launchCameraAsync
    // launchImageLibraryAsync
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      // console.log(result);

      if (!result.cancelled) {
        let imageobj={
          "image":result.uri
        }
        this.setState({ image: this.state.image.concat(imageobj) })
        
      }

    
  }; 
  _takeImage= async () => {

    this.slideAnimationDialog.dismiss();
    let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      // console.log(result);

      if (!result.cancelled) {
        let imageobj={
          "image":result.uri
        }
        this.setState({ image: this.state.image.concat(imageobj) })
        
      }
  } 
  renderItem(data) {

    let { item, index } = data;
    
    return (
      <View style={[styles.flatListRow]}>
        <Image style={{width:150,height:130}} source = {{uri: item.image}} />
        <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5 }} activeOpacity={1} onPress= {() => this.onRemoveImage(index)}>
            <Icon name="times-circle" size={20} color="#fff" />
        </TouchableOpacity>

      </View>
    ) 
  }
  onRemoveImage = async (index) => {
      await this.state.image.splice(index, 1);
      
      await this.setState({deletedImage:index})
      
      
  }

  showSlideAnimationDialog = () => {
    // if(this.state.image.length >= 5)
    // {
    //   Alert.alert(
    //                   'Verity One',
    //                   'You exceeds the image selection limit. Please remove one if you want to change image.',
    //                   [
    //                     // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
    //                     // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //                     {text: 'OK', onPress: () => console.log('OK Pressed')},
    //                   ],
    //                   { cancelable: true }
    //                 )
    // }
    // else
    // { 
      this.slideAnimationDialog.show();
    // }
    
  }
  render(){
    
    return(
      
      <View style={styles.mainContainer}>
      
            <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:25,paddingLeft:10 }}>

                    
              <TouchableOpacity onPress={() => this.goBack()}><Image 
                          source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                          style={styles.ImageIconStyle} 
                          /></TouchableOpacity>
              <View style={{ width:width-90,alignItems:'center',justifyContent:'center'}}>
                <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20,fontFamily: 'sansserifBold',color:'#4ac0f7'}}>Add Product</Text>
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
                    selectTextOnFocus={false}
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
                        
                   
                  
                  
                  
            </KeyboardAvoidingView>
            <View style={styles.row}>
              <View style={styles.row}>
                <View style={{flex: 1,
    flexDirection:'column',
    alignItems:'flex-start',
    width:150,
    height:140,}}>
                  <TouchableOpacity  activeOpacity={1} onPress={this.showSlideAnimationDialog}>
                    <View style={[styles.box]}>
                        <Image 
                        source={require('../images/add_plus-512.png')} 
                        style={styles.fileUploadIcon} 
                        />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1,
    flexDirection:'column',
    alignItems:'flex-start',
    width:170,
    height:150,}}>
                
                  <FlatList
                    horizontal={true}
                    data={this.state.image}
                    extraData={this.state}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, index) => index.toString()}
                  />    
                </View> 
              </View>

            </View>
             

              <PopupDialog
                    width={250}
                      height={110}
                    ref={(popupDialog) => {
                      this.slideAnimationDialog = popupDialog;
                    }}
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
                      <TouchableOpacity onPress = {
                                () => this._pickImageFromGallery()} >
                           <Text style={styles.modelText}>Select photo from library</Text>
                         </TouchableOpacity>
                      </View>
                
              </PopupDialog>   
            {(this.state.loading &&       
              <View style={[styles.loading]}>
                  <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
              </View> 
            )}
            <View style={[styles.row,styles.footer]}>
               <TouchableOpacity style={[styles.row,styles.btn]} onPress = {
                      () => this.onSubmitProduct()} >
                 <Text style={styles.buttonText}>Submit</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.row,styles.btn]} onPress = {
                      () => { if(this.props.handleClick){ this.props.handleClick(); } Actions.pop();  }} >
                 <Text style={styles.buttonText}>Cancel</Text>
               </TouchableOpacity> 
            </View>
            
            
      </View> 
    
      )
  }
}


