import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AsyncStorage,
  KeyboardAvoidingView,
  Dimensions,
  Image ,
  Button,
  FlatList,
  ActivityIndicator,
  Platform,
  ScrollView,
  Keyboard,
  Share,
  NetInfo,
} from 'react-native';

import Modal from "react-native-modal";
import { Rating } from 'react-native-elements';
import MapView from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StarRating from 'react-native-star-rating';

import { Actions } from 'react-native-router-flux';

import Carousel from 'react-native-snap-carousel';

import {apiUrl,netErrorMsg} from "../config/constant";

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var userId="";
var productIndex="";

export default class ProductDetail extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          totalReviews:"",
          avgRating:"",
          isRate:"",
          isReview:"",
          rateUserCount:"",
          userRate:"",
          netStatus:"none",
          isMapReady: false,
          isModalVisible: false,
          itemDetail:[],
          reviewDetails:[]
  //         reviewDetails:[{
  //    "id": "160",
  //    "productId": "3228",
  //   "profileImage": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=256837934862482&height=50&width=50&ext=1529821029&hash=AeRVpwxzsIwyvd5W",
  //   "reviewDate": "2018-06-20",
  //   "reviewText": "Test",
  //   "reviewTitle": "Test",
  //   "reviewValue": "4.000000",
  //   "userId": "761",
  //   "userName": "idream idream",
  // }],
       }

       
    }

    
    async componentWillMount() {
      
      Keyboard.dismiss();
      console.log(this.props.itemDetail)

      
      
     // await AsyncStorage.getItem('itemDetail', (errs, result) => {

     //  console.log(";;;;;;;;;;;;;;;;")
     //    console.log(result);
     //     this.setState({totalReviews: JSON.parse(result)});
     //  }); 

     await AsyncStorage.getItem('itemDetail', (errs, result) => {

          result=JSON.parse(result);
        // console.log(";;;;;;;;;;;;;;;;   Aysync product detail")
        // console.log(result);
        

         this.setState({totalReviews: result.totalReviews});
         this.setState({avgRating: result.avgRating});
         this.setState({isRate: result.isRate});
         this.setState({isReview: result.isReview});
         this.setState({rateUserCount: result.rateUserCount});

         // this.setState({reviewDetails: result.review});
         this.setState({
                                reviewDetails: result.review
                              }) 

         productIndex=result.productIndex;
         // console.log(this.state.reviewDetails);

         // console.log(this.state.reviewDetails);

         // console.log(";;;;;;;;;;;;;;;;");
      }); 
     
     await AsyncStorage.getItem('userId',
      (err,value) => {
        if(value != "")
        {
          userId=value;
        }
        
      });

     

   }
    goBack() {
      Actions.pop();
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
    onChangeUserRate = (rating) =>
    {
      this.setState({ userRate: rating });
    }

    _toggleModal = () =>
    {
      if(this.state.isReview != "0" || this.state.isRate != "0")
      {
        Alert.alert(
                'Verity One',
                "You have already submitted review.",
                [
                  // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                  // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: true }
              )
        return;
      }
      this.setState({ isModalVisible: !this.state.isModalVisible });
      this.setState({ userRate: "" });
    }

    refreshState = () => {
       AsyncStorage.getItem('itemDetail', (errs, result) => {

        result=JSON.parse(result);
        // console.log(";;;;;;;;;;;;;;;;")
        //   console.log(result);
        

         this.setState({totalReviews: result.totalReviews});
         this.setState({avgRating: result.avgRating});
         this.setState({isRate: result.isRate});
         this.setState({isReview: result.isReview});
         this.setState({rateUserCount: result.rateUserCount});

         // this.setState({reviewDetails: result.review});
         this.setState({reviewDetails: result.review}) 

         
         // console.log(this.state.totalReviews);

         console.log(this.state.reviewDetails);

         this.props.refreshproductClick(this.props.itemDetail,result.productIndex);
         // console.log(";;;;;;;;;;;;;;;;");
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




    onMapLayout = () => {
      this.setState({ isMapReady: true });
      console.log("........."+this.state.isMapReady);
    }

    onSubmitReviewClick = () => {
      var handleClick = this.refreshState.bind(this);
      Actions.AddReview({'itemDetail':this.props.itemDetail,'handleClick':handleClick});
    }
    onReportClick = () => {
      Actions.AddReport({'itemDetail':this.props.itemDetail});
    }
    onClaimClick = () => {
      
      Actions.AddClaim({'itemDetail':this.props.itemDetail});
    }

    onRecommendClick = () => {
    
      
      Share.share({
        message: this.props.itemDetail.productSharelink,
        url: this.props.itemDetail.productSharelink,
        title: this.props.itemDetail.productName
      }, {
        // Android only:
        // dialogTitle: 'Share BAM goodness',
        // iOS only:
        // excludedActivityTypes: [
        //   'com.apple.UIKit.activity.PostToTwitter'
        // ]
      })
    }

    onAllReviewClick= () => {

      if(this.props.itemDetail.totalReviews == "0")
      {
        Alert.alert(
                        'Verity One',
                        'No reviews available.',
                        [
                          // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                          // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: true }
                      )
                return;
      }
      else
      {
        Actions.AllReview({'itemDetail':this.props.itemDetail});
      }
      
    }
    onItemClick = async (item) => {
      return; 
    }

    dateToMDY(date) {
      var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var d = date.getDate();
      var m = strArray[date.getMonth()];
      var y = date.getFullYear();
      return '' + m +' '+ (d <= 9 ? '0' + d : d) +', ' + y;
    }

    _toggleModalOkClick = async () => {
    // console.log(this.state.forgotEmail);
        let errcnt=0;

        if(this.state.userRate == "")
        {
            Alert.alert(
                    'Verity One',
                    'Please give rating.',
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
          if(this.state.netStatus != "none")
          {  
              await fetch(apiUrl+'giveRating', {  
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        ratingValue:this.state.userRate,
                        userId:userId,
                        productId:this.props.itemDetail.productId
                      })
                    })
                  .then((response) => response.json())
                  .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.success == 1)
                    {
                      
                      this.setState({totalReviews:responseJson.result.rateUserCount});
                      this.setState({avgRating:responseJson.result.ratingValue});

                      this.setState({userRate:''});
                      this.setState({'isRate':"1"})
                      let itemData={
                                "rateUserCount":responseJson.result.rateUserCount,
                                "avgRating": responseJson.result.ratingValue,
                                "productIndex":productIndex
                              }
                              console.log(itemData);
                              this.props.updateRatingClick(this.props.itemDetail,itemData);

                    }
                    else
                    {
                        
                    }
                    

                    
                  })
                  .catch((error) => {
                    console.error(error);
                  });  



                this.setState({ isModalVisible: !this.state.isModalVisible });

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










_renderItem ({item, index}) {
        return (
            <View style={styles.slide}>
                <Image style={{width:180,height:180}} source = {{uri: item.productImage}} />
            </View>
        );
    }

  
  render(){

    let productImageURL=(this.props.itemDetail.images.length == 0?"":this.props.itemDetail.images[0].productImage);

    
    return(

      <View style={styles.mainContainer}>
        <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:25,paddingLeft:10 }}>
            <TouchableOpacity onPress={this.goBack}><Image 
                      source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                      style={styles.ImageIconStyle} 
                      /></TouchableOpacity>
        </View> 
        <ScrollView>
            
            <View style={styles.row,styles.imageBox, styles.logo}>
                <Image style={{width:152,height:65}} source = {{uri: 'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711036_homeLogo@2x.png'}} />
            </View>
            <View style={styles.row}>
              <Text style={[styles.productName]}>{this.props.itemDetail.productName}</Text>
            </View>
            <View style={styles.row}>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.props.itemDetail.images}
              renderItem={this._renderItem}
              sliderWidth={width}
              itemWidth={180}
              tappableDots={true}
            />
            </View>
            <View style={[styles.row,styles.listlabelRow]}>
              <Text style={{color:'#000',fontSize:20,flex:1,fontFamily: 'sansserif'}}>Listing Details</Text>
            </View>
            <View style={[styles.row,styles.flatcontainer]}>
             <FlatList
              scrollEnabled={false}
              data={this.props.itemDetail.productDetails}
              extraData={this.state.products}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => 

                <View style={styles.flatview}>
                  <TouchableOpacity activeOpacity={1} onPress = {() => this.onItemClick(item)}>
                    <View style={styles.itemView}>
                      <Text style={styles.itemLabel}>{item.placeholder} </Text>
                      <Text style={styles.itemValue}>{item.value}</Text>
                    </View>
                    
                  </TouchableOpacity>
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
              onEndThreshold={0}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
              refreshing={false}
              ItemSeparatorComponent={this.renderSeparator}
            />  
            </View>
            {( this.props.itemDetail.address != "NA" &&
            <MapView style={[styles.row,styles.borderRow,styles.map]}
                  pointerEvents="none"
                  region={{
                    latitude: Number(this.props.itemDetail.lat),
                    longitude: Number(this.props.itemDetail.lng),
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,

                  }}
                  onLayout={this.onMapLayout}
                  zoomEnabled={false}
                    
                  toolbarEnabled={true}
              >    
                

                
                  <MapView.Marker
                  coordinate={{
                    latitude: Number(this.props.itemDetail.lat),
                    longitude: Number(this.props.itemDetail.lng)
                  }}

                  title={this.props.itemDetail.productName}
                  description={this.props.itemDetail.upcCode} />
                


                </MapView>
              )}  
            <View style={[styles.borderRow,styles.row]}>
              <View style={[styles.rateView]}>

                <StarRating
                    activeOpacity={1}
                    disabled={false}
                    maxStars={5}
                    starSize={35}
                    starStyle={{padding:5}}  
                    emptyStartColor={"#d1d3d1"}
                    rating={Number(this.state.avgRating)} 
                    fullStarColor='#e5bf02'
                    selectedStar={() => this._toggleModal()}
                />
                <Text style={{paddingVertical:12,paddingLeft:3}}>({this.state.rateUserCount} Vote) {(this.state.isReview == "0" && this.state.isRate == "0")?"Rate Now":""}</Text>
                
              
              </View>  
            </View>
            {(this.state.totalReviews != "0" &&
            <View style={[styles.borderRow,styles.rowButton,styles.flatcontainer]}>
             <FlatList
              scrollEnabled={false}
              data={this.state.reviewDetails}
              extraData={this.state}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => 
                <View style={styles.rateflatview}>
                  <TouchableOpacity activeOpacity={1} onPress = {() => this.onItemClick(item)}>
                    <View style={styles.innerView}>
                      <View style={{flexDirection:'column',marginRight:3,width:Platform.OS === 'ios' ? 'auto' : '30%'}}>
                        <Image style={styles.reviewImage} resizeMode='cover' source={{uri: item.profileImage}} />
                        
                        
                      </View>
                      <View style={{flexDirection:'column',width:Platform.OS === 'ios' ? height > 950? '90%':'70%' : '70%'}}>

                        <View style={{flexDirection:'row'}}>
                          <StarRating
                            disabled={true}
                            maxStars={5}
                            starSize={10}
                            starStyle={{paddingRight:10,paddingTop:3}}  
                            emptyStartColor={"#c0c4c0"}
                            rating={Number(item.reviewValue)}
                            fullStarColor='#e5bf02'
                              
                            />
                          <Text style={styles.usernameText}>{item.userName}</Text>

                        </View>

                        <View style={{flexDirection:'row',flex:1,marginBottom:5}}>
                          <Text style={styles.reviewTitle}>{item.reviewTitle}</Text>
                        </View>
                        <View style={{flexDirection:'row',flex:1,marginBottom:5}}>
                          <Text style={styles.reviewText}>{item.reviewText}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.innerView}>
                      <Text style={styles.reviewDate}>{this.dateToMDY(new Date(item.reviewDate))}</Text>
                    </View>
                    
                  </TouchableOpacity>
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
              onEndThreshold={0}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
              refreshing={false}
              ItemSeparatorComponent={this.renderSeparator}
            />  
            </View>
            )}
            <View style={styles.rowButton}>
                
                {( this.state.isReview == "0" &&
                <TouchableOpacity style={[styles.row,styles.button]} activeOpacity={1} onPress={this.onSubmitReviewClick}>
                  <View>
                      <Text style={[styles.buttonText]}>Submit Review</Text>
                  </View>    
                  
                </TouchableOpacity>
                )}
                
                <TouchableOpacity style={[styles.row,styles.button]} activeOpacity={1} onPress={this.onAllReviewClick}>
                  <View>
                      <Text style={[styles.buttonText]}>All Review</Text>
                  </View> 
                </TouchableOpacity>
              
                <TouchableOpacity style={[styles.row,styles.button]} activeOpacity={1} onPress={this.onRecommendClick}>
                  <View>
                      <Text style={[styles.buttonText]}>Recommend</Text>
                  </View> 
                </TouchableOpacity>
            </View>
            <View style={styles.rowButton}>
                <TouchableOpacity style={[styles.row,styles.button]} activeOpacity={1} onPress={this.onReportClick}>
                  <View>
                      <Text style={[styles.buttonText]}>Report</Text>
                  </View>    
                  
                </TouchableOpacity>
                <TouchableOpacity style={[styles.row,styles.button]} activeOpacity={1} onPress={this.onClaimClick}>
                  <View>
                      <Text style={[styles.buttonText]}>Claim</Text>
                  </View> 
                </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback  onPress={() => this.setState({ isModalVisible: false })} >
                    <Modal isVisible={this.state.isModalVisible} onBackButtonPress={() => this.setState({ isModalVisible: false })}  onBackdropPress={() => this.setState({ isModalVisible: false })} onRequestClose={() => { this.setState({'isModalVisible':false}) } }>
                        <View style={{ backgroundColor:'#ffffff',marginHorizontal:height > 950 ?'30%':'10%',borderRadius:5,height:Platform.OS === 'ios' ? '30%' : '40%'}}>
                            <View style={{padding:22,flexDirection:'row'}}>
                              <View style={{width:Platform.OS === 'ios' ? 'auto' : '20%',height:50}}>
                                <Image style={{width:50,height:50}} source = {{uri: productImageURL}} />
                              </View>
                              <View style={{flexWrap: 'wrap',width:'80%',height:50}}>
                                <Text style={{flexWrap: 'wrap',fontWeight:'600',textAlign:'center',fontSize:15,fontFamily: 'sansserif',paddingBottom:8}}>{this.props.itemDetail.productName}</Text>
                              </View>
                            </View>
                            <View
                              style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#FF7F50",
                              }}
                            />
                            <View style={{flex:1,justifyContent: 'center'}}>
                              <View style={[styles.modelRateView]}>

                                <StarRating
                                    activeOpacity={1}
                                    disabled={false}
                                    maxStars={5}
                                    starSize={35}
                                    starStyle={{padding:5}}  
                                    emptyStartColor={"#d1d3d1"}
                                    rating={Number(this.state.userRate)} 
                                    fullStarColor='#e5bf02'
                                    selectedStar={(rating) => this.onChangeUserRate(rating)}
                                />
                              </View>
                              <View style={{flexDirection: 'row',
                                  justifyContent: 'center',marginTop:6}}>
                                  
                                  <View style={{width:'30%',height:80,marginHorizontal:10}}>
                                   <TouchableOpacity style={[styles.modelbtn]} onPress={this._toggleModal} >
                                     <Text style={styles.modelbuttonText}>Cancel</Text>
                                   </TouchableOpacity> 
                                  </View>
                                 <View style={{width:'30%',height:80,marginHorizontal:10}}>
                                   <TouchableOpacity style={[styles.modelbtn]} onPress = {
                                          () => this._toggleModalOkClick()} >
                                     <Text style={styles.modelbuttonText}>Submit</Text>
                                   </TouchableOpacity>
                                 </View>
                                 
                              </View>
                            </View>
                        </View>
                  </Modal>
            </TouchableWithoutFeedback>
        </ScrollView>

 
            
            
        
      </View> 
      )
  }
}

