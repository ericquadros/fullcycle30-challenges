import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

// Interface para os atributos do Balance
interface BalanceAttributes {
  id: number;
  account_id: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação de Balance (id é opcional pois é autogerado)
interface BalanceCreationAttributes extends Optional<BalanceAttributes, 'id'> {}

class Balance extends Model<BalanceAttributes, BalanceCreationAttributes> implements BalanceAttributes {
  public id!: number;
  public account_id!: string;
  public amount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Balance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Balance',
    tableName: 'balances',
    timestamps: true,
    underscored: true,
  }
);

export default Balance;
