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
  NetInfo,
  Platform
} from 'react-native';

import { Constants } from 'expo';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Actions } from 'react-native-router-flux';


import {apiUrl,netErrorMsg} from "../config/constant";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";
export default class UserList extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
            list:[],
            loading:false,
            offset:0,
            isDataAvailable:true,
            emptyMessage:""
         
        }
        
    }

    async componentWillMount() {
      
        this.setState({loading:true}); 

        NetInfo.getConnectionInfo().then((connectionInfo) => {
          // console.log(connectionInfo.type)
          if(connectionInfo.type != "none")
          {
            this.fetchData();
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

    // componentDidMount() {
    //   this.setState({'loading':true});
  
    //   Backend.loadUsers((user) => {
        
    //     if(Object.keys(user).length !== 0)
    //     {
          
    //         this.setState({
    //           list: [...this.state.list, ...user]
    //         })
          
    //     }
    //     console.log("........listing")
    //     console.log(this.state.list)
    //     this.setState({'loading':false})
    //   });
  
    // }

    goBack() {
      Actions.pop();
    }

    async fetchData()
    {
      
          
            this.setState({loading:true});
            

            await fetch(apiUrl+'getUsers', {  
                      method: 'GET',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      }
                      
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        // alert(responseJson.result[0].productName)
                        // console.log(responseJson.result);
                        this.setState({loading:false});
                        if(responseJson.success == 1)
                        {
                          this.setState({
                                list: [...this.state.list, ...responseJson.result]
                              })
                           
                          // console.log(this.state.products);
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
            
            

            if(this.state.list.length == 0)
            {
              this.setState({emptyMessage:" No Users found. "});
            }      
            else
            {
              this.setState({emptyMessage:""});
            } 
    }
  openChat = (userId,userName) =>
  {
    AsyncStorage.setItem('isChatOpen', 'Yes');
    Actions.ChatUser({'userName':userName,'userId':userId});
  }
  renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#CED0CE",
          }}
        />
      );
    };

  renderItem(data) {
      let { item, index } = data;
      let imageUrl="https://t.certified.bz/components/com_community/assets/default_user.png";
      if(item.profileImage != "")
      {
        imageUrl=item.profileImage
      }

        
      // if(item.name == "Devyangni Modi")
      // {
        return (
            <View style={styles.flatview}>
                    <TouchableOpacity activeOpacity={1} onPress = {() => this.openChat(item.userId,item.name)}>
                      

                      <View style={styles.innerView}>
                        
                          <View style={{flexDirection:'column',marginRight:3,width:Platform.OS === 'ios' ? 'auto' : 'auto'}}>
                            <Image style={styles.userImage} resizeMode='cover' source={{uri: imageUrl}} />
                            
                            
                          </View>
                          <View style={{flexDirection:'column',width:'70%'}}>
                            <Text style={[styles.itemLabel,styles.nameStyle]}>{item.name}</Text>
                            <Text style={[styles.itemLabel,styles.emailStyle]}>{item.email}</Text>
                          </View>  
                        
                          <View style={styles.itemStyleRight}>
                            <Icon name="angle-right" size={25} color="#CED0CE" />
                            
                          </View>
                      </View>
                      
                    </TouchableOpacity>
                  </View>
        ) 
      // }  
    }  
  render(){

    return(
      
      <View style={styles.mainContainer}>
      
        <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:30,paddingLeft:10 }}>

                
        <TouchableOpacity onPress={this.goBack}><Image 
                      source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                      style={styles.ImageIconStyle} 
                      /></TouchableOpacity>

                      <View style={{ width:width-80,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{ flexDirection:'row',alignSelf:'center',fontSize:20,fontWeight:'bold',color:'#4ac0f7'}}>Users</Text>
                    </View> 

        </View> 
       
            <View style={[styles.row,styles.flatcontainer]}>
               <FlatList
                data={this.state.list}
                extraData={this.state}
                showsVerticalScrollIndicator={false}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={(item, index) => index.toString()}
                onEndThreshold={0}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
                refreshing={false}
                ItemSeparatorComponent={this.renderSeparator}
                ListFooterComponent={() => <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />}
                ListEmptyComponent={<View style={styles.MainContainer}>
      
                    <Text style={{textAlign: 'center'}}>{this.state.emptyMessage}</Text>
            
                  </View>}
              />  
            </View>
            
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
  flatcontainer:{
    height:height,
    flex:10,

  },
  flatview: {
    justifyContent: 'center',
    // paddingTop: 30,
    borderRadius: 2,
    flexGrow:3,
    backgroundColor:'#ffffff',
    margin: 2,
    padding: 5,
    borderRadius: 2,
    borderColor: '#9f9f9f',
    borderBottomWidth: 0,
    // shadowColor: '#666',
    // shadowRadius: 3,
    // elevation: 1,
    // // shadowOffset: { width: 2, height: 3 },
    // // shadowOpacity: 0.9,
    // shadowOffset: { width: 1, height: 3 },
    // shadowOpacity: 0.8

  },
  codeLabel: {
    color:'#045781',
    fontSize:20
  },
  container : {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#ffffff',
      },
  ImageIconStyle: {
     padding: 10,
     margin: 5,
     height: 30,
     width: 30,
     borderRadius:5,
     resizeMode : 'stretch',
   
  },
  mainContainer : {
    backgroundColor:'#ffffff',
    height:height,
    alignItems:'center',
    justifyContent :'center',
     // paddingTop: Constants.statusBarHeight,
  },
  labelText : {
    marginVertical: 15,
    fontWeight:'bold',
    fontFamily:'sansserifBold',
    fontSize:20,
    color:'#4ac0f7'
  },

  itemLabel: {
    
    textAlign: 'left'
  },
  nameStyle:{
    fontSize:20,
    color:'#000',
  },
  emailStyle:{
    fontSize:18,
    color:'#c0c0c0',
  },

  itemValue: {
    color:'#4ac0f7',
    fontSize:20,
    textAlign: 'right'
  },
  itemStyleLeft:{
      justifyContent:'flex-start',justifyContent: 'space-between',width:'90%'  
  },
  itemStyleRight:{
      justifyContent: 'center',width:'10%',alignItems:'flex-end',  
  },
  innerView:
  {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    
    
  },
  userImage: {
    width: 50,
    height: 50,
    margin: 3,
    borderWidth:1,
    borderColor:'#000',
    borderRadius: 50/2
  },
});
