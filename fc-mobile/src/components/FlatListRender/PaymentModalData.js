import React, { useState, useMemo } from "react";
import { Text, View, Image, TouchableOpacity, } from "react-native";
import { PaymentsStyle } from '../../styles';
import { SF, Colors } from "../../utils";
import { Button, Input, VectorIcon } from "../../components";
import { useTranslation } from "react-i18next";
import { useTheme } from '@react-navigation/native';

const PaymentModalData = (props) => {
    const { t } = useTranslation();
    const { item, onPress } = props;
    const stateArray = {
        CardNumber: "",
        ExpirDate: "",
        Cvv: "",
    };
    const [state, setState] = useState(stateArray);
    const [expiry, setExpiry] = useState('');

    const handleExpiryChange = (text) => {
        // Remove any non-numeric characters from the input
        const formattedText = text.replace(/[^0-9]/g, '');

        if (formattedText.length <= 4) {
            // Format the text as MM/YY
            let formattedExpiry = '';
            for (let i = 0; i < formattedText.length; i++) {
                if (i === 2) {
                    formattedExpiry += '/';
                }
                formattedExpiry += formattedText[i];
            }

            setExpiry(formattedExpiry);
        }
    };
    return (
        <View style={PaymentsStyle.MinPaymentsView}>
            <View style={PaymentsStyle.FlexRowCloseIcon}>
                <View>
                    <Text style={PaymentsStyle.payviacard}>Pay via Card</Text>
                </View>
                <TouchableOpacity onPress={() => onPress()}>
                    <VectorIcon icon="FontAwesome" name="window-close" color={Colors.theme_background} size={SF(34)} />
                </TouchableOpacity>
            </View>
            <Input
                title={"Card Number"}
                titleStyle={PaymentsStyle.TitleStyle}
                placeholder={"Enter Card Number"}
                maxLength={16}
                onChangeText={(text) => setState({ ...state, CardNumber: text })}
                value={state.CardNumber}
                inputType={'numeric'}
            />
            <View style={PaymentsStyle.FlexRowInput}>
                <View style={PaymentsStyle.Width70}>
                    <Input
                        placeholder={"Expiry Date"}
                        maxLength={5}
                        onChangeText={handleExpiryChange}
                        value={expiry}
                        inputType={'numeric'}
                    />
                </View>
                <View style={PaymentsStyle.Width30}>
                    <Input
                        titleStyle={PaymentsStyle.TitleStyle}
                        placeholder={"CVV"}
                        maxLength={4}
                        inputType={'numeric'}
                        onChangeText={(text) => setState({ ...state, Cvv: text })}
                        value={state.Cvv}
                    />
                </View>
            </View>
            <View style={PaymentsStyle.ButtonView}>
                <Button title="Pay $456" />
            </View>
        </View>
    );
}
export default PaymentModalData;