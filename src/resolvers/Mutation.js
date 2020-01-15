import { ObjectID } from "mongodb";
import * as uuid from 'uuid';

const Mutation = {
    addUser: async (parent, args, ctx, info) => {
        const { userName, password } = args;
        const { client } = ctx;

        const db = client.db("NetflixDatabase");
        const collection = db.collection("users");

        const findUser = await collection.findOne({ userName });
        if (!findUser){
            const result = await collection.insertOne({ userName, password });

            return {
                _id: result.ops[0]._id,
                userName,
                password
            }
        }
        else throw new Error("User already exist");
    },
    login: async (parent, args, ctx, info) => {
        const { userName, password } = args;
        const { client } = ctx;

        const db = client.db("NetflixDatabase");
        const collection = db.collection("users");

        const findUser = await collection.findOne({ userName });
        if(findUser.password === password){
            const token = uuid.v4();

            await collection.updateOne({ userName },
            {$set: {token: token}});
            
            return token;
        }
        else throw new Error("Wrong UserName or Password");
    },
    
}

export {Mutation as default}