const express = require("express");
const path = require('path');
const {ApolloServer} = require('apollo-server-express')
const port = 3000;
const { loadFilesSync } = require("@graphql-tools/load-files");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'));
const resolveArray = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));

async function startApolloSerer() {
  const app=express();
  const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolveArray,
  });
  const server = new ApolloServer({
    schema
  });
  await server.start();
  server.applyMiddleware({app, path: '/graphql'})
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  app.get("/", (req, res) => res.send("Hello World!"));
}

startApolloSerer();




