import { ObjectID } from "mongodb";
import * as uuid from 'uuid';

const Mutation = {
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
    addUser: async (parent, args, ctx, info) => {
        const { userName, password } = args;
        const { collectionUsers, pubsub } = ctx;

        const findUser = await collectionUsers.findOne({ userName });
        if (!findUser){
            const result = await collectionUsers.insertOne({ userName, password });

            pubsub.publish(
                "12345",
                {
                    newUserSubscription: result.ops[0]
                }
            );

            return result.ops[0];
        }
        else throw new Error("User already exist");
    },
    addPost: async (parent, args, ctx, info) => {
        const { userID, token, title, content } = args;
        const { collectionUsers, collectionPosts, pubsub } = ctx;

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
        if(findUser){
            const result = await collectionPosts.insertOne({ title, content, date: `${day}/${month}/${year}`, user: userID });

            pubsub.publish(
                userID,
                {
                    userSubscription: result.ops[0]
                }
            );

            return result.ops[0];
        }
        else throw new Error("User is not logged in");
    },
    updateUser: async (parent, args, ctx, info) => {
        const { userID, token, userName, password } = args;
        const { collectionUsers } = ctx;

        if(await collectionUsers.findOne({ userName })) throw new Error("User already exist");

        const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
        if(findUser){
            await collectionUsers.updateOne({ _id: ObjectID(userID) },
                {$set: { userName: userName || findUser.userName, 
                password: password || findUser.password}});
            
            return await collectionUsers.findOne({ _id: ObjectID(userID) });
        }
        else throw new Error("User is not logged in");
    },
    updatePost: async (parent, args, ctx, info) => {
        const { userID, token, postID, title, content } = args;
        const { collectionUsers, collectionPosts, pubsub } = ctx;

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
        if(findUser){
            const findPost = await collectionPosts.findOne({ _id: ObjectID(postID) });
            await collectionPosts.updateOne({ _id: ObjectID(postID) },
                {$set: { title: title || findPost.title, 
                content: content || findPost.content,
                date: `${day}/${month}/${year}`}});

                const updatedPost = await collectionPosts.findOne({ _id: ObjectID(postID) });

                pubsub.publish(
                    postID,
                    {
                        postSubscription: updatedPost
                    }
                );
            
            return updatedPost;
        }
        else throw new Error("User is not logged in");
    },
    removeUser: async (parent, args, ctx, info) => {
        const { userID, token } = args;
        const { collectionUsers, collectionPosts } = ctx;
  
        const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
        if(findUser){
            await collectionUsers.deleteOne({ _id: ObjectID(userID) });
            await collectionPosts.deleteMany({ user: userID });
    
            return findUser;
        }
        else throw new Error("User is not logged in");
    },
    removePost: async (parent, args, ctx, info) => {
        const { userID, token, postID } = args;
        const { collectionUsers, collectionPosts } = ctx;
  
        const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
        if(findUser){
            const findPost = await collectionPosts.findOne({ _id: ObjectID(postID) });
            await collectionPosts.deleteOne({ _id: ObjectID(postID) });
    
            return findPost;
        }
        else throw new Error("User is not logged in");
    }
}

export {Mutation as default}