import React from "react";
import { Style } from '../../styles';
import { Colors, SF } from '../../utils';
import { TouchableOpacity } from 'react-native';
import { RouteName } from '../../routes';
import { useNavigation } from '@react-navigation/native';
import { VectorIcon } from '../../components';

const CallIIcon = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={Style.CallIconView} onPress={() => navigation.navigate(RouteName.AUDIO_CALL_SCREEN)}>
            <VectorIcon
                icon="Ionicons"
                size={SF(20)}
                name="call"
                color={Colors.theme_background}
            />
        </TouchableOpacity>
    )
}
export default CallIIcon;