import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const THEME_COLORS = ['#3DB3EA', '#00FFB4', '#FF00E3', '#FF740A', '#243C6A']

const initialState = {
  wizard: {
    mentalidad: '',
    insumos: { vision: '', mision: '', valores: '', quarter: '' },
    bigThink: [],
    temas: [],
    objetivos: [],
    resultadosClave: [],
  },
  draftCycleFields: {
    name: 'Nuevo ciclo OKR',
    period: 'Q1',
    year: new Date().getFullYear(),
    behaviorPlan: {},
  },
  cycles: [],
  activeCycleId: null,
}

// Convert wizard state into a cycle-shaped object (used for steps 7-8 before activation)
function wizardToCycle(wizard, draftFields) {
  const themes = wizard.temas.map((t, i) => ({
    id: `theme-${i}-${t.name}`,
    name: t.name,
    color: t.color || THEME_COLORS[i % THEME_COLORS.length],
  }))

  const objectives = wizard.objetivos.map(o => {
    const theme = themes.find(t => t.name === o.tema)
    return {
      id: o.id,
      themeId: theme?.id || null,
      refinedStatement: o.title,
      whatStatement: o.title,
      whyStatement: o.why,
    }
  })

  const keyResults = wizard.resultadosClave.map(kr => ({
    id: kr.id,
    objectiveId: kr.objetivoId,
    type: kr.type || 'commitment',
    directionalVerb: (kr.title || '').split(' ')[0] || 'Incrementar',
    metric: kr.title,
    initialValue: kr.baseline || 0,
    targetValue: kr.target || 0,
    currentValue: kr.current || kr.baseline || 0,
    changeDescription: kr.unit || '',
    status: 'on_track',
    progressEntries: [],
  }))

  return {
    id: 'draft',
    status: 'draft',
    name: draftFields.name || 'Nuevo ciclo OKR',
    period: draftFields.period || 'Q1',
    year: draftFields.year || new Date().getFullYear(),
    themes,
    objectives,
    keyResults,
    behaviorPlan: draftFields.behaviorPlan || {},
    learningReview: { items: [], keyLearnings: '' },
    parkingLot: [],
    coachConversations: {},
  }
}

