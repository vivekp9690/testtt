import React, { Component } from 'react';
import I18n from 'react-native-i18n';
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
  Image ,
  Button,
  FlatList,
  ActivityIndicator,
  Platform,
  Keyboard,
  NativeModules,
  Picker,
  ScrollView,
  NetInfo
} from 'react-native';

import { Rating } from 'react-native-elements';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating';

import { Actions } from 'react-native-router-flux';   
  
import {apiUrl,netErrorMsg} from "../config/constant";



var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

var userId="";
export default class AdvanceSearch extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          searchKey: '',
          company : '',
          lotcode : '',
          UPC : '',
          description : '',
          products:[],
          loading:false,
          offset:0,
          isDataAvailable:true,
          starCount: 0,
          emptyMessage:"",
          PickerSelectedVal :"",
          isLoading: true, 
          PickerCategory : "",
          PickerType : "",
          PickerCompliant : "",
          PickerCall : "",
          
       }
    }

     componentDidMount() {
   
      return fetch('http://a.verity.bz/index.php/en/?option=com_jewebservices&task=getcatlistdetail')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            dataSource: responseJson
          }, function() {
            // In this block you can do something with new state.
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
    // GetPickerSelectedItemValue=()=>{
    //   Alert.alert("Selected country is : " +this.state.PickerValueHolder);
    // }

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
    // onStarRatingPress(rating) {
    //   this.setState({
    //     starCount: rating
    //   });
    // }

    searchKeyChange = (text) => {
     this.setState({searchKey:text});
     this.setState({offset:0});
     this.setState({products:[]});
     this.setState({isDataAvailable:true});
    }


    companyChange = (text) => {
     this.setState({company:text});
     this.setState({offset:0});
     this.setState({products:[]});
     this.setState({isDataAvailable:true});
    }


    lotcodeChange = (text) => {
     this.setState({lotcode:text});
     this.setState({offset:0});
     this.setState({products:[]});
     this.setState({isDataAvailable:true});
    }


    upcChange = (text) => {
     this.setState({upc:text});
     this.setState({offset:0});
     this.setState({products:[]});
     this.setState({isDataAvailable:true});
    }


    descChange = (text) => {
     this.setState({description:text});
     this.setState({offset:0});
     this.setState({products:[]});
     this.setState({isDataAvailable:true});
    }


    onSearchbtnClick()
    {     
      NetInfo.getConnectionInfo().then((connectionInfo) => {
            // console.log(connectionInfo.type)
        if(connectionInfo.type != "none")
        {
            let errcnt=0;
            Keyboard.dismiss();
            if(!this.state.loading)
            {
              // console.log(this.state.searchKey);
              // console.log(this.state.company);
              // console.log(this.state.lotcode);
              // console.log(this.state.upc);
              // console.log(this.state.description);
              // console.log(this.state.PickerCategory);
              // console.log(this.state.PickerType);
              // console.log(this.state.PickerCompliant);
              // console.log(this.state.PickerCall);
                
           if((this.state.searchKey != "" ) && (this.state.company != "") &&  (this.state.lotcode != "") && (this.state.upc != "undefined")  && (this.state.upc != "")  && (this.state.description != "")  && (this.state.PickerCategory != "")  && (this.state.PickerType != "")  && (this.state.PickerCompliant != "")  && (this.state.PickerCall != ""))
                {
                    Alert.alert(
                            'Verity One',
                            'Please enter product name to search.',
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
                  this.fetchData();
                }

            }  
        }
        else
        {
          // console.log("search component mount ....."+connectionInfo.type)
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



    // handleLoadMore = () => {
    //   console.log(this.state.offset);
    //     this.setState({
    //       offset: this.state.offset + 10
    //     }, () => {
    //       console.log(offset);
    //       this.fetchData();
    //     });
    // };

     handleLoadMore = () => {
       console.log("offset");
        this.setState({
          offset: this.state.offset + 10
        }, () => {
            NetInfo.getConnectionInfo().then((connectionInfo) => {
                  // console.log(connectionInfo.type)
              if(connectionInfo.type != "none")
              {
                    this.fetchData();
              }
              else
              {
                // console.log("search handle more connection....."+connectionInfo.type)
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
        });
    };


    async fetchData()
    {                      
                      
          if(this.state.isDataAvailable)
          {
            this.setState({loading:true});

           
              await fetch(apiUrl+'advsearch', {  
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        searchword:this.state.searchKey,
                        company:this.state.company,
                        lotcode:this.state.lotcode,
                        UPC:this.state.upc,
                        // upcdata:this.state.PickerCategory,
                        description:this.state.description,
                        categoryval:this.state.PickerCategory,
                        typeval:this.state.PickerType,
                        compliantval:this.state.PickerCompliant,
                        callval:this.state.PickerCall,                        
                        userId:userId,
                        offset:this.state.offset,
                        isUpdated:"1"

                      })
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        // alert(responseJson.result[0].upcdata);
                        // console.log(responseJson.result);
                        // alert(response); return false;
                        this.setState({loading:false});
                        if(responseJson.success == 1)
                        {
                          if(responseJson.result.length <= 0)
                          {
                            this.setState({isDataAvailable:false});
                          }
                          console.log(responseJson.result);
                          
                             this.setState({
                                products: [...this.state.products, ...responseJson.result]
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
                              { cancelable: false }
                            )
                        }
                    

                    
                  })
                  .catch((error) => {
                    console.error(error);
                    this.setState({loading:false});
                  });  
            }
            else
            {
              this.setState({loading:false});
            } 

            if(this.state.products.length == 0)
            {
              this.setState({emptyMessage:" No results found. "});
            }      
            else
            {
              this.setState({emptyMessage:""});
            } 
    }
     onItemClick = async (item, index) => {

      // console.log("index---------"+index)
      let review=[];
      // console.log(item.review);

      if(Array.isArray(item.review))
      {
        if(item.totalReviews != "0")
        {
          review=item.review;
        }
      }
      else
      {
        if(item.totalReviews != "0")
        {
          review.push(item.review);
        }
      }
      
      let itemData={
        "totalReviews":item.totalReviews,
        "review":review,
        "avgRating": item.avgRating,
        "isRate": item.isRate,
        "isReview": item.isReview,
        "rateUserCount":item.rateUserCount,
        "productIndex":index

      }
      await AsyncStorage.setItem('itemDetail',JSON.stringify(itemData), () => {});

      var refreshproductClick = this.refreshStateProduct.bind(this);
      var updateRatingClick = this.updateRating.bind(this);

      Actions.ProductDetail({'itemDetail':item,'refreshproductClick':refreshproductClick,'updateRatingClick':updateRatingClick});
    }
    updateRating= (item,itemObj) => {
        let products = this.state.products;

          // console.log(itemObj);
          let targetProduct = products[itemObj.productIndex];
          // console.log(targetProduct);
          // Flip the 'liked' property of the targetPost
          targetProduct.rateUserCount = itemObj.rateUserCount;
          targetProduct.avgRating = itemObj.avgRating;
          targetProduct.isRate = "1";

          products[itemObj.productIndex]=targetProduct;
          // console.log(targetProduct);
          this.setState({ products });

          // console.log("**************");
    }
    refreshStateProduct = (item,index) => {
       AsyncStorage.getItem('itemDetail', (errs, result) => {

        result=JSON.parse(result);
        // console.log("**********")
        //   console.log(result);
        

          let products = this.state.products;

          // console.log(products);
          let targetProduct = products[index];
          // console.log(targetProduct);
          // Flip the 'liked' property of the targetPost
          targetProduct.totalReviews = result.totalReviews;
          targetProduct.avgRating = result.avgRating;
          targetProduct.isRate = result.isRate;
          targetProduct.isReview = result.isReview;
          targetProduct.rateUserCount = result.rateUserCount;
          targetProduct.review = result.review;


          // console.log("--------------");
          products[index]=targetProduct;
          // console.log(targetProduct);
          this.setState({ products });

          // console.log("**************");
      }); 
   }

   renderItem(data) {

    let { item, index } = data;
    return (
      <View style={styles.flatview}>
              <TouchableOpacity activeOpacity={1} onPress = {() => this.onItemClick(item, index)}>
                <View style={styles.upcCodeView}>
                  <Text style={styles.codeLabel}>UPC : </Text>
                  <Text style={styles.codeValue}>{item.upcCode}</Text>
                  <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={10}
                  starStyle={{paddingRight:2,paddingTop:5,paddingLeft:5}}  
                  emptyStartColor={"#d1d3d1"}
                  rating={Number(item.avgRating)}
                  fullStarColor='#e5bf02'
                    
                  />
                </View>
                <View style={styles.innerView}>
                    <View style={{flexDirection:'column',width:Platform.OS === 'ios' ? 'auto' : '25%'}}>
                      <Image style={styles.image} resizeMode='cover' source={{uri: item.thumbImage}} />
                    </View>
                    <View style={{flexDirection:'column',width:Platform.OS === 'ios' ? 'auto' : '75%'}}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={styles.productName}>{item.productName.substr(0,60)}{item.productName.length > 60 ? <Text>...</Text>: null }</Text>
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <Text style={styles.categoryLabel}>Category : </Text>
                        <Text style={styles.categoryValue}>{item.category}</Text>
                      </View>
                    </View>
                </View>
              </TouchableOpacity>
            </View>
    ) 
  }
  
  render(){

      if (this.state.isLoading) {
     return (
       <View style={{flex: 1, paddingTop: 20}}>
         <ActivityIndicator />
       </View>
     );
   }

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

        <ScrollView contentContainerStyle={{width: width}}>

        <View style={styles.mainthree}>
          <View style={styles.row1}>
              <View style={[styles.box, styles.box2]}>
                    <TextInput style={styles.inputBox} 
                      placeholder={I18n.t('Product Name')}
                      placeholderTextColor = "#878787"
                      value={this.state.searchKey}
                      selectionColor="#000"
                      autoFocus = {true}
                      underlineColorAndroid="transparent"
                      ref={(input) => {
                        this.searchKey = input
                      }}
                      clearButtonMode= "while-editing"
                      onChangeText = {this.searchKeyChange}/>
              </View>            
          </View> 

          <View style={styles.row1}>
              <View style={[styles.box, styles.box2]}>
                    <TextInput style={styles.inputBox} 
                      placeholder={I18n.t('Company')}
                      placeholderTextColor = "#878787"
                      value={this.state.company}
                      selectionColor="#000"
                      autoFocus = {true}
                      underlineColorAndroid="transparent"
                      ref={(input) => {
                        this.company = input
                      }}
                      clearButtonMode= "while-editing"
                      onChangeText = {this.companyChange}/>
              </View>            
          </View>

          <View style={styles.row1}>
            <View style={[styles.box, styles.box2]}>
                  <TextInput style={styles.inputBox} 
                    placeholder={I18n.t('Lot Code')}
                    placeholderTextColor = "#878787"
                    value={this.state.lotcode}
                    selectionColor="#000"
                    autoFocus = {true}
                    underlineColorAndroid="transparent"
                    ref={(input) => {
                      this.lotcode = input
                    }}
                    clearButtonMode= "while-editing"
                    onChangeText = {this.lotcodeChange}/>
            </View>  
          </View>

          <View style={styles.row1}>
            <View style={[styles.box, styles.box2]}>
                  <TextInput style={styles.inputBox} 
                    placeholder={I18n.t('UPC')}
                    placeholderTextColor = "#878787"
                    value={this.state.upc}
                    selectionColor="#000"
                    autoFocus = {true}
                    underlineColorAndroid="transparent"
                    ref={(input) => {
                      this.upc = input
                    }}
                    clearButtonMode= "while-editing"
                    onChangeText = {this.upcChange}/>
            </View>  
          </View>

          <View style={styles.row1}>
            <View style={[styles.box, styles.box2]}>
                  <TextInput style={styles.inputBox} 
                    placeholder={I18n.t('Description')}
                    placeholderTextColor = "#878787"
                    value={this.state.description}
                    selectionColor="#000"
                    autoFocus = {true}
                    underlineColorAndroid="transparent"
                    ref={(input) => {
                      this.description = input
                    }}
                    clearButtonMode= "while-editing"
                    onChangeText = {this.descChange}/>
            </View>  
          </View>
        </View>

        <View style={[styles.Dropdownmain]}>
          <View style={[styles.Dropdown, styles.box]}>
            <Text>{I18n.t('Select Category')}</Text>
            <Picker selectedValue={this.state.PickerCategory}

              onValueChange={(itemValue, itemIndex) => this.setState({PickerCategory: itemValue})} >
              { this.state.dataSource.map((item, key)=>(
              <Picker.Item label={item.text} value={item.text} key={key} />)
              )}    
            </Picker>
          </View>


          <View style={[styles.Dropdown, styles.box]}>
              <Text>{I18n.t('Select Type')}</Text>
              <Picker
                 selectedValue={this.state.PickerType}
                 onValueChange={(itemValue, itemIndex) => this.setState({PickerType: itemValue})} >
                  <Picker.Item label={I18n.t('--category--')} value="" />
                 <Picker.Item label="VEGAN" value="VEGAN" />
                 <Picker.Item label="NON-GMO" value="NON-GMO" />
                 <Picker.Item label="HALAL" value="HALAL" />
                 <Picker.Item label="KOSHER" value="KOSHER" />
             </Picker>        
          </View>

          <View style={[styles.Dropdown, styles.box]}>
            <Text>{I18n.t('Compliant')}</Text>
            <Picker style={styles.pickercls} 
               selectedValue={this.state.PickerCompliant}
               onValueChange={(itemValue, itemIndex) => this.setState({PickerCompliant: itemValue})} >
               <Picker.Item label={I18n.t('--compliant--')} value="" />
               <Picker.Item label="NO" value="NO" />
               <Picker.Item label="YES" value="YES" />
               <Picker.Item label="NOT VERIFIED" value="NOT VERIFIED" />
               <Picker.Item label="PENDING" value="PENDING" />
            </Picker>        
          </View> 

          <View style={[styles.Dropdown, styles.box]}>
            <Text>{I18n.t('Show Latest Recalls')}</Text>
              <Picker
                 selectedValue={this.state.PickerCall}
                 onValueChange={(itemValue, itemIndex) => this.setState({PickerCall: itemValue})} >
                 <Picker.Item label={I18n.t('--Recalls--')} value="" />
                 <Picker.Item label="YES" value="YES" />
                 <Picker.Item label="NO" value="NO" />
              </Picker>   
          </View>
        </View>  

        <View style={styles.srhcls}>
          <View style={[styles.Dropdown, styles.srhcls, styles.box2]}>
                <TouchableOpacity activeOpacity={1} style={[styles.button]} onPress = {
                          () => this.onSearchbtnClick()} >                   
                        <Text style={styles.buttonText}>{I18n.t('Search')}</Text>              
                </TouchableOpacity>
          </View>
        </View>

       

        <View style={[styles.row,styles.flatcontainer]}>
         <FlatList
          data={this.state.products}
          extraData={this.state.products}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => item.productId}
          onEndReached={this.handleLoadMore}
          onEndThreshold={0}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          refreshing={false}
          ListFooterComponent={() => <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />}
          ListEmptyComponent={<View style={styles.MainContainer}>
 
              <Text style={{textAlign: 'center'}}>{this.state.emptyMessage}</Text>
       
            </View>}
        />  
        </View>


        </ScrollView>   
      
      </View> 

      )
  }
}


const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    margin: 3,
    borderRadius: 2,
  },
  
  flatview: {
    justifyContent: 'center',
    // paddingTop: 30,
    borderRadius: 2,
    flexGrow:3,
    backgroundColor:'#d3ecff',
    margin: 5,
    padding: 5,
  
    borderColor: '#9f9f9f',
    borderBottomWidth: 0,    

  },

  
  upcCodeView:
  {
    borderBottomWidth: 1,
    borderColor:'#a0a0a0',
    flexDirection: "row"
    
   ,
    // justifyContent: 'space-between',
    
  },
  innerView:
  {
    
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent: 'space-between',
    
  },
  
  codeLabel: {
    color:'#08914d',
    fontWeight:'bold',
    fontSize:18
  },
  codeValue: {
    fontSize:18,
    color:'#2278bf'
    // alignSelf: 'flex-start',
  },
  categoryLabel: {
    color:'#878787',
    fontSize:18
  },
  categoryValue: {
    fontSize: 14,
   
    color:'#08914d',
    flexWrap: 'wrap',
    width:'60%'
    // alignSelf: 'flex-start',
  },
  productName:{
    color:'#257fca',
    fontWeight:'bold',
    fontSize:18,
    flexWrap: 'wrap',
    marginRight:4,
    width:'93%'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    width:width,
    paddingHorizontal:10,
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
    height:150
  },
  imageBox: {
    flex: 1,
    height: 100,
    backgroundColor: '#333'
  },  

  mainContainer : {
    backgroundColor:'#ffffff',
    height:height,
    alignItems:'center',
    justifyContent :'center'
  },
  
  inputBox: {
    flexGrow: 0.1,
    width:'100%',
    backgroundColor:'#ffffff',
    borderWidth:0.6,
    borderRadius:5,
    fontSize:16,
    color:'#000000',
    alignSelf:'flex-start',
    paddingHorizontal:10,
  },
  button: {
    width:100,
    height:33,
    borderRadius: 5,
    borderWidth:0.6,
    // marginVertical: 2,
    // paddingVertical: 2,
    // top:0
  },
  buttonText: {
    fontSize:18,
    textAlign:'center',
    marginVertical: 2,
    paddingVertical: 2,
  },
  Dropdown: {
    width: '100%',
    display: 'flex',
    
  },
  mainthree:{

  },

  row1:{

width: '100%',
height:60,
  },
Dropdownmain: {
paddingLeft: 15,
paddingRight: 15,
width: '100%',
  },
srhcls: {
  flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop: 10,
},
dropdowncls: {
    borderWidth:0.6,
    borderRadius:5,
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
  
});
