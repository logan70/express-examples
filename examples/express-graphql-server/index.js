const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
type RandomDie {
  numSides: Int!
  rollOnce: Int!
  roll(numRolls: Int!):[Int]
}
type Mutation {
  setMessage(message:String): String
}
type Query {
  getDie(numSides:Int):RandomDie
  getMessage: String
}

`);

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }
  rollOnce() {
    return 1;
  }
  roll({ numRolls }) {
    return [numRolls];
  }
}

let fakeDatabase = {};
const root = {
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6);
  },
  getMessage: () => {
    return fakeDatabase.message;
  },
  setMessage: ({ message }) => {
    fakeDatabase.message = message;
    return message;
  },
};

const app = express();
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
