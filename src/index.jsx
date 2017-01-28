import React from 'react'
import { render } from 'react-dom'
import App from './js/App'
import CRUDSketch from './js/CRUDSketch'
import Edit from './js/Edit'
import { Router, Route, browserHistory } from 'react-router'

// Is this showing up in the container?
render(<Router history={browserHistory}>
	<Route path="/" component={App}>
		<Route path="/nodes" component={CRUDSketch}>
			<Route path="/nodes/:nodeId" component={Edit}></Route>
		</Route>
	</Route>
</Router>, document.getElementById('App'))
