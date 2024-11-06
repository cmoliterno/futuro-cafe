import React, {useState, useRef} from 'react';
import '../SelectLanguage/i18n';
import {View, Text, Image, Animated, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Spacing, Button, LanguageSelectFlatTwo} from '../../../components';
import {LanguageStyles} from '../../../styles';
import {RouteName} from '../../../routes';
import images from '../../../index';
import {SH} from '../../../utils';

const Translation = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  let englishLanguage = t('Portuguese');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectLabel, setSelectLabel] = useState(englishLanguage);
  const scrollY = useRef(new Animated.Value(0)).current;
  const changeLang = e => {
    setSelectLabel(e);
  };
  const [isFocus, setIsFocus] = useState(false);
  const [IconChange, SetIconChange] = useState('');
  const [selectLanguage, setSelectLanguage] = useState('br');
  const LanguageDropdownData = [
    {label: 'Português (BR)', value: 'br'},
    {label: 'Inglês', value: 'en'},
    {label: 'Árabe', value: 'ara'},
    {label: 'Espanhol', value: 'spa'},
    {label: 'Francês', value: 'fr'},
  ];

  return (
    <View style={LanguageStyles.BgColorWhiteAll}>
      <View style={LanguageStyles.SetBackGround} />
      <View style={LanguageStyles.SetBackGroundTwo} />
      <Text style={LanguageStyles.LanguageText}>{t('Language')}</Text>
      <View style={LanguageStyles.MinView}>
        <View>
          <Image
            source={images.Language_Logo}
            style={LanguageStyles.LottieWidth}
          />
        </View>
        <Spacing space={SH(30)} />
        <View style={LanguageStyles.SelectTextView}>
          <Text style={LanguageStyles.LangugeText}>{t('Select_Language')}</Text>
        </View>
        <Spacing space={SH(20)} />
        <FlatList
          data={LanguageDropdownData}
          showsHorizontalScrollIndicator={false}
          style={{paddingHorizontal: SH(20)}}
          renderItem={({item, index}) => (
            <LanguageSelectFlatTwo
              item={item}
              index={index}
              setIsFocus={setIsFocus}
              IconChange={IconChange}
              selectLanguage={selectLanguage}
              selectLabel={selectLabel}
              setSelectLanguage={setSelectLanguage}
              SetIconChange={SetIconChange}
              onPress={() => {
                setSelectLanguage(item.value);
                setSelectLabel(item.label);
                SetIconChange(index);
                setModalVisible(false);
                changeLang(item.label);
              }}
            />
          )}
        />
      </View>
      <View style={LanguageStyles.BottomView}>
        <View style={LanguageStyles.BtnVieStyle}>
          <Button
            title={t('Confirm_Text')}
            onPress={() => navigation.navigate(RouteName.LOGIN_SCREEN)}
          />
        </View>
      </View>
    </View>
  );
};

export default Translation;
