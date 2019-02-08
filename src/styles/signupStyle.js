import { StyleSheet,Dimensions } from "react-native"


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
export default StyleSheet.create({

	
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


  container : {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#ffffff'
  },
  labelText : {
    marginVertical: 15,
    fontWeight:'bold',
    fontFamily:'sansserifBold',
    fontSize:20,
    color:'#426bb1'
  },
  inputBox: {
    flexGrow: 0.1,
    width:width-20,
    backgroundColor:'#ffffff',
    borderWidth:1,
    borderRadius:5,
    fontSize:16,
    fontFamily: 'sansserif',
    color:'#000000',
    marginVertical: 10,
    paddingHorizontal:16,
    height:30
  },
  button: {
    width:130,
    backgroundColor:'#426bb1',
    borderRadius: 5,
    marginVertical: 5,
    paddingVertical: 5
  },
  buttonText: {
    fontSize:18,
    fontFamily: 'sansserifBold',
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
  }
})