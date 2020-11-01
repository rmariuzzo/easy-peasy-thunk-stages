import { ThunkCreator } from 'easy-peasy'
import { useCallback, useState } from 'react'

import { ThunkStage } from './thunk-stages-model'

export const useThunkStages = <P = void, R = any>(
  thunk: ThunkCreator<P, R>
): [(payload: P extends undefined ? void : P) => Promise<R>, ThunkStage] => {
  const [stage, setStage] = useState<ThunkStage>('idle')
  const wrapper = useCallback(
    async (...args: Parameters<typeof thunk>) => {
      setStage('busy')
      try {
        const result = await thunk(...args)
        setStage('completed')
        return result
      } catch (error) {
        setStage('failed')
        throw error
      }
    },
    [thunk]
  )
  return [wrapper, stage]
}
