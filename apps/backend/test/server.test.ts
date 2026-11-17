import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../src/server.js'

describe('backend API', () => {
  it('GET /api/hello 返回问候消息', async () => {
    const res = await request(app).get('/api/hello')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: 'Hello from ECS backend v3' })
  })

  it('GET /health 返回 200 与 ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.text).toBe('ok')
  })

  it('GET /api/version 返回非空版本号', async () => {
    const res = await request(app).get('/api/version')
    expect(res.status).toBe(200)
    expect(res.text.length).toBeGreaterThan(0)
  })
})
