import React from 'react';
import ReactDOM from 'react-dom';
import Game from "./game";
import * as ServiceWorker from './service-worker';
import './index.css';

ReactDOM.render(<Game />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
ServiceWorker.register();
