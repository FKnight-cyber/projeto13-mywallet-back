import db from "../databases/mongodb.js";

export async function getRecords(_,res){
    const { token } = res.locals;
    try{
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(400).send("Invalid session!");

        const user = await db.collection('users').findOne({_id: session.userId});
        if(!session) return res.status(400).send("User not found!");

        const records = await db.collection('records').find({email: user.email}).toArray();

        const data ={
            records,
            balance: user.balance
        }

        res.status(201).send(data);
    }catch(error){
        res.status(422).send("It was not possible to get the records!",error);
    }
};

export async function addRecord(_,res){
    const { token } = res.locals;

    const cleansedSchema = res.locals.cleansedSchema;
    
    try {
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(400).send("Invalid session!");

        const user = await db.collection('users').findOne({_id: session.userId});
        if(!session) return res.status(400).send("User not found!");

        const newBalance = parseFloat(parseFloat(user.balance) + parseFloat(cleansedSchema.price)).toFixed(2);

        await db.collection('users').updateOne({_id: session.userId},{$set:{balance:newBalance}});

        await db.collection('records')
        .insertOne({
            ...cleansedSchema,
            email:user.email,
            time: Date.now()
        });
        res.status(201).send('record added successfuly')
    }catch(error){
        res.status(422).send("It was not possible to add the record!",error);
    }
};

export async function removeRecord(req,res){
    const { token } = res.locals;
    const {index} = req.params;

    try {
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(400).send("Invalid session!");

        const user = await db.collection('users').findOne({_id: session.userId});
        if(!session) return res.status(400).send("User not found!");

        let records = await db.collection('records').find({email: user.email}).toArray();
        
        const record = records[index];

        const newBalance = user.balance - record.price;

        await db.collection('records').deleteOne(record);
        await db.collection('users').updateOne({_id: session.userId},{$set:{balance:newBalance}})

        records = await db.collection('records').find({email: user.email}).toArray();

        const data ={
            records,
            balance: newBalance
        }

        res.status(200).send(data);
    }catch(error){
        return res.sendStatus(400);
    }
};

export async function updateRecord(req,res){
    const { token } = res.locals;
    const idRegister = req.params.index;
    const cleansedSchema = res.locals.cleansedSchema;

    try {
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(400).send("Invalid session!");

        const user = await db.collection('users').findOne({_id: session.userId});
        if(!session) return res.status(400).send("User not found!");

        let records = await db.collection('records').find({email: user.email}).toArray();
  
        const record = records[idRegister];

        const newBalance = parseFloat(user.balance) + parseFloat(cleansedSchema.price) - parseFloat(record.price);

        await db.collection('records').updateOne({_id:record._id},{$set:{
            price: cleansedSchema.price,
            description: cleansedSchema.description,
            time: Date.now()
        }});
     
        await db.collection('users').updateOne({_id: session.userId},{$set:{balance:newBalance}})

        records = await db.collection('records').find({email: user.email}).toArray();

        const data ={
            records,
            balance: newBalance
        }
        res.status(200).send(data);
    }catch(error){
        return res.sendStatus(400);
    }
};