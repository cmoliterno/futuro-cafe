import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("tbAnaliseRapida", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nomeGrupo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lado: {
            type: DataTypes.ENUM("Esquerdo", "Direito"),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    await queryInterface.addColumn("tbAnalise", "analiseRapidaId", {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "tbAnaliseRapida", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
    });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeColumn("tbAnalise", "analiseRapidaId");
    await queryInterface.dropTable("tbAnaliseRapida");
}
