import db from '../databases/mongodb.js';
import bcrypt from 'bcrypt';
import {v4} from 'uuid'

export async function signUp(req,res){
    const { password } = req.body;

    const cleansedRegister = res.locals.cleansedRegister;

    console.log(cleansedRegister)
    console.log(res.locals.cleansedRegister)

    const passwordHash = bcrypt.hashSync(password,10);

    try {
        await db.collection('users').insertOne({...cleansedRegister, password: passwordHash});
        res.status(200).send('OK');
    }catch(error){
        res.status(422).send("It was not possible to register the user!",error);
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

            res.status(200).send({
                user: checkUser.name,
                hasRegister:true,
                token
            });
        }else{
            return res.status(404)
            .send(`There's no account registered with this ${user} email,
             register your account and try again!`);
        }
    }catch(error){
        res.status(422).send({messageError: `error occurred: ${error}`})
    }
};