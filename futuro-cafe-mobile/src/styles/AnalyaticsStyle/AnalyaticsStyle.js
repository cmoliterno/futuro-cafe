import { StyleSheet, } from 'react-native';
import { SH, Fonts, SW, SF, widthPercent, Colors } from '../../utils';

export default AnalyaticsStyle = (Colors) => StyleSheet.create({
  // export default StyleSheet.create({

  MainView: {
    paddingHorizontal: SH(10)
  },
  PleaseEnterDate: {
    fontSize: SF(18),
    color: Colors.black_text_color,
    fontFamily: Fonts.Poppins_Medium,
    // fontWeight: '700',
    paddingHorizontal: SH(20)
  },
  PleaseEnterDateTwo: {
    fontSize: SF(18),
    color: Colors.black_text_color,
    fontFamily: Fonts.Poppins_Medium,
    fontWeight: '700',
  },
  PaddingHorizontal: {
    PaddingHorizontal: SH(15)
  },
  TitleStyle: {
    fontSize: SF(18),
    color: Colors.black_text_color,
    fontWeight: '700',
    paddingBottom: SH(5),
  },
  CaptureImageSet: {
    height: SH(70),
    width: SW(70),
    borderRadius: SH(10),
  },
  FlexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.light_gray_text_color,
    borderStyle: 'dashed',
    paddingBottom: SH(20),
    paddingHorizontal: SH(15)

  },
  FlexRowTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: Colors.light_gray_text_color,
    borderStyle: 'dashed',
    paddingBottom: SH(20),
    paddingHorizontal: SH(15)
  },
  PlayVideoView: {
    position: 'absolute',
    right: 0,
    top: '30%',
    left: '40%',
    bottom: 0,
  },
  FlexRowPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  FlexRowCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: SH(30)
  },
  NavigationButtons: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 346,
    bottom: SH(0),
    paddingHorizontal: SH(20),
    backgroundColor: Colors.white_text_color,
    paddingBottom: SH(15),
    paddingTop: SH(5)
  },
  PreviousButton: {
    backgroundColor: Colors.theme_background,
    height: SH(40),
    borderRadius: 300,
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  PreviousTextStyle: {
    color: Colors.white_text_color,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(17),
    fontWeight: '800'
  },
  ImmageHeight: {
    height: SH(130),
    width: '100%'
  },
  BackgroundView: {
    width: widthPercent(15),
    height: SH(7),
    backgroundColor: Colors.theme_background,
    borderRadius: 300,
  },
  BackgroundViewTwo: {
    width: widthPercent(15),
    height: SH(7),
    backgroundColor: Colors.gray_text_color,
    borderRadius: 300,
  },
  FlexViewBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SH(20)

  },
  Thankyou: {
    width: widthPercent(15),
    height: SH(7),
    backgroundColor: Colors.theme_background,
    borderRadius: 300,
  },
  PaddingHori: {
    paddingHorizontal: SH(20)
  },

  SummaryText: {
    color: Colors.theme_background,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(22),
    fontWeight: '700'
  },
  SetAllPadding: {
    paddingHorizontal: SH(20)
  },
  BarChartView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    borderWidth: SW(0.5),
    borderColor: Colors.light_gray_text_color,
    borderRadius: SH(10)
  },
  Charts: {
    marginVertical: 8,
    borderRadius: 16,
  },
  BlackTexytColor: {
    color: Colors.black_text_color_Full,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(18),
  },
  GreenColor: {
    color: Colors.green_color,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(22),
  },
  TotalTextGray: {
    color: Colors.black_text_color_Full,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(22),
  },
  TotalText: {
    color: Colors.black_text_color_Full,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(18),
  },
  TotalResponceView: {
    width: '100%',
    padding: SH(10),
    borderWidth: 0.5,
    backgroundColor: Colors.theme_background_Second,
    borderColor: Colors.light_gray_text_color,
    borderRadius: 10,
  },
  TwoTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: SH(5)
  },
  TotalGrayTwo: {
    color: Colors.gray_text_color,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(18),
  },
});