import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "products",
  timestamps: true,
})
export default class StoreCatalogProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  purchasePrice: number;

  // Campos que não usamos nesta perspectiva, deste módulo, 
  // mas é necessário declarar para o sequelize funcionar corretamente
  @Column({ allowNull: false })
  stock: number;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
