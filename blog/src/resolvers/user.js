function posts(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).posts();
}
function likes(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).likes();
}
function comments(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .comments();
}
function commentstocomments(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .commentstocomments();
}

function following(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .following();
}
function followedBy(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .followedBy();
}

async function isFollowing(parent, args, context) {
  const { userId } = context;
  const following = await context.prisma.user({ id: userId }).following({
    where: {
      id_contains: parent.id,
    },
  });
  return following.length ? true : false;
}

module.exports = {
  posts,
  isFollowing,
  followedBy,
  following,
  likes,
  comments,
  commentstocomments,
};
