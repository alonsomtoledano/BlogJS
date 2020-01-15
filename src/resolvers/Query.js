import { argumentsObjectFromField } from "apollo-utilities";

const Query = {
  ok: () => {
    return "ok";
  },
  getUser: async (parent, args, ctx, info) => {
    const { _id, token} = args;
    const { client } = ctx;

    const db = client.db("NetflixDatabase");
    const collectionUsers = db.collection("users");

    const findUser = await collectionUsers.findOne({ _id: ObjectID(_id) });
    console.log(findUser);
    if(findUser.token === token){
      return findUser;
    }
    else throw new Error("User is not logged in");
  }
}

export {Query as default}