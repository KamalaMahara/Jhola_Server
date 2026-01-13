import { Table, Column, Model, DataType } from 'sequelize-typescript'
@Table({
  tableName: 'users', // yo table name vaneko supabase ko GUI ma dekhine name ho
  modelName: 'user',  // yo chai hamro project vitra ko table lae acess garne name 
  timestamps: true
})

class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.STRING

  })
  declare username: string;

  @Column({
    type: DataType.STRING

  })
  declare email: string;

  @Column({
    type: DataType.STRING
  })
  declare password: string;
}
export { User }
