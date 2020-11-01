import { createStore, thunk, Thunk, action } from 'easy-peasy'

import { thunkStagesModel, ThunkStagesModel } from '../thunk-stages-model'

describe('thunkStagesModel()', () => {
  it('should create store', () => {
    createStore(thunkStagesModel({}))
  })

  it('should set initial thunk stages values', () => {
    type TestModel = {
      test: Thunk<TestModel>
    }
    const testModel: TestModel & ThunkStagesModel<TestModel> = {
      test: thunk(jest.fn()),
      ...thunkStagesModel({
        test: 'idle'
      })
    }
    const store = createStore(testModel)
    expect(store.getState().thunkStages).toHaveProperty('test', 'idle')
  })

  it('should set "busy" and "completed" stage of a thunk', () => {
    type TestModel = {
      test: Thunk<TestModel>
    }
    const setThunkStageSpy = jest.fn()
    const testModel: TestModel & ThunkStagesModel<TestModel> = {
      test: thunk(jest.fn()),
      ...thunkStagesModel({
        test: 'idle'
      }),
      setThunkStage: action((state, payload) => {
        setThunkStageSpy(payload)
      })
    }
    const store = createStore(testModel)
    store.getActions().test()
    expect(setThunkStageSpy).toHaveBeenCalledWith({
      thunk: 'test',
      stage: 'busy'
    })
    expect(setThunkStageSpy).toHaveBeenCalledWith({
      thunk: 'test',
      stage: 'completed'
    })
  })

  it('should set "busy" and "failed" stage of a thunk', async () => {
    jest.useFakeTimers()
    type TestModel = {
      test: Thunk<TestModel>
    }
    const setThunkStageSpy = jest.fn()
    const testModel: TestModel & ThunkStagesModel<TestModel> = {
      test: thunk(() => Promise.reject()),
      ...thunkStagesModel({
        test: 'idle'
      }),
      setThunkStage: action((state, payload) => {
        setThunkStageSpy(payload)
      })
    }
    const store = createStore(testModel)
    try {
      await store.getActions().test()
      fail()
    } catch {
      // Intentionally left blank.
    }
    setImmediate(() => {
      expect(setThunkStageSpy).toHaveBeenCalledWith({
        thunk: 'test',
        stage: 'busy'
      })
      expect(setThunkStageSpy).toHaveBeenCalledWith({
        thunk: 'test',
        stage: 'failed'
      })
    })
  })
})
