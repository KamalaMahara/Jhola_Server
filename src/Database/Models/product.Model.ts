import { Table, Column, Model, DataType, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript'
import Category from './categoryModel.js';

@Table({
  tableName: 'products', // yo table name vaneko supabase ko GUI ma dekhine name ho
  modelName: 'Product',  // yo chai hamro project vitra ko table lae acess garne name 
  timestamps: true
})

class Product extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false

  })
  declare productName: string;

  @Column({
    type: DataType.TEXT

  })
  declare productDescription: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  declare productPrice: number;


  @Column({
    type: DataType.INTEGER,

  })
  declare productTotalStock: number


  @Column({
    type: DataType.INTEGER,

  })
  declare productDiscount: number

  @Column({
    type: DataType.STRING,
  })
  declare productImageUrl: string

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  categoryId!: string;

  @BelongsTo(() => Category)
  category!: Category;

}
export default Product 
