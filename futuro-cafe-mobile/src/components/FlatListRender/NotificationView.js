import React, { useState, useMemo } from 'react';
import { useTheme } from '@react-navigation/native';
import { View, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NotificationStyle } from '../../styles';
import ReadMore from 'react-native-read-more-text';
import { SF, SH } from '../../utils';
import { VectorIcon } from '../commonComponents';

const NotificationView = (props) => {
    const { t } = useTranslation();
    const { item, index } = props;
    return (
        <View style={NotificationStyle.flexRowBitwin}>
            <View style={NotificationStyle.flexItemOne}>
                <View style={NotificationStyle.flexRowStart}>
                <VectorIcon style={NotificationStyle.iconStyle} size={SF(22)} icon="FontAwesome" name="bell-o" />
                <Text style={NotificationStyle.TitelText} >{item.text}</Text>
                </View>
                
                <Text style={NotificationStyle.TitelText2}>{item.Nottification}</Text>

                
            </View>
            <View style={NotificationStyle.flexItemTwo}>
                <Text style={NotificationStyle.TitelText3}>{item.DigitText}</Text>

            </View>


        </View>

    );
}
export default NotificationView;