import React from 'react'; // Importando o React
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importando o Navbar
import AppRoutes from './routes/AppRoutes'; // Importando o componente de rotas

const App: React.FC = () => {

  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isAuthenticated} />
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
