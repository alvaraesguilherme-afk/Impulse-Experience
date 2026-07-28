import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'

export function usePresenca(usuario) {
  const [online, setOnline] = useState(() => new Map())
  const [toasts, setToasts] = useState([])
  const proximoIdRef = useRef(0)

  useEffect(() => {
    if (!usuario) {
      setOnline(new Map())
      return
    }

    const canal = supabase.channel('presenca-staff', {
      config: { presence: { key: usuario.id } },
    })

    canal.on('presence', { event: 'sync' }, () => {
      const estado = canal.presenceState()
      const mapa = new Map()
      for (const [id, presencas] of Object.entries(estado)) {
        const info = presencas[0]
        mapa.set(id, { nome: info?.nome, online_em: info?.online_em })
      }
      setOnline(mapa)
    })

    canal.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      if (key === usuario.id) return
      const info = newPresences[0]
      const toastId = ++proximoIdRef.current
      setToasts(atual => [...atual, { id: toastId, nome: info?.nome || 'Alguém' }])
      setTimeout(() => {
        setToasts(atual => atual.filter(t => t.id !== toastId))
      }, 4000)
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

  return { online, toasts }
}
