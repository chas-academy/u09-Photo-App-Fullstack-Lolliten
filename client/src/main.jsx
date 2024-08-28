import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
//import './index.css';     //Importera styling här sen
import authReducer from "./reduxConfig.jsx";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from "react-redux"; // kolla package.json, bara redux toolkit installerat, räcker de?
/* OPTIONAL */
import {
persistStore,
persistReducer,
FLUSH,
REHYDRATE,
PAUSE,
PERSIST,
PURGE,
REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
//Persist is for state, and local storage

// Config
const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
    <App />
    </PersistGate>
    </Provider>
  </StrictMode>,
)