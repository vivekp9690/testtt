import React, { Component } from 'react';
import I18n from 'react-native-i18n';
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
  Image ,
  Button,
  FlatList,
  ActivityIndicator,
  Platform,
  Keyboard,
  NativeModules,
  Picker,
  ScrollView,
  NetInfo
} from 'react-native';

import en from './en.json';
import fr from './fr.json';



 I18n.language = [
      {lang: "English", code:"en"},
      {lang: "French", code:"fr"},
        
    ]
    
I18n.fallbacks=true;
I18n.translations = {
  en,
  fr
 
};


I18n.locale = 'en';


 export const switchLanguage = (lang, component) => {
   I18n.locale = lang;
   component.forceUpdate();
};

I18n.switchLanguage = () => {
    const index = I18n.langs.indexOf(I18n.locale);
    if (index === I18n.langs.length - 1)
        I18n.locale = I18n.langs[0];
    else
        I18n.locale = I18n.langs[index + 1];
};




export default class New extends Component<{}> {
  
    constructor(props) {
      super(props);
        this.state = {
          languages:[],
          langValue:"en",
          select:"Select Langauge"     
        }
       this.onLanguage = this.onLanguage.bind(this);
    }

  onSetRuLang = (text) => {
   
    switchLanguage('fr', this);
    I18n.locale = 'fr';

  };
  onSetRuLang1 = (text) => {
   
    switchLanguage('en', this);
    I18n.locale = 'en';

  };

  onSelectLanaguage(text)
  {
    this.setState({
      value:false,
      select:Text.lang,
    })
    I18n.local = Text.code;
  }
    onLanguage()
    {
      
      this.setState({
        value:true,
      })
    } 


    return(
     
      <View style={styles.mainContainer}>
    
            <Text>{I18n.locale}</Text>

            <View style={styles.button, styles.row1}>
            <Button title='FR' onPress={this.onSetRuLang} />
            <Button title='EN' onPress={this.onSetRuLang1} />
            </View>       
      
      </View> 

      )
  
}


const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    margin: 3,
    borderRadius: 2,
  },
  
  flatview: {
    justifyContent: 'center',
    // paddingTop: 30,
    borderRadius: 2,
    flexGrow:3,
    backgroundColor:'#d3ecff',
    margin: 5,
    padding: 5,
  
    borderColor: '#9f9f9f',
    borderBottomWidth: 0,    

  },

  
  upcCodeView:
  {
    borderBottomWidth: 1,
    borderColor:'#a0a0a0',
    flexDirection: "row"
    
   ,
    // justifyContent: 'space-between',
    
  },
  innerView:
  {
    
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent: 'space-between',
    
  },
  
  codeLabel: {
    color:'#08914d',
    fontWeight:'bold',
    fontSize:18
  },
  codeValue: {
    fontSize:18,
    color:'#2278bf'
    // alignSelf: 'flex-start',
  },
  categoryLabel: {
    color:'#878787',
    fontSize:18
  },
  categoryValue: {
    fontSize: 14,
   
    color:'#08914d',
    flexWrap: 'wrap',
    width:'60%'
    // alignSelf: 'flex-start',
  },
  productName:{
    color:'#257fca',
    fontWeight:'bold',
    fontSize:18,
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
    paddingHorizontal:10,
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
    height:150
  },
  imageBox: {
    flex: 1,
    height: 100,
    backgroundColor: '#333'
  },  

  mainContainer : {
    backgroundColor:'#ffffff',
    height:height,
    alignItems:'center',
    justifyContent :'center'
  },
  
  inputBox: {
    flexGrow: 0.1,
    width:'100%',
    backgroundColor:'#ffffff',
    borderWidth:0.6,
    borderRadius:5,
    fontSize:16,
    color:'#000000',
    alignSelf:'flex-start',
    paddingHorizontal:10,
  },
  button: {
    width:100,
    height:33,
    borderRadius: 5,
    borderWidth:0.6,
    // marginVertical: 2,
    // paddingVertical: 2,
    // top:0
  },
  buttonText: {
    fontSize:18,
    textAlign:'center',
    marginVertical: 2,
    paddingVertical: 2,
  },
  Dropdown: {
    width: '100%',
    display: 'flex',
    
  },
  mainthree:{

  },

  row1:{

width: '100%',
height:60,
  },
Dropdownmain: {
paddingLeft: 15,
paddingRight: 15,
width: '100%',
  },
srhcls: {
  flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop: 10,
},
 ImageIconStyle: {
     marginTop: 5,
     paddingTop: 10,
     height: 40,
     width: 40,
     borderRadius:5,
     resizeMode : 'stretch',
  },

  
});
