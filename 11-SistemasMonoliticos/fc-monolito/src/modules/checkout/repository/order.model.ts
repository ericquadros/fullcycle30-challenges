import { Column, Model, PrimaryKey, Table, HasMany } from "sequelize-typescript";
import OrderItemModel from "./order-item.model";

@Table({
  tableName: "orders",
  timestamps: true,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare clientId: string;

  @Column({ allowNull: true })
  declare invoiceId: string;

  @Column({ allowNull: false })
  declare status: string;

  @HasMany(() => OrderItemModel)
  declare items: OrderItemModel[];

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
} 