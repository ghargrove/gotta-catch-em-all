import { useContext } from 'react'

import { KidContext } from '~/components/AuthenticationProvider'
import { Kid } from '~/queries/get-kids'

/**
 * Retrieve the currently authenticated kid.
 * 
 * @returns `undefined` if the authentication is not yet known. 
 * `null` if the user is a guest and a `Kid` object if the user is authenticated
*/
export function useAuthenticatedKid(): undefined | null | Kid {
  const authenticatedKid = useContext(KidContext)

  return authenticatedKid
}