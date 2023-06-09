import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import Action from './Action';

const rootReducer = combineReducers({
  Action: Action,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware())
);

export default store;
