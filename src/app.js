import { MongoClient } from "mongodb";
import { GraphQLServer, PubSub } from "graphql-yoga";
import "babel-polyfill";
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';


const usr = "alonso";
const pwd = "12345";
const url = "cluster0-uuiaf.gcp.mongodb.net/test";

const pubsub = new PubSub();

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */
const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  return client;
};

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function(context) {
  const resolvers = {
    Query,
    Mutation,
    Post
  };

  const server = new GraphQLServer({ typeDefs: './src/schema.graphql', resolvers, context });
  const options = {
    port: 8000
  };

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
}
const runApp = async function() {
  const client = await connectToDb(usr, pwd, url);
  const db = client.db("blogDatabase");
  const collectionUsers = db.collection("users");
  const collectionPosts = db.collection("posts");

  console.log("Connect to Mongo DB");
  try {
    runGraphQLServer({ client, pubsub, collectionUsers, collectionPosts });
  } catch (e) {
    client.close();
  }
};

runApp();
