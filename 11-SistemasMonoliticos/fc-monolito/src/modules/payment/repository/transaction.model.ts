import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { TransactionStatus } from "../domain/transaction";

@Table({
  tableName: "transactions",
  timestamps: true,
})
export default class TransactionModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare orderId: string;

  @Column({ allowNull: true })
  declare amount: number;

  @Column({ 
    allowNull: false,
    type: 'ENUM',
    values: Object.values(TransactionStatus)
  })
  declare status: TransactionStatus;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
