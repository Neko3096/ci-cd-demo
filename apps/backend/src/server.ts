import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors())

const port = Number(process.env.PORT ?? 3000)
// 版本号来源优先级：CI 注入的 GIT_SHA > npm 包版本 > 开发默认值
const VERSION = process.env.GIT_SHA ?? process.env.npm_package_version ?? 'dev'

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from ECS backend v3' })
})

app.get('/health', (_req, res) => res.status(200).send('ok'))

app.get('/api/version', (_req, res) => res.send(String(VERSION)))

// 测试环境只导出 app，不真正占用端口
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '127.0.0.1', () => {
    console.log(`Backend listening on 127.0.0.1:${port}`)
  })
}

export default app
