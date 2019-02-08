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
  WebView ,
  Platform, 
  ScrollView
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import { Actions } from 'react-native-router-flux';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

var userId="";
export default class WebViewScreen extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          ERCAddress: '',
          VRTYBalance:'',
          VRTYUSDValue:'',
          ERCAddressFieldId: '',
          VRTYBalanceFieldId:'',
          VRTYUSDValueFieldId:'',
          loading:false

       }

       
    }
    goBack() {
      Actions.pop();
    }
    
   async componentWillMount() {
      
     this.setState({loading:true}); 

     await AsyncStorage.getItem('userId',
      (err,value) => {
        if(value != "")
        {
          userId=value;
        }
        
      });
      
      
      
  }

  componentDidMount()
  {

    setTimeout(() => {

      this.setState({loading:false})
    }, 8000)   
  }
  
  displayPageTitle() {
         if (this.props.pageName) {

            if (this.props.pageDesc) {
                return <Text style={styles.labelText}>{this.props.pageName} Detail</Text>;
            }
            else
            {
             return <Text style={styles.labelText}>{this.props.pageName}</Text>;
            }
         } else {
             return <Text style={styles.labelText}></Text>;
         }
  }

  displayPageDesc() {
         if (this.props.pageDesc) {
             return <Text style={styles.labelDesc}>{this.props.pageDesc}</Text>;
         } else {
             return <Text style={styles.labelDesc}></Text>;
         }
  }
    
  render(){

    return(
      
      <View style={styles.mainContainer}>
      
        <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:30,paddingLeft:10 }}>

                
          <TouchableOpacity onPress={this.goBack}><Image 
                      source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                      style={styles.ImageIconStyle} 
                      /></TouchableOpacity>
          <View style={{ width:width-90,alignItems:'center',justifyContent:'center'}}>
            <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20,fontFamily: 'sansserifBold'}}>{this.displayPageTitle()}</Text>
          </View>            
        </View>
        {(this.props.pageDesc && 
          <View style={styles.container}>
              {this.displayPageDesc()}
          </View>
        )}
          
            
               <WebView 
                  onLoad={() => this.setState({loading:false})}
                  source={{uri: this.props.pageLink}}
                  style={[styles.row,styles.subcontainer]}
                />
            {(this.state.loading && 
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
                  </View>
                )}
            
          
          
      </View> 
    
      )
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    width:width,
    paddingHorizontal:10
  },
  subcontainer:{
    // height:height,
    flex:20,

  },
  flatview: {
    justifyContent: 'center',
    // paddingTop: 30,
    borderRadius: 2,
    flexGrow:3,
    backgroundColor:'#ffffff',
    margin: 5,
    padding: 10,
    paddingRight:10,
    borderRadius: 2,
    borderColor: '#9f9f9f',
    borderBottomWidth: 0,
    shadowColor: '#666',
    shadowRadius: 3,
    elevation: 1,
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.8

  },
  codeLabel: {
    color:'#426bb1',
    fontSize:20,
    fontFamily: 'sansserif'
  },
  container : {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#ffffff',
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
    height:Platform.OS === 'ios' ? height : height,
    alignItems:'center',
    justifyContent :'center'
  },
  labelText : {
    marginVertical: 15,
    fontWeight:'bold',
    fontSize:20,
    fontFamily:'sansserifBold',
    color:'#4ac0f7'
  },
  labelDesc : {
    marginVertical: 15,
    fontSize:15,
    fontFamily: 'sansserif',
    color:'#000'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
