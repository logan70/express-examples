import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { ObjectType, Field, buildSchemaSync, Resolver, Query } from 'type-graphql'

const PORT = 3000
const app = express()

@ObjectType()
class User {
  @Field()
  name: string

  @Field()
  email: string
}

const users: User[] = [
  { name: 'Logan', email: 'im.lizhh@gmail.com' },
  { name: 'Emma', email: 'ouwenxia1994@foxmail.com' }
]

@Resolver()
class UserResolver {
  @Query(_ => [User])
  async getUsers() {
    return users
  }
}

const apolloServer = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [ UserResolver ],
  }),
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
