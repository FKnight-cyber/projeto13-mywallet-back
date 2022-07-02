import { stripHtml } from 'string-strip-html';
import joi from 'joi';

export default async function recordSchema(req,res,next){
    const { price, description, recordControl } = req.body

    const recordScheme = joi.object({
        price: joi.number().min(0).required(),
        description: joi.string().max(26).required()
    });

    const cleansedSchema = {
        price: price,
        description: stripHtml(description).result.trim()
    };

    const { error } = recordScheme.validate(cleansedSchema);

    let newPrice = parseFloat(price).toFixed(2);

    if(recordControl){
        newPrice = (-1)*parseFloat(price).toFixed(2);
    }

    const newSchema = {
        price: newPrice,
        description: stripHtml(description).result.trim()
    }

    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    };

    res.locals.cleansedSchema = newSchema;

    next();
}