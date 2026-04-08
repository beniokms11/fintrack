import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPT = `Tu es l'assistant financier FinTrack, un conseiller bienveillant et expert en finances personnelles pour les utilisateurs francophones en Afrique de l'Ouest.

RÈGLES IMPORTANTES :
- Réponds TOUJOURS en français
- Utilise le FCFA (Franc CFA) comme devise
- Sois concis, pratique et encourageant
- Donne des conseils adaptés au contexte ouest-africain (Mobile Money, tontine, etc.)
- N'invente JAMAIS de chiffres sur les finances de l'utilisateur
- Si tu ne connais pas une réponse, dis-le honnêtement
- Utilise des emojis avec modération pour rester engageant
- Propose des conseils actionnables, pas juste de la théorie

CONTEXTE :
Tu aides des utilisateurs qui gèrent leur argent entre espèces, Mobile Money (MTN MoMo, Moov Money), comptes bancaires et épargne. Les catégories de dépenses courantes incluent : alimentation, transport, loyer, santé, recharge/internet, loisirs, famille, business.

Tu peux aider avec :
- Analyser des habitudes de dépenses
- Donner des conseils d'épargne
- Proposer des budgets réalistes
- Expliquer des concepts financiers simplement
- Motiver l'utilisateur à mieux gérer son argent`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 })
    }

    // Récupérer le contexte récent pour l'IA
    const { data: wallets } = await supabase.from('wallets').select('name, balance')
    const totalBalance = wallets?.reduce((sum, w) => sum + Number(w.balance), 0) || 0

    const { data: txs } = await supabase
      .from('transactions')
      .select('type, amount, date, description')
      .order('date', { ascending: false })
      .limit(10)

    const userInfo = `
INFOS UTILISATEUR (A ne mentionner que si pertinent) :
- Solde total estimé : ${totalBalance} FCFA
- Dernières transactions : ${JSON.stringify(txs)}
`

    const finalSystemPrompt = SYSTEM_PROMPT + userInfo


    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API non configurée' }, { status: 500 })
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: finalSystemPrompt },
          ...messages.slice(-20), // Keep last 20 messages for context
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Groq API error:', response.status, errorData)
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'L\'assistant est très sollicité en ce moment. Réessaie dans quelques minutes.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: 'Erreur du service IA. Réessaie dans un moment.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse."

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Erreur interne. Réessaie dans un moment.' },
      { status: 500 }
    )
  }
}
