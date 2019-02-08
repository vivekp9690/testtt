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
  FlatList,
  ActivityIndicator,
  Platform,
  NetInfo,
  ScrollView
} from 'react-native';

import * as rssParser from 'react-native-rss-parser';
import { Constants } from 'expo';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Actions } from 'react-native-router-flux';
import {apiUrl,netErrorMsg} from "../config/constant";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";
export default class ReCallLinkData extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          list:'',
          mainpagetitle:'',
          loading:false
          
        }

        
    }
    
    async componentWillMount() {
     

     
     
     await AsyncStorage.getItem('userId',
      (err,value) => {
        if(value != "")
        {
          userId=value;
        }
     });
     
     var itemName= this.props.itemName;
     var redirectUrl=this.props.redirectUrl;

     NetInfo.getConnectionInfo().then((connectionInfo) => {
            // console.log(connectionInfo.type)
            if(connectionInfo.type != "none")
            {
              this.setState({loading:true}); 
               fetch(redirectUrl, {
                            method: 'POST',
                            headers: {
                              'Accept': 'application/xml',
                              'Content-Type': 'application/xml',
                            },
                            body: JSON.stringify({
                               userId:userId,
                            })
                          })
                          .then((response) => response.text())
                          .then((responseData) => rssParser.parse(responseData))
                          .then((responseJson) => {
                           
                              if(responseJson){
                                  this.setState({loading:false});
                                      let i=0;
                                      let listItems = [];
                                      for (i=0;i < responseJson.items.length;i++) {
                                            let fullPostUrl='';
                                            if (responseJson.items[i].links instanceof Array) {
                                                Object.keys(responseJson.items[i].links).forEach(function(key) {
                                                  fullPostUrl=responseJson.items[i].links[key].url;
                                              });   
                                            } 
                                            listItems.push({ 
                                                title: this.decodeHTMLEntities(responseJson.items[i].title),
                                                link: fullPostUrl,
                                                description:this.decodeHTMLEntities(responseJson.items[i].description),
                                                pubDate: responseJson.items[i].published
                                            });
                                        }
                                  this.setState({'mainpagetitle':responseJson.title,'list':listItems});
                              }else{
                                  Alert.alert(
                                        'Verity One',
                                        "Invalid response from server.",
                                        [
                                          // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                          // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                          {text: 'OK', onPress: () => console.log('OK Pressed')},
                                        ],
                                        { cancelable: true }
                                  )
                              }

                              this.setState({loading:false}); 
                           }).catch((error) => {
                            this.setState({loading:false}); 
                             Alert.alert(
                                    'Verity One',
                                    "Invalid response from server.",
                                    [
                                      // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                      // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    { cancelable: true }
                              )
                          });
            }
            else
            {
              this.setState({loading:false}); 
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
  decodeHTMLEntities(text) {
    var entities = [
        ['amp', '&'],
        ['rsquo', ','],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

    return text;
  }
  goBack() {
    Actions.pop();
  }
  
  openWebView(item,index){
    console.log(item);
    var webpageLink=item.link;

    Actions.WebViewScreen({pageLink : webpageLink,pageName:this.props.itemName,pageDesc: item.title});
  }
  
  renderItem(data) {
    let { item, index } = data;
    return (
      <View style={styles.flatview}>
              <TouchableOpacity activeOpacity={1} onPress = {() => this.openWebView(item, index)}>
                
                <View style={styles.innerView}>
                    <View style={{flexDirection:'column',width:Platform.OS === 'ios' ? 'auto' : '100%'}}>
                      <View style={{flexDirection:'row',paddingBottom:4}}>
                        <Text style={styles.productName}>{item.title.substr(0,60)}{item.title.length > 60 ? <Text>...</Text>: null }</Text>
                      </View>
                      <View style={{flexDirection:'row',paddingBottom:4}}>
                        <Text style={styles.categoryValue}>{item.description}</Text>
                      </View>
                      
                      <View style={{flexDirection:'row',paddingBottom:4}}>
                        <Text style={styles.categoryDate}>{item.pubDate}</Text>
                      </View>
                    </View>
                </View>
                <View style={{borderBottomColor: '#9f9f9f',borderBottomWidth: 1}}/>
              </TouchableOpacity>
            </View>
    ) 
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
            <Text style={{ flexDirection:'row',alignSelf:'center',fontWeight:'bold',fontSize:20,fontFamily: 'sansserifBold',color:'#4ac0f7'}}>{this.props.itemName}</Text>
          </View>            
        </View> 
        
            <View style={[styles.row,styles.flatcontainer]}>
                <FlatList
                    data={this.state.list}
                    extraData={this.state}
                    initialNumToRender={this.state.list.length}
                    showsVerticalScrollIndicator={false}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, index) => index.toString()}
                    onEndThreshold={0}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                    refreshing={false}
                    ListFooterComponent={false}
                />
            </View>

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
  flatcontainer:{
    height:height,
    flex:10,
    marginTop:Platform.OS === 'ios' ? '1%' : '5%',
  },
  flatview: {
    justifyContent: 'center',
    // paddingTop: 30,
    borderRadius: 2,
    flexGrow:3,
    backgroundColor:'#fff',
    margin: 2,
    padding: 5,
    borderRadius: 2,
    borderColor: '#9f9f9f',
    borderBottomWidth: 0,
  },
  categoryLabel: {
    color:'#878787',
    fontSize:18,
    fontFamily: 'sansserif'
  },
  categoryValue: {
    fontSize: 12,
    fontFamily: 'sansserif',
    color:'#000',
    //flexWrap: 'wrap',
    width:'100%'
    // alignSelf: 'flex-start',
  },
  categoryDate: {
    fontSize: 12,
    fontFamily: 'sansserif',
    color:'#4ac0f7',
    //flexWrap: 'wrap',
    width:'100%'
    // alignSelf: 'flex-start',
  },
  productName:{
    color:'#000',
    fontWeight:'bold',
    fontSize:18,
    fontFamily: 'sansserifBold',
    //flexWrap: 'wrap',
    marginRight:4,
    width:'100%'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    width:width,
    paddingHorizontal:10
  },
  logo: {
    backgroundColor: '#ffffff',
    alignItems:'center',
    justifyContent:'center'
  },
  box: {
    
    marginLeft: 0,
    marginRight: 5,
    marginTop: 10,
  },
  box2:
  {
    height:height
  },
  mainContainer : {
    backgroundColor:'#ffffff',
    width: width, 
    height:Platform.OS === 'ios' ? height : height,
    alignItems:'center',
    justifyContent :'center'
  },
  container : {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#ffffff',
  },
  labelText : {
    marginVertical: 15,
    fontWeight:'bold',
    fontSize:20,
    fontFamily: 'sansserifBold',
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
