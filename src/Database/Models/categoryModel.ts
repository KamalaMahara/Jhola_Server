import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript'

@Table({
  tableName: 'categories', // yo table name vaneko supabase ko GUI ma dekhine name ho
  modelName: 'Category',  // yo chai hamro project vitra ko table lae acess garne name 
  timestamps: true,
  freezeTableName: true
})

class Category extends Model {
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
  declare categoryName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare categoryImageUrl: string;


}
export default Category
