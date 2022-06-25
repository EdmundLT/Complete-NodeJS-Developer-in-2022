const express = require("express");
const path = require('path');
const { graphqlHTTP } = require("express-graphql");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'));
const resolveArray = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));
const schema = makeExecutableSchema({
  typeDefs: typesArray,
  resolvers: resolveArray,
})

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,

    graphiql: true,
  })
);
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
