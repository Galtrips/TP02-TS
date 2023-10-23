import mongoose, {Document, Model} from "mongoose";

interface IProduct extends Document{
    name: string;
    description: string,
    price: number;
    stock: number;
}

const ProductsSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        default: 10,
        required: false
    },    
  }  
)

const ProductModel: Model<IProduct> = mongoose.model<IProduct>('Products', ProductsSchema);

export default ProductModel;
export{
  ProductModel,
  IProduct
}  