const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10);

  // 2
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4
  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
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
    user,
  };
}
async function updateUser(parent, args, context, info) {
  const updateUser = await context.prisma.user.update({
    where: {
      id: parseInt(args.id),
    },
    data: {
      email: args.email,
      name: args.name,
    },
  });
  return updateUser;
}

async function deleteUser(parent, args, context, info) {
  const deleteUser = await context.prisma.user.delete({
    where: {
      id: parseInt(args.id),
    },
  });
  return deleteUser;
}
// competator
async function createCompetator(parent, args, context, info) {
  const { userId } = context;

  const newCompetator = await context.prisma.competator.create({
    data: {
      tournament: { connect: { id: parseInt(args.tournamentId) } },
      user: { connect: { id: userId } },
    },
  });
  context.pubsub.publish("NEW_COMPETATOR", newCompetator);

  return newCompetator;
}

async function updateCompetator(parent, args, context, info) {
  if (!args.groupId) {
    return await context.prisma.competator.update({
      where: {
        id: parseInt(args.competatorId),
      },
      data: {
        point: parseInt(args.point),
      },
    });
  } else {
    return await context.prisma.competator.update({
      where: {
        id: parseInt(args.competatorId),
      },
      data: {
        group: { connect: { id: parseInt(args.groupId) } },
        point: parseInt(args.point),
      },
    });
  }
}

// group
async function createGroup(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.group.create({
    data: {
      tournament: { connect: { id: parseInt(args.tournamentId) } },
      name: args.name,
    },
  });
}
// tournament
async function createTournament(parent, args, context, info) {
  return await context.prisma.tournament.create({
    data: {
      title: args.title,
    },
  });
}
async function updateTournament(parent, args, context, info) {
  return await context.prisma.tournament.update({
    where: {
      id: parseInt(args.tournamentId),
    },
    data: {
      finished: args.finished,
    },
  });
}

// match
async function createMatch(parent, args, context, info) {
  return await context.prisma.match.create({
    data: {
      competators: { connect: { id: parseInt(args.competatorId) } },
      group: { connect: { id: parseInt(args.groupId) } },
    },
  });
}

async function addCompetatorToMatch(parent, args, context, info) {
  return await context.prisma.competator.update({
    where: {
      id: parseInt(args.competatorId),
    },
    data: {
      matchs: { connect: { id: parseInt(args.matchId) } },
    },
  });
}

async function updateMatch(parent, args, context, info) {
  return await context.prisma.match.update({
    where: {
      id: args.matchId,
    },
    data: {
      competators: { connect: { id: parseInt(args.competatorId) } },
    },
  });
}

async function finishMatch(parent, args, context, info) {
  const finishedMatch = await context.prisma.match.update({
    where: {
      id: parseInt(args.matchId),
    },
    data: {
      finished: args.finished,
      winnerId: parseInt(args.winnerId),
    },
    include: {
      competators: {
        select: { id: true },
      },
    },
  });
  const first = await context.prisma.competator.findUnique({
    where: { id: finishedMatch.competators[0].id },
    select: {
      played: true,
      point: true,
    },
  });
  console.log(first);
  if (finishedMatch.competators[0].id === parseInt(args.winnerId)) {
    first1 = await context.prisma.competator.update({
      where: {
        id: finishedMatch.competators[0].id,
      },
      data: {
        played: first.played + 1,
        point: first.played + 1,
      },
    });
    context.pubsub.publish("COMPETATOR_UPDATED", first1);
  } else {
    first2 = await context.prisma.competator.update({
      where: {
        id: finishedMatch.competators[0].id,
      },
      data: {
        played: first.played + 1,
      },
    });
    context.pubsub.publish("COMPETATOR_UPDATED", first0);
  }

  const second = await context.prisma.competator.findUnique({
    where: { id: finishedMatch.competators[1].id },
    select: {
      played: true,
      point: true,
    },
  });
  if (finishedMatch.competators[1].id === parseInt(args.winnerId)) {
    const second1 = await context.prisma.competator.update({
      where: {
        id: finishedMatch.competators[1].id,
      },
      data: {
        played: second.played + 1,
        point: second.played + 1,
      },
    });
    context.pubsub.publish("COMPETATOR_UPDATED", second1);
  } else {
    const second0 = await context.prisma.competator.update({
      where: {
        id: finishedMatch.competators[1].id,
      },
      data: {
        played: second.played + 1,
      },
    });
    context.pubsub.publish("COMPETATOR_UPDATED", second0);
  }
  console.log(finishedMatch);

  context.pubsub.publish("MATCH_FINISHED", finishedMatch);
  return finishedMatch;
}

module.exports = {
  signup,
  login,
  updateUser,
  deleteUser,
  createGroup,
  createTournament,
  updateTournament,
  createCompetator,
  updateCompetator,
  createMatch,
  finishMatch,
  addCompetatorToMatch,
};
