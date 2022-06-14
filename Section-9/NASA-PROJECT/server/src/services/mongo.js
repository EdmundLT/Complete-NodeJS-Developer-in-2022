const mongoose = require("mongoose");
const MONGO_URL =
  "mongodb+srv://nasa-api:b3HXcYh5Q8sAIYbi@cluster0.imdwuhi.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}
async function mongoDisconenct() {
  await mongoose.disconnect();
}
module.exports = {
  mongoConnect,
  mongoDisconenct,
};
