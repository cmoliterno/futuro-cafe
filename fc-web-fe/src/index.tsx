import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CssBaseline from "@mui/material/CssBaseline";
import App from './App';

// Importações para o Leaflet
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './styles/leaflet-fixes.css';

// Configurar ícones do Leaflet para o webpack
import L from 'leaflet';
// Configurar diretamente os ícones em vez de manipular o protótipo
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline>
      <App />
    </CssBaseline>
  </React.StrictMode>,
  document.getElementById('root')
);
