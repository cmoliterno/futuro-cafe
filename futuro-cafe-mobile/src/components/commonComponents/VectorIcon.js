import React from 'react';
import { Icon } from 'react-native-elements'; // ou qualquer biblioteca de ícones que você esteja usando

const VectorIcon = ({ icon, name, size, color }) => {
  return <Icon type={icon} name={name} size={size} color={color} />;
};

export default VectorIcon;
