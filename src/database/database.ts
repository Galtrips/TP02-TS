import mongoose from "mongoose";
import ProductModel,{IProduct}  from "./models/product";
import UserModel,{IUser}  from "./models/user";
import productsRoutes from "../routes/productsRoutes";

// Déclarer ici les interfaces de retour de chacune des fonctions de la BDD.

interface ProductsResult
{
	products?: IProduct[];
	error?: any;
}

interface UserResult
{
	user?: IUser;
	error?: any;
}

class Database 
{
	constructor(private isFromTest: boolean) {}

	async connect() {
		try {
			let dbAddress = (
				this.isFromTest
					? process.env.DB_ADDRESS_TEST
					: process.env.DB_ADDRESS
			) as string;
			await mongoose.connect(dbAddress);
			console.log(`DB Connected ! (${dbAddress})`);
		} catch (error) {
			console.log("Error while connecting to DB !");
			console.log(error);
		}
	}

	// Délcarer les fonctions d'accès a la BDD ici
	async getAllProducts() : Promise<ProductsResult>
	{
		try{
			let products:IProduct[] = await ProductModel.find();
			return{products: products} 
		} catch (err){
			console.error(err);
			return{error: err};  
		} 
	}

	async createProduct(name:string, description:string, price:number, stock:number) : Promise<ProductsResult>{

		let product = new ProductModel({
			name: name,
			description: description,
			price: price,
			stock: stock
		});
	
		try{
			const savedProduct: IProduct = await product.save();
			return{products:[savedProduct]};
		} catch(err){
			console.error(err);
			return{error: err};  
		} 
	} 

	async getProduct(id:string) : Promise<ProductsResult>{
		try{
			let product:IProduct[] = await ProductModel.find({_id: id});
			return{products: product} 
		} catch (err){
			console.error(err);
			return{error: err};  
		} 
	} 

	async updateProduct(id:string, name:string, description:string, price:number) : Promise<ProductsResult>{
		
		try{
			const updateProdtcut: Partial<IProduct> = {
				name: name,
				description: description,
				price: price
			};
			const product:IProduct|null = await ProductModel.findByIdAndUpdate(id, updateProdtcut);

			if (product === null){
				return {error: "Product not found"} 
			}

			return{products: [product]}
		} catch (err){
			console.error(err);
			return{error: err};  
		} 
	}	
	
	async updateStock(id:string, name:string, description:string, price:number, stock:number) : Promise<ProductsResult>{
		
		try{
			const updateProdtcut: Partial<IProduct> = {
				name: name,
				description: description,
				price: price,
				stock: stock
			};
			const product:IProduct|null = await ProductModel.findByIdAndUpdate(id, updateProdtcut);

			if (product === null){
				return {error: "Product not found"} 
			}

			return{products: [product]}
		} catch (err){
			console.error(err);
			return{error: err};  
		} 
	}

	async deleteProduct(id:string) : Promise<ProductsResult>{
		try{
			const product:IProduct|null = await ProductModel.findByIdAndDelete(id);

			if (product === null){
				return {error: "Product not found"} 
			}

			return{products: [product]}
		} catch (err){
			console.error(err);
			return{error: err};  
		} 
	}	

	async createUser(email:string, password:string) : Promise<UserResult>{
		try{
			const user = new UserModel({
				email: email,
				password: password
			});
			const savedUser: IUser = await user.save();
			return{user: savedUser};
		} catch(err){
			console.error(err);
			return{error: err};  
		} 
	}

	async getUser(email:string) : Promise<UserResult>{
		try{
			let user:IUser|null = await UserModel.findOne({email: email});

			if (user === null){
				return {error: "User not found"} 
			}
			return{user: user} 
		} catch (err){
			console.error(err);
			return{error: err};  
		} 
	}
}

export default Database;