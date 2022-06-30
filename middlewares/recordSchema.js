import { stripHtml } from 'string-strip-html';
import joi from 'joi';

export default async function recordSchema(req,res,next){
    const { price, description, recordControl } = req.body
    let newPrice = parseFloat(price).toFixed(2);

    if(recordControl){
        newPrice = (-1)*parseFloat(price).toFixed(2);
    }

    const recordScheme = joi.object({
        price: joi.number().required(),
        description: joi.string().max(30).required()
    });

    const cleansedSchema = {
        price: newPrice,
        description: stripHtml(description).result.trim()
    };

    const { error } = recordScheme.validate(cleansedSchema);

    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    };

    res.locals.cleansedSchema = cleansedSchema;

    next();
}