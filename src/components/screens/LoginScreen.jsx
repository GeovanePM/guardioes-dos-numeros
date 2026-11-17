import { useState } from 'react'
import { validateSchoolAccess } from '../../lib/auth.js'

export default function LoginScreen({ onSuccess }) {
  const [code,    setCode]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const escola = await validateSchoolAccess(code.trim())
      onSuccess(escola)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <img src="/assets/logo.jpg" alt="Guardiões dos Números" className="login-logo" />
        <h1 className="login-title">Guardiões dos Números</h1>
        <p className="login-subtitle">Digite o código de acesso da sua escola</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            placeholder="Código da escola"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            maxLength={16}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
          />
          <button
            type="submit"
            className="login-btn"
            disabled={loading || !code.trim()}
          >
            {loading ? 'Verificando...' : 'Entrar no Reino ⚔️'}
          </button>
        </form>

        <p className="login-hint">
          Código fornecido pela secretaria da escola
        </p>
      </div>
    </div>
  )
}
