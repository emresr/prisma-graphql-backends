const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");
//user
async function signup(parent, args, context, info) {
   const password = await bcrypt.hash(args.password, 10);

   const user = await context.prisma.user.create({
      data: { ...args, password },
   });

   const token = jwt.sign({ userId: user.id }, APP_SECRET);

   return {
      token,
      user,
   };
}

async function login(parent, args, context, info) {
   const user = await context.prisma.user.findUnique({
      where: { email: args.email },
   });
   if (!user) {
      throw new Error("No such user found");
   }

   const valid = await bcrypt.compare(args.password, user.password);
   if (!valid) {
      throw new Error("Invalid password");
   }

   const token = jwt.sign({ userId: user.id }, APP_SECRET);

   return {
      token,
      user,
   };
}
async function updateUser(parent, args, context, info) {
   const updateUser = await context.prisma.user.update({
      where: {
         id: parseInt(args.id),
      },
      data: {
         email: args.email,
         name: args.name,
      },
   });
   return updateUser;
}

async function deleteUser(parent, args, context, info) {
   const deleteUser = await context.prisma.user.delete({
      where: {
         id: parseInt(args.id),
      },
   });
   return deleteUser;
}
//product
async function createProduct(parent, args, context) {
   return await context.prisma.product.create({
      data: {
         name: args.name,
         price: args.price,
      },
   });
}
//cart product
async function createCartproduct(parent, args, context) {
   // stock
   const old = await context.prisma.product.findUnique({
      where: {
         id: parseInt(args.productId),
      },
      select: {
         totalStock: true,
      },
   });
   await context.prisma.product.update({
      where: {
         id: parseInt(args.productId),
      },
      data: {
         totalStock: old.totalStock - args.amount,
      },
   });
   await context.prisma.stock.create({
      data: {
         product: { connect: { id: parseInt(args.productId) } },
         amount: -args.amount,
      },
   });
   //
   const productPrice = await context.prisma.product.findUnique({
      where: {
         id: parseInt(args.productId),
      },
      select: {
         price: true,
      },
   });
   return await context.prisma.cartproduct.create({
      data: {
         product: { connect: { id: parseInt(args.productId) } },
         amount: args.amount,
         price: productPrice.price,
      },
   });
}
async function deleteCartproduct(parent, args, context) {
   const deleteCartproduct = await context.prisma.cartproduct.delete({
      where: {
         id: parseInt(args.cartproductId),
      },
   });
   return deleteCartproduct;
}
//cart
async function createCart(parent, args, context, info) {
   const { userId } = context;

   const total = await context.prisma.cartproduct.findUnique({
      where: {
         id: parseInt(args.cartproductId),
      },
      select: {
         price: true,
         amount: true,
      },
   });

   const newCart = await context.prisma.cart.create({
      data: {
         cartproducts: { connect: { id: parseInt(args.cartproductId) } },
         total: total.price * total.amount,
         user: { connect: { id: userId } },
      },
   });
   context.pubsub.publish("NEW_CART", newCart);
   return newCart;
}
async function updateCart(parent, args, context, info) {
   const newCartProduct = await createCartproduct(parent, args, context);
   console.log(newCartProduct);
   const cartproduct = await context.prisma.cartproduct.findUnique({
      where: {
         id: parseInt(newCartProduct.id),
      },
   });

   const oldCart = await context.prisma.cart.findUnique({
      where: {
         id: parseInt(args.cartId),
      },
      select: {
         total: true,
         id: true,
      },
   });
   const updatedCart = await context.prisma.cart.update({
      where: {
         id: parseInt(args.cartId),
      },
      data: {
         cartproducts: { connect: { id: parseInt(newCartProduct.id) } },
         total: oldCart.total + cartproduct.price * cartproduct.amount,
      },
   });
   await context.pubsub.publish("NEW_CART_PRODUCT", cartproduct);
   return updatedCart;
}

//order
async function createOrder(parent, args, context) {
   const cartUser = await context.prisma.cart.findUnique({
      where: {
         id: parseInt(args.cartId),
      },
      select: {
         user: true,
      },
   });
   console.log(cartUser);
   const newOrder = await context.prisma.order.create({
      data: {
         cart: { connect: { id: parseInt(args.cartId) } },
         user: { connect: { id: parseInt(cartUser.user.id) } },
      },
   });
   context.pubsub.publish("NEW_ORDER", newOrder);
   return newOrder;
}
async function updateOrder(parent, args, context) {
   const updatedOrder = await context.prisma.order.update({
      where: {
         id: parseInt(args.orderId),
      },
      data: {
         ready: args.ready,
         picked: args.picked,
         pickTime: args.pickTime,
      },
   });
   context.pubsub.publish("NEW_ORDER", updatedOrder);
   return updatedOrder;
}

async function deleteOrder(parent, args, context, info) {
   const deleteOrder = await context.prisma.order.delete({
      where: {
         id: parseInt(args.id),
      },
   });
   return deleteOrder;
}

//stock
async function createStock(parent, args, context) {
   const old = await context.prisma.product.findUnique({
      where: {
         id: parseInt(args.productId),
      },
      select: {
         totalStock: true,
      },
   });
   await context.prisma.product.update({
      where: {
         id: parseInt(args.productId),
      },
      data: {
         totalStock: old.totalStock + args.amount,
      },
   });
   return await context.prisma.stock.create({
      data: {
         product: { connect: { id: parseInt(args.productId) } },
         amount: args.amount,
      },
   });
}
async function deleteStock(parent, args, context) {
   const stock = await context.prisma.stock.findUnique({
      where: {
         id: parseInt(args.id),
      },
      select: {
         amount: true,
         product: { select: { id: true } },
      },
   });
   console.log(stock.product.id);
   const old = await context.prisma.product.findUnique({
      where: {
         id: parseInt(stock.product.id),
      },
      select: {
         totalStock: true,
      },
   });
   await context.prisma.product.update({
      where: {
         id: parseInt(stock.product.id),
      },
      data: {
         totalStock: old.totalStock - stock.amount,
      },
   });
   await context.prisma.stock.delete({
      where: {
         id: parseInt(args.id),
      },
   });
   return true;
}
async function setActiveCart(parent, args, context) {
   return await context.prisma.user.update({
      where: {
         id: parseInt(args.userId),
      },
      data: {
         activeCart: args.cartId,
      },
   });
}
module.exports = {
   signup,
   login,
   updateUser,
   deleteUser,

   setActiveCart,

   createOrder,
   updateOrder,
   deleteOrder,

   createCart,
   updateCart,

   createProduct,

   createCartproduct,
   deleteCartproduct,
   createStock,
   deleteStock,
};
