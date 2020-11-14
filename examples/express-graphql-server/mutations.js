const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
input MessageInput {
  content: String,
  author: String
}
type Message {
  id: ID!,
  content: String,
  author: String
}
type Query {
  getMessage(id:ID!): Message
}
type Mutation {
  createMessage(input: MessageInput): Message,
  updateMessage(id: ID!,input: MessageInput): Message
}

`);
class Message{
  constructor(id, {author, content}){
    this.id = id;
    this.author = author;
    this.content = content;
  }
}



const fakeDatabase = {};

const root = {
  getMessage: ({id}) => {
    if(!fakeDatabase[id]){
      throw new Error('no message with id:' + id);
    }else{
      return new Message(id, fakeDatabase[id]);
    }
  },
  createMessage: ({input}) => {
    const id = require('crypto').randomBytes(10).toString('hex')
    fakeDatabase[id] = input;
    return new Message(id, fakeDatabase[id]);
  },
  updateMessage: ({id, input}) => {
    if(!fakeDatabase[id]){
      throw new Error('no message with id:' + id);
    }else{
      fakeDatabase[id] = input;
      return new Message(id, input)
    }
  }
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
