
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SF, SH, SW, Fonts, Colors } from '../../utils';
import { CheckBox } from 'react-native-elements';

function CheckBoxset(props) {
    const { checked, onPress, title, iconType, checkedIcon, uncheckedIcon, checkedColor, uncheckedColor } = props;
    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    width: "100%",
                    paddingHorizontal: SW(20)
                },
                labelStyle: {
                    fontSize: SF(18),
                    color: Colors.black_text_color,
                    fontFamily: Fonts.Poppins_Medium,
                    paddingVertical: SH(2),
                    fontWeight: '600'
                },
                containerStyle: {
                    backgroundColor: 'transparent',
                    borderWidth: SH(0),
                    padding: SH(0),
                    marginLeft: SH(0)
                },
            }),
    )
    return (
        <View style={styles.container}>
            <CheckBox
                checked={checked}
                title={title}
                onPress={onPress}
                iconType={iconType}
                checkedIcon={checkedIcon}
                uncheckedIcon={uncheckedIcon}
                checkedColor={checkedColor}
                uncheckedColor={uncheckedColor}
                textStyle={styles.labelStyle}
                containerStyle={styles.containerStyle}
            />
        </View>
    );
};
export default CheckBoxset;