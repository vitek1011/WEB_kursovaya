import { ADD_TO_CART, DELETE_FROM_CART, QUANTITY_CHANGED } from "../constants";
import { CartActions } from "../types";
import { Good } from "../types";

const cartDefaultState: Good[] = [];

const cart = (state = cartDefaultState, action: CartActions): Good[] => {
  switch (action.type) {
    case ADD_TO_CART:
      const goodIndex = state.findIndex(
        (good) => good.name === action.data.name
      );

      if (state[goodIndex]) {
        return state.map((value, index) => {
          if (index == goodIndex) {
            if (value.quantity < 10) {
              value.quantity++;
              return { ...value };
            }
          }

          return value;
        });
      }

      action.data.quantity = 1;
      return [...state, action.data];
    case DELETE_FROM_CART:
      return [...state].filter((good) => good.id !== action.id);

    case QUANTITY_CHANGED:
      const quantityIndex = state.findIndex(
        (good) => good.id === action.data.id
      );

      return state.map((value, index) => {
        if (index == quantityIndex) {
          return { ...value, quantity: Number.parseInt(action.data.e) };
        }

        return value;
      });
    default:
      return state;
  }
};

export default cart;
