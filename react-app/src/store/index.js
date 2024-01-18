import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import posts from './posts'
import albums from './albums';
import comments from './comments'
import aws from './aws'
import ui from './ui'
import favorites from './favorites'
import tags from './tags'

const rootReducer = combineReducers({
  session,
  posts,
  albums,
  comments,
  aws,
  favorites,
  tags,
  ui
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
