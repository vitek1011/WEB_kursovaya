import axios, { AxiosResponse } from "axios";
import { ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { projectFirestore, projectStorage } from "../../components/base";

import {
  FETCH_GOODS_SUCCESS,
  FETCH_GOODS_FAILURE,
  FETCH_GOODS_REQUEST,
  CREATE_GOOD_FAILURE,
  serverUrl,
  DELETE_GOOD_FAILURE,
  UPDATE_GOOD_FAILURE,
} from "../constants";
import { Good, AppActions, GetGoods } from "../types";

export const getGoods: ActionCreator<
  ThunkAction<Promise<AxiosResponse<any>>, AppActions, void, GetGoods>
> = (filter = "") => async (dispatch: Dispatch<AppActions>) => {
  dispatch({ type: FETCH_GOODS_REQUEST });

  try {
    const msg = await axios.get(serverUrl + `goods?filter=${filter}`);

    console.log(msg.data);

    return dispatch({ type: FETCH_GOODS_SUCCESS, data: msg.data });
  } catch (err) {
    return dispatch({ type: FETCH_GOODS_FAILURE, data: err });
  }
};

export const createGood = (data: Good) => async (dispatch) => {
  try {
    const storageRef = projectStorage.ref();
    const fileRef = storageRef.child(data.file.name);
    await fileRef.put(data.file);
    const fileUrl = await fileRef.getDownloadURL();

    await projectFirestore.collection("goods").add({
      name: data.name,
      description: data.description,
      price: data.price,
      image: {
        name: data.file.name,
        url: fileUrl,
      },
    });

    return dispatch(getGoods());
  } catch (err) {
    return dispatch({ type: CREATE_GOOD_FAILURE });
  }
};

export const deleteGood = (id: string) => async (
  dispatch: Dispatch<AppActions>
) => {
  try {
    await axios({
      method: "DELETE",
      url: serverUrl + "private/" + "goods/" + id,
      withCredentials: true,
    });

    return dispatch(getGoods());
  } catch (err) {
    dispatch({ type: DELETE_GOOD_FAILURE, data: err });
  }
};

export const updateGood = (data: Good) => async (
  dispatch: Dispatch<AppActions>
) => {
  try {
    await axios.put(serverUrl + "private/" + "goods", JSON.stringify(data), {
      withCredentials: true,
    });

    return dispatch(getGoods());
  } catch (err) {
    dispatch({ type: UPDATE_GOOD_FAILURE, data: err });
  }
};
