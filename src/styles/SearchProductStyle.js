import { StyleSheet,Dimensions,Platform } from "react-native"


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
export default StyleSheet.create({

	image: {
    width: 70,
    height: 70,
    margin: 3,
    borderRadius: 2,
  },
  flatcontainer:{
    height:height,
    flex:10,
    marginTop:Platform.OS === 'ios' ? '1%' : '5%',
  },
  flatview: {
    justifyContent: 'center',
    // paddingTop: 30,
    borderRadius: 2,
    flexGrow:3,
    backgroundColor:'#d3ecff',
    margin: 5,
    padding: 5,
    borderRadius: 2,
    borderColor: '#9f9f9f',
    borderBottomWidth: 0,
    

  },
  
  upcCodeView:
  {
    borderBottomWidth: 1,
    borderColor:'#a0a0a0',
    flexDirection: "row",
    
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent: 'space-between',
    
  },
  innerView:
  {
    
    flexDirection: 'row',
    alignItems: 'flex-start',
    width:width
    // justifyContent: 'space-between',
    
  },
  
  codeLabel: {
    color:'#08914d',
    fontWeight:'bold',
    fontSize:18,
    fontFamily:'sansserifBold',
  },
  codeValue: {
    fontSize:18,
    fontFamily: 'sansserif',
    color:'#2278bf'
    // alignSelf: 'flex-start',
  },
  categoryLabel: {
    color:'#878787',
    fontSize:18,
    fontFamily: 'sansserif'
  },
  categoryValue: {
    fontFamily: 'sansserif',
    fontSize:18,
    color:'#08914d',
    flexWrap: 'wrap',
    width:'60%'
    // alignSelf: 'flex-start',
  },
  productName:{
    color:'#257fca',
    fontWeight:'bold',
    fontSize:18,
    fontFamily:'sansserifBold',
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
    paddingHorizontal:10
  },
  rowSearch: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width:width,
    paddingHorizontal:10,
    paddingTop:10
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
    height:150,
    width:width,
    flex:1
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
  container : {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#ffffff',

  },
  inputBox: {
    
    flexGrow: 0.1,
    // // width:250,
    height:40,
    width:width-110,
    backgroundColor:'#ffffff',
    borderWidth:0.6,
    borderRadius:5,
    alignSelf:'flex-start',
    paddingHorizontal:10,
    borderColor:'#71797a',
    justifyContent:'center'
  },
  button: {
    
    flexGrow: 0.1,
    width:80,
    height:40,
    borderRadius: 5,
    borderWidth:0.6,
    borderColor:'#71797a',
    justifyContent:'center'
    // marginVertical: 2,
    // paddingVertical: 2,
    // top:0
  },
  buttonText: {
    fontSize:18,
    fontFamily: 'sansserif',
    textAlign:'center',
    marginVertical: 2,
    paddingVertical: 2,
  },
})