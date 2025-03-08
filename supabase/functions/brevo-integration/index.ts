import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const SUPABASE_URL = 'https://jdwcgbwcwkrrvaqtokju.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BrevoContact {
  email: string
  attributes: {
    NOME?: string
    EMPRESA?: string
  }
  listIds: number[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    )

    const { record } = await req.json()
    const { id, email, user_type, full_name } = record

    // Configurar contato para o Brevo
    const contact: BrevoContact = {
      email,
      attributes: {},
      listIds: []
    }

    // Configurar dados específicos baseado no tipo de usuário
    if (user_type === 'candidate') {
      contact.attributes.NOME = full_name
      contact.listIds = [4] // Lista de candidatos
    } else if (user_type === 'company') {
      contact.attributes.NOME = full_name
      contact.listIds = [3] // Lista de empresas
    }

    // Enviar para o Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY!
      },
      body: JSON.stringify(contact)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Erro ao adicionar contato ao Brevo:', error)
      throw new Error(`Erro ao adicionar contato ao Brevo: ${error}`)
    }

    const data = await response.json()
    console.log('Contato adicionado com sucesso ao Brevo:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Erro na função brevo-integration:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})