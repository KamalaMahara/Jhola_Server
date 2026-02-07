//userId(fk),productId(fk),productQuantity
//userId(fk),productId(fk),productQuantity
import { Table, Column, Model, DataType, PrimaryKey, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model.js';
import Product from './product.Model.js';

@Table({
  tableName: "carts",
  modelName: "Cart",
  timestamps: true
})

export class Cart extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4

  }) declare id: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare quantity: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,   // must match User.id type
    allowNull: false
  })
  declare userId: string;

  @BelongsTo(() => User)
  user!: User;



  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,   // must match Product.id type
    allowNull: false
  })
  declare productId: string;

  @BelongsTo(() => Product)
  product!: Product;



}