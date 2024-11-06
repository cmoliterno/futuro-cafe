import { StyleSheet, } from 'react-native';
import { SH, Fonts, SW, SF, Colors } from '../../utils';

// export default NotificationStyle = (Colors) => StyleSheet.create({
export default StyleSheet.create({

  flexRowBitwin:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingBottom:SH(20),
    marginVertical:SH(5)
  },
   flexRowStart:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    marginBottom:SH(5)
  },
  flexItemOne:{
    width:'80%',
    flexDirection:'column',
    alignItems:'flex-start',
    textAlign:'left'
  },
  flexItemTwo:{
    width:'20%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  TitelText:{
    fontSize:SF(16),
    fontFamily:Fonts.Poppins_Bold,
    color:Colors.black_text_color_Full
  },
  TitelText2:{
    fontSize:SF(15),
    fontFamily:Fonts.Poppins_Medium,
    color:Colors.gray_text_color
  },
  TitelText3:{
    fontSize:SF(13),
    fontFamily:Fonts.Poppins_Medium,
    color:Colors.black_text_color
  },
  iconStyle:{
    color:Colors.theme_background,
    backgroundColor:Colors.light_theme_background,
    borderWidth:SH(0.5),
    borderColor:Colors.theme_background,
    padding:SH(4),
    borderRadius:SH(10),
    marginRight:SH(10)
  }
});
