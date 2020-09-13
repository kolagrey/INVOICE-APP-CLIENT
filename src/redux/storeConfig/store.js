import { createStore, applyMiddleware, compose } from 'redux';
import createDebounce from 'redux-debounced';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import rootReducer from '../reducers/rootReducer';

const middlewares = [thunk, createDebounce()];
const persistConfig = {
  key: 'root',
  storage: storageSession
};
const persistedReducer = persistReducer(persistConfig, rootReducer)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);
const persistor = persistStore(store);

export { store, persistor };
