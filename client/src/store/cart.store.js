import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set) => ({
            orderDetails: [],

            setOrderDetails: (orderDetails) => set({ orderDetails }),

            setItem: (item) =>
                set((state) => {
                    const existingItemIndex = state.orderDetails.findIndex(
                        (orderDetail) => orderDetail.productId === item.productId
                    );

                    if (existingItemIndex !== -1) {
                        if (item.quantity <= 0) {
                            const updatedOrderDetails = state.orderDetails.filter(
                                (orderDetail) => orderDetail.productId !== item.productId
                            );
                            return { orderDetails: updatedOrderDetails };
                        }

                        const updatedOrderDetails = [...state.orderDetails];
                        updatedOrderDetails[existingItemIndex] = item;
                        return { orderDetails: updatedOrderDetails };
                    } else {
                        return { orderDetails: [...state.orderDetails, item] };
                    }
                }),

            removeFromCart: (productId) =>
                set((state) => ({
                    orderDetails: state.orderDetails.filter((item) => item.productId !== productId),
                })),

            clearCart: () => set({ orderDetails: [] }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
