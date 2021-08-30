function carts(parent, args, context) {
   return context.prisma.user.findUnique({ where: { id: parent.id } }).carts();
}
function orders(parent, args, context) {
   return context.prisma.user.findUnique({ where: { id: parent.id } }).orders();
}
module.exports = {
   carts,
   orders,
};
