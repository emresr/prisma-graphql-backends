function stocks(parent, args, context) {
   return context.prisma.product
      .findUnique({ where: { id: parent.id } })
      .stocks();
}
function cartproducts(parent, args, context) {
   return context.prisma.product
      .findUnique({ where: { id: parent.id } })
      .cartproducts();
}

module.exports = {
   stocks,
   cartproducts,
};
