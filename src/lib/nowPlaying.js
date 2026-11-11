import { writable, derived } from 'svelte/store';

/** Shared catalog for the top-right combined player. */
export const TRACKS = {
	rachmaninoff: {
		id: 'rachmaninoff',
		kind: 'youtube',
		videoId: 'J7FNWtUwBD0',
		title: 'Rachmaninoff: 10 Preludes, Op. 23: No. 4 in D Major',
		credit: 'Ashkenazy · official',
		/* Local PNGs: dark rims cropped, corners AA'd onto white (no CSS clip fringe) */
		cover: '/album-rachmaninoff.png'
	},
	ghost: {
		id: 'ghost',
		kind: 'audio',
		src: '/ghost-in-a-flower.mp3',
		title: 'Ghost in a Flower',
		credit: 'Elton · my playing',
		cover: '/album-ghost.png'
	},
	'all-of-me': {
		id: 'all-of-me',
		kind: 'audio',
		src: '/all-of-me.mp3',
		title: 'All of Me',
		credit: 'Elton · my playing',
		cover: '/album-all-of-me.png'
	}
};

/** Selectable thumbs under the pill (Bach stays a coming-soon placeholder in the UI). */
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
