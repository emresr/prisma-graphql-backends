function user(parent, args, context) {
  return context.prisma.comment.findUnique({ where: { id: parent.id } }).user();
}

function post(parent, args, context) {
  return context.prisma.comment.findUnique({ where: { id: parent.id } }).post();
}
function commentstocomments(parent, args, context) {
  return context.prisma.comment
    .findUnique({ where: { id: parent.id } })
    .commentstocomments();
}

module.exports = {
  user,
  post,
  commentstocomments,
};
