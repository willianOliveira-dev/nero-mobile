import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartState {
    itemCount: number;
    setItemCount: (count: number) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            itemCount: 0,
            setItemCount: (count) => set({ itemCount: count }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
