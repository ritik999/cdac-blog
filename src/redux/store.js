import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import theamReducer from './theam/theamSlice'
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


const rootReducer=combineReducers({
    userData:userReducer,
    theam:theamReducer,
})

const persistConfig={
    key:'root',
    storage,
    version:1,
}

const persistedReducer=persistReducer(persistConfig,rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

export const persistor=persistStore(store);

// export const store=configureStore({
//     reducer:{
//         user:userReducer
//     }
// })
