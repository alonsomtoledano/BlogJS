import { ObjectID } from "mongodb";
import * as uuid from 'uuid';

const Mutation = {
    login: async (parent, args, ctx, info) => {
        const { mail, password } = args;
        const { collectionUsers } = ctx;

        const findUser = await collectionUsers.findOne({ mail });
        if(!findUser) throw new Error("Wrong mail");
        if(findUser.password === password){
            const token = uuid.v4();

            await collectionUsers.updateOne({ _id: findUser._id },
            {$set: {token}});

            setTimeout( () => {
                collectionUsers.updateOne({_id: findUser._id}, {$set: {token:null}});
            }, 1800000)

            return await collectionUsers.findOne({ _id: findUser._id });
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
    addUser: async (parent, args, ctx, info) => {
        const { mail, password, author } = args;
        const { collectionUsers, pubsub } = ctx;

        const findUser = await collectionUsers.findOne({ mail });
        if (!findUser){
            const result = await collectionUsers.insertOne({ mail, password, author });

            return result.ops[0];
        }
        else throw new Error("Mail already exist");
    },
    addPost: async (parent, args, ctx, info) => {
        const { userID, token, title, description } = args;
        const { collectionUsers, collectionPosts, pubsub } = ctx;

        const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token, author: true });
        if(findUser){
            const result = await collectionPosts.insertOne({ title, description, author: userID });

            pubsub.publish(
                userID,
                {
                    userSubscription: result.ops[0]
                }
            );

            return result.ops[0];
        }
        else throw new Error("User is not logged in or is not an Author");
    },
    removeUser: async (parent, args, ctx, info) => {
        const { userIDlog, token, userID } = args;
        const { collectionUsers, collectionPosts } = ctx;
  
        const findUser = await collectionUsers.findOne({ _id: ObjectID(userIDlog), token });
        if(findUser){
            if(userIDlog === userID){
                await collectionUsers.deleteOne({ _id: ObjectID(userID) });
                if(findUser.author){
                    await collectionPosts.deleteMany({ author: userID });
                }
                return findUser;
            }
            else throw new Error("You can not remove others account");
        }
        else throw new Error("User is not logged in");
    },
    removePost: async (parent, args, ctx, info) => {
        const { userID, token, postID } = args;
        const { collectionUsers, collectionPosts } = ctx;
  
        const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token, author: true });
        if(findUser){
            const findPost = await collectionPosts.findOne({ _id: ObjectID(postID) });
            if(findPost.author === userID){
                await collectionPosts.deleteOne({ _id: ObjectID(postID) });
            }
            else throw new Error("You can not remove others post");
            
    
            return findPost;
        }
        else throw new Error("User is not logged in");
    }
}

export {Mutation as default}