import React, { Component } from 'react'

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			query: null
		}
	}


	render() {
		return (
			<div className="Search">
				<p>search</p>
			</div>
		);
	}
}



export default Search;