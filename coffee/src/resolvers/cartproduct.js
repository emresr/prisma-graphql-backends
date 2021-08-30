function product(parent, args, context) {
  return context.prisma.cartproduct
    .findUnique({ where: { id: parent.id } })
    .product();
}
function cart(parent, args, context) {
  return context.prisma.cartproduct
    .findUnique({ where: { id: parent.id } })
    .cart();
}

module.exports = {
  product,
  cart,
};
