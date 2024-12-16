import { combineReducers, configureStore } from '@reduxjs/toolkit'
import FilesReducer from './slices/filesSlice'

const rootReducer = combineReducers({
  files: FilesReducer
})

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof rootReducer>

export type AppDispach = typeof store.dispatch
