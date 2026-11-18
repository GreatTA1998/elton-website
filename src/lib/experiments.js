/**
 * TEMP discoverability A/B scaffold — delete this file, ExperimentsPanel.svelte,
 * and every `// TEMP experiments` hook when the test is done.
 */
import { writable, get } from 'svelte/store';
import { ALBUM_IDS, nowPlaying } from './nowPlaying.js';

/** @typedef {{ id: string, key: string, label: string, hint: string }} FlagDef */
/** @typedef {{ id: string, label: string, hint: string }} PresetDef */
/** @typedef {{ id: string, key: string, label: string, min: number, max: number, step: number, def: number }} SliderDef */

/** @type {FlagDef[]} */
export const FLAG_DEFS = [
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
		hint: 'Optional B&W — selection should read via size + dock'
	},
	{
		id: 'overlapMusic',
		key: 'elton-exp-overlap-music',
		label: 'Enable overlap (music)',
		hint: 'Selected album art docks onto the player (inactive stay clear)'
	},
	{
		id: 'overlapApps',
		key: 'elton-exp-overlap-apps',
		label: 'Enable overlap (apps)',
		hint: 'Selected logo docks into the card (inactive stay clear)'
	},
	{
		id: 'dockSelected',
		key: 'elton-exp-dock-selected',
		label: 'Extra dock depth',
		hint: 'Adds depth on top of overlap (selected only)'
	}
];

/** Keep old export name for any TEMP grep familiarity */
export const EXPERIMENT_DEFS = FLAG_DEFS;

/** @type {PresetDef[]} */
export const MUSIC_PRESETS = [
	{ id: 'tuck', label: 'Soft dock', hint: 'Selected art peeks onto the pill (above)' },
	{ id: 'straddle', label: 'Deep dock', hint: 'Selected art nests further into the pill' },
	{ id: 'fan', label: 'Tilted dock', hint: 'Selected art docks with a slight tilt' }
];

/** @type {PresetDef[]} */
export const APPS_PRESETS = [
	{ id: 'hang', label: 'Hang into card', hint: 'Selected logo drops into the card top' },
	{ id: 'sit', label: 'Sit on edge', hint: 'Selected logo rests on the card rim' },
	{ id: 'fan', label: 'Tilted dock', hint: 'Selected logo docks with a slight tilt' }
];

/** @type {SliderDef[]} */
export const MUSIC_SLIDERS = [
	{ id: 'musicV', key: 'elton-exp-music-v', label: 'Selected overlap', min: 0, max: 100, step: 1, def: 18 },
	{ id: 'musicH', key: 'elton-exp-music-h', label: 'Selected nudge', min: 0, max: 100, step: 1, def: 10 },
	{ id: 'musicScale', key: 'elton-exp-music-scale', label: 'Base thumb scale', min: 70, max: 130, step: 1, def: 100 },
	{ id: 'musicActive', key: 'elton-exp-music-active', label: 'Active scale ratio', min: 110, max: 170, step: 1, def: 128 }
];

/** @type {SliderDef[]} */
export const APPS_SLIDERS = [
	{ id: 'appsV', key: 'elton-exp-apps-v', label: 'Selected overlap', min: 0, max: 100, step: 1, def: 28 },
	{ id: 'appsH', key: 'elton-exp-apps-h', label: 'Selected nudge', min: 0, max: 100, step: 1, def: 10 },
	{ id: 'appsScale', key: 'elton-exp-apps-scale', label: 'Base logo scale', min: 70, max: 130, step: 1, def: 100 },
	{ id: 'appsActive', key: 'elton-exp-apps-active', label: 'Active scale ratio', min: 110, max: 170, step: 1, def: 128 }
];

/** @type {SliderDef[]} */
export const DOCK_SLIDERS = [
	{ id: 'dockDepth', key: 'elton-exp-dock-depth', label: 'Extra dock depth', min: 0, max: 100, step: 1, def: 24 }
];

const MUSIC_PRESET_KEY = 'elton-exp-music-preset';
const APPS_PRESET_KEY = 'elton-exp-apps-preset';

