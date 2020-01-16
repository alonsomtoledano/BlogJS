import { ObjectID } from "mongodb";

const Post = {
    user: async (parent, args, ctx, info) => {
        const { collectionUsers } = ctx;
        const _id = parent.user;

        return await collectionUsers.findOne({ _id: ObjectID(_id) });
    }
}

export {Post as default}