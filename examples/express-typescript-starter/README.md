## 使用TypeScript编写Express应用

### 初始化环境

- 新建项目并初始化

```bash
mkdir express-typescript
cd express-typescript
npm init -y
```

- 安装express、typescript、ts-node、nodemon
`ts-node`用于直接运行ts文件
`nodemon` 用于监听文件变化重启server

```bash
npm i express -S
npm i typescript nodemon ts-node -D
```

- 安装node及express的typescript声明库

```bash 
npm i @types/node @types/express -D
```

- 配置typescript，新建`tsconfig.json`文件

```json
{
  "compilerOptions": {
      "target": "es6",
      "module": "commonjs",
      "esModuleInterop": true,
      "noImplicitAny": true,
      "moduleResolution": "node",
      "sourceMap": true,
      "outDir": "dist",
      "types": [
        "@types/node",
        "@types/express"
      ]
  }
}
```

### 配置命令并编写代码

- 在`package.json`中声明开发、构建、运行命令

```json
// package.json
...
+ "scripts": {
+   "dev": "nodemon app.ts",
+   "build": "tsc --project ./",
+   "start": "node dist/app.js"
+ },
...
```

- 新建`app.ts`，编写server逻辑

```typescript
import express from 'express'

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  res.send('Hello Express + Typescript')
})

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
```

### 尝试开发、构建、运行命令

```base
npm run dev
npm run build
npm run start
```
