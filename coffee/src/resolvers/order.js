function cart(parent, args, context) {
   return context.prisma.order.findUnique({ where: { id: parent.id } }).cart();
}
function user(parent, args, context) {
   return context.prisma.order.findUnique({ where: { id: parent.id } }).user();
}

module.exports = {
   cart,
   user,
};
