const { PrismaClient } = require("@prisma/client");
const { ApolloServer, PubSub } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { getUserId } = require("./utils");

const Query = require("./resolvers/query.js");
const Mutation = require("./resolvers/mutation.js");
const Subscription = require("./resolvers/subscription.js");
const User = require("./resolvers/user.js");
const Tournament = require("./resolvers/tournament.js");
const Group = require("./resolvers/group.js");
const Competator = require("./resolvers/competator.js");
const Match = require("./resolvers/match.js");

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Competator,
  Group,
  Tournament,
  User,
  Match,
};
const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
}).listen({ port: 4000 }, () =>
  console.log(`Server up at: http://localhost:4000 `)
);
