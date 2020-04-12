import axios from 'axios';

export function getPlaylistContents(token) {
	return;
}

export function getPlaylists(token) {
	return axios.get('https://api.spotify.com/v1/me/playlists&limit=50',
		{
			headers: {
				'Authorization': 'Bearer ' + token
			}
		}
	)
}