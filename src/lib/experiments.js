/**
 * TEMP discoverability A/B scaffold — delete this file, ExperimentsPanel.svelte,
 * artTheme.js, and every `// TEMP experiments` hook when the test is done.
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
	},
	{
		id: 'colorTheme',
		key: 'elton-exp-color-theme',
		label: 'Art color theme',
		hint: 'Restyle music pill / app card from selected art'
	}
];

export const EXPERIMENT_DEFS = FLAG_DEFS;

/** @type {PresetDef[]} */
export const PRESETS = [
	{ id: 'soft', label: 'Soft dock', hint: 'Selected peeks slightly into the parent' },
	{ id: 'deep', label: 'Deep dock', hint: 'Selected nests a bit further' },
	{ id: 'tilt', label: 'Tilted dock', hint: 'Selected docks with a slight tilt' }
];

/** @type {PresetDef[]} */
export const COLOR_MODES = [
	{ id: 'crop', label: 'Art crop bg', hint: 'Enlarged selected art as background' },
	{ id: 'wash', label: 'Palette wash', hint: 'Colors sampled from the art' },
	{ id: 'gen', label: 'Generated art', hint: 'Complementary generated wash from the palette' }
];

/** Shared V / H / scale / active-scale / blur (music + apps). V units ≈ 0.1px. */
/** @type {SliderDef[]} */
export const OVERLAP_SLIDERS = [
	{ id: 'overlapV', key: 'elton-exp-v', label: 'Vertical overlap', min: 0, max: 25, step: 1, def: 15 },
	{ id: 'overlapH', key: 'elton-exp-h', label: 'Horizontal nudge', min: 0, max: 20, step: 1, def: 4 },
	{ id: 'baseScale', key: 'elton-exp-scale', label: 'Base scale', min: 85, max: 110, step: 1, def: 100 },
	{ id: 'activeScale', key: 'elton-exp-active', label: 'Active scale', min: 105, max: 120, step: 1, def: 110 },
	{ id: 'inactiveBlur', key: 'elton-exp-blur', label: 'Inactive blur', min: 0, max: 12, step: 1, def: 0 }
];

/** @type {SliderDef[]} */
export const DOCK_SLIDERS = [
	{ id: 'dockDepth', key: 'elton-exp-dock-depth', label: 'Extra dock depth', min: 0, max: 20, step: 1, def: 8 }
];

/** @type {SliderDef[]} */
export const COLOR_SLIDERS = [
	{ id: 'colorStrength', key: 'elton-exp-color-str', label: 'Strength', min: 20, max: 100, step: 5, def: 70 },
	{ id: 'colorZoom', key: 'elton-exp-color-zoom', label: 'Crop zoom', min: 140, max: 360, step: 10, def: 220 },
	{ id: 'colorArtBlur', key: 'elton-exp-color-blur', label: 'Art blur', min: 0, max: 40, step: 2, def: 18 }
];

const ALL_SLIDERS = [...OVERLAP_SLIDERS, ...DOCK_SLIDERS, ...COLOR_SLIDERS];
const PRESET_KEY = 'elton-exp-preset';
const COLOR_MODE_KEY = 'elton-exp-color-mode';
const PANEL_KEY = 'elton-exp-panel-open';

