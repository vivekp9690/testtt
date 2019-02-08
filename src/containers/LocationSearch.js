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
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  FlatList,
  SectionList,
} from 'react-native';

const googleMapUrl='https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBHMVfcKqZC0gQky3zgP5r6fEUWo9bEBcc&sensor=true';

const str_certified = "certified";

import { Constants, Location, Permissions } from 'expo';
import {splashAPIKey} from "../config/constant";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker'

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
let listItems = [];
let listItemsStore=[];
let locationbean_below_75=[];
export default class SignupForm extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          // radious:'500',
          // curr_lat:'42.0150599',
          // curr_lot:'-87.7829346',
          radious:'',
          curr_lat:'',
          curr_lot:'',
          list:'',
          listStore:'',
          place:"",
          searchTypeAction:"",
          locationbeanArrayList_taken:[],
          locationbeanArrayList_below_75:'',
          locationbeanArrayList_ignored:[],
          myData:[],
          loading:false,
          splashName:"",
          splashImage:"",
          loading:false,
          placesArray:[],
          errorMessage: '',
          distance:"",
          location: null,
       }
    }

    goBack() {
      Actions.pop();
    }

  radiousChange = (text) => {
     this.setState({
      radious:text
     });
  }
  
  latChange = (text) => {
     this.setState({
      curr_lat:text
     });
  }
  longChange = (text) => {
     this.setState({
      curr_lot:text
     });
  }
  
  componentDidMount() {
    console.log('Modal Mounts!')
    // alert("mounted")
    if(this.state.splashName != "")
    {
      setTimeout(() => {
        console.log('Open')
        Actions.login()
      }, 10000)
    }
    


  }
  /*componentWillMount() {

    NetInfo.getConnectionInfo().then((connectionInfo) => {
        // console.log(connectionInfo)

      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: '    + connectionInfo.effectiveType);

      if(connectionInfo.type != "none")
      {
        this.setState({'loading':true})
        if (Platform.OS === 'android' && !Constants.isDevice) {
          this.setState({
            errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
          });
        } else {
          this._getLocationAsync();
        }
      }
      else
      {
        this.setState({"splashName":"normal"})
        this.setState({'loading':false})

      }

    });

    
  }*/

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {

      // show default splash screen 
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });

      this.setState({"splashName":"normal"})
        this.setState({'loading':false})

        return;
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location});

    this.getAllNearByPlaces()
       
        //Static Location for testing
        //let curLattitude = 26.3679835
        //let curLongiture = -80.0765358
        console.log("distance........")
        // console.log(this.distance(location.coords.latitude,location.coords.longitude,"42.0150599","-87.7829346",'K'))
        

  };

 
  getAllNearByPlaces_old = async(searchType)=>{
    
    this.setState({searchTypeAction:searchType});
    let types = ['strKroger', 'strCostco', 'strPublix', 'strWawa', 'strWalmart', 'strTrader', 'strThefresh', 'strWholefoods', 'strStartBucks', 'strChipotle', 'strAlfalfas', 'strCosmoProf', 'strCvsPharmacy', 'strDunkinDonuts', 'strGNCLiveWell', 'strPaneraBread',' strPetSupermarket', 'strSaloncentric', 'strWalgreens']

        //Costco Location = (42.0150599, -87.7829346)
        //The Fresh Market = (42.0807986, -87.7587472)
        //Kroger Mart = (40.1208193, -83.0902709)
        //Publix Location = (26.386930, -80.078047)
        //Trader Joe's = (38.0640464, -78.4905779)
        //Walmart Location = (26.436384, -80.12261)
        //Wawa Location = (33.8924922, -83.3739964)
        //Whole Foods Location = (39.06826, -77.4840521)
        //Starbucks Location = (28.6662752, -77.1253246)
        //Chipotle Grill Location = (26.365584, -80.078941)
        
        //Alfalfa's Market Location = (39.9870078, -105.1344862)
        //CosmoProf Location = (39.8552137, -105.0809277) // (25.7329385, -80.3450386)
        //CVS Pharmacy Location = (40.0227183, -105.2563465)
        //Dunkin Donut's Location = (40.0338396, -105.2588705) //Ahmedabad - (23.0245552, 72.5563425)
        //GNC's Location = (25.7495414, -80.2600533)
        //Panera Bread's Location = (25.7496781, -80.2574439)
        //Pet Supermarket's Location = (37.9620864, 23.6762804)
        //Salon Centric's Location = (36.12321, -115.2795002)
        //Wallgreen's Location = (33.5289889, -111.9258436)

    
    var countTypes=0;  
    for (let type of types){
       await this.getNearByStore(type,searchType)
          if(this.state.place != "")
          {

            this.state.placesArray.sort(function(a, b) {
                return a.distance - b.distance;
            });
            
            console.log("last place......",this.state.place)
            this.setState({'loading':false}) 
            break;
          }
          countTypes++;
          if(types.length == countTypes && this.state.place == "")
          {
            this.setState({"splashName":"normal"})
            this.setState({'loading':false})
          }     
    } 
    
  }
  toObject(arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
      rv[i] = arr[i];
    return rv;
  }
  getAllNearByPlaces = async(searchType)=>{

    if(this.state.loading)
    {
      return;
    }
    this.setState({listStore:[]});  
    this.setState({myData:[]});  
    
    listItems = [];
    listItemsStore=[];
    
    this.setState({'loading':true})
    this.setState({searchTypeAction:searchType});
    
    let types = ['strKroger', 'strCostco', 'strPublix', 'strWawa', 'strWalmart', 'strTrader', 'strThefresh', 'strWholefoods', 'strStartBucks', 'strChipotle', 'strAlfalfas', 'strCosmoProf', 'strCvsPharmacy', 'strDunkinDonuts', 'strGNCLiveWell', 'strPaneraBread',' strPetSupermarket', 'strSaloncentric', 'strWalgreens']
    // let types = ['strCostco'];
    var countTypes=0;  
    for (let type of types){
        
       await this.getNearByStore(type,searchType)
       
        countTypes++;

        if(types.length == countTypes && this.state.listStore.length > 0)
        {
          console.log(types.length+" == "+countTypes+" && "+this.state.listStore.length)
            // this.state.placesArray.sort(function(a, b) {
            //     return a.distance - b.distance;
            // });
            
            // console.log("passed location lat: "+this.state.location.coords.latitude+" long: "+this.state.location.coords.longitude)
            // console.log("sorted array..............................")
            // console.log(this.state.placesArray);

            // console.log("final splash screen near 100 meters..............................")

            // console.log(this.state.placesArray[0]);
            // this.setState({"splashName":this.state.placesArray[0].splashName})
            // this.setState({"place":this.state.placesArray[0].place})

            console.log("............state ................. my data s")

            console.log(this.state.placesArray)
            this.state.placesArray.sort(function(a, b) {
                return a.distance - b.distance;
            });
            
            console.log("sorted array..............................")
            console.log(this.state.placesArray);

            console.log("final splash screen near 100 meters..............................")

            console.log(this.state.placesArray[0]);
            this.setState({"splashName":this.state.placesArray[0].splashName})
            this.setState({"place":this.state.placesArray[0].place})

            let storeview_arr=this.state.listStore;
            let myDataArray=[];
              for (i=0;i < storeview_arr.length;i++) {

              
                var singleRec=storeview_arr[i][Object.keys(storeview_arr[i])];
                  //Object.keys(storeview_arr[i]).map(function(key, index){
                      
                   //let myobj=['Place ID:: '+storeview_arr[i][key][i]['place_id'],'Set Place Name:: '+storeview_arr[i][key][i]['name'],'Location Name:: '+storeview_arr[i][key][i]['location_name'], 'Distance:: '+storeview_arr[i][key][i]['distance'], 'Place Location:: '+storeview_arr[i][key][i]['place_latlng']];
                   let myobj=['Place ID :: '+singleRec.place_id,'Set Place Name :: '+singleRec.name,'Location Name :: '+singleRec.location_name, 'Distance :: '+singleRec.distance, 'Place Location :: ',singleRec.place_latlng,' '];
                   myDataArray.push ({title: singleRec.name, data: myobj});
                      
                  //});
              }
              
            this.setState({"myData":myDataArray});
            
            console.log(myDataArray)
            // console.log(this.state.myData)
            console.log("............state ................. my data e")
            this.setState({'loading':false})
        }
        else if(types.length == countTypes && this.state.placesArray.length <= 0)
        {
            this.setState({"splashName":"normal"})
            this.setState({'loading':false})
        }  
    } 
  }
  getNearByStore= async (place,searchType) => {
    //var curLattitude=this.state.location.coords.latitude;
    //var curLongiture=this.state.location.coords.longitude;
    
    var curLattitude=this.state.curr_lat;
    var curLongiture=this.state.curr_lot;
    var radious =this.state.radious;
    
    //console.log(this.state.radious);
    //console.log(this.state.curr_lat);
    //console.log(this.state.curr_lot);
    
    
    //var curLattitude= 42.0150599
    //var curLongiture=  -87.7829346
    //var radious =100;
     
// var curLattitude=39.06826
    // var curLongiture=  -77.4840521
    // var curLattitude=23.01665959442587;
    // var curLattitude=72.52831391366996;
     var splashName = "normal"
     if(place == 'strCostco') splashName = "costco";
     if(place == 'strThefresh') splashName = "freshMarket";
     if(place == 'strKroger') splashName = "krogermart";
     if(place == 'strPublix') splashName = "publix";
     if(place == 'strTrader') splashName = "traderjoes";
      if(place == 'strWalmart') splashName = "walmart";
      if(place == 'strWawa') splashName = "wawa";
      if(place == 'strWholefoods') splashName = "wholefoods";
      if(place == 'strStartBucks') splashName = "starbucks";
      if(place == 'strChipotle') splashName = "chipotle";
            
      if(place == 'strAlfalfas') splashName = "alfalfas";
      if(place == 'strCosmoProf') splashName = "cosmoProf";
      if(place == 'strCvsPharmacy') splashName = "cvsPharmacy";
      if(place == 'strDunkinDonuts') splashName = "dunkinDonuts";
      if(place == 'strGNCLiveWell')splashName = "gncLiveWell";
      if(place == 'strPaneraBread')splashName = "paneraBread";
      if(place == 'strPetSupermarket') splashName = "petSupermarket";
      if(place == 'strSaloncentric') splashName = "salonCentric";
      if(place == 'strWalgreens') splashName = "walgreens";
       

        // console.log(place,splashName)     
        var strUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+curLattitude+","+curLongiture+"&radius="+radious+"&type=store&name="+splashName+"&sensor=true&key="+splashAPIKey

        if (place == 'strChipotle') {//Set type = restaurant
            strUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+curLattitude+","+curLongiture+"&radius="+radious+"&type=restaurant&name="+splashName+"&sensor=true&key="+splashAPIKey
        } else if (place == 'strCvsPharmacy') { //Set type = pharmacy
            strUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+curLattitude+","+curLongiture+"&radius="+radious+"&type=pharmacy&name="+splashName+"&sensor=true&key="+splashAPIKey
        } else if (place == 'strDunkinDonuts' || place == 'strPaneraBread') { //Set type = food
            strUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+curLattitude+","+curLongiture+"&radius="+radious+"&type=food&name="+splashName+"&sensor=true&key="+splashAPIKey
        }

        console.log(strUrl)
        await fetch(strUrl, {  
                      method: 'GET',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      }
                      
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                         //alert(responseJson.result)
                         //console.log(".........result")
                         //console.log(responseJson.results.length);
                        //console.log(place);
                        let sameproperty='';
                        var validStores = 0;
                        
                        if(responseJson.results.length > 0)
                        {
                          
                          for (let results of responseJson.results){
                              //console.log(results.name+" ...............name   ");
                              let newdistance=this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng);
                              if (newdistance <= radious) {
                                       
                                locationbean_below_75.push({ 
                                            place_id:'',
                                            name:'',
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                });
                                    
                              }        
                              
                              var isValidStore = false
                              //listItems=[];
                              var resultName="";
                              var listItemObj={};
                              switch (place) {
                              case 'strCostco':
                                  if (results.name.toLowerCase().includes("costco")) {
                                      isValidStore = true;
                                      resultName=results.name;

                                      listItemObj={ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       };

                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemsStore.push({costco:listItemObj});
                                      
                                  }
                              case 'strThefresh':
                                  if (results.name.toLowerCase().includes("fresh") && results.name.toLowerCase().includes("market")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       };
                                       listItemsStore.push({fresh:listItemObj});
                                       
                                  }
                              case 'strKroger':
                                  if (results.name.toLowerCase().includes("kroger")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                       listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });

                                       listItemObj={ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                      };
                                       listItemsStore.push({kroger:listItemObj});
                                  }
                              case 'strPublix':
                                  if (results.name.toLowerCase().includes("publix")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                      };
                                       listItemsStore.push({publix:listItemObj});
                                  }
                              case 'strTrader':
                                  if (results.name.toLowerCase().includes("trader")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });

                                       listItemObj={ 
                                              place_id:results.id.substring(1, 5),
                                              name:results.name,
                                              location_name:results.name+': '+results.vicinity,
                                              place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                              distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                        };
                                       
                                       listItemsStore.push({trader:listItemObj});
                                  }
                              case 'strWalmart':
                                  if (results.name.toLowerCase().includes("walmart")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                        };
                                       listItemsStore.push({walmart:listItemObj});
                                  }
                              case 'strWawa':
                                  if (results.name.toLowerCase().includes("wawa")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                         };
                                       listItemsStore.push({wawa:listItemObj});
                                  }
                              case 'strWholefoods':
                                  if (results.name.toLowerCase().includes("whole") && results.name.toLowerCase().includes("foods")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });

                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({whole:listItemObj});
                                  }
                              case 'strStartBucks':
                                  if (results.name.toLowerCase().includes("starbucks")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });

                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({starbucks:listItemObj});
                                  }
                              case 'strChipotle':
                                  if (results.name.toLowerCase().includes("chipotle") && results.name.toLowerCase().includes("grill")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({chipotle:listItemObj});

                                  }
                              case 'strAlfalfas':
                                  if (results.name.toLowerCase().includes("alfalfa")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({alfalfa:listItemObj});
                                  }
                              case 'strCosmoProf':
                                  if (results.name.toLowerCase().includes("cosmoprof")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({cosmoprof:listItemObj});
                                  }
                              case 'strCvsPharmacy':
                                  if (results.name.toLowerCase().includes("cvs") && results.name.toLowerCase().includes("pharmacy")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({cvs_pharmacy:listItemObj});
                                  }
                              case 'strDunkinDonuts':
                                  if (results.name.toLowerCase().includes("dunkin") && results.name.toLowerCase().includes("donut")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({dunkin_donut:listItemObj});
                                  }
                              case 'strGNCLiveWell':
                                  if (results.name.toLowerCase().includes("gnc")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({gnc:listItemObj});
                                  }
                              case 'strPaneraBread':
                                  if (results.name.toLowerCase().includes("panera") && results.name.toLowerCase().includes("bread")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({panera_bread:listItemObj});
                                  }
                              case 'strPetSupermarket':
                                  if (results.name.toLowerCase().includes("pet") && results.name.toLowerCase().includes("supermarket")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({pet_supermarket:listItemObj});
                                  }
                              case 'strSaloncentric':
                                  if (results.name.toLowerCase().includes("salon") && results.name.toLowerCase().includes("centric")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({salon_centric:listItemObj});
                                  }
                              case 'strWalgreens':
                                  if (results.name.toLowerCase().includes("walgreens")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                      listItems.push({ 
                                            place_id:results.id.substring(1, 5),
                                            name:results.name,
                                            location_name:results.name+': '+results.vicinity,
                                            place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                            distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                       });
                                       listItemObj={ 
                                        place_id:results.id.substring(1, 5),
                                        name:results.name,
                                        location_name:results.name+': '+results.vicinity,
                                        place_latlng:'Latitude:'+results['geometry']['location'].lat+'     Longitude:'+results['geometry']['location'].lng,
                                        distance:this.distance(curLattitude, curLongiture, results['geometry']['location'].lat,results['geometry']['location'].lng),
                                   };
                                       listItemsStore.push({walgreens:listItemObj});
                                  }
                              default:break
                              }
                              
                              if (isValidStore) {
                                  validStores += 1
                                  // temp.place = place
                                  // temp.calculateDistance(self.curLocation)
                                   // console.log(listItemsStore.)            
                                 // self.placesArray.append(temp)
                                  //console.log(place);
                                  
                                  //console.log(validStores);
                                  //console.log(place, resultName);
                                  //console.log(place, listItems);
                                  var distance=this.distance(curLattitude, curLongiture,results.geometry.location.lat,results.geometry.location.lng);  
                                  var objPlace={
                                      place:place,
                                      splashName:splashName,
                                      distance:distance

                                  }
                                  
                                  console.log(".................")
                                  console.log(objPlace)
                                  this.setState(prevState => ({
                                    placesArray: [...prevState.placesArray, objPlace]
                                  }))  



                                  console.log('liststore............'+listItemsStore.length);
                                  this.setState({"place":place});
                                  this.setState({"list":listItems});
                                  this.setState({"listStore":listItemsStore});
                                  
                                  this.setState({"locationbeanArrayList_below_75":locationbean_below_75});
                                  this.setState({"splashName":splashName});
                                  
                                    
                                  
                                  
                              }
                          }
                          
                        } 
                       
                        //console.log("\n---------------------------"+validStores+"Places valid near "+place)
                    
                  })
                  .catch((error) => {
                    console.error(error);
                    
                  }); 
  }
  renderItem(data) {
    let { item, index } = data;
    return (
      <View style={styles.innerView}>
          <TouchableOpacity activeOpacity={1}>
                <View style={[styles.row]}>
                    <View style={{flexDirection:'column',width:Platform.OS === width ? 'auto' : '100%'}}>
                      <View style={{flexDirection:'row'}}>
                         <View><Text style={styles.maptext}>Place ID::</Text></View>
                        <Text style={styles.productName}>{item.place_id.substr(0,60)}{item.place_id.length > 60 ? <Text>...</Text>: null }</Text>
                      </View>
                      
                      <View style={{flexDirection:'row'}}>
                        <View><Text style={styles.maptext}>Set Place Name::</Text></View>  
                        <Text style={styles.categoryValue}>{item.name}</Text>
                      </View>
                      
                      <View style={{flexDirection:'row'}}>
                        <View><Text style={styles.maptext}>Location Name::</Text></View>    
                        <Text style={styles.categoryDate}>{item.location_name}</Text>
                      </View>
                      <View style={{flexDirection:'row'}}>
                        <View><Text style={styles.maptext}>Distance::</Text></View>    
                        <Text style={styles.categoryDate}>{item.distance}</Text>
                      </View>
                      <View><Text style={styles.maptext}>Places Locations::</Text></View>      
                      <View style={{flexDirection:'row'}}>
                        <Text style={styles.categoryDate}>{item.place_latlng}</Text>
                      </View>
                    </View>
                </View>
                <View style={{borderBottomColor: '#9f9f9f',borderBottomWidth: 1}}/>
              </TouchableOpacity>
            </View>
    ) 
  }
  distance(lat1, lon1, lat2, lon2, unit='K') {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
        
        dist=dist * 1000;
	return Math.round(dist);
  }
  render(){
    //console.log(this.state.list);
    //console.log(this.state.locationbeanArrayList_below_75);
    console.log(this.state.listStore);
    
    let splashNameText = '';
    if (this.state.splashName) {
      splashNameText='Nearest Places: certified';
    }
    
    return(
      <View style={styles.mainContainer}>
        <View style={{ flexDirection:'row',alignSelf:'flex-start',paddingTop:Platform.OS === 'ios' ? 25 : 45,paddingLeft:10 }}>
            <TouchableOpacity onPress={this.goBack}><Image 
                      source={{uri:'https://t.certified.bz/components/com_applicationsetting/assets/images/backimage/1516711035_backimage.png'}} 
                      style={styles.ImageIconStyle} 
                      /></TouchableOpacity>
        </View>
            <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps="always"
            scrollEnabled={true}
            behavior="padding"
            >
              <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Radius"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    ref={(input) => {
                      this.radious = input
                    }}
                    onChangeText = {this.radiousChange}/>
               
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Current Latitude"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    ref={(input) => {
                      this.curr_lat = input
                    }}
                    onChangeText={this.latChange}
                    /> 
                        
                <TextInput style={styles.inputBox} 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Current Longitude"
                    placeholderTextColor = "#999999"
                    selectionColor="#000"
                    ref={(input) => {
                      this.curr_lot = input
                    }}
                    onChangeText = {this.longChange}

                    />
                    
                  <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={styles.button1} onPress = {
                            () => this.getAllNearByPlaces('place')} >
                       <Text style={styles.buttonText}>GET PLACE</Text>
                     </TouchableOpacity>   
                 <TouchableOpacity style={styles.button2} onPress = {
                        () => this.getAllNearByPlaces('store')} >
                   <Text style={styles.buttonText}>STORES</Text>
                 </TouchableOpacity>   
                 <TouchableOpacity style={styles.button3} onPress = {
                        () => this.getAllNearByPlaces('splash')} >
                   <Text style={styles.buttonText}>CHECK SPLASH</Text>
                      </TouchableOpacity>
                   </View>
                 {( (this.state.searchTypeAction === "place" || this.state.searchTypeAction === "") && 
                    <View>
                            <View style={styles.nearestPlace}>
                                <Text style={styles.nearestPlaceText}>{splashNameText}</Text>
                            </View>
                            <View style={styles.belowPlace}>
                                <Text style={styles.belowPlaceText}>Below {'<'} {this.state.radious}</Text>
                            </View>
                            <View style={styles.container}> 
                                <FlatList
                                contentContainerStyle={styles.container,styles.flatcontainer,styles.Textborderline}
                                             data={this.state.locationbeanArrayList_below_75}
                                             extraData={this.state}
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
                             <View style={styles.takenPlace}>
                                <Text style={styles.takenPlaceText}>Taken Places</Text>
                            </View>
                            <View style={styles.container}>
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
                                             ListFooterComponent={false}
                                         />
                               </View>
                               <View style={styles.ignoredPlace}>
                                <Text style={styles.ignoredPlaceText}>Ignored Places</Text>
                            </View>
                         </View>
                )} 
                {(this.state.searchTypeAction === "store" && this.state.myData.length > 0 && 
                     <StoreView listStore={this.state.myData} />
                )}        
                {(this.state.searchTypeAction === "splash" && 
                    <SplashView loading={this.state.loading} listStore={this.state.listStore} errorMessage={this.state.errorMessage} location={this.state.location} place={this.state.place} splashName={this.state.splashName} />
                )} 
                {(this.state.loading && 
                  <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" animating={this.state.loading} />
                  </View>
                )}
            </KeyboardAwareScrollView>
      </View>
      )
  }
}

