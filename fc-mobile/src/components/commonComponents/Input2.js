import React, { useMemo } from 'react';
import propTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { SF, SH, SW, Fonts, Colors } from '../../utils';
import { Input } from 'react-native-elements';

function Inputs2({
  title,
  placeholder,
  titleStyle,
  inputStyle,
  onChangeText,
  value,
  inputprops,
  onBlur,
  onFocus,
  inputType,
  autoFocus,
  secureTextEntry,
  maxLength,
  leftIcon = {},
  rightIcon = {},
  errorMessage = "",
  disabled = false,
  required = false,
  containerStyle,
  onEndEditing,
  inputContainerStyle,
  numberOfLines
}) {
  const colorsset = Colors;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { width: '100%', ...containerStyle, marginBottom: SH(0), },
        inputContainerStyle: {
          borderBottomWidth: SH(0),
          width: "100%",
          ...inputContainerStyle
        },
        input_style: {
          width: '100%',
          borderColor: colorsset.light_gray_text_color,
          fontSize: SF(16),
          fontWeight: '600',
          borderColor: Colors.theme_background,
          marginBottom: SH(0),
          fontFamily: Fonts.Poppins_Medium,
          color: colorsset.black_text_color,
          paddingVertical: SH(8),
          paddingHorizontal: SH(20),
          borderRadius: 300,
          borderWidth: SH(0.5),
          backgroundColor: '#f1f5ff',
          zIndex:324534,
          position:'relative',
          ...inputStyle,
        },
        labelStyle: {
          width: '100%',
          fontSize: SF(18),
          color: colorsset.black_text_color,
          fontFamily: Fonts.Poppins_Medium,
          paddingHorizontal: SW(5),
          fontWeight: '500',
          paddingVertical: SH(2),
          ...titleStyle,
        },
        placeholderStyle: {
          fontSize: SF(19),
          color: Colors.theme_background,
          fontFamily: Fonts.Poppins_Medium
        },
        errorStyle: {
          color: colorsset.theme_background,
          fontFamily: Fonts.Poppins_Regular,
          margin: 0,
          height: 0,
        },
      }),
    [title, titleStyle, inputStyle, colorsset],
  );
  return (
    <View style={styles.container}>
      <Input
        label={title + (required ? "*" : "")}
        placeholder={placeholder}
        onChangeText={(text) => onChangeText(text)}
        leftIcon={leftIcon}
        placeholderTextColor={Colors.gray_text_color}
        rightIcon={rightIcon}
        numberOfLines={numberOfLines}
        errorMessage={errorMessage}
        disabled={disabled}
        onFocus={() => onFocus()}
        onBlur={() => onBlur()}
        autoFocus={autoFocus}
        keyboardType={!inputType ? 'default' : inputType}
        secureTextEntry={secureTextEntry}
        value={value}
        selectionColor={colorsset.theme_background}
        maxLength={maxLength}
        {...inputprops}
        errorStyle={styles.errorStyle}
        inputStyle={styles.input_style}
        labelStyle={styles.labelStyle}
        inputContainerStyle={styles.inputContainerStyle}
        onEndEditing={(e) => onEndEditing(e)}
      />
    </View>
  );
}

Inputs2.defaultProps = {
  title: '',
  placeholder: '',
  titleStyle: {},
  inputStyle: {},
  onChangeText: () => { },
  onFocus: () => { },
  onBlur: () => { },
  value: '',
  textprops: {},
  inputprops: {},
  inputType: null,
  autoCompleteType: '',
  onEndEditing: () => { },

};

Inputs2.propTypes = {
  title: propTypes.string,
  autoCompleteType: propTypes.string,
  placeholder: propTypes.string,
  titleStyle: propTypes.shape({}),
  inputStyle: propTypes.shape({}),
  onChangeText: propTypes.func,
  value: propTypes.string,
  textprops: propTypes.object,
  inputprops: propTypes.object,
  onFocus: propTypes.func,
  onBlur: propTypes.func,
  inputType: propTypes.any,
  onEndEditing: propTypes.func,
};

export default Inputs2;
