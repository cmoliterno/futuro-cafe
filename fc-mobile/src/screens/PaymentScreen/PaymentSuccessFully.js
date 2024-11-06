import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {Style, PaymentsStyle} from '../../styles';
import {Container, Spacing, Lottie, Button} from '../../components';
import {SH} from '../../utils';
import images from '../../index';

const PaymentSuccessFully = props => {
  return (
    <Container>
      <ScrollView>
        <View style={Style.Container}>
          <View style={Style.MinViewContentFuill}>
            <View style={PaymentsStyle.MinViewContentFuill}>
              <Spacing space={SH(150)} />
              <View style={PaymentsStyle.BgcolorWhite}>
                <View style={PaymentsStyle.CenterView}>
                  <View style={PaymentsStyle.BackWhite}>
                    <Lottie
                      Lottiewidthstyle={PaymentsStyle.Lootianimation}
                      source={images.Payments_Successful}
                    />
                  </View>
                </View>
                <Spacing space={SH(30)} />
                <Text style={PaymentsStyle.TextySytyles}>$ 456</Text>
                <Spacing space={SH(10)} />
                <Text style={PaymentsStyle.TextySytylesTwo}>
                  Payment Successful!
                </Text>
                <Spacing space={SH(10)} />
                <Text style={PaymentsStyle.ParegraphText}>
                  The Payment has been done Successfully. Thanks for being there
                  with us.
                </Text>
                <Spacing space={SH(20)} />
                <Text style={PaymentsStyle.DateTewxtStyle}>
                  Payment ID : 345645
                </Text>
                <Text style={PaymentsStyle.DateTewxtStyle}>
                  19 oct 2023 , 10:34 PM
                </Text>
                <Spacing space={SH(30)} />
                <Button title="Done" />
                <Spacing space={SH(30)} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};
export default PaymentSuccessFully;
