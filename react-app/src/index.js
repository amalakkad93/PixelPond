import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ModalProvider, Modal } from './context/Modal';
import { ShortModalProvider, ShortModal } from './context/ModalShort';
import { LoadingProvider } from './context/LoadingContext';

import ThemeProvider from "./context/ThemeContext";
import configureStore from "./store";
import * as sessionActions from "./store/session";


import App from "./App";

import "./index.css";



const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
}

// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:

function Root() {
  return (
    <ThemeProvider>
      <ShortModalProvider>
        <ModalProvider>
          <LoadingProvider>
            <Provider store={store}>
              <Router>
                <App />
                <ShortModal />
                <Modal />
              </Router>
            </Provider>
          </LoadingProvider>
        </ModalProvider>
      </ShortModalProvider>
    </ThemeProvider>
  );
}


ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
