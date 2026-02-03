import { Table, Column, DataType, Model, PrimaryKey, AllowNull } from 'sequelize-typescript'
import { PaymentMethods, PaymentStatus } from '../../globals/types/index.js'

@Table({
  tableName: "payments",
  modelName: "Payment",
  timestamps: true
})
class Payment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.ENUM(PaymentMethods.COD, PaymentMethods.Esewa, PaymentMethods.Khalti),
    defaultValue: PaymentMethods.COD
  })
  declare paymentMethod: string

  @Column({
    type: DataType.ENUM(PaymentStatus.Paid, PaymentStatus.Unpaid),
    defaultValue: PaymentStatus.Unpaid
  })
  declare paymentstatus: string

  @Column({
    type: DataType.STRING
  })
  declare pidx: string
}

export default Payment 