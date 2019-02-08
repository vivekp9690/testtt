import { StyleSheet,Dimensions } from "react-native"

const opacity = 'rgba(0, 0, 0, .6)';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
export default StyleSheet.create({

	headerStyle:{
    position:'absolute',
    flexDirection:'row',
    width:width,
    alignSelf:'flex-start',
    justifyContent: 'space-between',
    paddingTop:28,
    paddingBottom:2,
    paddingHorizontal:10,
  },
  ImageIconStyle: {
    //  padding: 10,
    //  margin: 5,
    //  marginTop: 5,
    //  paddingTop: 10,
     height: 40,
     width: 40,
     borderRadius:5,
     resizeMode : 'stretch',
   
  },
  flashImageIconStyle: {
    //  padding: 10,
    //  margin: 5,
    //  marginTop: 5,
    //  paddingTop: 10,
     height: 50,
     width: 50,
     borderRadius:5,
     resizeMode : 'stretch',
   
  },
  mainContainer : {
    backgroundColor:'transparent',
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
  container: {
    flex: 1,
    flexDirection: 'column',
    top:0,
    height:height
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity,
    flexDirection:'row',
    width:width,
    alignSelf:'flex-start',
    justifyContent: 'space-between',
    paddingTop:28,
    paddingBottom:2,
    paddingHorizontal:10,
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: .2,
    backgroundColor: opacity
  },
  focused: {
    flex: 10,
    justifyContent:'center',
    width:width
  },
  layerRight: {
    flex: .2,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity
  },
  
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
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