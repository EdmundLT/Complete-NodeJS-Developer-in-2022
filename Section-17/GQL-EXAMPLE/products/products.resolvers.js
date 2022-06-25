const productModel = require('./products.model');
module.exports = {
    Query: {
        products: ()=>{
            return productModel.getAllProducts();
        },
        productsByPrice: (parent, args) => {
            return productModel.getProductsByPrice(args.min, args.max);
        },
        product: (_, args) => {
            return productModel.getProductByID(args.id);
        }
    },
    Mutation: {
        addNewProduct: (_, args) => {
            return productModel.addNewProduct(args.id, args.description, args.price);
        },
        addReviews: (_, args) => {
            return productModel.addReviews(args.id, args.rating, args.comment);
        }
    }
}