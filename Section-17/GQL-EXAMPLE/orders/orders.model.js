const orders = [
  {
    date: "2010-05-10",
    subtotal: 97.66,
    items: [
      {
        product: {
          id: "redshoe",
          description: "Old Red Shoe",
          price: 45.11,
        },
        quantity: 2,
      },
    ],
  },
];

function getOrders() {
  return orders;
}

module.exports = {
  getOrders,
}