import React, { Component } from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  BackHandler, 
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import Splash from './containers/Splash';

import Login from './containers/Login';
import Signup from './containers/Signup';
import Dashboard from './containers/Dashboard';
import VerityToken from './containers/VerityToken';
import SearchProduct from './containers/SearchProduct';
import AdvanceSearch from './containers/AdvanceSearch';
import ProductDetail from './containers/ProductDetail';
import AboutUs from './containers/AboutUs';
import LocationSearch from './containers/LocationSearch';
import WebViewScreen from './containers/WebViewScreen';
import ReCall from './containers/ReCall';
import ReCallLinkData from './containers/ReCallLinkData';
import AddReview from './containers/AddReview';
import AddReport from './containers/AddReport';
import AddClaim from './containers/AddClaim';
import AllReview from './containers/AllReview';

import BarcodeScannerScreen from './containers/BarcodeScannerScreen';
import AddProduct from './containers/AddProduct';
import OCRScreen from './containers/OCRScreen';

import Chat from './containers/Chat';
import ChatUser from './containers/ChatUser';
import UserList from './containers/UserList';

import Setting from './containers/Setting';
import UpdateProfile from './containers/UpdateProfile';

import Invite from './containers/Invite';
   

export default class Routes extends Component<{}> {

	constructor(props) {
	    super(props);
	    this.state ={ isLoggedIn: false };
	    
	  }

	  componentWillMount() {

	  	// var userId=""
	   //  AsyncStorage.getItem('userId',
	   //  (err,value) => {
	   //  	if(value != "" && value != null)
	   //  	{
	   //  		userId=value;
	   //  		Actions.dashboard();
	   //  	}
	   //  	// else
	   //  	// {
	   //  	// 	Actions.login()
	   //  	// }
	      
	   //  });
	   
	  }
	  
	//   initial={true}
	render() {
		return(

			<Router>
			    <Stack key="root" hideNavBar={true}>
			    
					<Scene key="Splash" component={Splash} title="Splash"  />	
					<Scene key="login" component={Login} title="Login"   />
					<Scene key="dashboard" component={Dashboard} title="Dashboard"/>
					<Scene key="signup" component={Signup} title="Register"   />
					
					<Scene key="VerityToken" component={VerityToken} title="VerityToken" />
					<Scene key="AboutUs" component={AboutUs} title="AboutUs"/>

					<Scene key="LocationSearch" component={LocationSearch} title="LocationSearch"/>
					<Scene key="ReCall" component={ReCall} title="ReCall"/>
					<Scene key="ReCallLinkData" component={ReCallLinkData} title="ReCallLinkData"/>
								
					<Scene key="WebViewScreen" component={WebViewScreen} title="WebViewScreen"/>

					<Scene key="Invite" component={Invite} title="Invite" />
					<Scene key="AdvanceSearch" component={AdvanceSearch} title="AdvanceSearch" />
					<Scene key="SearchProduct" component={SearchProduct} title="SearchProduct"/>
					<Scene key="ProductDetail" component={ProductDetail} title="ProductDetail"  />
					<Scene key="AddReview" component={AddReview} title="AddReview" />
					<Scene key="AddReport" component={AddReport} title="AddReport"  />
					<Scene key="AddClaim" component={AddClaim} title="AddClaim"  />
					<Scene key="AllReview" component={AllReview} title="AllReview" />

					<Scene key="BarcodeScannerScreen" component={BarcodeScannerScreen} title="BarcodeScannerScreen" />
					<Scene key="AddProduct" component={AddProduct} title="AddProduct"  />
					<Scene key="OCRScreen" component={OCRScreen} title="OCRScreen" />

					<Scene key="Chat" component={Chat} title="Chat" />
					<Scene key="ChatUser" component={ChatUser} title="ChatUser" />
					<Scene key="UserList" component={UserList} title="UserList" />

					<Scene key="Setting" component={Setting} title="Setting" />
					<Scene key="UpdateProfile" component={UpdateProfile} title="UpdateProfile" />


			      
			    </Stack>
			 </Router>
			)
	}
}