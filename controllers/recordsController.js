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

    const cleansedSchema = res.locals.cleansedScheme;
    
    try {
        const session = await db.collection('sessions').findOne({token});
        if(!session) return res.status(400).send("Invalid session!");

        const user = await db.collection('users').findOne({_id: session.userId});
        if(!session) return res.status(400).send("User not found!");

        const newBalance = user.balance + cleansedSchema.price;

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