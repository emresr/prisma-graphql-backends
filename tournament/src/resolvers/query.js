async function me(parent, args, context, info) {
   const { userId } = context;

   return await context.prisma.user.findUnique({
      where: {
         id: userId,
      },
   });
}
async function users(parent, args, context, info) {
   return await context.prisma.user.findMany();
}

async function user(parent, args, context, info) {
   return await context.prisma.user.findUnique({
      where: {
         id: parseInt(args.id),
      },
   });
}

async function tournaments(parent, args, context, info) {
   return await context.prisma.tournament.findMany({
      skip: (args.skip - 1) * 5 || 0,
      take: args.take || 5,
      orderBy: [
         {
            id: "asc",
         },
      ],
      where: {
         finished: args.finished,
      },
   });
}

async function tournament(parent, args, context, info) {
   return await context.prisma.tournament.findUnique({
      where: {
         id: parseInt(args.id),
      },
      include: {
         competators: {
            orderBy: {
               id: true,
            },
         },
      },
   });
}
async function groups(parent, args, context, info) {
   return await context.prisma.group.findMany({
      where: {
         matchs: {
            some: {
               finished: true,
            },
         },
      },
      include: {
         matchs: {
            where: {
               id: "1",
            },
         },
      },
   });
}

async function group(parent, args, context, info) {
   return await context.prisma.group.findUnique({
      where: {
         id: parseInt(args.id),
      },
      include: {
         matchs: {
            where: {
               finished: true,
            },
         },
      },
   });
}
async function competators(parent, args, context, info) {
   return await context.prisma.competator.findMany();
}

async function competator(parent, args, context, info) {
   return await context.prisma.competator.findUnique({
      where: {
         id: parseInt(args.id),
      },
   });
}
async function matchs(parent, args, context, info) {
   return await context.prisma.match.findMany({
      where: {
         finished: true,
      },
   });
}

async function match(parent, args, context, info) {
   return await context.prisma.match.findUnique({
      where: {
         id: parseInt(args.id),
      },
   });
}
async function finishedMatchs(parent, args, context, info) {
   return await context.prisma.tournament.findUnique({
      where: {
         id: 1,
      },
   });
}
module.exports = {
   me,
   users,
   user,
   groups,
   group,
   tournaments,
   tournament,
   competator,
   competators,
   matchs,
   match,
   finishedMatchs,
};
