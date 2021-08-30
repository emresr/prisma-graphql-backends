function groups(parent, args, context) {
  return context.prisma.tournament
    .findUnique({ where: { id: parent.id } })
    .groups();
}
function competators(parent, args, context) {
  return context.prisma.tournament
    .findUnique({ where: { id: parent.id } })
    .competators();
}

module.exports = {
  groups,
  competators,
};
