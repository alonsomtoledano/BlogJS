import { ObjectID } from "mongodb";

const Query = {
  ok: () => {
    return "ok";
  },
  getUser: async (parent, args, ctx, info) => {
    const { userID, token} = args;
    const { collectionUsers } = ctx;

    const findUser = await collectionUsers.findOne({ _id: ObjectID(userID), token });
    if(findUser){
      return findUser;
    }
    else throw new Error("User is not logged in");
  }
}

export {Query as default}