import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const asObject = anecdote => ({
  content: anecdote,
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes: anecdotes.toSorted((a, b) => b.votes - a.votes) }))
    },
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(asObject(content))
      set(state => ({ anecdotes: [...state.anecdotes, newAnecdote] }))
    },
    vote: async (id) => {
      const votedAnecdote = await anecdoteService.vote(id)
      set(state => ({ anecdotes: state.anecdotes
        .map(anecdote => anecdote.id === id ? votedAnecdote : anecdote)
        .toSorted((a, b) => b.votes - a.votes)
      }))
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set(state => ({ 
        anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id)
      }))
    },
    setFilter: (filter) => {
      set(() => ({
        filter: filter
      }))
    }
  },
}))

const useNotificationStore = create((set, get) => ({
  message: '',
  timeoutId: null,
  actions: {
    showMessage: (msg) => {
      const { timeoutId } = get()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      const id = setTimeout(() => {
        set({ message: '', timeoutId: null })
      }, 5000)

      set({
        message: msg,
        timeoutId: id
      })
    },
  }
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useNotification = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export default useAnecdoteStore
