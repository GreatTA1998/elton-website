/**
 * TEMP discoverability A/B scaffold — delete this file, ExperimentsPanel.svelte,
 * and every `// TEMP experiments` hook when the test is done.
 */
import { writable, get } from 'svelte/store';
import { ALBUM_IDS, nowPlaying } from './nowPlaying.js';

/** @typedef {{ id: string, key: string, label: string, hint: string }} ExperimentDef */

/** @type {ExperimentDef[]} */
export const EXPERIMENT_DEFS = [
	{
		id: 'defaultSecond',
		key: 'elton-exp-default-second',
		label: 'Default select second',
		hint: 'Start on 2nd album / app'
	},
	{
		id: 'grayscaleUnselected',
		key: 'elton-exp-grayscale-unselected',
		label: 'Grayscale unselected',
		hint: 'Unselected art/logos go B&W'
	}
];

/** @returns {Record<string, boolean>} */
function readAll() {
	/** @type {Record<string, boolean>} */
	const flags = {};
	for (const def of EXPERIMENT_DEFS) {
		flags[def.id] = false;
		if (typeof localStorage === 'undefined') continue;
		try {
			flags[def.id] = localStorage.getItem(def.key) === '1';
		} catch {
			/* ignore */
		}
	}
	return flags;
}

/** @param {string} key @param {boolean} on */
function writeFlag(key, on) {
	if (typeof localStorage === 'undefined') return;
	try {
		if (on) localStorage.setItem(key, '1');
		else localStorage.removeItem(key);
	} catch {
		/* ignore */
	}
}

const initial = readAll();

export const experiments = writable(initial);

/** Emits when defaultSecond should (re)apply — homepage apps subscribe. */
export const defaultSecondApply = writable(!!initial.defaultSecond);

/** Sync album default without fighting an in-progress autoplay nonce unnecessarily. */
function syncAlbum(on) {
	const id = on ? ALBUM_IDS[1] : ALBUM_IDS[0];
	nowPlaying.update((prev) => {
		if (!prev || prev.id === id) return prev;
		return { id, autoplay: false, nonce: (prev.nonce || 0) + 1 };
	});
}

// Client module load: apply before first paint when flag already persisted.
if (typeof window !== 'undefined' && initial.defaultSecond) {
	nowPlaying.set({ id: ALBUM_IDS[1], autoplay: false, nonce: 0 });
}

/** Call once in the browser (layout onMount). */
export function hydrateExperiments() {
	const flags = readAll();
	experiments.set(flags);
	syncAlbum(!!flags.defaultSecond);
	defaultSecondApply.set(!!flags.defaultSecond);
}

/** @param {string} id @param {boolean} on */
export function setExperiment(id, on) {
	const def = EXPERIMENT_DEFS.find((d) => d.id === id);
	if (!def) return;
	writeFlag(def.key, on);
	experiments.update((prev) => ({ ...prev, [id]: on }));
	if (id === 'defaultSecond') {
		syncAlbum(on);
		defaultSecondApply.set(on);
	}
}

/** @param {string} id */
export function toggleExperiment(id) {
	setExperiment(id, !get(experiments)[id]);
}
