import { CartItem } from "@/type/CartItem";

export const addToCart = (newItem: CartItem) => {
    const storedCart = localStorage.getItem("cart");
    const cartItems: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
    const existingItem = cartItems.find(item => item.productId === newItem.productId);
    
    if (existingItem) {
      existingItem.quantity += newItem.quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
    } else {
      cartItems.push(newItem);
    }
    localStorage.setItem("cart", JSON.stringify(cartItems));
  };
  
  export const updateCart = (productId: string, newQuantity: number) => {
    const storedCart = localStorage.getItem("cart");
    const cartItems: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
    
    const itemToUpdate = cartItems.find(item => item.productId === productId);
    
    if (itemToUpdate) {
      console.log(itemToUpdate);
      
      itemToUpdate.quantity = newQuantity;
      itemToUpdate.totalPrice = itemToUpdate.quantity * itemToUpdate.unitPrice;
      
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  };
  
  export const removeFromCart = (productId: string) => {
    const storedCart = localStorage.getItem("cart");
    const cartItems: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
    
    // Loại bỏ sản phẩm khỏi giỏ dựa trên productId
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  
  export const clearCartFromLocalStorage = () => {
    localStorage.removeItem("cart");
  };

  export const getCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      return JSON.parse(storedCart) as CartItem[];
    }
    return null
  }