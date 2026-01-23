enum OrderStatus {
  Preparation = "preparation",
  Ontheway = "ontheway",
  Delivered = "delivered",
  Pending = "pending",
  Cancelled = "cancelled"
}
enum PaymentMethods {
  Khalti = "khalti",
  Esewa = "esewa",
  COD = "cod"
}

enum PaymentStatus {
  Paid = "paid",
  Unpaid = "unpaid"
}
export { OrderStatus, PaymentMethods, PaymentStatus }