class StoreView extends React.Component {

  render() {
     
         
        //  console.log(this.props.listStore)
     return (
      <View style={styles.container,styles.flatcontainer,styles.Textborderline}> 
         <SectionList contentContainerStyle={styles.container,styles.flatcontainer,styles.Textborderline} 
                renderItem={({item, index, section}) => <Text key={index}>{item}</Text>}
                renderSectionHeader={({section: {title}}) => (
                  <View style={styles.storeTitleBackG}>
                     <Text style={styles.storeTitle}>{title}</Text>
                  </View>
                )}
                sections={this.props.listStore}
                // sections={[
                //   {title: 'Title1', data: ['item1', 'item2']},
                //   {title: 'Title2', data: ['item3', 'item4']},
                //   {title: 'Title3', data: ['item5', 'item6']},
                // ]}
                keyExtractor={(item, index) => item + index}
              />
      </View>        
      );
  }
};

class SplashView extends React.Component {

  render() {
    let text = 'Waiting..';
    if (this.props.errorMessage) {
      text = this.props.errorMessage;
    } else if (this.props.location) {
      text = JSON.stringify(this.props.location);
    }
    
    let image ="";
    if(this.props.place == 'strCostco') image=require('../../assets/images/Splash/costco.imageset/1536x2048.png');
    else if(this.props.place == 'strThefresh') image=require('../../assets/images/Splash/freshMarket.imageset/1536x2048.png');
    else if(this.props.place == 'strKroger') image=require('../../assets/images/Splash/krogermart.imageset/1536x2048.png');
    else if(this.props.place == 'strPublix') image=require('../../assets/images/Splash/publix.imageset/1536x2048.png');
    else if(this.props.place == 'strTrader') image=require('../../assets/images/Splash/traderjoes.imageset/1536x2048.png');
    else if(this.props.place == 'strWalmart') image=require('../../assets/images/Splash/walmart.imageset/1536x2048.png');

    else if(this.props.place == 'strWawa') image=require('../../assets/images/Splash/wawa.imageset/1536x2048.png');
    else if(this.props.place == 'strWholefoods') image=require('../../assets/images/Splash/wholefoods.imageset/1536x2048.png');
    else if(this.props.place == 'strStartBucks') image=require('../../assets/images/Splash/starbucks.imageset/1536x2048-Recovered.jpg');
    else if(this.props.place == 'strChipotle') image=require('../../assets/images/Splash/chipotle.imageset/1536x2048.jpg');

    else if(this.props.place == 'strAlfalfas') image=require('../../assets/images/Splash/alfalfas.imageset/1536x2048.jpg');
    else if(this.props.place == 'strCosmoProf') image=require('../../assets/images/Splash/cosmoProf.imageset/1536x2048-Recovered.jpg');
    else if(this.props.place == 'strCvsPharmacy') image=require('../../assets/images/Splash/cvsPharmacy.imageset/1536x2048.jpg');
    else if(this.props.place == 'strDunkinDonuts') image=require('../../assets/images/Splash/dunkinDonuts.imageset/1536x2048.jpg');

    else if(this.props.place == 'strGNCLiveWell') image=require('../../assets/images/Splash/gncLiveWell.imageset/1536x2048-Recovered.jpg');
    else if(this.props.place == 'strPaneraBread') image=require('../../assets/images/Splash/paneraBread.imageset/1536x2048-Recovered.jpg');
    else if(this.props.place == 'strPetSupermarket') image=require('../../assets/images/Splash/petSupermarket.imageset/1536x2048-Recovered.jpg');
    else if(this.props.place == 'strSaloncentric') image=require('../../assets/images/Splash/salonCentric.imageset/1536x2048-Recovered.jpg');
    else if(this.props.place == 'strWalgreens') image=require('../../assets/images/Splash/walgreens.imageset/1536x2048.jpg');
    else if(this.props.place == 'normal') image=require('../../assets/images/Splash/normal.imageset/1536x2048.png');             


    return (
      <View style={styles.container}>
        {(image != "" && 
        <Image 
              source={image} 
              style={styles.ImageStyle} 
              /> 
        )} 
        {(this.props.loading && 
        <Image 
              source= {require('../../assets/images/GIFVerity.gif') }
              style={styles.gifImageStyle} 
              /> 
        )}                    
      </View>
    );
  }
};


