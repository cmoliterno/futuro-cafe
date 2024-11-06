import React from 'react';
import {View, FlatList, ScrollView} from 'react-native';
import {NotificationStyle, Style} from '../../styles';
import {Spacing, NotificationView} from '../../components';
import {SH} from '../../utils';
import {useTranslation} from 'react-i18next';
const NotificationScreen = () => {
  const {t} = useTranslation();
  const CategoryData = [
    {
      id: 1,
      text: t('Nottification_Title_1'),
      DigitText: t('Notification_date_1'),
      Nottification: t('Nottification_1'),
    },
    {
      id: 2,
      text: t('Nottification_Title_2'),
      DigitText: t('Notification_date_2'),
      Nottification: t('Nottification_2'),
    },
    {
      id: 3,
      text: t('Nottification_Title_3'),
      DigitText: t('Notification_date_3'),
      Nottification: t('Nottification_3'),
    },
    {
      id: 4,
      text: t('Nottification_Title_4'),
      DigitText: t('Notification_date_4'),
      Nottification: t('Nottification_4'),
    },
    {
      id: 5,
      text: t('Nottification_Title_5'),
      DigitText: t('Notification_date_5'),
      Nottification: t('Nottification_5'),
    },
    {
      id: 6,
      text: t('Nottification_Title_6'),
      DigitText: t('Notification_date_6'),
      Nottification: t('Nottification_6'),
    },
    {
      id: 7,
      text: t('Nottification_Title_7'),
      DigitText: t('Notification_date_7'),
      Nottification: t('Nottification_7'),
    },
    {
      id: 8,
      text: t('Nottification_Title_8'),
      DigitText: t('Notification_date_8'),
      Nottification: t('Nottification_8'),
    },
    {
      id: 9,
      text: t('Nottification_Title_9'),
      DigitText: t('Notification_date_9'),
      Nottification: t('Nottification_9'),
    },
  ];
  return (
    <View style={Style.ScrollViewStyles}>
      <ScrollView>
        <View style={Style.Container}>
          <View style={Style.MinViewContent}>
            <Spacing space={SH(20)} />
            <View style={NotificationStyle.WhiteNotifoication}>
              <FlatList
                data={CategoryData}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => (
                  <NotificationView item={item} index={index} />
                )}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default NotificationScreen;
