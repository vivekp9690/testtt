import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet,NetInfo,Image,Dimensions,ActivityIndicator } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import {splashAPIKey} from "../config/constant";

import {Actions} from 'react-native-router-flux';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class App extends Component {
  

  constructor(props) {
    super(props);
        this.state = {
          location: null,
          errorMessage: null,
          distance:"",
          place:"",
          splashName:"",
          splashImage:"",
          loading:true,
          placesArray:[]
        };
   
                    
  }
  componentWillMount() {

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

    
  }

  distance(lat2, lon2) {

    var lat1=this.state.location.coords.latitude;
    var lon1=this.state.location.coords.longitude;
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
    
    return dist;
  } 


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
       
  };

  
  getAllNearByPlaces = async()=>{


    // let types = ['strDmart','strBrandFactory','strKroger', 'strCostco', 'strPublix', 'strWawa', 'strWalmart', 'strTrader', 'strThefresh', 'strWholefoods', 'strStartBucks', 'strChipotle', 'strAlfalfas', 'strCosmoProf', 'strCvsPharmacy', 'strDunkinDonuts', 'strGNCLiveWell', 'strPaneraBread',' strPetSupermarket', 'strSaloncentric', 'strWalgreens']

    let types = ['strKroger', 'strCostco', 'strPublix', 'strWawa', 'strWalmart', 'strTrader', 'strThefresh', 'strWholefoods', 'strStartBucks', 'strChipotle', 'strAlfalfas', 'strCosmoProf', 'strCvsPharmacy', 'strDunkinDonuts', 'strGNCLiveWell', 'strPaneraBread',' strPetSupermarket', 'strSaloncentric', 'strWalgreens']
    
    var countTypes=0;  
    for (let type of types){
        
       await this.getNearByStore(type)
       
        countTypes++;

        if(types.length == countTypes && this.state.placesArray.length > 0)
        {
            this.state.placesArray.sort(function(a, b) {
                return a.distance - b.distance;
            });
            
            console.log("passed location lat: "+this.state.location.coords.latitude+" long: "+this.state.location.coords.longitude)
            console.log("sorted array..............................")
            console.log(this.state.placesArray);

            console.log("final splash screen near 100 meters..............................")

            console.log(this.state.placesArray[0]);
            this.setState({"splashName":this.state.placesArray[0].splashName})
            this.setState({"place":this.state.placesArray[0].place})
            this.setState({'loading':false})
        }
        else if(types.length == countTypes && this.state.placesArray.length <= 0)
        {
            this.setState({"splashName":"normal"})
            this.setState({'loading':false})
        }  
    } 
    
  }
 
  getNearByStore= async (place) => {
    var curLattitude=this.state.location.coords.latitude;
    var curLongiture=this.state.location.coords.longitude;
    
    
    // var curLattitude=26.44045;
    // var curLongiture=-80.07014;

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


    var splashName = "normal"
    if(place == 'strDmart') splashName = "D Mart";
    if(place == 'strBrandFactory') splashName="Brand Factory";
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
       

    var strUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+curLattitude+","+curLongiture+"&radius=100&type=store&name="+splashName+"&sensor=true&key="+splashAPIKey
        
        if (place == 'strChipotle') {//Set type = restaurant
            strUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+curLattitude+","+curLongiture+"&radius=100&type=restaurant&name="+splashName+"&sensor=true&key="+splashAPIKey
        } else if (place == 'strCvsPharmacy') { //Set type = pharmacy
            strUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+curLattitude+","+curLongiture+"&radius=100&type=pharmacy&name="+splashName+"&sensor=true&key="+splashAPIKey
        } else if (place == 'strDunkinDonuts' || place == 'strPaneraBread') { //Set type = food
            strUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+curLattitude+","+curLongiture+"&radius=100&type=food&name="+splashName+"&sensor=true&key="+splashAPIKey
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
                        // console.log(".......................................result")
                        // console.log(responseJson.results);
                        
                        var validStores = 0
                        if(responseJson.results.length > 0)
                        {

                          for (let results of responseJson.results){
                          
                              
                              var isValidStore = false
                              var resultName="";
                              switch (place) {
                              case 'strDmart':
                                    
                                  if (results.name.toLowerCase().includes("d mart")) {
                                    isValidStore = true;
                                    resultName=results.name;
                                  } 
                            case 'strBrandFactory':
                                    
                                  if (results.name.toLowerCase().includes("brand factory")) {
                                    isValidStore = true;
                                    resultName=results.name;
                                  }   
                              case 'strCostco':
                                  
                                  if (results.name.toLowerCase().includes("costco")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strThefresh':
                                  if (results.name.toLowerCase().includes("fresh") && results.name.toLowerCase().includes("market")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strKroger':
                                  if (results.name.toLowerCase().includes("kroger")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strPublix':
                                  if (results.name.toLowerCase().includes("publix")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strTrader':
                                  if (results.name.toLowerCase().includes("trader")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strWalmart':
                                  if (results.name.toLowerCase().includes("walmart")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strWawa':
                                  if (results.name.toLowerCase().includes("wawa")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strWholefoods':
                                  if (results.name.toLowerCase().includes("whole") && results.name.toLowerCase().includes("foods")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strStartBucks':
                                  if (results.name.toLowerCase().includes("starbucks")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strChipotle':
                                  if (results.name.toLowerCase().includes("chipotle") && results.name.toLowerCase().includes("grill")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strAlfalfas':
                                  if (results.name.toLowerCase().includes("alfalfa")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strCosmoProf':
                                  if (results.name.toLowerCase().includes("cosmoprof")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strCvsPharmacy':
                                  if (results.name.toLowerCase().includes("cvs") && results.name.toLowerCase().includes("pharmacy")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strDunkinDonuts':
                                  if (results.name.toLowerCase().includes("dunkin") && results.name.toLowerCase().includes("donut")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strGNCLiveWell':
                                  if (results.name.toLowerCase().includes("gnc")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strPaneraBread':
                                  if (results.name.toLowerCase().includes("panera") && results.name.toLowerCase().includes("bread")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strPetSupermarket':
                                  if (results.name.toLowerCase().includes("pet") && results.name.toLowerCase().includes("supermarket")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strSaloncentric':
                                  if (results.name.toLowerCase().includes("salon") && results.name.toLowerCase().includes("centric")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              case 'strWalgreens':
                                  if (results.name.toLowerCase().includes("walgreens")) {
                                      isValidStore = true;
                                      resultName=results.name;
                                  }
                              default:break
                              }
                              
                              if (isValidStore) {
                                  validStores += 1
                                  var distance=this.distance(results.geometry.location.lat,results.geometry.location.lng);  
                                  var objPlace={
                                      place:place,
                                      splashName:splashName,
                                      distance:distance

                                  }
                                  

                                
                                  this.setState(prevState => ({
                                    placesArray: [...prevState.placesArray, objPlace]
                                  }))  
                                
                                 
                              }
                          }
                        } 
                        
                        

                    
                  })
                  .catch((error) => {
                    console.error(error);
                    
                  }); 
  }

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    
    if(this.state.splashName != "")
    {
      setTimeout(() => {
        console.log('Open')
        Actions.login()
      }, 2000)
    }
    let image ="";
    if(this.state.place == 'strCostco') image=require('../../assets/images/Splash/costco.imageset/1536x2048.png');
    else if(this.state.place == 'strDmart') image=require('../../assets/images/Splash/dmart.imageset/dmart.png');
    else if(this.state.place == 'strBrandFactory') image=require('../../assets/images/Splash/dmart.imageset/Brand-Factory.png');
    else if(this.state.place == 'strThefresh') image=require('../../assets/images/Splash/freshMarket.imageset/1536x2048.png');
    else if(this.state.place == 'strKroger') image=require('../../assets/images/Splash/krogermart.imageset/1536x2048.png');
    else if(this.state.place == 'strPublix') image=require('../../assets/images/Splash/publix.imageset/1536x2048.png');
    else if(this.state.place == 'strTrader') image=require('../../assets/images/Splash/traderjoes.imageset/1536x2048.png');
    else if(this.state.place == 'strWalmart') image=require('../../assets/images/Splash/walmart.imageset/1536x2048.png');

    else if(this.state.place == 'strWawa') image=require('../../assets/images/Splash/wawa.imageset/1536x2048.png');
    else if(this.state.place == 'strWholefoods') image=require('../../assets/images/Splash/wholefoods.imageset/1536x2048.png');
    else if(this.state.place == 'strStartBucks') image=require('../../assets/images/Splash/starbucks.imageset/1536x2048-Recovered.jpg');
    else if(this.state.place == 'strChipotle') image=require('../../assets/images/Splash/chipotle.imageset/1536x2048.jpg');

    else if(this.state.place == 'strAlfalfas') image=require('../../assets/images/Splash/alfalfas.imageset/1536x2048.jpg');
    else if(this.state.place == 'strCosmoProf') image=require('../../assets/images/Splash/cosmoProf.imageset/1536x2048-Recovered.jpg');
    else if(this.state.place == 'strCvsPharmacy') image=require('../../assets/images/Splash/cvsPharmacy.imageset/1536x2048.jpg');
    else if(this.state.place == 'strDunkinDonuts') image=require('../../assets/images/Splash/dunkinDonuts.imageset/1536x2048.jpg');

    else if(this.state.place == 'strGNCLiveWell') image=require('../../assets/images/Splash/gncLiveWell.imageset/1536x2048-Recovered.jpg');
    else if(this.state.place == 'strPaneraBread') image=require('../../assets/images/Splash/paneraBread.imageset/1536x2048-Recovered.jpg');
    else if(this.state.place == 'strPetSupermarket') image=require('../../assets/images/Splash/petSupermarket.imageset/1536x2048-Recovered.jpg');
    else if(this.state.place == 'strSaloncentric') image=require('../../assets/images/Splash/salonCentric.imageset/1536x2048-Recovered.jpg');
    else if(this.state.place == 'strWalgreens') image=require('../../assets/images/Splash/walgreens.imageset/1536x2048.jpg');
    else if(this.state.splashName == 'normal') image=require('../../assets/images/Splash/normal.imageset/1536x2048.png');             


    return (
      <View style={styles.container}>
        {(image != "" && 
        <Image 
              source={image} 
              style={styles.ImageStyle} 
              /> 
        )} 
        {(this.state.loading && 
        <Image 
              source= {require('../../assets/images/GIFVerity.gif') }
              style={styles.gifImageStyle} 
              /> 
        )}                    
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  ImageStyle: {
    flex:1,
    width: width,
    height:height,
    resizeMode:'cover',
  },
  gifImageStyle:{
    flex:1,
    resizeMode:'center',
    
  },
  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:40,
    paddingHorizontal:'50%'
  },
});