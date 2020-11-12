const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
input MessageInput {
  content
}
type RandomDie {
  numSides: Int!
  rollOnce: Int!
  roll(numRolls: Int!):[Int]
}
type Mutation {
  setMessage(message:String): String
}
type Query {
  quoteOfTheDay: String
  random: Float!
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
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
  },
  random: () => {
    return Math.random();
  },
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6);
  },
  setMessage: ({ message }) => {
    fakeDatabase.message = message;
    return message;
  },
  getMessage: () => {
    return fakeDatabase.message;
  },
};

const app = express();
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
