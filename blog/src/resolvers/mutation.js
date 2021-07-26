const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10);

  // 2
  const user = await context.prisma.user.create({
    data: { ...args, password }
  });

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4
  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user
  };
}
async function updateUser(parent, args, context, info) {
  const updateUser = await context.prisma.user.update({
    where: {
      id: parseInt(args.id)
    },
    data: {
      email: args.email,
      name: args.name
    }
  });
  return updateUser;
}

async function deleteUser(parent, args, context, info) {
  const deleteUser = await context.prisma.user.delete({
    where: {
      id: parseInt(args.id)
    }
  });
  return deleteUser;
}
async function createPost(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.post.create({
    data: {
      title: args.title,
      author: { connect: { id: userId } }
    }
  });
}
async function updatePost(parent, args, context, info) {
  const updatePost = await context.prisma.post.update({
    where: {
      id: parseInt(args.id)
    },
    data: {
      title: args.title,
      content: args.content,
      published: args.published
    }
  });
  return updatePost;
}

async function deletePost(parent, args, context, info) {
  const deletePost = await context.prisma.post.delete({
    where: {
      id: parseInt(args.id)
    }
  });
  return deletePost;
}

async function follow(parent, args, context, info) {
  const { userId } = context;
  if (!userId) throw Error("Not authenticated");
  if (userId === parseInt(args.id)) {
    throw Error("Can't follow himself");
  }

  try {
    await context.prisma.user.update({
      data: {
        following: {
          connect: { id: parseInt(args.id) }
        }
      },
      where: {
        id: userId
      }
    });
    return true;
  } catch {
    return false;
  }
}
async function unfollow(parent, args, context, info) {
  const { userId } = context;
  if (!userId) throw Error("Not authenticated");
  if (userId === parseInt(args.id)) {
    throw Error("Can't unfollow himself");
  }

  try {
    await context.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        following: {
          disconnect: { id: parseInt(args.id) }
        }
      }
    });
    return true;
  } catch {
    return false;
  }
}
async function like(parent, args, context, info) {
  const { userId } = context;
  if (!userId) throw Error("You need to be authenticated");
  const [isLikeExist] = await context.prisma.like.findMany({
    where: {
      AND: [{ user: { id: userId } }, { post: { id: parseInt(args.id) } }]
    },
    select: {
      id: true
    }
  });
  if (isLikeExist) {
    throw Error([isLikeExist]);

    context.prisma.like.delete({
      where: {
        AND: [{ user: { id: userId } }, { post: { id: parseInt(args.id) } }]
      }
    });
    return true;
  }

  if (!isLikeExist) {
    //   throw Error("Gonna be liked");
    try {
      await context.prisma.like.create({
        data: {
          user: { connect: { id: userId } },
          post: { connect: { id: parseInt(args.id) } }
        }
      });
      return true;
    } catch {
      return false;
    }
  }
}
async function unlike(parent, args, context, info) {
  try {
    context.prisma.like.delete({
      where: {
        post: { id: parseInt(args.id) }
      }
    });
    return true;
  } catch {
    return false;
  }
}

async function createComment(parent, args, context, info) {
  const { userId } = context;
  if (!userId) throw Error("You need to be authenticated");

  return await context.prisma.comment.create({
    data: {
      text: args.text,
      user: { connect: { id: userId } },
      post: { connect: { id: parseInt(args.id) } }
    }
  });
}
async function createCommentToComment(parent, args, context, info) {
  const { userId } = context;
  if (!userId) throw Error("You need to be authenticated");

  return await context.prisma.commentToComment.create({
    data: {
      text: args.text,
      user: { connect: { id: userId } },
      comment: { connect: { id: parseInt(args.id) } }
    }
  });
}
module.exports = {
  signup,
  login,
  updateUser,
  deleteUser,
  createPost,
  updatePost,
  deletePost,
  follow,
  unfollow,
  like,
  createComment,
  createCommentToComment,
  unlike
};
