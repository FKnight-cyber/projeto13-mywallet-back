import { stripHtml } from 'string-strip-html';
import joi from 'joi';

export default async function authSchema(req,res,next){
    const { name, email,password } = req.body;

    const cleansedRegister = {
        name: stripHtml(name).result,
        email: stripHtml(email).result,
        password,
        balance: 0
    }

    const authSchema = joi.object({
        name: joi.string().trim().required(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi.string().trim().required(),
        balance: joi.number().required()
    });

    const { error } = authSchema.validate(cleansedRegister);

    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    }

    res.locals.cleansedRegister = cleansedRegister;
    next();
}