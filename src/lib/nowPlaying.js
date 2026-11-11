import { writable, derived } from 'svelte/store';

/** Shared catalog for the top-right combined player. */
export const TRACKS = {
	rachmaninoff: {
		id: 'rachmaninoff',
		kind: 'youtube',
		videoId: 'J7FNWtUwBD0',
		title: 'Rachmaninoff: 10 Preludes, Op. 23: No. 4 in D Major',
		credit: 'Ashkenazy · official',
		cover: 'https://i.ytimg.com/vi/J7FNWtUwBD0/hqdefault.jpg'
	},
	ghost: {
		id: 'ghost',
		kind: 'audio',
		src: '/ghost-in-a-flower.mp3',
		title: 'Ghost in a Flower',
		credit: 'my playing',
		cover:
			'https://cdns-images.dzcdn.net/images/cover/d23308fd612026c39ba4ea5f3f99ab83/500x500.jpg'
	},
	'all-of-me': {
		id: 'all-of-me',
		kind: 'audio',
		src: '/all-of-me.mp3',
		title: 'All of Me',
		credit: 'my playing',
		cover: 'https://m.media-amazon.com/images/I/61b0Mz2-fDL._SY580_.jpg'
	},
	bach: {
		id: 'bach',
		kind: 'coming-soon',
		title: 'Bach',
		credit: 'Coming soon',
		cover: '/bach-album.jpg'
	}
};

/** Selectable thumbs under the pill (Bach stays coming-soon — art only). */
export const ALBUM_IDS = ['rachmaninoff', 'ghost', 'all-of-me'];

/** @type {import('svelte/store').Writable<{ id: string, autoplay: boolean, nonce: number }>} */
export const nowPlaying = writable({ id: 'rachmaninoff', autoplay: false, nonce: 0 });

export const currentTrack = derived(nowPlaying, ($np) => TRACKS[$np.id] || TRACKS.rachmaninoff);

/** @param {string} id @param {boolean} [autoplay] */
export function playTrack(id, autoplay = true) {
	if (!TRACKS[id]) return;
	nowPlaying.update((prev) => ({
		id,
		autoplay,
		nonce: (prev?.nonce || 0) + 1
	}));
}
