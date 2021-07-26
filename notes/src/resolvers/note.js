function user(parent, args, context) {
  return context.prisma.note.findUnique({ where: { id: parent.id } }).user();
}

module.exports = {
  user,
};
