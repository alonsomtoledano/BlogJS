import { ObjectID } from "mongodb";

const Match = {
    teams: async (parent, args, ctx, info) => {
        const { client } = ctx;
        const db = client.db("footballDatabase");
        const collection = db.collection("teams");
        const idTeam = parent.teams.map(elem => ObjectID(elem));
  
        return await collection.find({ _id: { $in: idTeam } }).toArray();
    }
}

export {Match as default}