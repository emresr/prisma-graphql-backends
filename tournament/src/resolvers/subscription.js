function newCompetatorSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator("NEW_COMPETATOR");
}

const newCompetator = {
  subscribe: newCompetatorSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

function matchFinishedSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator("MATCH_FINISHED");
}

const matchFinished = {
  subscribe: matchFinishedSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

function competatorUpdatedSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator("COMPETATOR_UPDATED");
}

const competatorUpdated = {
  subscribe: competatorUpdatedSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newCompetator,
  matchFinished,
  competatorUpdated,
};
