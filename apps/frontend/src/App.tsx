import { useEffect, useState } from 'react'
import './styles.css'

// 生产环境用 VITE_API_BASE_URL 指定后端基址；留空表示同源相对路径 /api
const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

type Status = 'loading' | 'ready' | 'error'

export default function App() {
  const [message, setMessage] = useState('')
  const [version, setVersion] = useState('')
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const helloRes = await fetch(`${apiBase}/api/hello`, { signal: controller.signal })
        if (!helloRes.ok) throw new Error(`/api/hello 返回 HTTP ${helloRes.status}`)

        const data: unknown = await helloRes.json()
        if (
          !data ||
          typeof data !== 'object' ||
          !('message' in data) ||
          typeof data.message !== 'string'
        ) {
          throw new Error('/api/hello 返回结构不正确')
        }
        setMessage(data.message)

        const versionRes = await fetch(`${apiBase}/api/version`, { signal: controller.signal })
        if (versionRes.ok) setVersion(await versionRes.text())

        setStatus('ready')
      } catch (err) {
        // 组件卸载导致的取消不算失败
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : '未知错误')
        setStatus('error')
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  return (
    <main className="card">
      <p className="tag">React + Vite · Node + Express</p>
      <h1>CI/CD 示例工程</h1>
      <p className="sub">前端由 GitHub Actions 构建，后端提供 /api/hello 与 /health。</p>

      <section className="panel">
        <div className="row">
          <span className="label">后端消息</span>
          {status === 'loading' && <span className="value muted">加载中…</span>}
          {status === 'error' && (
            <span className="value error" data-testid="backend-msg">
              接口不可用：{error}
            </span>
          )}
          {status === 'ready' && (
            <span className="value ok" data-testid="backend-msg">
              {message}
            </span>
          )}
        </div>

        <div className="row">
          <span className="label">后端版本</span>
          <span className="value" data-testid="backend-version">
            {version || '—'}
          </span>
        </div>

        <div className="row">
          <span className="label">接口基址</span>
          <span className="value mono">{apiBase || '同源（/api）'}</span>
        </div>
      </section>

      <p className="hint">
        状态为「接口不可用」时页面本身仍是正常的：这正是前端需要显式处理加载失败的结果。
      </p>
    </main>
  )
}
