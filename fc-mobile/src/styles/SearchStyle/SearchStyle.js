import { Fonts, SH, SW, SF, Colors, widthPercent } from '../../utils';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  contentContainerStyle: {
    width: '100%',
    height: 'auto'
  },
  minstyleviewphotograpgy: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: Colors.white_text_color,
  },
  bgcolorset: {
    backgroundColor: Colors.white_text_color
  },
  minviewsigninscreen: {
    width: '100%',
    height: '100%'
  },
  minflexview: {
    width: '100%',
    height: '100%',
  },
  flexinputstyle: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SH(10),
    marginBottom: SH(100),
  },
  flextextinput: {
    width: '80%',
    borderWidth: SH(1),
    marginHorizontal: SH(20),
    borderRadius: SH(10),
    borderColor: Colors.theme_background
  },
  setinputtext: {
    fontSize: SF(16),
    height: SH(49),
    fontFamily: Fonts.Poppins_Medium,
  },
  seticonborder: {
    paddingHorizontal: SW(15),
    backgroundColor: Colors.white_text_color,
    borderRadius: SW(13),
    height: SH(50),
    justifyContent: 'center',
    alignItems: 'center'
  },
  setbgcolorred: {
    height: SH(200),
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: Colors.theme_background
  },
  setbgcolorviewmin: {
    backgroundColor: Colors.white_text_color,
    borderTopLeftRadius: SW(20),
    borderTopRightRadius: SW(20),
    position: 'relative',
    top: SH(-40),
    paddingLeft: SW(30),
    paddingTop: SH(30),
  },
  textstylesearches: {
    fontSize: SF(20),
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.black_text_color,
    fontWeight: '700',
    paddingBottom: SH(10),
  },
  flexrowsetsearchicon: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  settextdatapizz: {
    fontSize: SF(17),
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.gray_text_color,
    fontWeight: '600',
    marginLeft: SW(7),
  },
  toptospace: {
    marginTop: SH(50),
  },
  setspacecomeview: {
    marginTop: SH(-80),
  },
  setbgborderview: {
    borderWidth: SW(1),
    borderColor: Colors.white_text_color,
    paddingHorizontal: SH(15),
    paddingVertical: SH(3),
    borderRadius: SW(18),
    marginRight: SW(10),
    marginBottom: SH(20),
  },
  textstyleset: {
    color: Colors.white_text_color,
    fontSize: SF(14),
    fontFamily: Fonts.Poppins_Medium,
  },
  setflex: {
    paddingHorizontal: SW(15),
  },
  bgcolorwhiteset: {
    backgroundColor: Colors.white_text_color,
    borderTopLeftRadius: SW(20),
    borderTopRightRadius: SW(20),
    position: 'relative',
    paddingTop: SH(10),
    height: '100%'
  },
  imagsetstyle: {
    height: SW(50),
    width: SW(50),
    borderRadius: SW(100),
    marginRight: SW(20),
  },
  textboldstyle: {
    color: Colors.theme_background,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(15),
  },
  textflexview: {
    width: '70%',
  },
  textboldstyletwo: {
    color: Colors.gray_text_color,
    fontFamily: Fonts.Poppins_Italic,
    fontSize: SF(15),
  },
  deleverytextunbold: {
    color: Colors.black_text_color,
    fontWeight: '600',
    fontSize: SF(14),

  },
  deleverytextunboldtwo: {
    color: Colors.red,
    fontWeight: '600',
    fontSize: SF(14),
  },
  setflexviewdata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SH(10),
    marginRight: SW(70),
    paddingBottom: SH(10),
    borderBottomWidth: 0.5,
    paddingLeft: SH(10),
    borderColor: Colors.light_gray_text_color,
    width: '100%'
  },
  setdishtext: {
    fontWeight: '600',
    fontSize: SF(15),
    fontFamily: Fonts.Poppins_Medium,
  },
  imgofnew: {
    height: SW(50),
    width: SW(50),
    borderRadius: SW(100),
    marginRight: SW(20),
  },
  pad20: {
    paddingHorizontal: SW(20)
  },
  imagsetstylefredrice: {
    height: SH(50),
    width: SW(50),
    borderRadius: SW(100),
    marginRight: SW(20),
  },
});