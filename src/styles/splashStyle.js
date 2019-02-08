import { StyleSheet,Dimensions } from "react-native"


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
export default StyleSheet.create({
   mainContainer:{  
   backgroundColor:'#ffffff',
    alignItems:'center',
    justifyContent :'center',
    height:height,
    
    
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
  logoContainer : {
    alignItems: 'center',
    
  },
  container : {
    justifyContent:'center',
    alignItems: 'center'
  },
  FacebookStyle: {
    
    // backgroundColor: '#485a96',
    borderWidth: .5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 5 ,
    margin: 0,
    flexDirection:'column',
    justifyContent: 'flex-start',
    
   
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
  ImageIconStyle: {
     padding: 10,
     margin: 5,
     height: 40,
     width: 40,
     borderRadius:5,
     resizeMode : 'stretch',
   
  },
  inputBox: {
    width:width-20,
    backgroundColor:'#ffffff',
    borderWidth:1,
    flexGrow: 0.1,
    borderRadius:5,
    paddingHorizontal:16,
    fontSize:16,
    color:'#000000',
    marginVertical: 10,
    paddingHorizontal:16,
    height:30
  },
  button: {
    width:100,
      backgroundColor:'#426bb1',
      borderRadius: 5,
      marginVertical: 5,
      paddingVertical: 5,
  },
  fbbutton: {
    width:100,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 10
  },
  buttonText: {
    fontSize:18,
    fontWeight:'800',
    color:'#ffffff',
    textAlign:'center'
  },
  signupButton: {
    color:'#426bb1',
    fontSize:16,
    fontWeight:'500'
  },
  forgotPassword: {
    color:'#426bb1',
    fontSize:16,
    fontWeight:'500',
    textAlign:'left',
    padding:10
  }
})