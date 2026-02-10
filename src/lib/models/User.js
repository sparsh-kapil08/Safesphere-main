
import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    emergencyContact: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

export default User;