function reducer(state, action) {
  switch (action.type) {
    // ── Wizard actions (steps 1-6) ──
    case 'SET_WIZARD_FIELD':
      return { ...state, wizard: { ...state.wizard, [action.field]: action.value } }
    case 'SET_WIZARD_INSUMOS':
      return { ...state, wizard: { ...state.wizard, insumos: { ...state.wizard.insumos, ...action.value } } }
    case 'ADD_BIG_THINK':
      return { ...state, wizard: { ...state.wizard, bigThink: [...state.wizard.bigThink, action.item] } }
    case 'REMOVE_BIG_THINK':
      return { ...state, wizard: { ...state.wizard, bigThink: state.wizard.bigThink.filter((_, i) => i !== action.index) } }
    case 'SET_TEMAS':
      return { ...state, wizard: { ...state.wizard, temas: action.temas } }
    case 'ADD_OBJETIVO':
      return { ...state, wizard: { ...state.wizard, objetivos: [...state.wizard.objetivos, action.objetivo] } }
    case 'UPDATE_OBJETIVO':
      return { ...state, wizard: { ...state.wizard, objetivos: state.wizard.objetivos.map((o, i) => i === action.index ? { ...o, ...action.data } : o) } }
    case 'REMOVE_OBJETIVO':
      return { ...state, wizard: { ...state.wizard, objetivos: state.wizard.objetivos.filter((_, i) => i !== action.index) } }
    case 'ADD_KEY_RESULT':
      return { ...state, wizard: { ...state.wizard, resultadosClave: [...state.wizard.resultadosClave, action.kr] } }
    case 'UPDATE_KEY_RESULT':
      return { ...state, wizard: { ...state.wizard, resultadosClave: state.wizard.resultadosClave.map((kr, i) => i === action.index ? { ...kr, ...action.data } : kr) } }
    case 'REMOVE_KEY_RESULT':
      return { ...state, wizard: { ...state.wizard, resultadosClave: state.wizard.resultadosClave.filter((_, i) => i !== action.index) } }

    // ── Cycle lifecycle ──
    case 'ACTIVATE_CYCLE': {
      const newCycle = {
        ...wizardToCycle(state.wizard, state.draftCycleFields),
        id: Date.now(),
        status: 'active',
        createdAt: new Date().toISOString(),
        activatedAt: new Date().toISOString(),
      }
      return { ...state, cycles: [...state.cycles, newCycle], activeCycleId: newCycle.id }
    }

    case 'CREATE_CYCLE':
      return {
        ...state,
        wizard: initialState.wizard,
        draftCycleFields: { name: 'Nuevo ciclo OKR', period: 'Q1', year: new Date().getFullYear(), behaviorPlan: {} },
        activeCycleId: null,
      }

    case 'SET_ACTIVE_CYCLE':
      return { ...state, activeCycleId: action.id }

    case 'DELETE_CYCLE':
      return {
        ...state,
        cycles: state.cycles.filter(c => c.id !== action.id),
        activeCycleId: state.activeCycleId === action.id ? null : state.activeCycleId,
      }

    // ── Update active or draft cycle ──
    case 'UPDATE_CYCLE': {
      if (!state.activeCycleId) {
        return { ...state, draftCycleFields: { ...state.draftCycleFields, ...action.data } }
      }
      return { ...state, cycles: state.cycles.map(c => c.id === state.activeCycleId ? { ...c, ...action.data } : c) }
    }

    case 'UPDATE_NESTED_FIELD': {
      if (!state.activeCycleId) {
        return {
          ...state,
          draftCycleFields: {
            ...state.draftCycleFields,
            [action.section]: { ...(state.draftCycleFields[action.section] || {}), [action.field]: action.value },
          },
        }
      }
      return {
        ...state,
        cycles: state.cycles.map(c => {
          if (c.id !== state.activeCycleId) return c
          return { ...c, [action.section]: { ...(c[action.section] || {}), [action.field]: action.value } }
        }),
      }
    }

    // ── KR progress ──
    case 'UPDATE_KR_PROGRESS':
      return {
        ...state,
        cycles: state.cycles.map(c => {
          if (c.id !== state.activeCycleId) return c
          return {
            ...c,
            keyResults: c.keyResults.map(kr => {
              if (kr.id !== action.krId) return kr
              const entry = { value: action.value, note: action.note || '', recordedAt: Date.now() }
              return {
                ...kr,
                currentValue: action.value,
                status: action.status || kr.status,
                progressEntries: [...(kr.progressEntries || []), entry],
              }
            }),
          }
        }),
      }

    // ── Learning review ──
    case 'ADD_LEARNING_ITEM':
      return {
        ...state,
        cycles: state.cycles.map(c => {
          if (c.id !== state.activeCycleId) return c
          const lr = c.learningReview || { items: [], keyLearnings: '' }
          return { ...c, learningReview: { ...lr, items: [...lr.items, { id: Date.now(), category: action.category, content: '' }] } }
        }),
      }

    case 'UPDATE_LEARNING_ITEM':
      return {
        ...state,
        cycles: state.cycles.map(c => {
          if (c.id !== state.activeCycleId) return c
          const lr = c.learningReview || { items: [], keyLearnings: '' }
          return { ...c, learningReview: { ...lr, items: lr.items.map(i => i.id === action.id ? { ...i, ...action.data } : i) } }
        }),
      }

    case 'REMOVE_LEARNING_ITEM':
      return {
        ...state,
        cycles: state.cycles.map(c => {
          if (c.id !== state.activeCycleId) return c
          const lr = c.learningReview || { items: [], keyLearnings: '' }
          return { ...c, learningReview: { ...lr, items: lr.items.filter(i => i.id !== action.id) } }
        }),
      }

    // ── Parking lot ──
    case 'ADD_PARKING_ITEM':
      return {
        ...state,
        cycles: state.cycles.map(c => {
          if (c.id !== state.activeCycleId) return c
          return { ...c, parkingLot: [...(c.parkingLot || []), { id: Date.now(), createdAt: new Date().toISOString(), ...action.item }] }
        }),
      }

    case 'UPDATE_PARKING_ITEM':
      return {
        ...state,
        cycles: state.cycles.map(c => {
          if (c.id !== state.activeCycleId) return c
          return { ...c, parkingLot: (c.parkingLot || []).map(i => i.id === action.id ? { ...i, ...action.data } : i) }
        }),
      }

    case 'REMOVE_PARKING_ITEM':
      return {
        ...state,
        cycles: state.cycles.map(c => {
          if (c.id !== state.activeCycleId) return c
          return { ...c, parkingLot: (c.parkingLot || []).filter(i => i.id !== action.id) }
        }),
      }

    // ── Coach messages ──
    case 'SAVE_COACH_MESSAGE':
      return {
        ...state,
        cycles: state.cycles.map(c => {
          if (c.id !== state.activeCycleId) return c
          const cc = c.coachConversations || {}
          return { ...c, coachConversations: { ...cc, [action.context]: [...(cc[action.context] || []), action.message] } }
        }),
      }

    case 'LOAD_STATE':
      return { ...initialState, ...action.state }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('twy_okr_data')
      if (saved) return { ...init, ...JSON.parse(saved) }
    } catch {}
    return init
  })

  useEffect(() => {
    localStorage.setItem('twy_okr_data', JSON.stringify(state))
  }, [state])

  // Derived activeCycle: real cycle if activated, virtual draft if wizard has data
  const activeCycle = state.activeCycleId
    ? (state.cycles.find(c => c.id === state.activeCycleId) || null)
    : (state.wizard.objetivos.length > 0 || state.wizard.temas.length > 0)
      ? wizardToCycle(state.wizard, state.draftCycleFields)
      : null

  const value = {
    // Raw state/dispatch for wizard steps 1-6
    state,
    dispatch,
    // Derived
    cycles: state.cycles,
    activeCycle,
    // Cycle lifecycle
    createCycle: () => dispatch({ type: 'CREATE_CYCLE' }),
    activateCycle: () => dispatch({ type: 'ACTIVATE_CYCLE' }),
    setActiveCycleId: (id) => dispatch({ type: 'SET_ACTIVE_CYCLE', id }),
    deleteCycle: (id) => dispatch({ type: 'DELETE_CYCLE', id }),
    // Update cycle
    updateCycle: (data) => dispatch({ type: 'UPDATE_CYCLE', data }),
    updateNestedField: (section, field, value) => dispatch({ type: 'UPDATE_NESTED_FIELD', section, field, value }),
    // KR
    updateKRProgress: (krId, value, note, status) => dispatch({ type: 'UPDATE_KR_PROGRESS', krId, value, note, status }),
    // Learning
    addLearningItem: (category) => dispatch({ type: 'ADD_LEARNING_ITEM', category }),
    updateLearningItem: (id, data) => dispatch({ type: 'UPDATE_LEARNING_ITEM', id, data }),
    removeLearningItem: (id) => dispatch({ type: 'REMOVE_LEARNING_ITEM', id }),
    // Parking
    addParkingItem: (item) => dispatch({ type: 'ADD_PARKING_ITEM', item }),
    updateParkingItem: (id, data) => dispatch({ type: 'UPDATE_PARKING_ITEM', id, data }),
    removeParkingItem: (id) => dispatch({ type: 'REMOVE_PARKING_ITEM', id }),
    // Coach
    saveCoachMessage: (context, message) => dispatch({ type: 'SAVE_COACH_MESSAGE', context, message }),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
