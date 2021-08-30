const { PrismaClient } = require("@prisma/client");
const { ApolloServer, PubSub } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { getUserId } = require("./utils");

const Query = require("./resolvers/query.js");
const Mutation = require("./resolvers/mutation.js");
const Subscription = require("./resolvers/subscription.js");
const User = require("./resolvers/user.js");
const Order = require("./resolvers/order.js");
const Cart = require("./resolvers/cart.js");

const Product = require("./resolvers/product.js");

const Stock = require("./resolvers/stock.js");
const Cartproduct = require("./resolvers/cartproduct.js");

const resolvers = {
   Query,
   Mutation,
   Subscription,
   User,
   Order,
   Cart,
   Stock,
   Product,
   Cartproduct,
};
const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new ApolloServer({
   typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
   resolvers,
   context: ({ req }) => {
      return {
         ...req,
         prisma: prisma,
         pubsub,
         userId: req && req.headers.authorization ? getUserId(req) : null,
      };
   },
}).listen({ port: 4000 }, () =>
   console.log(`Server up at: http://localhost:4000 `)
);
