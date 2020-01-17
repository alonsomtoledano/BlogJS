import { ObjectID } from "mongodb";

const Post = {
    author: async (parent, args, ctx, info) => {
        const { collectionUsers } = ctx;
        const _id = parent.author;

        return await collectionUsers.findOne({ _id: ObjectID(_id) });
    }
}

export {Post as default}