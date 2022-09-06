const express = require('express');
const path = require('path');

const { ApolloServer }=  require("apollo-server-express");
const { authMiddleware } = require("./utils/auth")
const db = require('./config/connection');
// const routes = require('./routes');

const { typeDefs, resolvers }= require("./schemas"); 

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
})


// server.start().then(res => {
//  server.applyMiddleware({ app });
//  app.listen({ port: 3000 }, () =>
//      console.log('Now browse to http://localhost:4000' + server.graphqlPath)
//  )
// })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("/", (req,res) => {
  res.sendFile(path,join(__dirname, "../client/build/index.html"));
});

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on: ${PORT}`);

  console.log(`use graphQL at http://localhost:${PORT}${server.graphqlPath}`);
});
});


db.on('error', (err) =>{
  console.error("mongodb connection error:", err)
})
