async function users(parent, args, context, info) {
   const allUsers = await context.prisma.user.findMany({});
   console.log(allUsers);
   return allUsers;
}

async function user(parent, args, context, info) {
   const user = await context.prisma.user
      .findUnique({
         where: {
            id: 1,
         },
         select: {
            id: true,
         },
      })
      .orders({
         where: {
            ready: false,
         },
      });
   console.log(user);
   return user;
}

async function me(parent, args, context, info) {
   const { userId } = context;

   const x = await context.prisma.user.findUnique({
      where: {
         id: 1,
      },
      select: {
         id: true,
         orders: {
            ready: {
               equals: true,
            },
         },
      },
   });
   console.log(x);
   return x;
}
async function orders(parent, args, context, info) {
   return await context.prisma.order.findMany({
      where: {
         picked: args.picked,
      },
      orderBy: {
         createdAt: "desc",
      },
      skip: args.skip,
      take: args.take,
   });
}
async function order(parent, args, context, info) {
   return await context.prisma.order.findUnique({
      where: {
         id: parseInt(args.id),
      },
   });
}
async function cart(parent, args, context, info) {
   return await context.prisma.cart.findUnique({
      where: {
         id: parseInt(args.id),
      },
   });
}
function carts(parent, args, context, info) {
   return context.prisma.cart.findMany();
}

function products(parent, args, context) {
   return context.prisma.product.findMany();
}
function product(parent, args, context, info) {
   return context.prisma.product.findUnique({
      where: {
         id: parseInt(args.id),
      },
   });
}
function cartproducts(parent, args, context) {
   return context.prisma.cartproduct.findMany();
}
function cartproduct(parent, args, context, info) {
   return context.prisma.cartproduct.findUnique({
      where: {
         id: parseInt(args.id),
      },
   });
}
function stocks(parent, args, context) {
   return context.prisma.stock.findMany();
}
function stock(parent, args, context, info) {
   return context.prisma.stock.findUnique({
      where: {
         id: parseInt(args.id),
      },
   });
}
module.exports = {
   me,
   users,
   user,

   orders,
   order,

   carts,
   cart,

   product,
   products,

   stocks,
   stock,

   cartproduct,
   cartproducts,
};
