import { Good, CartActions, IncrementData } from "../types";
import { ADD_TO_CART, DELETE_FROM_CART, QUANTITY_CHANGED } from "../constants";

export const addToCart = (data: Good): CartActions => ({
  type: ADD_TO_CART,
  data,
});

export const deleteFromCart = (id: string): CartActions => ({
  type: DELETE_FROM_CART,
  id,
});

export const incrementCount = (data: IncrementData): CartActions => ({
  type: QUANTITY_CHANGED,
  data,
});
