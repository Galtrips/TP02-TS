import { Request, Response } from "express";
import HTTPCode from "../../utils/enums/HTTPCode";
import { schemaFormaterCreate, schemaFormaterUpdate} from "../../middlewares/joiValidator";

async function getAllProducts(req: Request, res: Response)
{
	let {products, error} = await req.app.locals.database.getAllProducts();
	if(error)
		return res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error});
	else
		return res.status(HTTPCode.OK).json({products});
}

async function getProduct(req: Request, res: Response)
{
	let {products, error} = await req.app.locals.database.getProduct(req.params.id);
	if(error)
		return res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error});
	else
		return res.status(HTTPCode.OK).json({products});
}

async function createProduct(req: Request, res: Response)
{
	let isBodyValid = schemaFormaterCreate.validate(req.body);
	if(isBodyValid.error){ 
		let details = isBodyValid.error.details[0].message;
		console.error(details);
		return res.status(HTTPCode.BAD_REQUEST).json({error: details});
	}	

	let body = req.body;
	let {products, error} = await req.app.locals.database.createProduct(body.name, body.description, body.price, body.stock);

	if(error){ 
		res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error})
	} else {  
		res.status(HTTPCode.CREATED).json({products});
	} 
}

async function updateProduct(req: Request, res: Response)
{
	let isBodyValid = schemaFormaterUpdate.validate(req.body);
	if(isBodyValid.error){ 
		let details = isBodyValid.error.details[0].message;
		console.error(details);
		return res.status(HTTPCode.BAD_REQUEST).json({error: details});
	}	

	let body = req.body;
	let {products, error} = await req.app.locals.database.updateProduct(req.params.id ,body.name, body.description, body.price);

	if(error){ 
		if (error === "Product not found")
			res.status(HTTPCode.NOT_FOUND).json({error})
		else  
			res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error})
	} else {  
		res.status(HTTPCode.CREATED).json({products});
	} 
}

async function deleteProduct(req: Request, res: Response)
{
	let {products, error} = await req.app.locals.database.deleteProduct(req.params.id);
	if(error)
		if (error === "Product not found")
			res.status(HTTPCode.NOT_FOUND).json({error})
		else  
			res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error})
	else
		return res.status(HTTPCode.OK).json({products});
}

async function buyProduct(req: Request, res: Response)
{
	try{ 
		let {products, error} = await req.app.locals.database.getProduct(req.params.id);

		if (!products){
			return res.status(HTTPCode.NOT_FOUND).json({error: "Product not found"});
		}

		if (products[0].stock == 0){
			return res.status(HTTPCode.OK).json({error: "Product out of stock"});
		}

		let productReturn = await req.app.locals.database.updateStock(req.params.id, products[0].name, products[0].description, products[0].price, (products[0].stock - 1));

		if (productReturn.error){
			return res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error: productReturn.error});
		}
		productReturn.products![0].stock = productReturn.products![0].stock - 1;
		return res.status(HTTPCode.OK).json(productReturn.products);
	} catch(err){
		console.error(err);
		return res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({error: err});
	} 	
}

export default {
	getAllProducts,
	createProduct,
	getProduct,
	updateProduct,
	deleteProduct,
	buyProduct
}