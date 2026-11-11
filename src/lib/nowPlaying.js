import { writable, derived } from 'svelte/store';

/** Shared catalog for all listen modes. */
export const TRACKS = {
	rachmaninoff: {
		id: 'rachmaninoff',
		kind: 'youtube',
		videoId: 'J7FNWtUwBD0',
		title: 'Rachmaninoff: 10 Preludes, Op. 23: No. 4 in D Major',
		credit: 'Ashkenazy · official',
		cover: null
	},
	ghost: {
		id: 'ghost',
		kind: 'audio',
		src: '/ghost-in-a-flower.mp3',
		title: 'Ghost in a Flower',
		credit: 'Elton · my playing',
		cover:
			'https://cdns-images.dzcdn.net/images/cover/d23308fd612026c39ba4ea5f3f99ab83/500x500.jpg'
	},
	'all-of-me': {
		id: 'all-of-me',
		kind: 'audio',
		src: '/all-of-me.mp3',
		title: 'All of Me',
		credit: 'Elton · my playing',
		cover: 'https://m.media-amazon.com/images/I/61b0Mz2-fDL._SY580_.jpg'
	}
};

export const ALBUM_IDS = ['ghost', 'all-of-me'];

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

/** Listen UI modes: 1 shared pill, 2 docked shelf, 3 section mirrors pill */
export const LISTEN_MODES = [
	{ id: 1, label: '1 · pill' },
	{ id: 2, label: '2 · shelf' },
	{ id: 3, label: '3 · section' }
];

function readListenFromLocation() {
	if (typeof window === 'undefined') return 1;
	const n = Number(new URLSearchParams(window.location.search).get('listen'));
	return n === 2 || n === 3 ? n : 1;
}

/** @type {import('svelte/store').Writable<1|2|3>} */
export const listenMode = writable(1);

export function initListenMode() {
	listenMode.set(readListenFromLocation());
}

/** @param {1|2|3} mode */
export function setListenMode(mode) {
	const next = mode === 2 || mode === 3 ? mode : 1;
	listenMode.set(next);
	if (typeof window === 'undefined') return;
	const url = new URL(window.location.href);
	url.searchParams.set('listen', String(next));
	window.history.replaceState({}, '', url);
}
