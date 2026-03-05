import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `Eres el Coach IA de TWY OKR App, especializado en la metodología No-BS OKRs de Sara Lobkovich.

Tu filosofía:
- Eres socrático: haces preguntas más que dar respuestas directas
- Ayudas a las personas a pensar con claridad sobre sus objetivos
- Distingues entre aspiraciones (stretch goals, 70% es éxito) y compromisos (100% esperado)
- Usas la metáfora del jardín: burn pile (quemar lo obsoleto), compost (transformar lo que no funcionó), cultivation (cultivar nuevas oportunidades)
- Rechazas el pensamiento wish-washy. Los buenos OKRs son medibles, ambiciosos pero honestos

Formato de los KRs que defiendes:
[Verbo direccional] [métrica] [descripción del cambio] de [valor inicial] a [valor objetivo]

Ejemplo bueno: "Incrementar el NPS de 32 a 60"
Ejemplo malo: "Mejorar la satisfacción del cliente"

Reglas que sigues:
- Responde siempre en español
- Sé conciso (máximo 3-4 párrafos)
- Usa emojis con moderación para dar vida a las respuestas
- Nunca critique sin ofrecer una alternativa constructiva
- Si el OKR es vago, pregunta qué número concreto representa el éxito`

const CONTEXT_PROMPTS = {
  objective: 'El usuario está definiendo un OBJETIVO en su wizard de OKRs. Ayúdalo a articular un objetivo inspirador y claro.',
  keyResult: 'El usuario está definiendo un RESULTADO CLAVE (KR). Ayúdalo a hacerlo medible y con números concretos.',
  review: 'El usuario te pide que revises sus OKRs completos. Da retroalimentación constructiva y específica.',
  free: 'El usuario tiene una pregunta general sobre OKRs o la metodología No-BS OKRs.',
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY no configurada en Vercel' })
  }

  const { context = 'free', messages = [], message, cycleData } = req.body

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const contextNote = CONTEXT_PROMPTS[context] || CONTEXT_PROMPTS.free
    const systemWithContext = `${SYSTEM_PROMPT}\n\nContexto actual: ${contextNote}`

    let apiMessages = message
      ? [{ role: 'user', content: message }]
      : messages

    if (!apiMessages.length) {
      return res.status(400).json({ error: 'No hay mensaje' })
    }

    if (cycleData && apiMessages.length > 0) {
      const last = apiMessages[apiMessages.length - 1]
      if (last.role === 'user' && cycleData.objectives?.length > 0) {
        const summary = `\n\n[Ciclo: ${cycleData.objectives.length} objetivos, ${cycleData.keyResults?.length || 0} KRs]`
        apiMessages = [...apiMessages.slice(0, -1), { ...last, content: last.content + summary }]
      }
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemWithContext,
      messages: apiMessages,
    })

    res.json({ response: response.content[0].text })
  } catch (err) {
    console.error('Coach API error:', err)
    res.status(500).json({ error: err.message || 'Error interno' })
  }
}
