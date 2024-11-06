import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import AppHeader from '../../components/commonComponents/AppHeader';
import BottomMenu from '../../components/commonComponents/BottomMenu';
import RouteName from '../../routes/RouteName';
import VectoreIcons from '../../components/commonComponents/VectoreIcons';
import previsaoColheita from '../../../assets/PrevisaoColheita.png';
import contagemFrutos from '../../../assets/ContagemFrutos.png';
import previsaoFlorada from '../../../assets/PrevisaoFlorada.png';
import identificacaoPragas from '../../../assets/IdentificacaoPragas.png';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();

  const data = [
    {
      title: 'Previsão\nde Colheita',
      image: previsaoColheita,
      actions: [
        { text: 'Coletar imagens', route: RouteName.PHOTO_COLLECTION_SCREEN },
        { text: 'Análise Colheita', route: RouteName.RESULTS_SCREEN },
        { text: 'Gráficos', route: RouteName.TALHAO_WIZARD_SCREEN },
      ],
    },
    {
      title: 'Contagem\nde Frutos',
      image: contagemFrutos,
      actions: [
        { text: 'Coletar imagens', route: RouteName.PHOTO_HARVEST_SCREEN },
        { text: 'Análise Frutos', route: RouteName.PHOTO_HARVEST_SCREEN },
      ],
    },
    {
      title: 'Previsão pela\nFlorada',
      image: previsaoFlorada,
      actions: [
        { text: 'Coletar imagens', route: RouteName.PHOTO_FLOWERING_SCREEN },
        { text: 'Análise Colheita', route: RouteName.PHOTO_FLOWERING_SCREEN },
      ],
    },
    {
      title: 'Identificação\nde Pragas',
      image: identificacaoPragas,
      actions: [
        { text: 'Coletar imagens', route: RouteName.PHOTO_PESTS_SCREEN },
        { text: 'Análise Pragas', route: RouteName.PHOTO_PESTS_SCREEN },
      ],
    },
  ];

  const renderItem = (item, itemIndex) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            index === item.actions.length - 1 && styles.lastButton,
          ]}
          onPress={() => navigation.navigate(action.route)}
        >
          <Text style={styles.buttonText}>{action.text}</Text>
          <VectoreIcons
            icon="Feather"
            name="chevron-right"
            color="#000"
            size={20}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      <Swiper
        showsPagination={true}
        loop={false}
        style={styles.wrapper}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
      >
        {data.map((item, index) => (
          <View key={index}>{renderItem(item, index)}</View>
        ))}
      </Swiper>
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#230C02',
  },
  wrapper: {
    height: height * 0.75,
  },
  card: {
    backgroundColor: '#230C02',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    height: height * 0.75,
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: height * 0.4,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 32,
    position: 'absolute',
    alignSelf: 'center',
    color: '#FFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FFF5E9',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#230C02',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastButton: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dot: {
    backgroundColor: '#E2CAAC',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#06ff00',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});

export default HomeScreen;
