import { renderHook, act } from '@testing-library/react-hooks'

import { useThunkStage } from '../use-thunk-stages'

describe('useThunkStages()', () => {
  it('should wrap a thunk', async () => {
    const thunk = jest.fn()
    const { result } = renderHook(() => useThunkStage(thunk as any))
    const [wrapper] = result.current
    expect(thunk).not.toHaveBeenCalled()
    await act(() => wrapper())
    expect(thunk).toHaveBeenCalled()
  })

  it('should default thunk stage to "idle"', () => {
    const thunk = jest.fn().mockImplementation(() => Promise.resolve())
    const { result } = renderHook(() => useThunkStage(thunk as any))
    const [, stage] = result.current
    expect(stage).toBe('idle')
  })

  it('should change thunk stage to "busy"', async () => {
    const thunk = jest
      .fn()
      .mockImplementation(
        async () => new Promise((resolve) => setTimeout(resolve, 100))
      )
    const { result } = renderHook(() => useThunkStage(thunk as any))

    const [wrapper] = result.current
    act(() => {
      wrapper()
    })

    const [, stage] = result.current
    expect(stage).toBe('busy')
  })

  it('should change thunk stage to "completed"', async () => {
    const thunk = jest
      .fn()
      .mockImplementation(
        async () => new Promise((resolve) => setTimeout(resolve, 100))
      )
    const { result, waitForNextUpdate } = renderHook(() =>
      useThunkStage(thunk as any)
    )

    act(() => {
      const [wrapper] = result.current
      wrapper()
    })
    await waitForNextUpdate()

    const [, stage] = result.current
    expect(stage).toBe('completed')
  })

  it('should change thunk stage to "failed"', async () => {
    const thunk = jest
      .fn()
      .mockImplementation(
        () => Promise.reject()
      )
    const { result, waitForNextUpdate } = renderHook(() =>
      useThunkStage(thunk as any)
    )

    act(() => {
      const [wrapper] = result.current
      wrapper().catch(() => {
        // Intentionally left blank.
      })
    })
    await waitForNextUpdate()

    const [, stage] = result.current
    expect(stage).toBe('failed')
  })
})
