import { queryOptions } from '@tanstack/react-query'

type SetImages = {
  logo: string
  symbol: string
}

// Should these be remapped on the api side to create consistent
// underscored names?

export type Set = {
  id: string
  images: SetImages
  name: string
  releaseDate: string
  series: string
}

type SetsResult = {
  sets: Set[]
}


/** Get the sets */
const fetchAllSets = async (): Promise<SetsResult> => {
  return fetch("http://127.0.0.1:8082/api/sets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => {
    if (res.ok) {
      return res.json()
    }
  })
}

export const setQueryOptions = queryOptions({
  queryKey: ['sets'],
  queryFn: () => fetchAllSets()
})
