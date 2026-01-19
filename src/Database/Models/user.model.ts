import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript'
@Table({
  tableName: 'Users', // yo table name vaneko supabase ko GUI ma dekhine name ho
  modelName: 'User',  // yo chai hamro project vitra ko table lae acess garne name 
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

  @Column({
    type: DataType.ENUM('customer', 'admin'),
    defaultValue: 'customer'
  })
  declare role: string;
  @Column({
    type: DataType.STRING,
    allowNull: true

  })
  declare otp: string | null
  @Column({
    type: DataType.STRING,
    allowNull: true

  })
  declare otpGeneratedTime: string | null

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false

  })
  declare isOtpVerified: boolean
}
export { User }
