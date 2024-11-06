import React, {useState, useMemo} from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Otpstyle} from '../../../styles/LoginRegiesterStyle';
import images from '../../../index';
import RouteName from '../../../routes/RouteName';
import {
  Button,
  ConfirmationAlert,
  OTPInput,
  Spacing,
} from '../../../components';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {SH} from '../../../utils';

const OtpVerifyScreen = props => {
  const {t} = useTranslation();
  const {Colors} = useTheme();
  const Otpstyles = useMemo(() => Otpstyle(Colors), [Colors]);
  const {navigation} = props;
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [okbutton, Setokbutton] = useState('');

  const alertdata = {
    logout: t('Resand_Otp_Text_Modal'),
    loginSuccess: t('Login_Successfull'),
  };

  const onoknutton = () => {
    if (okbutton === true) {
      navigation.navigate(RouteName.HOME_SCREEN);
    }
  };

  return (
    <View style={Otpstyles.MinViewScreen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={Otpstyles.ScrollViewStyle}>
        <KeyboardAvoidingView enabled>
          <View style={Otpstyles.MinFlexView}>
            <View style={Otpstyles.MinViewSecond}>
              <View style={Otpstyles.CenterAnimation}>
                <View style={Otpstyles.CenterImage}>
                  <Image
                    source={images.Otp_Logo}
                    style={Otpstyles.LogoImageStyle}
                  />
                </View>
              </View>
              <Spacing space={SH(30)} />
              <Text style={Otpstyles.EnterSixDigitText}>
                {t('OTP_Title_1')}
              </Text>
              <Text style={Otpstyles.paregraph}>{t('OTP_Title_2')}</Text>
              <Text style={Otpstyles.paregraph}>
                {t('OTP_Title_3')} +91 123456XXXX
              </Text>
              <Spacing space={SH(40)} />
              <OTPInput />
              <Spacing space={SH(40)} />
              <View style={[Otpstyles.FlexRowText]}>
                <Text style={Otpstyles.ParegraPhotpBottom}>
                  {t('Didnt_Recevip_Otp')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setAlertVisible(true);
                    setAlertMessage(alertdata.logout);
                    Setokbutton(false);
                  }}>
                  <Text style={Otpstyles.ResendTextBold}>{t('Resend')}</Text>
                </TouchableOpacity>
              </View>
              <View style={[Otpstyles.FlexRowbtn]}>
                <Button
                  onPress={() => {
                    setAlertVisible(true);
                    setAlertMessage(alertdata.loginSuccess);
                    Setokbutton(true);
                  }}
                  title={t('Verify_Text')}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <ConfirmationAlert
        message={alertMessage}
        modalVisible={alertVisible}
        setModalVisible={setAlertVisible}
        onPress={() => {
          setAlertVisible(!alertVisible);
          onoknutton();
        }}
        buttonminview={Otpstyles.buttonotp}
        iconVisible={true}
        buttonText={t('Ok')}
      />
    </View>
  );
};

export default OtpVerifyScreen;
