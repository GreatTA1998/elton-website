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
		id: 'overlap',
		key: 'elton-exp-overlap',
		label: 'Enable overlap',
		hint: 'Selected thumb docks into music pill / app card'
	},
	{
		id: 'dockSelected',
		key: 'elton-exp-dock-selected',
		label: 'Extra dock depth',
		hint: 'Adds a little more depth on the selected item'
	}
];

/** Keep old export name for any TEMP grep familiarity */
export const EXPERIMENT_DEFS = FLAG_DEFS;

/** Shared preset family for music + apps */
/** @type {PresetDef[]} */
export const PRESETS = [
	{ id: 'soft', label: 'Soft dock', hint: 'Selected peeks slightly into the parent' },
	{ id: 'deep', label: 'Deep dock', hint: 'Selected nests a bit further' },
	{ id: 'tilt', label: 'Tilted dock', hint: 'Selected docks with a slight tilt' }
];

/** Shared V / H / scale / active-scale (music + apps) */
/** @type {SliderDef[]} */
export const OVERLAP_SLIDERS = [
	{ id: 'overlapV', key: 'elton-exp-v', label: 'Vertical overlap', min: 0, max: 36, step: 1, def: 12 },
	{ id: 'overlapH', key: 'elton-exp-h', label: 'Horizontal nudge', min: 0, max: 36, step: 1, def: 6 },
	{ id: 'baseScale', key: 'elton-exp-scale', label: 'Base scale', min: 85, max: 110, step: 1, def: 100 },
	{ id: 'activeScale', key: 'elton-exp-active', label: 'Active scale', min: 105, max: 135, step: 1, def: 118 }
];

/** @type {SliderDef[]} */
export const DOCK_SLIDERS = [
	{ id: 'dockDepth', key: 'elton-exp-dock-depth', label: 'Extra dock depth', min: 0, max: 36, step: 1, def: 10 }
];

const PRESET_KEY = 'elton-exp-preset';
const PANEL_KEY = 'elton-exp-panel-open';

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

	// Migrate prior dual music/apps overlap toggles → one enable
	if (!state.overlap && typeof localStorage !== 'undefined') {
		try {
			if (
				localStorage.getItem('elton-exp-overlap-music') === '1' ||
				localStorage.getItem('elton-exp-overlap-apps') === '1'
			) {
				state.overlap = true;
			}
		} catch {
			/* ignore */
		}
	}

	state.preset = 'soft';
	if (typeof localStorage !== 'undefined') {
		try {
			const p = localStorage.getItem(PRESET_KEY);
			if (p && PRESETS.some((x) => x.id === p)) state.preset = p;
		} catch {
			/* ignore */
		}
	}

	for (const def of [...OVERLAP_SLIDERS, ...DOCK_SLIDERS]) {
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

/** Floating panel open state (UI only). */
export const panelOpen = writable(true);

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
	if (typeof localStorage !== 'undefined') {
		try {
			const raw = localStorage.getItem(PANEL_KEY);
			if (raw === '0') panelOpen.set(false);
			else if (raw === '1') panelOpen.set(true);
		} catch {
			/* ignore */
		}
	}
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

/** @param {string} presetId */
export function setPreset(presetId) {
	if (!PRESETS.some((p) => p.id === presetId)) return;
	writeStr(PRESET_KEY, presetId);
	experiments.update((prev) => ({ ...prev, preset: presetId }));
}

/** @param {string} id @param {number} value */
export function setSlider(id, value) {
	const def = [...OVERLAP_SLIDERS, ...DOCK_SLIDERS].find((d) => d.id === id);
	if (!def) return;
	const n = Math.min(def.max, Math.max(def.min, Number(value)));
	if (!Number.isFinite(n)) return;
	writeNum(def.key, n);
	experiments.update((prev) => ({ ...prev, [id]: n }));
}

/** @param {boolean} open */
export function setPanelOpen(open) {
	panelOpen.set(!!open);
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(PANEL_KEY, open ? '1' : '0');
	} catch {
		/* ignore */
	}
}

/**
 * CSS custom properties — tiny clamp so even max stays subtle.
 * @param {Record<string, boolean | string | number>} e
 */
export function overlapStyle(e) {
	const v = Number(e.overlapV) || 0;
	const h = Number(e.overlapH) || 0;
	const s = Number(e.baseScale) || 100;
	const a = Number(e.activeScale) || 118;
	const dd = Number(e.dockDepth) || 0;
	return [
		`--exp-v:${(v / 100) * 0.55}rem`,
		`--exp-h:${(h / 100) * 0.35}rem`,
		`--exp-s:${s / 100}`,
		`--exp-a:${a / 100}`,
		`--exp-dock:${(dd / 100) * 0.4}rem`
	].join(';');
}
