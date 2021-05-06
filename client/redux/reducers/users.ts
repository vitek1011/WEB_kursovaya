import { LOGIN, LOGOUT } from "../constants";
import { database } from "firebase";
import { UsersState, UsersActions } from "../types";

let usersDefaultState: UsersState = {
  username: null,
};

const users = (state = usersDefaultState, action: UsersActions): UsersState => {
  switch (action.type) {
    case LOGIN:
      return { ...state, username: action.data.username };
    case LOGOUT:
      return { ...state, username: usersDefaultState.username };
    default:
      return state;
  }
};

export default users;
