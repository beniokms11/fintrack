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

    const { description, merchant } = await request.json()

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API non configurée' }, { status: 500 })
    }

    const prompt = `Catégorise cette transaction. Description: "${description}"${merchant ? `, Marchand: "${merchant}"` : ''}.

Catégories disponibles :
- Alimentation (repas, courses, nourriture)
- Transport (taxi, bus, carburant)
- Loyer (logement, loyer)
- Santé (pharmacie, hôpital, médecin)
- Loisirs (sortie, divertissement, sport)
- Éducation (école, formation, livres)
- Famille (aide familiale, cadeaux)
- Recharge / Internet (forfait, data, wifi)
- Mobile Money (transfert, frais)
- Business (professionnel)
- Salaire (emploi, paie)
- Vente (commerce)

Réponds uniquement avec le nom exact de la catégorie, rien d'autre.`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 50,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Erreur du service IA' }, { status: response.status })
    }

    const data = await response.json()
    const category = data.choices?.[0]?.message?.content?.trim() || ''

    return NextResponse.json({ category })
  } catch (error) {
    console.error('AI categorize error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