/** @returns {Record<string, boolean | string | number>} */
function readAll() {
	/** @type {Record<string, boolean | string | number>} */
	const state = {};
	for (const def of FLAG_DEFS) {
		state[def.id] = false;
		try {
			if (typeof localStorage !== 'undefined') state[def.id] = localStorage.getItem(def.key) === '1';
		} catch {
			/* ignore */
		}
	}
	state.preset = 'soft';
	state.colorMode = 'crop';
	try {
		if (typeof localStorage !== 'undefined') {
			const p = localStorage.getItem(PRESET_KEY);
			if (p && PRESETS.some((x) => x.id === p)) state.preset = p;
			const m = localStorage.getItem(COLOR_MODE_KEY);
			if (m && COLOR_MODES.some((x) => x.id === m)) state.colorMode = m;
		}
	} catch {
		/* ignore */
	}
	for (const def of ALL_SLIDERS) {
		state[def.id] = def.def;
		try {
			if (typeof localStorage === 'undefined') continue;
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
	try {
		if (typeof localStorage === 'undefined') return;
		if (on) localStorage.setItem(key, '1');
		else localStorage.removeItem(key);
	} catch {
		/* ignore */
	}
}

/** @param {string} key @param {string} value */
function writeStr(key, value) {
	try {
		if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
	} catch {
		/* ignore */
	}
}

/** @type {Map<string, number>} */
const pendingNums = new Map();
let writeNumRaf = 0;

function flushNums() {
	writeNumRaf = 0;
	if (typeof localStorage === 'undefined') return pendingNums.clear();
	for (const [k, v] of pendingNums) {
		try {
			localStorage.setItem(k, String(v));
		} catch {
			/* ignore */
		}
	}
	pendingNums.clear();
}

/** @param {string} key @param {number} value */
function writeNum(key, value) {
	pendingNums.set(key, value);
	if (typeof requestAnimationFrame === 'undefined') return flushNums();
	if (!writeNumRaf) writeNumRaf = requestAnimationFrame(flushNums);
}

const initial = readAll();
export const experiments = writable(initial);
export const panelOpen = writable(true);
export const defaultSecondApply = writable(!!initial.defaultSecond);

/** @param {boolean} on */
function syncAlbum(on) {
	const id = on ? ALBUM_IDS[1] : ALBUM_IDS[0];
	nowPlaying.update((prev) => {
		if (!prev || prev.id === id) return prev;
		return { id, autoplay: false, nonce: (prev.nonce || 0) + 1 };
	});
}

if (typeof window !== 'undefined' && initial.defaultSecond) {
	nowPlaying.set({ id: ALBUM_IDS[1], autoplay: false, nonce: 0 });
}

export function hydrateExperiments() {
	const flags = readAll();
	experiments.set(flags);
	syncAlbum(!!flags.defaultSecond);
	defaultSecondApply.set(!!flags.defaultSecond);
	try {
		if (typeof localStorage === 'undefined') return;
		const raw = localStorage.getItem(PANEL_KEY);
		if (raw === '0') panelOpen.set(false);
		else if (raw === '1') panelOpen.set(true);
	} catch {
		/* ignore */
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

/** @param {string} modeId */
export function setColorMode(modeId) {
	if (!COLOR_MODES.some((p) => p.id === modeId)) return;
	writeStr(COLOR_MODE_KEY, modeId);
	experiments.update((prev) => ({ ...prev, colorMode: modeId }));
}

/** @param {string} id @param {number} value */
export function setSlider(id, value) {
	const def = ALL_SLIDERS.find((d) => d.id === id);
	if (!def) return;
	const n = Math.min(def.max, Math.max(def.min, Number(value)));
	if (!Number.isFinite(n)) return;
	writeNum(def.key, n);
	experiments.update((prev) => ({ ...prev, [id]: n }));
}

/** @param {boolean} open */
export function setPanelOpen(open) {
	panelOpen.set(!!open);
	try {
		if (typeof localStorage !== 'undefined') localStorage.setItem(PANEL_KEY, open ? '1' : '0');
	} catch {
		/* ignore */
	}
}

/**
 * @param {Record<string, boolean | string | number>} e
 * @param {string} artUrl
 */
export function colorThemeStyle(e, artUrl) {
	if (!e.colorTheme || !artUrl) return '';
	const str = Math.min(1, Math.max(0.15, (Number(e.colorStrength) || 70) / 100));
	const zoom = Math.min(4, Math.max(1.2, (Number(e.colorZoom) || 220) / 100));
	const blur = Math.min(48, Math.max(0, Number(e.colorArtBlur) || 18));
	const safe = String(artUrl).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	return `--art-url:url("${safe}");--exp-str:${str};--exp-zoom:${zoom};--exp-art-blur:${blur}px`;
}

/**
 * @param {Record<string, boolean | string | number>} e
 * @param {string} [colorCss]
 */
export function overlapStyle(e, colorCss = '') {
	const v = Number(e.overlapV) || 0;
	const h = Number(e.overlapH) || 0;
	const s = Number(e.baseScale) || 100;
	const a = Number(e.activeScale) || 110;
	const dd = Number(e.dockDepth) || 0;
	const blur = Number(e.inactiveBlur) || 0;
	const base = [
		`--exp-v:${v / 10}px`,
		`--exp-h:${h / 10}px`,
		`--exp-s:${s / 100}`,
		`--exp-a:${a / 100}`,
		`--exp-dock:${dd / 10}px`,
		`--exp-blur:${blur}px`
	].join(';');
	return colorCss ? `${base};${colorCss}` : base;
}
