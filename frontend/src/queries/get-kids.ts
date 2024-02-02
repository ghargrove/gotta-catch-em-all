
import { queryOptions  } from '@tanstack/react-query'

export type Prices = {
  low: number
  mid: number
  high: number
  market: number
}

// TODO: Camelcase responses
export type Card = {
  id: number
  tcg_id: string
  name: string
  kind: 'normal' | 'holofoil' | 'reverse-holofoil'
  prices: Prices
}

type Kid = {
  id: number
  name: string
  cards: Card[],
  value: Prices
}

type KidsResult = {
  kids: Kid[]
}

export const fetchAllKids = async (): Promise<KidsResult> => {
  return fetch('http://127.0.0.1:8082/api/kids', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
  })
}

export const indexQueryOptions = queryOptions<KidsResult>({
  queryKey: ['kids'],
  queryFn: () => {
    return fetchAllKids()
  }
})