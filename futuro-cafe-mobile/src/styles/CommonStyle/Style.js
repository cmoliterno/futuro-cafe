import { StyleSheet } from 'react-native';
import { SF, SH, SW, Fonts, Colors } from '../../utils';

export default StyleSheet.create({
  inputBox:{
    width:"100%",
    height:SH(50),
    borderRadius:SH(10),
    borderWidth:SH(0.5),
    backgroundColor:Colors.light_theme_background,
    alignItems:'center',
    paddingHorizontal:SH(20),
    borderColor:Colors.theme_background,
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom: 10,
},
editiconStyle:{
  color:Colors.theme_background

},
DateTextStyle:{
  fontSize:SF(18),
  fontFamily:Fonts.Poppins_MediumItalic,
  color:Colors.gray_text_color,

},
  ScrollViewStyles: {
    width: '100%',

  },
  BottomImageShapp: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: SH(170),

  },
  MapStyleset: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: SH(10),
    borderRadius: SW(20),
  },
  ButtonCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uri: {
    width: SW(200),
    height: SH(100)
  },
  LeftIconLeftStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  PaddingVertical: {
    PaddingVertical: SH(10)
  },
  PaddingHorizontal: {
    paddingHorizontal: SH(15)
  },
  PaddingHorizontal5: {
    paddingHorizontal: SH(5)
  },
  headerStyle: {
    backgroundColor: Colors.theme_background,
  },
  headerTitleStyle: {
    color: Colors.white_text_color,
    fontSize: SF(25),
    fontWeight:'700'
  },
  MinViewContent: {
    width: '100%',
    height: '100%',
    paddingHorizontal:SH(20)

  },
  MinViewContent1: {
    width: '100%',
    height: '100%',

  },
  MinViewContentFuill: {
    width: '100%',
    height: '100%',
  },
  ScrollViewStyle: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  Container: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  FlexRowPassword: {
    width: '100%',
    borderRadius: SH(7),
    flexDirection: 'row',
    backgroundColor: Colors.white_text_color,
    height: SH(50),
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black_text_color,
  },
  IconPostionAbolute: {
    position: 'absolute',
    right: SH(30),
    height: SH(50),
    flexDirection: 'row',
    alignItems: 'center'
  },
  IconPostionAboluteTwo: {
    position: 'absolute',
    right: SH(30),
    height: SH(50),
    top: SH(37),
    flexDirection: 'row',
    alignItems: 'center'
  },
  CountryCodeIconCenter: {
    position: 'absolute',
    left: SH(30),
    height: SH(50),
    zIndex: 89,
    top: SH(30),
    flexDirection: 'row',
    alignItems: 'center'
  },
  PaddingLeftCountryInput: {
    // paddingLeft: SH(90)
  },
  SearchInputBorder: {
    borderWidth: SH(0),
  },
  CenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  CentrViewMin: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: Colors.white_text_color
  },
  ModalView: {
    backgroundColor: Colors.white_text_color,
    borderRadius: SH(7),
    shadowColor: Colors.black_text_color,
    shadowOffset: {
      width: SW(0),
      height: SH(2)
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: SH(20),
    width: '95%',
  },
  setbgcolorgrsay: {
    backgroundColor: Colors.gray_text_color,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: Platform.OS === 'ios' ? 2 : 0.9,
  },
  CenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkiconright: {
    borderWidth: 3,
    height: SW(80),
    width: SW(80),
    borderRadius: SH(100),
    flexDirection: 'row',
    borderColor: Colors.theme_background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  setroundcenter: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  setbackgroundicon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  registertextset: {
    paddingTop: SH(25),
    paddingBottom: SH(0),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  settext: {
    color: Colors.black_text_color,
    fontSize: SF(20),
    paddingHorizontal: SH(20),
    textAlign: 'center',
    fontFamily: Fonts.Poppins_Medium,
  },
  setokbutton: {
    width: '47%'
  },
  PaddingHorizontal5:{
  },
  buttonminview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SH(40),
    paddingTop: SH(20),
  },
  MinViewStyleSplash: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: '100%'
  },
  SearchHomeTab: {
    width: '100%',
    backgroundColor: 'transperent',
    shadowColor: "transperent",
    shadowOffset: {
      width: SW(0),
      height: Platform.OS === 'ios' ? 0 : 0,
    },
    shadowOpacity: 0,
    shadowRadius: Platform.OS === 'ios' ? 0 : 0,
    elevation: Platform.OS === 'ios' ? 0 : 0,
    color: Colors.theme_background,
    fontFamily: Fonts.Poppins_Regular,
  },
  MinViewScreen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  MinViewScreenHome: {
    height: '100%',
  },
  container: {
    width: '100%',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heightset: {
    height: 'auto',
  },
  SplashMinView: {
    height: '100%',
    backgroundColor: Colors.white_text_color,
  },
  ScrollViewTestHeight: {
    width: '100%',
    height: 'auto'
  },
  buttonotp: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  CallIconView: {
    width: SW(40),
    height: SH(43),
    flexDirection: 'row',
    borderRadius: SH(200),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white_text_color,
    marginRight: SH(20)
  },
  RemoveBgColor: {
    backgroundColor: Colors.white_text_color
  },
  RemoveBgColorTwos: {
    backgroundColor: Colors.theme_background
  },
  InputViewWidth: {
    width: '100%'
  },
  PostionAbsoluteIcon: {
    position: 'absolute',
    top: SH(20),
    left: SH(20),
    zIndex: 9
  },
  BgColorWhite: {
    backgroundColor: Colors.theme_background,
    height: SH(44),
    width: SW(40),
    borderRadius: SH(200),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  BgColorWhiteAll: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white_text_color,
  },
  datetextstyles: {
    color: Colors.gray_text_color,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(17)
  },
  FlexEditView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: SH(50),
    backgroundColor: '#f1f5ff',
    borderRadius:SH(10),
    paddingHorizontal: SH(20),
    borderWidth: SH(0.5),
    borderColor: Colors.theme_background
  },
  inputUnderLine: {
    paddingHorizontal: SH(10)
  },
  inputStyle:{
    backgroundColor:Colors.light_theme_background,
    borderRadius:SH(10),
    borderWidth:SH(0.5),
    borderColor:Colors.theme_background
  },
  inputStyle2:{
    backgroundColor:Colors.light_theme_background,
    borderRadius:SH(100),
    borderWidth:SH(0.5),
    borderColor:Colors.theme_background
  }
});
