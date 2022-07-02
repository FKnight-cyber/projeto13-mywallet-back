import db from '../databases/mongodb.js';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';

export async function signUp(req,res){
    const { password } = req.body;

    const cleansedRegister = res.locals.cleansedRegister;

    const passwordHash = bcrypt.hashSync(password,10);

    try {
        if(db.collection('users') !== null){
            const checkRegister = await db.collection('users').findOne({email:cleansedRegister.email});
            if(checkRegister) return res.status(404).send({message:'this email is already registered!'});
        }

        await db.collection('users').insertOne({...cleansedRegister, password: passwordHash});
        res.status(201).send('Successfully registered!');
    }catch(error){
        res.status(500).send({message: `error occurred: ${error},${db}`})
    }
};

export async function signIn(req,res){
    const { user,password } = req.body.headers;
    
    try{
        const checkUser = await db.collection('users').findOne({email: user});
        if(checkUser && bcrypt.compareSync(password, checkUser.password)){
            const token = v4();

            await db.collection('sessions').insertOne({
                token,
                userId: checkUser._id
            });

            res.status(202).send({
                user: checkUser.name,
                hasRegister:true,
                token
            });
        }else{
            return res.status(404)
            .send(`There's no account registered with this email, register your account and try again!`);
        }
    }catch(error){
        res.status(500).send({message: `error occurred: ${error}`})
    }
};