import { stripHtml } from 'string-strip-html';
import joi from 'joi';

export default async function recordSchema(req,res,next){
    const { price, description, recordControl } = req.body
    let newPrice = parseInt(price);

    if(recordControl){
        newPrice = -1*parseInt(price);
    }

    const recordScheme = joi.object({
        price: joi.number().required(),
        description: joi.string().max(20).required()
    });

    const cleansedSchema = {
        price: newPrice,
        description: stripHtml(description).result.trim()
    };

    const { error } = recordScheme.validate(cleansedSchema);

    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    };

    res.locals.cleansedScheme = cleansedSchema;

    next();
}