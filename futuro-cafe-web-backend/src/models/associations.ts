import Login from './Login';
import Perfil from './Perfil';
import Role from './Role';
import Pessoa from './Pessoa';
import PessoaFisica from './PessoaFisica';
import Projeto from './Projeto';
import Grupo from './Grupo';
import Cultivar from './Cultivar';
import CultivarEspecie from './CultivarEspecie';
import Fazenda from './Fazenda';
import Talhao from './Talhao';

// Define associations
export const setupAssociations = () => {
    // One-to-Many
    Role.hasMany(Login, { foreignKey: 'RoleId' });
    Login.belongsTo(Role, { foreignKey: 'RoleId' });

    Grupo.hasMany(Pessoa, { foreignKey: 'GrupoId' });
    Pessoa.belongsTo(Grupo, { foreignKey: 'GrupoId' });

    Fazenda.hasMany(Talhao, { foreignKey: 'FazendaId' });
    Talhao.belongsTo(Fazenda, { foreignKey: 'FazendaId' });

    CultivarEspecie.hasMany(Cultivar, { foreignKey: 'CultivarEspecieId' });
    Cultivar.belongsTo(CultivarEspecie, { foreignKey: 'CultivarEspecieId' });

    PessoaFisica.hasMany(Login, { foreignKey: 'PessoaFisicaId' });
    Login.belongsTo(PessoaFisica, { foreignKey: 'PessoaFisicaId' });
    
    Login.belongsToMany(Perfil, { through: 'LoginPerfil', foreignKey: 'LoginId' });
    Perfil.belongsToMany(Login, { through: 'LoginPerfil', foreignKey: 'PerfilId' });
    

    // Additional associations can be added here as needed
};
