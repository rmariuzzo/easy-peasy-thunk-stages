import {
  action,
  Action,
  Generic,
  generic,
  Thunk,
  ThunkCreator,
  thunkOn,
  ThunkOn
} from 'easy-peasy'

export type ThunkStage = 'idle' | 'busy' | 'completed' | 'failed'

type ThunkNames<M extends Record<string, unknown>> = {
  [K in keyof M]: M[K] extends Thunk<any, any, any, any, any> ? K : never
}[keyof M]

export interface ThunkStagesModel<M extends Record<string, unknown>> {
  thunkStages: Generic<
    Record<ThunkNames<Omit<M, keyof ThunkStagesModel<any>>>, ThunkStage>
  >
  setThunkStage: Action<
    ThunkStagesModel<M>,
    {
      thunk: ThunkNames<Omit<M, keyof ThunkStagesModel<any>>>
      stage: ThunkStage
    }
  >
  setThunkStageOn: ThunkOn<ThunkStagesModel<M>>
}

export const thunkStagesModel = <M extends Record<string, unknown>>(
  initialThunkStages: Record<
    ThunkNames<Omit<M, keyof ThunkStagesModel<any>>>,
    ThunkStage
  >
): ThunkStagesModel<M> => {
  return {
    thunkStages: generic(initialThunkStages),
    setThunkStage: action((state, payload) => {
      state.thunkStages[payload.thunk] = payload.stage
    }),
    setThunkStageOn: thunkOn(
      (actions) => {
        return (Object.keys(actions) as Array<keyof typeof actions>)
          .filter(
            (actionName) =>
              'type' in actions[actionName] &&
              'startType' in actions[actionName] &&
              'successType' in actions[actionName] &&
              'failType' in actions[actionName]
          )
          .reduce<Array<string>>((p, actionName) => {
            const action = <ThunkCreator | undefined>(
              Object.values(actions).find(
                (action) => action.type.split('.').pop() === actionName
              )
            )
            if (action) {
              p.push(
                action.type,
                action.startType,
                action.successType,
                action.failType
              )
            }
            return p
          }, [])
      },
      async (actions, target, helpers) => {
        const action = Object.values(actions).find(
          (action) => action.type === target.type.split('(')[0]
        )
        if (!action) {
          throw new Error(`Could not find action by type: ${target.type}`)
        }

        if (
          !(
            'startType' in action &&
            'successType' in action &&
            'failType' in action
          )
        ) {
          throw new Error(`The action type: ${target.type} is not a thunk`)
        }
        const thunkAction = <ThunkCreator>action
        const newStage: ThunkStage =
          target.type === thunkAction.startType
            ? 'busy'
            : target.type === thunkAction.successType
            ? 'completed'
            : target.type === thunkAction.failType
            ? 'failed'
            : 'idle'
        const thunkName = thunkAction.type.split('.').pop()
        if (!thunkName || !(thunkName in helpers.getState().thunkStages)) {
          throw new Error(`Invalid thunk name: ${thunkName}`)
        }
        actions.setThunkStage({ thunk: thunkName as any, stage: newStage })
      }
    )
  }
}
