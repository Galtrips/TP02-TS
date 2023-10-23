import Joi from "joi";

// Déclarer ici les formats de validation.

const schemaFormaterCreate: Joi.ObjectSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().max(255).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().default(10).min(0)
});

const schemaFormaterUpdate: Joi.ObjectSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    description: Joi.string().max(255),
    price: Joi.number().min(0)
}).or('name', 'description', 'price');

export default schemaFormaterCreate;
export{
    schemaFormaterCreate,
    schemaFormaterUpdate
} 