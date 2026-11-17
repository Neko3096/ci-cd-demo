import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

function jsonResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body
  } as Response
}

function textResponse(text: string): Response {
  return {
    ok: true,
    status: 200,
    text: async () => text
  } as Response
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('等待接口返回后，真正渲染出消息与版本', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const raw = input instanceof Request ? input.url : String(input)
        const url = new URL(raw, 'http://localhost')
        if (url.pathname === '/api/hello') {
          return jsonResponse({ message: 'Hello from ECS backend' })
        }
        if (url.pathname === '/api/version') {
          return textResponse('test-version')
        }
        throw new Error(`未预期的接口：${url.pathname}`)
      })
    )

    render(<App />)

    // 关键：等到文本内容真的更新，而不是只等元素出现
    await waitFor(() => {
      expect(screen.getByTestId('backend-msg')).toHaveTextContent('故意写错的期望值')
    })
    expect(screen.getByTestId('backend-version')).toHaveTextContent('test-version')
  })
})
