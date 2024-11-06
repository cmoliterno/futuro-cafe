import React, { useMemo } from 'react';
import { Button } from 'react-native-elements';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Fonts, SF, SH, SW, Colors } from '../../utils';

function Buttons(props) {
  const { title, onPress, buttonStyle, iconContainerStyle, disabled, buttonTextStyle, icon, spacedImages, linearGradientProps } = props;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        buttonStyle: {
          backgroundColor: disabled ? '#ccc' : Colors.theme_background,
          borderRadius: 20,
          width: '100%',
          paddingVertical: 10,
        },
        buttonTextStyle: {
          color: Colors.white_text_color,
          fontFamily: Fonts.Poppins_Medium,
          fontSize: SF(16),
          fontWeight: '600',
          lineHeight: SH(24),
        },
        buttonViewStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: spacedImages ? 'space-around' : 'center',
          width: '100%',
        },
        LeftImageViewStyle: {
          marginVertical: SW(5),
        },
      }),
    [disabled, spacedImages],
  );

  return (
    <TouchableOpacity disabled={disabled}>
      <Button
        title={title}
        onPress={onPress}
        icon={icon}
        iconContainerStyle={iconContainerStyle}
        linearGradientProps={linearGradientProps}
        buttonStyle={[styles.buttonStyle, buttonStyle]}
        titleStyle={[styles.buttonTextStyle, buttonTextStyle]}
        disabled={disabled}
      />
    </TouchableOpacity>
  );
}

export default Buttons;
