import React, {useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Style, PaymentsStyle} from '../../styles';
import {
  Container,
  Lottie,
  Spacing,
  VectorIcon,
  PaymentModalData,
  Button,
  Input,
} from '../../components';
import images from '../../index';
import {Colors, SH, SF} from '../../utils';

const MangePaymentMethode = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalcontent, setmodalcontent] = useState(0);
  const stateArray = {
    UPINumber: '',
  };
  const [state, setState] = useState(stateArray);
  return (
    <Container>
      <ScrollView>
        <View style={Style.Container}>
          <View style={Style.MinViewContentFuill}>
            <View style={PaymentsStyle.MinViewContentFuill}>
              <Lottie
                Lottiewidthstyle={{width: 200, height: 200}}
                source={images.Payments_Option}
              />

              <View style={PaymentsStyle.MinViewBgcolorWhite}>
                <Text style={PaymentsStyle.CreditCardTextStyle}>
                  Credit Card
                </Text>
                <Spacing space={SH(10)} />
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                    setmodalcontent(1);
                  }}
                  style={PaymentsStyle.MinViewFlex}>
                  <View>
                    <Text style={PaymentsStyle.EnterCardNumber}>
                      Enter Card Number
                    </Text>
                  </View>
                  <View style={PaymentsStyle.ImageFlexRow}>
                    <Image
                      source={images.UPI_Image_Visa}
                      resizeMode="contain"
                      style={PaymentsStyle.ImageUpiStyle}
                    />
                    <Image
                      source={images.UPI_Image_Visa_2}
                      resizeMode="contain"
                      style={PaymentsStyle.ImageUpiStyle}
                    />
                  </View>
                </TouchableOpacity>
                <Spacing space={SH(35)} />
                <Text style={PaymentsStyle.CreditCardTextStyle}>
                  Debit/ATM Card
                </Text>
                <Spacing space={SH(10)} />
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                    setmodalcontent(2);
                  }}
                  style={PaymentsStyle.MinViewFlex}>
                  <View>
                    <Text style={PaymentsStyle.EnterCardNumber}>
                      Enter Card Number
                    </Text>
                  </View>
                  <View style={PaymentsStyle.ImageFlexRow}>
                    <Image
                      source={images.UPI_Image_Visa}
                      resizeMode="contain"
                      style={PaymentsStyle.ImageUpiStyle}
                    />
                    <Image
                      source={images.UPI_Image_Visa_2}
                      resizeMode="contain"
                      style={PaymentsStyle.ImageUpiStyle}
                    />
                  </View>
                </TouchableOpacity>
                <Spacing space={SH(35)} />
                <View style={PaymentsStyle.TopBottomBorderSet}>
                  <Spacing space={SH(15)} />
                  <Text style={PaymentsStyle.CreditCardTextStyle}>UPI</Text>
                  <Spacing space={SH(15)} />
                  <View style={PaymentsStyle.CenterImageandText}>
                    <View>
                      <Image
                        source={images.UPI_Image_Visa_3}
                        style={PaymentsStyle.GooglepayImageStyle}
                      />
                    </View>
                    <View style={PaymentsStyle.SetPadding}>
                      <Image
                        source={images.UPI_Image_Visa_5}
                        style={PaymentsStyle.GooglepayImageStyle}
                      />
                    </View>
                    <View style={PaymentsStyle.SetPadding}>
                      <Image
                        source={images.UPI_Image_Visa_6}
                        style={PaymentsStyle.Payplestyles}
                      />
                    </View>
                    <View style={PaymentsStyle.SetPadding}>
                      <TouchableOpacity
                        style={PaymentsStyle.SetPlusBorder}
                        onPress={() => {
                          setModalVisible(true);
                          setmodalcontent(3);
                        }}>
                        <VectorIcon
                          name="plus"
                          icon="AntDesign"
                          size={SF(20)}
                          color={Colors.blue_color}
                        />
                      </TouchableOpacity>
                      <Spacing space={SH(10)} />
                      <Text style={PaymentsStyle.UPIDTextStylew}>
                        Enter UPI ID
                      </Text>
                    </View>
                  </View>
                </View>
                <Spacing space={SH(35)} />
                <Text style={PaymentsStyle.CreditCardTextStyle}>
                  Paytm Wallet
                </Text>
                <View>
                  <TouchableOpacity>
                    <Image
                      source={images.UPI_Image_Visa_4}
                      resizeMode="contain"
                      style={PaymentsStyle.PaytmLogoImage}
                    />
                    <Text style={PaymentsStyle.PaytmText}>Paytm Wallet</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View style={PaymentsStyle.CenteredView}>
                  <View style={PaymentsStyle.ModalView}>
                    {modalcontent === 1 ? (
                      <PaymentModalData
                        onPress={() => setModalVisible(!modalVisible)}
                      />
                    ) : modalcontent === 2 ? (
                      <PaymentModalData
                        onPress={() => setModalVisible(!modalVisible)}
                      />
                    ) : (
                      <View style={PaymentsStyle.MinPaymentsView}>
                        <View style={PaymentsStyle.FlexRowCloseIcon}>
                          <View>
                            <Text style={PaymentsStyle.payviacard}>UPI</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}>
                            <VectorIcon
                              icon="FontAwesome"
                              name="window-close"
                              color={Colors.theme_background}
                              size={SF(34)}
                            />
                          </TouchableOpacity>
                        </View>
                        <Input
                          inputStyle={PaymentsStyle.InputColor}
                          title={'UPI ID'}
                          titleStyle={PaymentsStyle.TitleStyle}
                          placeholder={'upihandle@bankname'}
                          onChangeText={text =>
                            setState({...state, UPINumber: text})
                          }
                          value={state.UPINumber}
                        />
                        <View style={PaymentsStyle.ButtonView}>
                          <Button title="Verify and Pay $456" />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};
export default MangePaymentMethode;
