// hooks/useStore.ts
import { useContext, createContext } from 'react';
import store from '../store';

export const StoreContext = createContext(store);

export const useStore = () => {
    return useContext(StoreContext);
};