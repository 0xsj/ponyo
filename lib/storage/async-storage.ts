import AsyncStorage from '@react-native-async-storage/async-storage'
import { StorageAdapter } from './types'

export const AsyncStorageAdapter: StorageAdapter = {
    getItem: async (key: string) => AsyncStorage.getItem(key),
    setItem: async (key: string, value: string) => AsyncStorage.setItem(key, value),
    removeItem: async (key: string) => AsyncStorage.removeItem(key)
}