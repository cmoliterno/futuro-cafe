import React, { useMemo } from 'react';
import { useTheme } from '@react-navigation/native';
import { View, Text, Image, StatusBar, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Button, Spacing } from '../../components';
import { RouteName } from '../../routes';
import { fontPercent, SH, widthPercent } from "../../utils";
import { useTranslation } from 'react-i18next';
import images from '../../index';
import { SwiperStyle } from '../../styles';

const { height } = Dimensions.get('window');

const SwiperScreen = (props) => {
  const { t } = useTranslation();
  const { navigation } = props;
  const { Colors } = useTheme();
  const SwiperStyles = useMemo(() => SwiperStyle(Colors), [Colors]);

  const Swiperdata = [
    {
      key: 's1',
      text: 'Swiperfirst',
      title: 'Swipertitle',
      animation: images.First_Swiper,
    },
    {
      key: 's2',
      text: 'SwiperFirstTwo',
      title: 'SwiperTitleTwo',
      animation: images.Two_Swiper,
    },
    {
      key: 's3',
      text: 'SwiperFirstThree',
      title: 'SwipertitleThree',
      animation: images.Three_Swiper,
    },
    {
      key: 's4',
      text: 'SwiperFirstFour',
      title: 'SwipertitleFour',
      animation: images.Four_Swiper,
    },
    {
      key: 's5',
      text: 'SwiperFirstFive',
      title: 'SwipertitleFive',
      animation: images.Five_Swiper,
      backgroundColor: '#FFF5E9',
    },
  ];

  const RenderItem = ({ item, index }) => (
    <View style={{ backgroundColor: '#FFF5E9', height: '100%' }}>
      <Spacing space={SH(10)} />
      <View style={[SwiperStyles.CenterView, { flex: 1 }]}>
        <Image
          source={item.animation}
          resizeMode="contain"
          style={[SwiperStyles.AnimationViewStyles, { bottom: fontPercent(20), height: '70%', width: '100%' }]}
        />
      </View>
      {/*<View style={SwiperStyles.AbsoluteView}>*/}
      {/*  <Text style={SwiperStyles.TitleStyles}>{t(item.title)}</Text>*/}
      {/*</View>*/}
    </View>
  );

  const _renderDoneButton = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
      <View style={{ width: widthPercent(90), top: SH(10) }}>
        <Button
          title={t('Get_Started')}
          onPress={() => navigation.navigate(RouteName.LOGIN_SCREEN)}
        />
      </View>
    </View>
  );

  const _renderNextButton = () => {
    return (
      <View style={SwiperStyles.BgButtonView}>
        {/* <Spacing space={SH(12)} />
        <Text style={SwiperStyles.NextTextStyle}>{t("Next_Text")}</Text> */}
      </View>
    );
  };
  const _renderSkipButton = () => {
    return (
      <View style={SwiperStyles.BgButtonView}>
        <View style={{ width: widthPercent(90), top: SH(10) }}>
          <Button
            title={t('Skip_Text')}
            onPress={() => navigation.navigate(RouteName.LOGIN_SCREEN)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={SwiperStyles.SwiperMinView}>
      <StatusBar backgroundColor={Colors.theme_background} />
      <View style={SwiperStyles.SwiperMinViewTwo}>
        <Image
          source={images.Bottom_Shap}
          resizeMode="cover"
          style={SwiperStyles.BottomImageShapp}
        />
      </View>

      <AppIntroSlider
        data={Swiperdata}
        renderItem={RenderItem}
        renderNextButton={_renderNextButton}
        renderSkipButton={_renderSkipButton}
        renderDoneButton={_renderDoneButton}
        showSkipButton={true}
        activeDotStyle={SwiperStyles.ActiveDotStyles}
        dotStyle={SwiperStyles.DotSwiperStyle}
      />
    </View>
  );
};

export default SwiperScreen;
