function user(parent, args, context) {
  return context.prisma.cart.findUnique({ where: { id: parent.id } }).user();
}

function cartproducts(parent, args, context) {
  return context.prisma.cart
    .findUnique({ where: { id: parent.id } })
    .cartproducts();
}

function order(parent, args, context) {
  return context.prisma.cart.findUnique({ where: { id: parent.id } }).order();
}
function activeuser(parent, args, context) {
  return context.prisma.cart
    .findUnique({ where: { id: parent.id } })
    .activeuser();
}

module.exports = {
  user,
  cartproducts,
  order,
  activeuser,
};
