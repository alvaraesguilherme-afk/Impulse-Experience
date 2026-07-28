import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export function usePresenca(usuario) {
  const [online, setOnline] = useState(() => new Set())

  useEffect(() => {
    if (!usuario) {
      setOnline(new Set())
      return
    }

    const canal = supabase.channel('presenca-staff', {
      config: { presence: { key: usuario.id } },
    })

    canal.on('presence', { event: 'sync' }, () => {
      setOnline(new Set(Object.keys(canal.presenceState())))
    })

    canal.subscribe(async status => {
      if (status === 'SUBSCRIBED') {
        await canal.track({ nome: usuario.nome, online_em: new Date().toISOString() })
      }
    })

    return () => {
      supabase.removeChannel(canal)
    }
  }, [usuario?.id])

  return online
}