/** @returns {Record<string, boolean | string | number>} */
function readAll() {
	/** @type {Record<string, boolean | string | number>} */
	const state = {};

	for (const def of FLAG_DEFS) {
		state[def.id] = false;
		if (typeof localStorage !== 'undefined') {
			try {
				state[def.id] = localStorage.getItem(def.key) === '1';
			} catch {
				/* ignore */
			}
		}
	}

	state.musicPreset = 'tuck';
	state.appsPreset = 'hang';
	if (typeof localStorage !== 'undefined') {
		try {
			const mp = localStorage.getItem(MUSIC_PRESET_KEY);
			const ap = localStorage.getItem(APPS_PRESET_KEY);
			if (mp && MUSIC_PRESETS.some((p) => p.id === mp)) state.musicPreset = mp;
			if (ap && APPS_PRESETS.some((p) => p.id === ap)) state.appsPreset = ap;
		} catch {
			/* ignore */
		}
	}

	for (const def of [...MUSIC_SLIDERS, ...APPS_SLIDERS, ...DOCK_SLIDERS]) {
		state[def.id] = def.def;
		if (typeof localStorage === 'undefined') continue;
		try {
			const raw = localStorage.getItem(def.key);
			if (raw == null) continue;
			const n = Number(raw);
			if (Number.isFinite(n)) state[def.id] = Math.min(def.max, Math.max(def.min, n));
		} catch {
			/* ignore */
		}
	}

	return state;
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

/** @param {string} key @param {string} value */
function writeStr(key, value) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(key, value);
	} catch {
		/* ignore */
	}
}

/** @param {string} key @param {number} value */
function writeNum(key, value) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(key, String(value));
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
	const def = FLAG_DEFS.find((d) => d.id === id);
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

/** @param {'music' | 'apps'} area @param {string} presetId */
export function setPreset(area, presetId) {
	const list = area === 'music' ? MUSIC_PRESETS : APPS_PRESETS;
	if (!list.some((p) => p.id === presetId)) return;
	const key = area === 'music' ? MUSIC_PRESET_KEY : APPS_PRESET_KEY;
	const field = area === 'music' ? 'musicPreset' : 'appsPreset';
	writeStr(key, presetId);
	experiments.update((prev) => ({ ...prev, [field]: presetId }));
}

/** @param {string} id @param {number} value */
export function setSlider(id, value) {
	const def = [...MUSIC_SLIDERS, ...APPS_SLIDERS, ...DOCK_SLIDERS].find((d) => d.id === id);
	if (!def) return;
	const n = Math.min(def.max, Math.max(def.min, Number(value)));
	if (!Number.isFinite(n)) return;
	writeNum(def.key, n);
	experiments.update((prev) => ({ ...prev, [id]: n }));
}

/**
 * CSS custom properties for TEMP overlap / dock consumers.
 * @param {Record<string, boolean | string | number>} e
 */
export function overlapStyle(e) {
	const mv = Number(e.musicV) || 0;
	const mh = Number(e.musicH) || 0;
	const ms = Number(e.musicScale) || 100;
	const ma = Number(e.musicActive) || 128;
	const av = Number(e.appsV) || 0;
	const ah = Number(e.appsH) || 0;
	const as_ = Number(e.appsScale) || 100;
	const aa = Number(e.appsActive) || 128;
	const dd = Number(e.dockDepth) || 0;
	return [
		`--exp-mv:${(mv / 100) * 0.95}rem`,
		`--exp-mh:${(mh / 100) * 0.55}rem`,
		`--exp-ms:${ms / 100}`,
		`--exp-ma:${ma / 100}`,
		`--exp-av:${(av / 100) * 0.85}rem`,
		`--exp-ah:${(ah / 100) * 0.5}rem`,
		`--exp-as:${as_ / 100}`,
		`--exp-aa:${aa / 100}`,
		`--exp-dock:${(dd / 100) * 0.7}rem`
	].join(';');
}
