async function users(parent, args, context, info) {
  const allUsers = await context.prisma.user.findMany();
  console.log(allUsers);
  return allUsers;
}

async function user(parent, args, context, info) {
  return await context.prisma.user.findUnique({
    where: {
      id: parseInt(args.id),
    },
  });
}

async function notes(parent, args, context, info) {
  return await context.prisma.note.findMany();
}
async function note(parent, args, context, info) {
  return await context.prisma.note.findUnique({
    where: {
      id: parseInt(args.id),
    },
  });
}

module.exports = {
  users,
  user,
  notes,
  note,
};
