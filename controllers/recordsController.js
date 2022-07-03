import { ObjectId } from "mongodb";
import db from "../databases/mongodb.js";

export async function getRecords(_,res){
    const { token } = res.locals;
    try{
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(498).send({message:"Invalid session!"});

        const user = await db.collection('users').findOne({_id: session.userId});
        if(!session) return res.status(404).send({message:"User not found!"});

        const records = await db.collection('records').find({email: user.email}).toArray();

        const data ={
            records,
            balance: user.balance
        }

        res.status(201).send(data);
    }catch(error){
        res.status(500).send({message:"error occurred!",error});
    }
};

export async function addRecord(_,res){
    const { token } = res.locals;

    const cleansedSchema = res.locals.cleansedSchema;
    
    try {
        const session = await db.collection('sessions').findOne(token);
        if(!session) return res.status(498).send({message:"Invalid session!"});

        const user = await db.collection('users').findOne({_id: new ObjectId(session.userId)});
        if(!session) return res.status(404).send({message:"User not found!"});

        const newBalance = parseFloat(parseFloat(user.balance) + parseFloat(cleansedSchema.price)).toFixed(2);

        await db.collection('users').updateOne({_id: new ObjectId(session.userId)},{$set:{balance:newBalance}});

        await db.collection('records')
        .insertOne({
            ...cleansedSchema,
            email:user.email,
            time: Date.now()
        });
        res.status(201).send({message:"record added successfuly"})
    }catch(error){
        res.status(500).send({message:"error occurred!",error});
    }
};

export async function removeRecord(req,res){
    const { token } = res.locals;
    const { index } = req.params;

    try {
        const session = await db.collection('sessions').findOne(token);
        if(!session) return res.status(498).send({message:"Invalid session!"});

        const user = await db.collection('users').findOne({_id: new ObjectId(session.userId)});
        if(!session) return res.status(404).send({message:"User not found!"});

        let records = await db.collection('records').find({email: user.email}).toArray();
        
        const record = records[index];

        const newBalance = user.balance - record.price;

        await db.collection('records').deleteOne(record);
        await db.collection('users').updateOne({_id: new ObjectId(session.userId)},{$set:{balance:newBalance}})

        records = await db.collection('records').find({email: user.email}).toArray();

        const data ={
            records,
            balance: newBalance
        }

        res.status(201).send(data);
    }catch(error){
        res.status(500).send({message:"error occurred!",error});
    }
};

export async function updateRecord(req,res){
    const { token } = res.locals;
    const idRegister = req.params.index;
    const cleansedSchema = res.locals.cleansedSchema;

    try {
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(498).send({message:"Invalid session!"});

        const user = await db.collection('users').findOne({_id: new ObjectId(session.userId)});
        if(!session) return res.status(404).send({message:"User not found!"});

        let records = await db.collection('records').find({email: user.email}).toArray();
  
        const record = records[idRegister];

        const newBalance = parseFloat(user.balance) + parseFloat(cleansedSchema.price) - parseFloat(record.price);

        await db.collection('records').updateOne({_id:new ObjectId(record._id)},{$set:{
            price: cleansedSchema.price,
            description: cleansedSchema.description,
            time: Date.now()
        }});
     
        await db.collection('users').updateOne({_id: new ObjectId(session.userId)},{$set:{balance:newBalance}})

        records = await db.collection('records').find({email: user.email}).toArray();

        const data ={
            records,
            balance: newBalance
        }
        res.status(201).send(data);
    }catch(error){
        res.status(500).send({message:"error occurred!",error});
    }
};