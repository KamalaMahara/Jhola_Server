// import type {Request,Response} from "express"



// class ProductController{
//   createProduct(req:Request, res:Response):Promise<void>{
//     const{productName,productDescription,productPrice,productTotalStock,productDiscount} = req.body

//     if(!productName || !productDescription || !productPrice || !productTotalStock || !productDiscount ){
//       res.status(400).json({
//         message:"please provide all the product details"
//       })
//       return
//     }
//   }
// }