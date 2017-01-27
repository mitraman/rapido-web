import React from 'react'
import { render } from 'react-dom'
import App from './js/App'
import CRUDSketch from './js/CRUDSketch'
import Ace from './js/AceExample'
import { Router, Route, browserHistory } from 'react-router'

// Is this showing up in the container?
render(<Router history={browserHistory}>
	<Route path="/" component={App}>
    <Route path="/d3" component={CRUDSketch}></Route>
		<Route path="/ace" component={Ace}></Route>
		<Route path="/nodes" component={CRUDSketch}>
			<Route path="/nodes/:nodeId" component={Ace}></Route>
		</Route>
	</Route>
</Router>, document.getElementById('App'))
