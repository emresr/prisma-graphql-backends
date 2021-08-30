function competators(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .competators();
}
module.exports = {
  competators,
};
