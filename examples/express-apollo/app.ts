import express from 'express'
import { ApolloServer, gql, IResolvers } from 'apollo-server-express'

const PORT = 3000
const app = express()

interface User {
  name: string
  email: string
}

const typeDefs = gql`
  type User {
    name: String
    email: String
  }

  type Query {
    getUsers: [User]
  }
`

const users: User[] = [
  { name: 'Logan', email: 'im.lizhh@gmail.com' },
  { name: 'Emma', email: 'ouwenxia1994@foxmail.com' }
]

const resolvers: IResolvers = {
  Query: {
    async getUsers() {
      return users
    }
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
})

const apolloGraphQLPath = '/graphql'
apolloServer.applyMiddleware({
  app,
  path: apolloGraphQLPath,
})

app.get('/', (req, res) => {
  res.redirect(apolloGraphQLPath)
})

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
