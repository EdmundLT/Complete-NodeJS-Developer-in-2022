const products = [
  {
    id: "redshoe",
    description: "Red Shoe",
    price: 42.11,
    reviews: []
  },
  {
    id: "bluejean",
    description: "Blue Jeans",
    price: 55.55,
    reviews: []
  },
];

function getAllProducts () {
  return products;
}
function getProductsByPrice(min, max) {
  return products.filter((product)=>{
    return product.price >= min && product.price <= max;
  })
}
function getProductByID(id) {
  return products.find((product)=>{
    return product.id === id;
  })
}
function addNewProduct(id, description, price) {
  const newProduct = {
    id,
    price,
    description,
    reviews: []
  };
  products.push(newProduct);
  return newProduct;
}
function addReviews(id, rating, comment) {
  const matchedProduct = getProductByID(id);
  if (matchedProduct) {
    const newReviews = {
      rating,
      comment
    };
    matchedProduct.reviews.push(newReviews);

    return matchedProduct;
  }
} 
  

module.exports = {
  getAllProducts,
  getProductsByPrice,
  getProductByID,
  addNewProduct,
  addReviews
}