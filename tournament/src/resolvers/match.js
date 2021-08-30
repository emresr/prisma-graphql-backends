function competators(parent, args, context) {
  return context.prisma.match
    .findUnique({ where: { id: parent.id } })
    .competators();
}
function group(parent, args, context) {
  return context.prisma.match.findUnique({ where: { id: parent.id } }).group();
}

module.exports = {
  competators,
  group,
};
