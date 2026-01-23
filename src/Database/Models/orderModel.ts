import { Table, Column, DataType, Model, PrimaryKey, AllowNull } from 'sequelize-typescript'
import { OrderStatus } from '../../globals/types/index.js';

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true
})
class Order extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [10, 10], //[min,max]
        msg: "phone number must be 10 digits.10 vanda sano ,thulo hunu  vayena"
      }
    }
  })
  declare phoneNumber: string

  @Column({
    type: DataType.STRING,
    allowNull: false,

  })
  declare shippingAddress: string

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  declare totalAmount: string
  @Column({
    type: DataType.ENUM(OrderStatus.Cancelled, OrderStatus.Delivered, OrderStatus.Ontheway, OrderStatus.Pending, OrderStatus.Preparation),
    defaultValue: OrderStatus.Pending
  })
  declare OrderStatus: string
}
export default Order