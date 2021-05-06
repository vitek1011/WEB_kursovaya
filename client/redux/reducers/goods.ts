import {
  FETCH_GOODS_FAILURE,
  FETCH_GOODS_REQUEST,
  FETCH_GOODS_SUCCESS,
  DELETE_GOOD_FAILURE,
} from "../constants";
import { GoodsState, GoodActions } from "../types";

let goodsDefaultState: GoodsState = {
  isFetching: false,
  isFetched: false,
  error: null,
  goods: [],
};

const goods = (state = goodsDefaultState, action: GoodActions): GoodsState => {
  switch (action.type) {
    case FETCH_GOODS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        goods: action.data,
      };
    case FETCH_GOODS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_GOODS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFetched: false,
        error: action.data,
      };
    case DELETE_GOOD_FAILURE:
      return {
        ...state,
        error: action.data,
      };
    default:
      return state;
  }
};

export default goods;
