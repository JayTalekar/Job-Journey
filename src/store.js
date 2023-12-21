import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "@redux-devtools/extension";
import { rootReducer } from "./reducers/rootReducer";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    storage,
    // blacklist: ['jobs', 'categories']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore(
    {
        reducer: persistedReducer,
        middleware: [thunk]
    },
    composeWithDevTools()
);

export const persistor = persistStore(store)