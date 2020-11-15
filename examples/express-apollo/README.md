## 使用Apollo编写GraphQL接口

### 初始化Express+TypeScript环境

参考[express-typescript-starter](../express-typescript-starter/README.md) 初始化Express+TypeScript环境

### 安装Apollo相关依赖

```bash
npm i apollo-server-express graphql -S
# or
yarn add apollo-server-express graphql -S
```

### 定义GraphQL Schema

Schema即类型定义的集合，更多内容详见[Apollo官网](https://www.apollographql.com/docs/apollo-server/getting-started/)

```ts
// app.ts
import { ApolloServer, gql, IResolvers } from 'apollo-server-express'

const typeDefs = gql`
  type User {
    name: String
    email: String
  }

  type Query {
    getUsers: [User]
  }
`
```

### 定义数据源

此处使用固定数据模拟，真实开发中，数据库、rpc接口、http接口等任何数据源均可作为graphQL的数据提供者

```ts
interface User {
  name: string
  email: string
}

const users: User[] = [
  { name: 'Logan', email: 'im.lizhh@gmail.com' },
  { name: 'Emma', email: 'ouwenxia1994@foxmail.com' }
]
```

### 定义Resolver(解析函数)

定义了Schema后，需要定义对应的Resolver来提供真正的数据

```ts
const resolvers: IResolvers = {
  Query: {
    async getUsers() {
      return users
    }
  }
}
```

### 创建Apollo服务实例

```ts
import express from 'express'

const PORT = 3000
const app = express()

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

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
```

### 发送graphQL请求

运行`npm run dev`启动服务后，就可以通过[http://localhost:3000/graphql](http://localhost:3000/graphql)访问GraphQL PlayGround

在左侧描述需要请求的数据类型后，点击中间按钮，右侧就会展示服务端返回数据。

也可以点击页面右侧`DOCS`，查看GraphQL根据Schema自动生成的接口文档

![GraphQL Playground](./playground.png)
