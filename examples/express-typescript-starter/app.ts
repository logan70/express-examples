import express from 'express'

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  res.send('Hello Express + Typescript Server')
})

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
