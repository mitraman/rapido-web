import React from 'react'
import { render } from 'react-dom'
import App from './js/modules/App'
import { BrowserRouter as Router, Route } from 'react-router-dom'

render(<Router>
	<Route path="/" component={App}>
	</Route>
</Router>, document.getElementById('App'))
