function user(parent, args, context) {
  return context.prisma.like.findUnique({ where: { id: parent.id } }).user();
}

function post(parent, args, context) {
  return context.prisma.like.findUnique({ where: { id: parent.id } }).post();
}

module.exports = {
  user,
  post,
};
