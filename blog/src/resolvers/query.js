async function users(parent, args, context, info) {
   const allUsers = await context.prisma.user.findMany({
      where: {
         posts: {
            some: { published: { equals: false } },
         },
      },
      include: {
         posts: true,
      },
   });
   console.log(allUsers);
   return allUsers;
}

async function user(parent, args, context, info) {
   const user = await context.prisma.user.findUnique({
      where: {
         id: parseInt(args.id),
      },
      include: {
         posts: {
            where: {
               published: {
                  equals: false,
               },
            },
         },
      },
   });
   console.log(user);
   return user;
}

async function posts(parent, args, context, info) {
   const posts = await context.prisma.post.findMany({
      where: {
         published: true,
         author: {
            email: {
               contains: "emre",
            },
         },
      },
   });
   return posts;
}
async function post(parent, args, context, info) {
   return await context.prisma.post.findUnique({
      where: {
         id: parseInt(args.id),
      },
   });
}
async function trendingPosts(parent, args, context, info) {
   const trending = await context.prisma.post.findMany({
      orderBy: {
         _count: {
            select: { likes: true },
         },
      },
   });
   console.log(trending);
   return trending;
}

// Search
async function search(parent, args, context) {
   const result = await context.prisma.post.findMany({
      where: {
         title: {
            contains: args.title,
         },
      },
   });
   return result;
}

module.exports = {
   users,

   user,
   posts,
   post,
   trendingPosts,
   search,
};
