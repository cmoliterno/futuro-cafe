import { Fonts, SH, SW, SF, Colors, widthPercent } from '../../utils';
import { StyleSheet } from 'react-native';

export default PaymentsStyle = (Colors) => StyleSheet.create({
  MinViewBgcolorWhite: {
    backgroundColor: Colors.white_text_color,
    width: '95%',
    height: '100%',
    marginHorizontal: SH(10),
    borderRadius: SH(10),
    paddingHorizontal: SH(20),
    paddingVertical: SH(20)
  },
  CreditCardTextStyle: {
    color: Colors.black_text_color,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(20)
  },
  EnterCardNumber: {
    color: Colors.blue_color,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(15)
  },
  ImageUpiStyle: {
    width: SW(30),
    height: SW(30),
    marginLeft: SH(20)
  },
  GooglepayImageStyle: {
    width: SW(50),
    height: SW(50),
  },
  Payplestyles: {
    width: SW(40),
    height: SW(40),
  },
  PaytmLogoImage: {
    width: SW(60),
    height: SW(60),
    marginLeft: SH(10)
  },
  MinViewFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: SH(10),
    paddingHorizontal: SH(15),
    paddingVertical: SH(7),
    borderColor: Colors.light_gray_text_color,
  },
  ImageFlexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  SetPlusBorder: {
    borderWidth: 1,
    width: SW(35),
    height: SW(35),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.light_gray_text_color,
    borderRadius: 5,
    left: SH(20)
  },
  UPIDTextStylew: {
    color: Colors.gray_text_color,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(14)
  },
  PaytmText: {
    color: Colors.gray_text_color,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(14),
    top: SH(-10)
  },
  CenterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CenterImageandText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  SetPadding: {
    paddingLeft: SH(30)
  },
  TopBottomBorderSet: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.light_gray_text_color,
    paddingBottom: SH(15)
  },
  payviacard: {
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(24),
    color: Colors.black_text_color,
  },
  FlexRowCloseIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: SH(20),
    paddingHorizontal: SH(20),
    paddingTop: SH(15)
  },
  TitleStyle: {
    color: Colors.gray_text_color,
    fontSize: SF(17),
    fontFamily: Fonts.Poppins_Regular
  },
  FlexRowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SH(-10)
  },
  Width70: {
    width: '60%'
  },
  Width30: {
    width: '40%'
  },
  CenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray_text_color,
  },
  IconClose: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    top: SH(-15),
  },
  ModalView: {
    backgroundColor: Colors.white_text_color,
    borderRadius: SH(10),
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  MinPaymentsView: {
    width: '100%',
  },
  ButtonView: {
    paddingHorizontal: SH(17),
    paddingBottom: SH(20)
  },
  InputColor: {
    color: Colors.gray_text_color
  },
  BgcolorWhite: {
    backgroundColor: Colors.white_text_color,
    marginHorizontal: SH(20),
    paddingHorizontal: SH(20),
    borderRadius: SH(10)
  },
  Lootianimation: {
    width: SW(250),
    height: SW(250)
  },
  BackWhite: {
    backgroundColor: Colors.white_text_color,
    marginTop: SH(-70),
    width: SW(150),
    height: SW(150),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 300
  },
  CenterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  TextySytyles: {
    color: Colors.black_text_color,
    fontFamily: Fonts.Poppins_Bold,
    fontSize: SF(27),
    textAlign:'center'
  },
  TextySytylesTwo: {
    color: Colors.theme_background,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(25),
    textAlign:'center'
  },
  ParegraphText: {
    color: Colors.black_text_color,
    fontFamily: Fonts.Poppins_Italic,
    fontSize: SF(18),
    textAlign:'center'
  },
  DateTewxtStyle: {
    color: Colors.gray_text_color,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(18),
    textAlign:'center'
  }
});