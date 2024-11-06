import React, { useState, useMemo } from 'react';
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { SF, SH, Colors, widthPercent } from '../../utils';
import { Input, Input2, VectorIcon } from '../../components';
import { useTranslation } from "react-i18next";

const SearchScreenset = (props) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const { t } = useTranslation();
    const { placeholder,WidthSet } = props;

    const styles = useMemo(
        () =>
            StyleSheet.create({
                WidthSet: {
                    width: widthPercent(100),
                    ...WidthSet,
                },
                SearchInputBorder: {
                    fontSize: SF(17),
                    borderRadius: 200,
                    paddingLeft: SH(55),
                    borderColor: Colors.theme_background,
                    backgroundColor:'#f1f5ff'
                },
                BorderWidth: {
                    borderWidth: SH(0),
                    width: '100%',
                    borderColor: Colors.theme_background,
                    borderRadius: SH(10),
                },
            }),
        [],
    );
    return (
        <TouchableOpacity style={[styles.WidthSet,{...WidthSet}]}>
            <Input2
                placeholder={placeholder}
                onChangeText={(value) => setMobileNumber(value)}
                value={mobileNumber}
                placeholderTextColor={Colors.black_text_color}
                inputStyle={styles.SearchInputBorder}
            />
            <View style={{ position: 'absolute', top: SH(15), left: SH(30) }}>
                <VectorIcon name="search1" icon="AntDesign" color={Colors.theme_background} size={SF(23)} />
            </View>
        </TouchableOpacity>
    );
};
export default SearchScreenset;
