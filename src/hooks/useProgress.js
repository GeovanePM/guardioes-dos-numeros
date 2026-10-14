import { useState, useCallback } from 'react'

const STORAGE_KEY = 'guardioes_progress_v1'

const DEFAULT_HERO_PROGRESS = {
  maxPhaseUnlocked: 1,
  phasesCompleted: [],
  comicsUnlocked: [],
  xp: 0,
  ending: false
}

const DEFAULT_PROGRESS = {
  mitos: { ...DEFAULT_HERO_PROGRESS },
  pampee: { ...DEFAULT_HERO_PROGRESS },
  galdios: { ...DEFAULT_HERO_PROGRESS },
  nia: { ...DEFAULT_HERO_PROGRESS },
  firstTypes: { fraction: false, problem: false, logic: false }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_PROGRESS)
    const parsed = JSON.parse(raw)
    // Merge with defaults for any missing keys
    const result = structuredClone(DEFAULT_PROGRESS)
    for (const hero of ['mitos', 'pampee', 'galdios', 'nia']) {
      if (parsed[hero]) Object.assign(result[hero], parsed[hero])
    }
    if (parsed.firstTypes) Object.assign(result.firstTypes, parsed.firstTypes)
    return result
  } catch {
    return structuredClone(DEFAULT_PROGRESS)
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // localStorage full or unavailable
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress())

  const updateAndSave = useCallback((updater) => {
    setProgress(prev => {
      const next = updater(structuredClone(prev))
      saveProgress(next)
      return next
    })
  }, [])

  const completePhase = useCallback((heroId, phase, hearts, correctCount) => {
    updateAndSave(prev => {
      const hero = prev[heroId]
      const xpGained = correctCount * 50 + hearts * 25

      if (!hero.phasesCompleted.includes(phase)) {
        hero.phasesCompleted.push(phase)
        hero.xp += xpGained
      }

      // Unlock next phase
      if (phase < 10 && hero.maxPhaseUnlocked <= phase) {
        hero.maxPhaseUnlocked = phase + 1
      }

      // Unlock comics (after phases 2, 4, 6, 8)
      const comicPhases = [2, 4, 6, 8]
      if (comicPhases.includes(phase)) {
        const comicIdx = comicPhases.indexOf(phase)
        if (!hero.comicsUnlocked.includes(comicIdx)) {
          hero.comicsUnlocked.push(comicIdx)
        }
      }

      // Phase 10 ending
      if (phase === 10) {
        hero.ending = true
      }

      return prev
    })
  }, [updateAndSave])

  const markFirstType = useCallback((type) => {
    updateAndSave(prev => {
      if (!prev.firstTypes[type]) {
        prev.firstTypes[type] = true
      }
      return prev
    })
  }, [updateAndSave])

  const resetHero = useCallback((heroId) => {
    updateAndSave(prev => {
      prev[heroId] = { ...DEFAULT_HERO_PROGRESS }
      return prev
    })
  }, [updateAndSave])

  const resetAll = useCallback(() => {
    const fresh = structuredClone(DEFAULT_PROGRESS)
    saveProgress(fresh)
    setProgress(fresh)
  }, [])

  const getHeroProgress = useCallback((heroId) => {
    return progress[heroId] || { ...DEFAULT_HERO_PROGRESS }
  }, [progress])

  const isPhaseUnlocked = useCallback((heroId, phase) => {
    return phase <= (progress[heroId]?.maxPhaseUnlocked || 1)
  }, [progress])

  const isPhaseCompleted = useCallback((heroId, phase) => {
    return progress[heroId]?.phasesCompleted?.includes(phase) || false
  }, [progress])

  const hasSeenFirstType = useCallback((type) => {
    return progress.firstTypes?.[type] || false
  }, [progress])

  return {
    progress,
    completePhase,
    markFirstType,
    resetHero,
    resetAll,
    getHeroProgress,
    isPhaseUnlocked,
    isPhaseCompleted,
    hasSeenFirstType
  }
}
