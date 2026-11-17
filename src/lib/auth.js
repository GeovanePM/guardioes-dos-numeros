import { supabase } from './supabase.js'

const SESSION_KEY = 'guardioes_escola_v1'

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(escola) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(escola))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export async function validateSchoolAccess(accessCode) {
  const { data: escola, error } = await supabase
    .from('escolas')
    .select('id, nome, cidade, status, access_code')
    .eq('access_code', accessCode.trim().toUpperCase())
    .single()

  if (error || !escola) {
    throw new Error('Código inválido. Verifique com a secretaria da sua escola.')
  }

  if (escola.status === 'inativo') {
    throw new Error('O acesso desta escola está suspenso. Entre em contato com o suporte.')
  }

  const { data: acesso } = await supabase
    .from('acessos')
    .select('ativo')
    .eq('escola_id', escola.id)
    .eq('modulo', 'guardioes')
    .single()

  if (!acesso?.ativo) {
    throw new Error('Sua escola não tem o módulo Guardiões ativado. Entre em contato com o suporte.')
  }

  const session = {
    id:          escola.id,
    nome:        escola.nome,
    cidade:      escola.cidade,
    access_code: escola.access_code,
  }
  saveSession(session)
  return session
}
