function product(parent, args, context) {
   return context.prisma.stock
      .findUnique({ where: { id: parent.id } })
      .product();
}

module.exports = {
   product,
};
