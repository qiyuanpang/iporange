import React from 'react';
import ReactDOM from 'react-dom';
//import {Router, Route, browserHistory } from 'react-router';
import { HashRouter as Router, useHistory} from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {CookiesProvider} from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import FooterPage from './pages/Footer';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

ReactDOM.render(
  [
  <CookiesProvider>
    <Router key="browserrouter" >
        <App key="app"/>
    </Router>
  </CookiesProvider>,
    // <FooterPage key='footer'/>
  ],
  document.getElementById('root')
);






// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
