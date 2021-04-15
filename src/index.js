import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import  rootReducer  from './reducers/RootReducer';
import {sessionReducer, sessionService} from 'redux-react-session';
import App from './App';
import { createLogger } from 'redux-logger';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
const reduxLogger = createLogger();

const store = createStore(rootReducer, undefined, applyMiddleware(thunkMiddleware, reduxLogger));
const validateSession = (session) => {
  /* sessionService.loadSession();
   sessionService.loadUser();*/
   return true;
}

const options = { refreshOnCheckAuth: false, redirectPath: '/home', driver: 'COOKIES',validateSession};
sessionService.initSessionService(store, options)
    .then(() => console.log('Redux React Session is ready and a session was refreshed from your storage'))
    .catch(() => console.log('Redux React Session is ready and there is no session in your storage'));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
