import { applyMiddleware, createStore, StoreCreator } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "./reducers";

const makeConfiguredStore = (reducer, initialState) =>
  createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunk))
  );

export const makeStore = (initialState, { isServer, req, debug, storeKey }) => {
  if (isServer) {
    initialState = initialState || { fromServer: "foo" };

    return makeConfiguredStore(rootReducer, initialState);
  } else {
    const persistConfig = {
      key: "nextjs",
      whitelist: ["cart", "users"],
      blacklist: ["goods", "cart"],
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = makeConfiguredStore(persistedReducer, initialState);

    store.__persistor = persistStore(store);

    return store;
  }
};
