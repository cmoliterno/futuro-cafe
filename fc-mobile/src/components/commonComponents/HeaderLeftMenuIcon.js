import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Colors, SF, SH } from '../../utils';
import { VectorIcon } from '../../components';

function HeaderLeftMenuIcon(props) {
    const { navigation } = props;
    return (
        <TouchableOpacity style={{paddingLeft:SH(13)}} onPress={() => navigation.toggleDrawer()}>
            <VectorIcon
                color={Colors.white_text_color}
                name="navicon"
                icon="EvilIcons"
                size={SF(35)}
            />
        </TouchableOpacity>
    );
};

export default HeaderLeftMenuIcon;