import { createListenerMiddleware, isAnyOf, TypedStartListening } from '@reduxjs/toolkit'
import { AppDispach, RootState } from '..'
import { updateFileContent } from '../slices/filesSlice'
import runTypescript from '../../runners/typescript/runner'

export const filesListenerMiddleware = createListenerMiddleware()

type AppStartListening = TypedStartListening<RootState, AppDispach>

const startAppListening = filesListenerMiddleware.startListening as AppStartListening

startAppListening({
  matcher: isAnyOf(updateFileContent),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState()
    const dispatch = listenerApi.dispatch

    if (updateFileContent.match(action)) {
      runTypescript(action.payload.content)
    }
  }
})
