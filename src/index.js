import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './assets/css/animate.css';
import { CircularProgress } from './materials';
import { store, persistor } from './redux/storeConfig/store';
import * as serviceWorker from './serviceWorker';
const LazyApp = lazy(() => import('./App'));

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Suspense
        fallback={
          <CircularProgress
            style={{
              color: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
            }}
          />
        }
      >
          <LazyApp />
      </Suspense>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
