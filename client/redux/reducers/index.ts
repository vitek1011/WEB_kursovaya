import { combineReducers } from "redux";

import cart from "./cart";
import goods from "./goods";
import users from "./users";

const rootReducer = combineReducers({ cart, goods, users });

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
