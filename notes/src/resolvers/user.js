function notes(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).notes();
}

module.exports = {
  notes,
};
