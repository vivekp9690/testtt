import { StyleSheet,Dimensions } from "react-native"


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
export default StyleSheet.create({

	headerStyle:{
    flexDirection:'row',
    width:width,
    alignSelf:'center',
    paddingTop:28,
    paddingBottom:2,
    paddingHorizontal:10,
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
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    width:width,
    paddingHorizontal:5
  },
  screenHeight:{
    height:height
  },
  container : {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#ffffff',

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