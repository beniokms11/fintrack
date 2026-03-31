import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { transactions, period } = await request.json()

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API non configurée' }, { status: 500 })
    }

    const prompt = `Analyse ces données financières et donne 2-3 insights courts et utiles en français.

Données (période: ${period || '30 jours'}):
${JSON.stringify(transactions?.slice(0, 20) || [], null, 2)}

Format ta réponse en JSON :
{
  "insights": [
    { "type": "positive|warning|tip|neutral", "title": "Titre court", "message": "Message concis en 1-2 phrases", "icon": "emoji" }
  ]
}

Règles :
- Utilise FCFA comme devise
- Sois concis et encourageant
- Base-toi UNIQUEMENT sur les données fournies
- Ne donne pas plus de 3 insights`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Tu es un analyste financier expert. Réponds uniquement en JSON valide.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 512,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Erreur du service IA' }, { status: response.status })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || '{}'

    try {
      const parsed = JSON.parse(content)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({ insights: [] })
    }
  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
