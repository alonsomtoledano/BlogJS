import { ObjectID } from "mongodb";
import * as uuid from 'uuid';

const Mutation = {
    addUser: async (parent, args, ctx, info) => {
        const { userName, password } = args;
        const { collectionUsers } = ctx;

        const findUser = await collectionUsers.findOne({ userName });
        if (!findUser){
            const result = await collectionUsers.insertOne({ userName, password });

            return result.ops[0];
        }
        else throw new Error("User already exist");
    },
    login: async (parent, args, ctx, info) => {
        const { userName, password } = args;
        const { collectionUsers } = ctx;

        const findUser = await collectionUsers.findOne({ userName });
        if(!findUser) throw new Error("Wrong UserName");
        if(findUser.password === password){
            const token = uuid.v4();

            await collectionUsers.updateOne({ userName },
            {$set: {token: token}});
            
            return token;
        }
        else throw new Error("Wrong Password");
    },
    logout: async (parent, args, ctx, info) => {
        const { userID, token } = args;
        const { collectionUsers } = ctx;

        const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
        if(findUser){
            await collectionUsers.updateOne({ _id: ObjectID(userID) },
            {$set: {token: null}});
            
            return await collectionUsers.findOne({ _id: ObjectID(userID) });
        }
        else throw new Error("User is not logged in");
    },
    removeUser: async (parent, args, ctx, info) => {
        const { userID, token } = args;
        const { collectionUsers } = ctx;
  
        const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
        if(findUser){
            await collectionUsers.findOneAndDelete({ _id: ObjectID(userID) });
    
            return findUser;
        }
        else throw new Error("User is not logged in");
    },
    addPost: async (parent, args, ctx, info) => {
        const { userName, token, title, content } = args;
        const { collectionUsers, collectionPosts } = ctx;

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const findUser = await collectionUsers.findOne({ userName });
        if(!findUser) throw new Error("Wrong UserName");
        if(findUser.token === token){
            const result = await collectionPosts.insertOne({ title, content, date: `${day}/${month}/${year}`, user: findUser._id });

            return result.ops[0];
        }
        else throw new Error("User is not logged in");
    }
}

export {Mutation as default}