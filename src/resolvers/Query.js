import { ObjectID } from "mongodb";

const Query = {
  ok: () => {
    return "ok";
  },
  getUser: async (parent, args, ctx, info) => {
    const { userID } = args;
    const { collectionUsers } = ctx;

    return await collectionUsers.findOne({ _id: ObjectID(userID)});
  },
  getPost: async (parent, args, ctx, info) => {
    const { postID } = args;
    const { collectionPosts } = ctx;

    return await collectionPosts.findOne({ _id: ObjectID(postID)});
  },
  getUsers: async (parent, args, ctx, info) => {
    const { collectionUsers } = ctx;

    return await collectionUsers.find({}).toArray();
  },
  getPosts: async (parent, args, ctx, info) => {
    const { collectionPosts } = ctx;

    return await collectionPosts.find({}).toArray();
  },
  getUserPosts: async (parent, args, ctx, info) => {
    const { userID } = args;
    const { collectionPosts } = ctx;

    return await collectionPosts.find({ user: userID }).toArray();
  }
}

export {Query as default}