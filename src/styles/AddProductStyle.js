import { StyleSheet,Dimensions,Platform } from "react-native"


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
export default StyleSheet.create({

	box: {
    flex: 1,
    height: 130,
    width:150,
    backgroundColor: '#b5bbbf',    
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    alignItems:'center',
    justifyContent:'center',
    
  },
  textAreaContainer: {
    borderColor: 'blue',
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start",
    textAlignVertical: "top"
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
  fileUploadIcon:{
      padding: 10,
      margin: 5,
      height: 50,
      width: 50,
      borderRadius:5,
      resizeMode : 'stretch',
  },
  mainContainer : {
    backgroundColor:'#ffffff',
    height:height,
    alignItems:'center',
    justifyContent :'center',
    paddingHorizontal:2
  },
  container : {
    justifyContent:'flex-start',
    alignItems: 'flex-start',
    backgroundColor:'#ffffff',
    width:width,
    // height:height,
    paddingHorizontal:5 
  },
  row: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingBottom: Platform.OS === 'ios' ? 10 : 15,
    // height: Platform.OS === 'ios' ? '100%' : 300,
  },
  modelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding:8,
    borderBottomWidth:1,
    borderBottomColor:'#CED0CE',
  },
  modelLastRow:{
    flexDirection: 'row',
    justifyContent: 'center',
    padding:8,
  },
  modelText:{
    color:'#3779c2',
    fontSize:17,
    fontFamily: 'sansserif'
  },
  flatListRow:{
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    width:150,
    height:100,
    marginTop:10,
    marginRight:10,
    marginBottom:3
  },
  labelText : {
    marginVertical: 15,
    fontSize:20,
    fontFamily: 'sansserif',
    color:'#000',
  },
  fieldLabelText : {
    fontSize:20,
    color:'#000',
    
  },
  inputBox: {
    flexGrow: 0.1,
    width:width-20,
    height:30,
    backgroundColor:'#ffffff',
    borderWidth:1,
    borderRadius:5,
    borderColor:'#000',
    fontSize:16,
    fontFamily: 'sansserif',
    color:'#000000',
    marginVertical: 10,
    paddingHorizontal:16,
  },
  pickerBox: {
    flexGrow: 0.1,
    width:width-20,
    // height:30,
    // backgroundColor:'#ffffff',
    // borderWidth:1,
    // borderRadius:5,
    // borderColor:'#000',
    
  },
  pickerBoxIOS: {
    flexGrow: 0.1,
    width:width-20,
    marginTop:0,
    // borderWidth:1,
    // borderRadius:5,
    // borderColor:'#000',
  },
  btn: {
    flex:1,    
    backgroundColor:'#4ac0f7',
    width:80,
    borderRadius: 5,
    margin: 10,
    padding:5,
    height:40,
  },
  buttonText: {
    fontSize:20,
    fontFamily: 'sansserif',
    fontWeight:'300',
    color:'#ffffff',
    textAlign:'center',
    height:40, 
  },

  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:40,
    paddingHorizontal:'50%'
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
  footer:{
    position: 'absolute', left: 0, right: 0, bottom: 0
  }
})