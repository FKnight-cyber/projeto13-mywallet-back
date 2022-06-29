import express,{json} from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import joi from 'joi';
import { stripHtml } from 'string-strip-html';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);
const promise = mongoClient.connect();

promise.then(()=>{
    db = mongoClient.db(process.env.BANCO);
    console.log("Database online")
});

promise.catch(e => console.log("It was not possible to connect with the database!",e));

app.post("/", async (req,res) => {
    const { user,password } = req.body.headers;

    try{
        const checkUser = await db.collection('users').findOne({email: user});
        if(!checkUser){
            
            return res.status(404)
            .send(`There's no account registered with this ${user} email,
             register your account and try again!`);
        }
      
        if(password === checkUser.password){
            res.status(200).send({
                user: checkUser.name,
                email:checkUser.email,
                hasRegister:true
            });
        }
    }catch(error){
        res.status(422).send({messageError: `error occurred: ${e}`})
    }
});

app.post("/register" , async (req,res) => {
    console.log(req.body)
    const cleansedRegister = {
        name: stripHtml(req.body.name).result,
        email: stripHtml(req.body.email).result,
        password: stripHtml(req.body.password).result
    }

    const registerScheme = joi.object({
        name: joi.string().trim().required(),
        email: joi.string().trim().required(),
        password: joi.string().trim().required()
    });

    const { error } = registerScheme.validate(cleansedRegister);

    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    }
    try {
        await db.collection('users').insertOne(cleansedRegister);
        res.status(200).send('OK');
    }catch(error){
        res.status(422).send("It was not possible to register the user!",error);
    }
});

app.post("/add", async (req,res) => {
    const recordScheme = joi.object({
        price: joi.number().required(),
        description: joi.string().max(20).required()
    });

    const cleansedScheme = {
        price: parseInt(req.body.price),
        description: stripHtml(req.body.description).result.trim()
    };

    const { error } = recordScheme.validate(cleansedScheme);

    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    };
    
    try {
        await db.collection('records')
        .insertOne({
            ...cleansedScheme, 
            email:req.headers.user,
            time: Date.now()
        });
        res.status(201).send('record added successfuly')
    }catch(error){
        res.status(422).send("It was not possible to add the record!",error);
    }
});

app.post("/remove", async (req,res) => {
    const recordScheme = joi.object({
        price: joi.number().required(),
        description: joi.string().max(20).required()
    });

    const cleansedScheme = {
        price: (-1)*parseInt(req.body.price),
        description: stripHtml(req.body.description).result.trim()
    };

    const { error } = recordScheme.validate(cleansedScheme);

    if(error){
        return res.status(422).send(error.details.map(detail => detail.message));
    };
    
    try {
        await db.collection('records')
        .insertOne({
            ...cleansedScheme, 
            email:req.headers.user,
            time: Date.now()
        });
        res.status(201).send('record added successfuly')
    }catch(error){
        res.status(422).send("It was not possible to add the record!",error);
    }
});

app.get("/initialpage", async (req,res) => {
    console.log(req.headers.user)
    const { user } = req.headers;

    try{
        const records = await db.collection('records').find({email: user}).toArray();
        res.status(201).send(records);
    }catch(error){
        res.status(422).send("It was not possible to get the records!",error);
    }
});

app.listen(process.env.PORT)