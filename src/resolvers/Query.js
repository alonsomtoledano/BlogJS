import { ObjectID } from "mongodb";

const Query = {
  getPost: async (parent, args, ctx, info) => {
    const { userID, token, postID } = args;
    const { collectionUsers, collectionPosts } = ctx;

    const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
    if (findUser){
      return await collectionPosts.findOne({ _id: ObjectID(postID)});
    } else throw new Error("User is not logged in");
  },
  getPosts: async (parent, args, ctx, info) => {
    const { userID, token } = args;
    const { collectionUsers, collectionPosts } = ctx;

    const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
    if (findUser){
      return await collectionPosts.find({}).toArray();
    } else throw new Error("User is not logged in");
  },
  getUserPosts: async (parent, args, ctx, info) => {
    const { userIDlog, token, userID } = args;
    const { collectionUsers, collectionPosts } = ctx;


    const findUser = await collectionUsers.findOne({ _id: ObjectID(userIDlog), token });
    if (findUser){
      return await collectionPosts.find({ author: userID }).toArray();
    } else throw new Error("User is not logged in");
  }
}

export {Query as default}