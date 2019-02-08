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

import { Actions } from 'react-native-router-flux';

import {apiUrl,netErrorMsg} from "../config/constant";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";
export default class AddClaim extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          message:'',
          loading:false,
          netStatus:"none"
          

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
   
    messageChange = (text) => {
     this.setState({
      message:text
     });
    }

    onSubmitClaim = () => {
    
    let errcnt=0;
    
    
    if(!this.state.loading)
    {
        
          
      if(this.state.netStatus != "none")
      {  
          if(this.state.message == "")
          {
              Alert.alert(
                      'Verity One',
                      'Please enter message.',
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

              console.log(JSON.stringify({
                      
                      userId:userId,
                      reasonId:this.state.reasonId,
                      reviewText:this.state.message,
                      productId:this.props.itemDetail.productId


                    }));
                this.setState({loading:true});
            // Actions.confirmation(); 
                fetch(apiUrl+'sendClaim', {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      
                      userId:userId,  
                      message:this.state.message,
                      productId:this.props.itemDetail.productId


                    })
                   
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
  
  render(){

    return(
      
      <View style={styles.mainContainer}>
      
            <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:25,paddingLeft:10 }}>

                    
              <TouchableOpacity onPress={this.goBack}><Image 
                          source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                          style={styles.ImageIconStyle} 
                          /></TouchableOpacity>

            </View>
            <View style={styles.row,styles.imageBox, styles.logo}>
                    <Image style={{width:152,height:65}} source = {{uri: 'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711036_homeLogo@2x.png'}} />
            </View> 
            <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps="always"
            scrollEnabled={Platform.OS === 'ios' ? false:true}
            behavior="padding"
            enableOnAndroid={true}
            innerRef={ref => {this.scroll = ref}}
            >
                <Text style={[styles.labelText]}>Claim listing {this.props.itemDetail.productName}</Text>

                

                <Text style={[styles.fieldLabelText]}>Message</Text>  
                <TextInput style={[styles.inputBox,styles.textArea]} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    
                    selectionColor="#000"
                    ref={(input) => {
                      this.reviewDesc = input
                    }}
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={this.messageChange}
                    /> 
                        
                
                
                  <View style={styles.row}>
                     <TouchableOpacity style={[styles.row,styles.btnSend]} onPress = {
                            () => this.onSubmitClaim()} >
                       <Text style={styles.buttonText}>Send</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={[styles.row,styles.btnCancel]} onPress = {
                            () => Actions.pop()} >
                       <Text style={styles.buttonText}>Cancel</Text>
                     </TouchableOpacity> 
                  </View>
                  {(this.state.loading && 
                    <View style={[styles.loading]}>
                        <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
                    </View>
                  )}  
                  
                  
                  
                  
            </KeyboardAwareScrollView>

            
            <View style={{flex:1,flexDirection: 'row',}}>
          
            </View>

            <View style={{flex:1,flexDirection: 'row',}}>
          
          </View>
             
      </View> 
    
      )
  }
}

const styles = StyleSheet.create({
  textAreaContainer: {
    borderColor: 'blue',
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start",
    textAlignVertical: "top"
  },
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
    //  padding: 10,
    //  margin: 5,
     marginTop: 5,
     paddingTop: 10,
     height: 40,
     width: 40,
     borderRadius:5,
     resizeMode : 'stretch',
   
  },
  mainContainer : {
    backgroundColor:'#ffffff',
    height:height,
    alignItems:'center',
    justifyContent :'center',
    paddingHorizontal:2
  },
  container : {
    justifyContent:'flex-start',
    alignItems: 'flex-start',
    backgroundColor:'#ffffff',
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
  btnSend: {
    
    backgroundColor:'#4ac0f7',
    width:80,
    borderRadius: 5,
    margin: 10,
    padding:5,
    height:40,
  },
  btnCancel:{
    backgroundColor:'#d9dbd9',
    width:80,
    borderRadius: 5,
    margin: 10,
    padding:5,
    height:40,
  },
  buttonText: {
    fontSize:20,
    fontFamily: 'sansserif',
    fontWeight:'300',
    color:'#ffffff',
    textAlign:'center',
    height:40, 
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