const styles = StyleSheet.create({

  ImageIconStyle: {
     padding: 10,
     margin: 5,
     height: 10,
     width: 10,
     borderRadius:5,
     resizeMode : 'stretch',
   
  },
  flatcontainer:{
    height:height,
    flex:10,
    marginTop:Platform.OS === 'ios' ? '1%' : '5%',
    
  },
  Textborderline:{
    borderBottomColor: '#4cb5f5',
    borderBottomWidth: 1,
    width:'100%'
  },
  storeTitle:{
    justifyContent:'center',
    alignItems: 'center',
    // backgroundColor:'blue',
    backgroundColor:'#5d90ef',
    textAlign:'center',
    fontWeight:'bold',
    fontSize:20,
    color:'#FFF',
    paddingBottom:3
  },
  mainContainer : {
    backgroundColor:'#ffffff',
    height:height,
    alignItems:'center',
    justifyContent :'center'
  },
 
  container : {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#ffffff',
    paddingHorizontal:2,
    width:width

  },
  labelText : {
    marginVertical: 15,
    fontWeight:'bold',
    fontSize:20,
    color:'#426bb1'
  },
  labelTextResult : {
    //marginVertical: 15,
    fontWeight:'bold',
    fontSize:16,
    color:'#426bb1'
  },
  maptext : {
    fontWeight:'bold',
    fontSize:16,
  },
  inputBox: {
    flexGrow: 0.1,
    width:width-20,
    backgroundColor:'#ffffff',
    borderWidth:1,
    borderRadius:5,
    paddingHorizontal:16,
    fontSize:16,
    color:'#000000',
    marginVertical: 10,
    paddingHorizontal:16,
    height:30
  },
  button1: {
      width:100,
      height:30,
      backgroundColor:'#426bb1',
      borderRadius: 5,
      marginVertical: 5,
      paddingVertical: 5,
      margin: 3,
      marginLeft: 2,
  },
  
  button2: {
      width:100,
      height:30,
      backgroundColor:'#426bb1',
      borderRadius: 5,
      marginVertical: 5,
      paddingVertical: 5,
      margin: 3,
  },
  button3: {
      width:100,
      height:30,
      backgroundColor:'#426bb1',
      borderRadius: 5,
      marginVertical: 5,
      paddingVertical: 5,
      margin: 3,
  },
  buttonText: {
    fontSize:12,
    fontWeight:'800',
    color:'#ffffff',
    textAlign:'center'
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
  flatview: {
    flex:1,
    justifyContent: 'center',
    borderRadius: 2,
    flexGrow:3,
    backgroundColor:'#fff',
    margin: 5,
    padding: 5,
    borderRadius: 2,
    borderColor: '#9f9f9f',
    borderBottomWidth: 0,
    height:height,
    color:"#000"
  },
  certifiedheadline: {
    justifyContent: 'center', 
    alignItems: 'center' ,
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    width: 'auto',
    backgroundColor: 'white',
  },
  ImageStyle: {
    flex:1,
    width: width,
    height:height,
    resizeMode:'center',
  },
  nearestPlace: {
    width: width,
    borderBottomWidth :1,
    borderBottomColor: '#5d90ef',
  }, 
  nearestPlaceText : {
    fontWeight:'bold',
    fontSize:17,
    color:'grey',
    justifyContent:'center',
    alignItems: 'center',
    textAlign:'center',
  },
  takenPlace: {
    width: width,
    borderBottomWidth :1,
    borderBottomColor: '#5d90ef',
  }, 
  takenPlaceText : {
    fontWeight:'bold',
    fontSize:17,
    color: '#5d90ef',
    justifyContent:'center',
    alignItems: 'center',
    textAlign:'center',
  },
  belowPlace: {
    width: width,
    borderBottomWidth :1,
    borderBottomColor: '#5d90ef',
  }, 
  belowPlaceText : {
    fontWeight:'bold',
    fontSize:17,
    color: '#5d90ef',
    justifyContent:'center',
    alignItems: 'center',
    textAlign:'center',
  },
  ignoredPlace: {
    width: width,
    borderBottomWidth :1,
    borderBottomColor: '#5d90ef',
  }, 
  ignoredPlaceText : {
    fontWeight:'bold',
    fontSize:15,
    color: '#5d90ef',
    justifyContent:'center',
    alignItems: 'center',
    textAlign:'center',
  },
});
