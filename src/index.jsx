import React from 'react'
import { render } from 'react-dom'
import App from './js/App'
import { Router, Route, hashHistory } from 'react-router'

// Is this showing up in the container?
render(<Router history={hashHistory}>
	<Route path="/" component={App}>
	</Route>
	</Router>, document.getElementById('App'))