const styles = StyleSheet.create({
  modelRow:{
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    // marginBottom: 10,
    marginBottom: 5,
    paddingHorizontal:5
  },
  modelRateView:{
    
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    
  },
  modelbtn: {
    
    backgroundColor:'#426bb1',
    width:90,
    borderRadius: 5,
    // marginRight: 10,
    // paddingRight:10,
    justifyContent:'center',
    height:40,
  },
  modelbuttonText: {
    fontSize:18,
    fontFamily: 'sansserif',
    color:'#ffffff',
    textAlign:'center',
    // paddingTop:Platform.OS === 'ios' ? 10 : 8 
  },
  rateView:{
    backgroundColor:'#CED0CE',
    paddingHorizontal:10,
    paddingVertical:10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    width:width,
  },
  map:{
    flex:1,
    height:150,
    width:width,
    marginTop:10,
    marginBottom:3,

  },
  borderRow:{
    borderColor:'#CED0CE',
    borderBottomWidth:1,
    
  },
  image: {
    width: 70,
    height: 70,
    margin: 3,
    borderRadius: 2,
  },
  flatcontainer:{
    flex:1,
    height:'auto',
    marginTop:Platform.OS === 'ios' ? '1%' : '5%',
  },
  flatview: {
    justifyContent: 'center',
    borderRadius: 2,
    flexGrow:3,
    backgroundColor:'#fff',
    marginVertical:13

  },
  rateflatview: {
    justifyContent: 'center',
    // paddingTop: 30,
    borderRadius: 2,
    flexGrow:3,
    flex:1,
    backgroundColor:'#fff',
    // paddingVertical:20

  },
  
  itemView:
  {
    flexDirection: "row",
    minHeight:20,
    flexGrow: 1,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    // justifyContent: 'space-between',
    
  },
  itemLabel: {
    color:'#939292',
    fontSize:15,
    fontFamily: 'sansserif',
    flexWrap: 'wrap',
    width:'30%'
  },
  itemValue: {
    fontSize:15,
    fontFamily: 'sansserif',
    color:'#000',
    flexWrap: 'wrap',
    width:'70%'
    // alignSelf: 'flex-start',
  },
  productName:{
    color:'#000',
    fontWeight:'bold',
    fontSize:20,
    fontFamily: 'sansserifBold',
    flex:1,
    marginTop:Platform.OS === 'ios' ? '2%' : '2%',

  },

  innerView:
  {
    
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent: 'space-between',
    
  },
  usernameText: {
    fontSize:18,
    fontFamily: 'sansserif'
    // alignSelf: 'flex-start',
  },
  reviewImage: {
    width: 80,
    height: 80,
    margin: 3,
    borderWidth:2,
    borderColor:'#000',
    borderRadius: 80/2
  },
  reviewText: {
    fontSize:18,
    fontFamily: 'sansserif',
    flexWrap: 'wrap',
    width:'85%',
    // alignSelf: 'flex-start',
  },
  reviewTitle:{
    fontWeight:'bold',
    fontSize:18,
    fontFamily: 'sansserifBold',
    flexWrap: 'wrap',
    marginRight:4,
    width:'85%'
  },
  reviewDate:{
    fontSize:15,
    fontFamily: 'sansserif',
    flexWrap: 'wrap',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // marginBottom: 10,
    width:width,
    paddingHorizontal:5
  },
  rowButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    width:width,
    paddingHorizontal:5
  },
  listlabelRow:{
    borderBottomWidth: 2,borderColor:'#939292'
  },
  logo: {
    backgroundColor: '#ffffff',
    alignItems:'center',
    justifyContent:'center'
  },
  imageBox: {
    flex: 1,
    height: 100,
    backgroundColor: '#333'
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
    justifyContent :'center'
  },
  inputBox: {
    flexGrow: 0.1,
    width:250,
    backgroundColor:'#ffffff',
    borderWidth:0.6,
    borderRadius:5,
    fontSize:16,
    fontFamily: 'sansserif',
    color:'#000000',
    alignSelf:'flex-start',
    paddingHorizontal:10,
  },
  button: {
    width:(width-20)/3,
    height:40,
    paddingHorizontal:5,
    marginRight:10, 
    borderRadius: 5,
    borderWidth:0.6,
    backgroundColor:'#d9dbd9',
    shadowColor: '#666',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 2,
    borderColor: '#9f9f9f',
    borderWidth: 0,
  },
  buttonText: {
    fontSize:14,
    fontFamily: 'sansserif',
    textAlign:'center',
    paddingTop:8
    
  },
  
  
});
