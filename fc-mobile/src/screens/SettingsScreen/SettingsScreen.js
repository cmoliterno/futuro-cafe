import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {SettingStyle, Style, LanguageStyles} from '../../styles';
import {
  Spacing,
  Container,
  VectorIcon,
  Switchs,
  ModalLanguage,
} from '../../components';
import {SH, SF, Colors} from '../../utils';
import {useTranslation} from 'react-i18next';
const SettingStylesScreen = () => {
  const stateArray = {
    Blutooth: false,
    Notification: true,
    CloudBackup: false,
    DarkMode: false,
  };
  let englishLanguage = 'Portuguese';
  const [modalVisible, setModalVisible] = useState(false);
  const [selectLabel, setSelectLabel] = useState(englishLanguage);
  const {t} = useTranslation();
  const changeLang = e => {
    setSelectLabel(e);
  };
  return (
    <View style={Style.BgColorWhiteAll}>
      <ScrollView>
        <View style={Style.Container}>
          <View style={Style.MinViewContent1}>
            <Spacing space={SH(20)} />
            <View style={SettingStyle.WhiteNotifoication}>
              <View style={SettingStyle.LightThemeNotifoication}>
                <View style={SettingStyle.FlexRowTextStyle}>
                  <View style={SettingStyle.BlututhTextView}>
                    <View style={SettingStyle.BlututhIconView}>
                      <VectorIcon
                        icon="FontAwesome"
                        name="bluetooth"
                        color={Colors.theme_background}
                        size={SF(25)}
                      />
                    </View>
                    <View>
                      <Text style={SettingStyle.BlututhText}>
                        {t('Setting_Title_1')}
                      </Text>
                    </View>
                  </View>
                  <View style={SettingStyle.BlututhIconView2}>
                    <VectorIcon
                      icon="AntDesign"
                      name="right"
                      color={Colors.theme_background}
                      size={SF(18)}
                    />
                  </View>
                </View>
                <View style={SettingStyle.FlexRowTextStyle}>
                  <View style={SettingStyle.BlututhTextView}>
                    <View style={SettingStyle.BlututhIconView2}>
                      <VectorIcon
                        icon="Ionicons"
                        name="notifications"
                        color={Colors.theme_background}
                        size={SF(25)}
                      />
                    </View>
                    <View>
                      <Text style={SettingStyle.BlututhText}>
                        {t('Setting_Title_3')}
                      </Text>
                    </View>
                  </View>
                  <View style={SettingStyle.BlututhIconView2}>
                    <VectorIcon
                      icon="AntDesign"
                      name="right"
                      color={Colors.theme_background}
                      size={SF(18)}
                    />
                  </View>
                </View>
              </View>
              <Spacing space={20} />
              <View style={SettingStyle.LightThemeNotifoication}>
                <View style={SettingStyle.FlexRowTextStyle}>
                  <View style={SettingStyle.BlututhTextView}>
                    <View style={SettingStyle.BlututhIconView3}>
                      <VectorIcon
                        icon="AntDesign"
                        name="clouddownload"
                        color={Colors.theme_background}
                        size={SF(25)}
                      />
                    </View>
                    <View>
                      <Text style={SettingStyle.BlututhText}>
                        {t('Setting_Title_5')}
                      </Text>
                    </View>
                  </View>
                  <View style={SettingStyle.BlututhIconView2}>
                    <VectorIcon
                      icon="AntDesign"
                      name="right"
                      color={Colors.theme_background}
                      size={SF(18)}
                    />
                  </View>
                </View>
                <View style={SettingStyle.FlexRowTextStyle}>
                  <View style={SettingStyle.BlututhTextView}>
                    <View style={SettingStyle.BlututhIconView4}>
                      <VectorIcon
                        icon="MaterialCommunityIcons"
                        name="theme-light-dark"
                        color={Colors.theme_background}
                        size={SF(25)}
                      />
                    </View>
                    <View>
                      <Text style={SettingStyle.BlututhText}>
                        {t('Setting_Title_7')}
                      </Text>
                    </View>
                  </View>
                  <View style={SettingStyle.BlututhIconView2}>
                    <VectorIcon
                      icon="AntDesign"
                      name="right"
                      color={Colors.theme_background}
                      size={SF(18)}
                    />
                  </View>
                </View>
                <View style={SettingStyle.FlexRowTextStyle}>
                  <View style={SettingStyle.BlututhTextViewTwo}>
                    <View style={SettingStyle.BlututhIconView}>
                      <VectorIcon
                        icon="Entypo"
                        name="key"
                        color={Colors.theme_background}
                        size={SF(25)}
                      />
                    </View>
                    <View>
                      <Text style={SettingStyle.BlututhText}>
                        {t('Setting_Title_8')}
                      </Text>
                      {/* <Text style={SettingStyle.BlututhTextSmall}>{t("Setting_Title_9")}</Text> */}
                    </View>
                  </View>
                  <View style={SettingStyle.BlututhIconView2}>
                    <VectorIcon
                      icon="AntDesign"
                      name="right"
                      color={Colors.theme_background}
                      size={SF(18)}
                    />
                  </View>
                </View>

                <View style={SettingStyle.FlexRowTextStyle}>
                  <View style={SettingStyle.BlututhTextView}>
                    <View style={SettingStyle.BlututhIconView3}>
                      <VectorIcon
                        icon="Entypo"
                        name="lock-open"
                        color={Colors.theme_background}
                        size={SF(25)}
                      />
                    </View>
                    <View>
                      <Text style={SettingStyle.BlututhText}>
                        {t('Setting_Title_11')}
                      </Text>
                      {/* <Text style={SettingStyle.BlututhTextSmall}>{t("Setting_Title_12")}</Text> */}
                    </View>
                  </View>
                  <View style={SettingStyle.BlututhIconView2}>
                    <VectorIcon
                      icon="AntDesign"
                      name="right"
                      color={Colors.theme_background}
                      size={SF(18)}
                    />
                  </View>
                </View>
                <View style={SettingStyle.FlexRowTextStyle}>
                  <View style={SettingStyle.BlututhTextView}>
                    <View style={SettingStyle.BlututhIconView4}>
                      <VectorIcon
                        icon="FontAwesome5"
                        name="mobile"
                        color={Colors.theme_background}
                        size={SF(25)}
                      />
                    </View>
                    <View>
                      <Text style={SettingStyle.BlututhText}>
                        {t('Setting_Title_13')}
                      </Text>
                      {/* <Text style={SettingStyle.BlututhTextSmall}>{t("Setting_Title_14")}</Text> */}
                    </View>
                  </View>
                  <View style={SettingStyle.BlututhIconView2}>
                    <VectorIcon
                      icon="AntDesign"
                      name="right"
                      color={Colors.theme_background}
                      size={SF(18)}
                    />
                  </View>
                </View>
              </View>
              <Spacing space={20} />
              <View style={SettingStyle.LightThemeNotifoication}>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={SettingStyle.FlexRowTextStyle}>
                  <View style={SettingStyle.BlututhTextViewTwo}>
                    <View style={SettingStyle.BlututhIconView2}>
                      <VectorIcon
                        icon="Entypo"
                        name="language"
                        color={Colors.theme_background}
                        size={SF(25)}
                      />
                    </View>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                      <Text style={SettingStyle.BlututhText}>
                        {t('Setting_Title_10')}
                      </Text>
                      <Spacing space={SH(5)} />
                      {/* <TouchableOpacity style={SettingStyle.LanguAgeView}>
                      <Text style={LanguageStyles.SelectTextSettings}>{selectLabel}</Text>
                      <VectorIcon icon="Feather" name="chevron-down" color={Colors.black_text_color} size={SF(25)} />
                    </TouchableOpacity> */}
                    </TouchableOpacity>
                  </View>
                  <View style={SettingStyle.BlututhIconView2}>
                    <VectorIcon
                      icon="AntDesign"
                      name="right"
                      color={Colors.theme_background}
                      size={SF(18)}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <ModalLanguage
        modalVisible={modalVisible}
        setModalVisible={() => {
          setModalVisible(!modalVisible);
        }}
        close={() => setModalVisible(!modalVisible)}
        OnClose={() => setModalVisible(false)}
        changeLang={changeLang}
      />
    </View>
  );
};
export default SettingStylesScreen;
