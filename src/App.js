import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Player from "./Player";
import "./App.css";

class App extends Component {
	constructor() {
		super();
		this.state = {
			token: null,
			ttl: null,
			item: {
				album: {
					images: [{ url: "" }]
				},
				name: "",
				artists: [{ name: "" }],
				duration_ms: 0
			},
			is_playing: "Paused",
			progress_ms: 0
		};
		this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
	}

	componentDidMount() {
		// check for active session
		let token = sessionStorage.getItem('token');
		let ttl = sessionStorage.getItem('ttl');
		let active = ttl > Date.now() * 1000 ? true : false;
		if (active) {
			this.setState({
				token: token,
				ttl: ttl
			});
		} else { // need to get new token
			token = hash.access_token;
			if (token) {
				this.setState({
					token: token
				}, () => {
					sessionStorage.setItem('token', hash.access_token)
					sessionStorage.setItem('ttl', hash.expires_in + (Date.now() * 1000));
				});
			}
		}
		this.getCurrentlyPlaying(token);
	}

	getCurrentlyPlaying(token) {
		// Make a call using the token
		$.ajax({
			url: "https://api.spotify.com/v1/me/player",
			type: "GET",
			beforeSend: xhr => {
				xhr.setRequestHeader("Authorization", "Bearer " + token);
			},
			success: data => {
				this.setState({
					item: data.item,
					is_playing: data.is_playing,
					progress_ms: data.progress_ms
				});
			}
		});
	}

	render() {
		return (
			<div className="App">
				{!this.state.token && (
					<a
						className="btn btn--loginApp-link"
						href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
							"%20"
						)}&response_type=token&show_dialog=true`}
					>
						Login to Spotify
					</a>
				)}
				{this.state.token && (
					<Player
						item={this.state.item}
						is_playing={this.state.is_playing}
						progress_ms={this.progress_ms}
					/>
				)}
			</div>
		);
	}
}

export default App;
