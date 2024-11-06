
import { StyleSheet } from 'react-native';
import { Fonts, SF, SH, SW, Colors } from '../../utils';

export default StyleSheet.create({
    LootieStyle: {
        width: SW(120),
        height: SW(120)
    },
    Bgcolorwhite: {
        backgroundColor: Colors.white_text_color,
        width: '100%',
        borderRadius: SH(10),
        paddingHorizontal: SH(20),
        paddingVertical: SH(10)
    },
    WelcomeText: {
        color: Colors.theme_background,
        fontFamily: Fonts.Poppins_Medium,
        fontSize: SF(23),
        textAlign: 'center'
    },
    ParegraphText: {
        color: Colors.black_text_color,
        fontFamily: Fonts.Poppins_Italic,
        fontSize: SF(18),
        textAlign: 'center'
    },
    SelectLocation: {
        color: Colors.black_text_color,
        fontFamily: Fonts.Poppins_Medium,
        fontSize: SF(23),
        textAlign: 'center'
    },
    Marginright: {
        marginRight: SH(10),
    },
    IconBgcolorView: {
        backgroundColor: Colors.black_text_color,
        fontFamily: Fonts.Poppins_Medium,
        fontSize: SF(17),
        borderRadius: 10,
        height: SW(45),
        width: SW(45),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: SH(15),
        bottom: SH(15),
    },
    SearchLocation: {
        backgroundColor: Colors.black_text_color,
        fontFamily: Fonts.Poppins_Medium,
        fontSize: SF(17),
        borderRadius: 10,
        height: SW(45),
        width: SW(45),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: SH(15),
        top: SH(15),
        zIndex: 23
    },
    DelevirTexct: {
        color: Colors.theme_background,
        fontFamily: Fonts.Poppins_Bold,
        fontSize: SF(21),

    },
    FlexRowText: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 0.5,
        paddingBottom: SH(10),
        borderColor: Colors.light_gray_text_color
    },
    FlexRowTextTwo: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 0.5,
        paddingBottom: SH(20),
        borderColor: Colors.light_gray_text_color
    },
    Width30: {
        width: '15%',
    },
    Width70: {
        width: '100%',
    },
    DeleveryText: {
        color: Colors.black_text_color,
        fontFamily: Fonts.Poppins_Medium,
        fontSize: SF(18)
    },
    DeleveryTextTwo: {
        color: Colors.gray_text_color,
        fontFamily: Fonts.Poppins_Italic,
        fontSize: SF(17)
    },
    BlueTextColor: {
        color: Colors.blue_color,
        fontFamily: Fonts.Poppins_Medium,
        fontSize: SF(18),
    },
    BlueTextColorTwo: {
        color: Colors.black_text_color,
        fontFamily: Fonts.Poppins_Italic,
        fontSize: SF(17),
    },
    FlexRowTextStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    FlexRowEddit: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    SavedAddress: {
        color: Colors.gray_text_color,
        fontFamily: Fonts.Poppins_Medium,
        fontSize: SF(18)
    },
    EditTextStyle: {
        color: Colors.black_text_color,
        fontFamily: Fonts.Poppins_Medium,
        fontSize: SF(18),
        paddingRight: SH(10)
    },
    BorderRound: {
        borderWidth: 1,
        width: SW(100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SH(10),
        paddingTop:SH(7),
        height: SW(80),
        borderColor: Colors.theme_background,
        backgroundColor:Colors.theme_background
    },
    TextColor: {
        color: Colors.white_text_color,
        fontFamily: Fonts.Poppins_Medium,
        fontSize: SF(17),
        paddingTop: SH(4)
    },
    IconCnetr: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    FlexArround: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around'
    },
    mapstyleset: {
        flex: 1,
        width: '100%',
        height: SH(600),
        paddingTop: SH(10),
        borderRadius: SW(20),
      },
      positonabsolute: {
        backgroundColor: Colors.white_text_color,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: SW(27),
        borderTopRightRadius: SW(27),
        paddingBottom: 0,
        shadowOffset: {
          width: 0,
          height: Platform.OS === 'ios' ? 0 : 25,
        },
        shadowOpacity: 0.58,
        shadowRadius: Platform.OS === 'ios' ? 0 : 25,
        elevation: Platform.OS === 'ios' ? 0 : 2,
      },
      setconformbutton: {
        marginTop: SH(20),
        borderRadius: SW(100),
      },
      textcolorsetwhite: {
        color: Colors.white_text_color
      },
      positonsetdelever: {
        position: 'absolute',
        top: SH(20),
        zIndex: 4,
        flexDirection: 'row',
        alignItems: 'center',
        padding: SW(6),
        borderWidth: SW(1),
        marginLeft: SW(20),
        justifyContent: 'space-between',
        borderRadius: SW(20),
        width: SW(153),
        backgroundColor: Colors.bgwhite,
        border_color: 'rgba(0, 0, 0, 0.48)'
      },
      setdilivertext: {
        fontSize: SF(17),
        fontWeight: '600',
        fontFamily: Fonts.Poppins_Medium,
        color: Colors.black_text_color,
        paddingRight: SW(15),
        paddingTop: SH(3)
      },
      setpencileicon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        paddingTop: SH(10),
        position: 'relative',
        top: SH(20),
        width: SW(50),
        height: SH(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        right: SW(0),
        marginTop: SH(-20),
        zIndex: 3,
      },
      flexrowhomeimage: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      },
      setwhiteboxwidth: {
        width: '85%',
        paddingBottom: SH(10),
      },
      centerpencileicon: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
      },
      satyanilaym: {
        color: Colors.black_text_color,
        fontSize: SF(17),
        fontFamily: Fonts.Poppins_Medium,
      },
      satyanilaymtwo: {
        color: Colors.gray_text_color,
        fontSize: SF(14),
        fontFamily: Fonts.Poppins_Medium,
      },
      setwhiteboxwidthtwo: {
        width: '99%'
      },
      marginright: {
        marginRight: SW(20),
      },
     
});
