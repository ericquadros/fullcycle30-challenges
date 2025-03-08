import { Column, ForeignKey, Model, PrimaryKey, Table, BelongsTo } from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({
  tableName: "order_items",
  timestamps: true,
})
export default class OrderItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  declare orderId: string;

  @BelongsTo(() => OrderModel)
  declare order: OrderModel;

  @Column({ allowNull: false })
  declare productId: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare quantity: number;

  @Column({ allowNull: false })
  declare price: number;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
} 