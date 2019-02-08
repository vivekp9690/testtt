import { StyleSheet,Dimensions,Platform } from "react-native"


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
export default StyleSheet.create({

	logo: {
    backgroundColor: '#045781',
    alignItems:'center',
    justifyContent:'center',
    height:'15%',
    marginTop:0
  },
  logoImage: {
    width: '70%',
    height: '70%',
    borderRadius:5
  },
  setting: {
    backgroundColor: '#ffffff',
    alignItems:'flex-end',
    justifyContent:'flex-end',
    left:0,
    paddingRight:4,
    paddingTop:3,
    paddingHorizontal:'0%'
  },
  imageBox: {
    
    height: 100,
    backgroundColor: '#333'
  },

  row: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:height > 950 ? 7:10,
    width:'auto',
    height:height > 950 ? '100%':'auto',
  },
  row2:{
    paddingHorizontal: '1%',
  },
  box_new: {
    flex: height > 950 ? 1:2 ,
    height:  '100%',
    width:'100%',
    marginLeft: 4,
    marginRight: 4,
  }, 
  image: {
    flex:height > 950 ? 1:2 ,
    resizeMode:'cover',

  },
  textView:{
    top: height > 950 ? '80%':'73%',
    flex:1,
    bottom:0,
    justifyContent:'center',
    width:'100%',
    alignItems:'center',
    position: 'absolute',
    backgroundColor:'rgba(0, 0, 0, 0.1)'

  },
  btnText:{
    color:'#fff',fontSize:Platform.OS === 'ios' ? 17 :16,padding:'1%'
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
    fontSize:17
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
})