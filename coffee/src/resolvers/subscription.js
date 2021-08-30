function newOrderSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator("NEW_MESSAGE");
}

const newOrder = {
  subscribe: newOrderSubscribe,
  resolve: (payload) => {
    return payload;
  },
};
//newCart
function newCartSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator("NEW_CART");
}

const newCart = {
  subscribe: newCartSubscribe,
  resolve: (payload) => {
    return payload;
  },
};
// Add product to cart
function newCartProductSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator("NEW_CART_PRODUCT");
}

const newCartProduct = {
  subscribe: newCartProductSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newOrder,
  newCart,
  newCartProduct,
};
