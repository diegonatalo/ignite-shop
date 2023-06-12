import { ReactNode, createContext, useState } from 'react'

export interface Product {
  id: string
  name: string
  imageUrl: string
  price: string
  numberPrice: number
  description: string
  defaultPriceId: string
}

interface CartContextData {
  cartItems: Product[]
  cartTotal: number
  addToCart: (product: Product) => void
  checkIfItemAlreadyExists: (productId: string) => boolean
  removeCartItem: (productId: string) => void
}

export const CartContext = createContext({} as CartContextData)

interface CartContextProviderProps {
  children: ReactNode
}

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartItems, setCartItems] = useState<Product[]>([])
  const cartTotal = cartItems.reduce((total, product) => {
    return total + product.numberPrice
  }, 0)

  function addToCart(product: Product) {
    setCartItems((prevState) => [...prevState, product])
  }

  function checkIfItemAlreadyExists(productId: string) {
    return cartItems.some((product) => product.id === productId)
  }

  function removeCartItem(productId: string) {
    setCartItems((prevState) =>
      prevState.filter((product) => product.id !== productId)
    )
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        addToCart,
        checkIfItemAlreadyExists,
        removeCartItem
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
