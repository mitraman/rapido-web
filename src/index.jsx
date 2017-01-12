import React from 'react'
import { render } from 'react-dom'
import App from './js/App'
import D3 from './js/D3'
import { Router, Route, hashHistory } from 'react-router'

// Is this showing up in the container?
render(<Router history={hashHistory}>
	<Route path="/" component={App}>
    <Route path="/d3" component={D3}></Route>
	</Route>
</Router>, document.getElementById('App'))
