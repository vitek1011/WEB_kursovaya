import {
  ADD_TO_CART,
  DELETE_FROM_CART,
  QUANTITY_CHANGED,
  LOGIN,
  FETCH_GOODS_SUCCESS,
  FETCH_GOODS_FAILURE,
  FETCH_GOODS_REQUEST,
  CREATE_GOOD_FAILURE,
  DELETE_GOOD_FAILURE,
  UPDATE_GOOD_FAILURE,
  LOGOUT,
} from "./constants";
import { AxiosResponse } from "axios";
import { Dispatch } from "redux";

export interface Good {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity?: number;
  image: {
    name: string;
    url: string;
  };
}

export interface AddToCart {
  type: typeof ADD_TO_CART;
  data: Good;
}

export interface DeleteFromCart {
  type: typeof DELETE_FROM_CART;
  id: string;
}

export interface IncrementCount {
  type: typeof QUANTITY_CHANGED;
  data: IncrementData;
}

export interface IncrementData {
  id: string;
  e: string;
}

export type CartActions = AddToCart | DeleteFromCart | IncrementCount;

export interface Login {
  type: typeof LOGIN;
  data: {
    username: string;
  };
}

export interface Logout {
  type: typeof LOGOUT;
}

export interface Whoami {
  type: (
    username: string
  ) => (dispatch: Dispatch<AppActions>) => Promise<{ type: typeof LOGOUT }>;
}

export interface UsersState {
  username: string | null;
}

export type UsersActions = Login | Logout | Whoami;

export interface GetGoods {
  type:
    | typeof FETCH_GOODS_SUCCESS
    | typeof FETCH_GOODS_FAILURE
    | typeof FETCH_GOODS_REQUEST;
  data?: any;
}

export interface CreateGood {
  type:
    | typeof FETCH_GOODS_SUCCESS
    | typeof FETCH_GOODS_FAILURE
    | typeof CREATE_GOOD_FAILURE;
  data: any;
}

export interface DeleteGood {
  type:
    | typeof FETCH_GOODS_SUCCESS
    | typeof FETCH_GOODS_FAILURE
    | typeof DELETE_GOOD_FAILURE;
  data?: any;
}

export interface UpdateGood {
  type:
    | typeof FETCH_GOODS_SUCCESS
    | typeof FETCH_GOODS_FAILURE
    | typeof UPDATE_GOOD_FAILURE;
  data: any;
}

export interface GoodsState {
  isFetching: boolean;
  isFetched: boolean;
  error: any;
  goods: Good[];
}

export type GoodActions = GetGoods | CreateGood | DeleteGood | UpdateGood;

export type AppActions = CartActions | GoodActions | UsersActions;
