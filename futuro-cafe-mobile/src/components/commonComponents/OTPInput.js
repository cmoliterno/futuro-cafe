// CustomOtpInput.js

import React, { useState, useRef, useMemo } from 'react';
import { Otpstyle } from '../../styles';
import { View, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';

const CustomOtpInput = ({ numberOfInputs = 4 }) => {
    const [otp, setOtp] = useState(Array(numberOfInputs).fill(''));
    const inputRefs = useRef([]);
    const { Colors } = useTheme();
    const Otpstyles = useMemo(() => Otpstyle(Colors), [Colors]);
    const handleInputChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;

        setOtp(newOtp);

        // Move to the next input
        if (text !== '' && index < numberOfInputs - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleInputDelete = (index) => {
        if (index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <View style={Otpstyles.CustomeInputView}>
            {Array.from({ length: numberOfInputs }).map((_, index) => (
                <TextInput
                    key={index}
                    style={[Otpstyles.CustomeInput,{paddingTop:3,}]}
                    value={otp[index]}
                    keyboardType="numeric"
                    maxLength={1}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    onChangeText={(text) => handleInputChange(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            handleInputDelete(index);
                        }
                    }}
                />
            ))}
        </View>
    );
};
export default CustomOtpInput;

