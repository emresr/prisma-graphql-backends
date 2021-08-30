function competators(parent, args, context) {
  return context.prisma.group
    .findUnique({ where: { id: parent.id } })
    .competators();
}

function tournament(parent, args, context) {
  return context.prisma.group
    .findUnique({ where: { id: parent.id } })
    .tournament();
}
function matchs(parent, args, context) {
  return context.prisma.group.findUnique({ where: { id: parent.id } }).matchs();
}
module.exports = {
  competators,
  tournament,
  matchs,
};
