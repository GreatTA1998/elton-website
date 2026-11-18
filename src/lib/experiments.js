/**
 * TEMP discoverability A/B scaffold — delete this file, ExperimentsPanel.svelte,
 * expSurfaces.css, and every `// TEMP experiments` hook when the test is done.
 */
import { writable, get } from 'svelte/store';
import { ALBUM_IDS, nowPlaying } from './nowPlaying.js';

/** @typedef {{ id: string, key: string, label: string, hint: string }} FlagDef */
/** @typedef {{ id: string, key: string, label: string, min: number, max: number, step: number, def: number }} SliderDef */

/** Winners default-on. Tilted dock + Title+copy pair. Rev clears stale LS. */
export const DEFAULT_ON = new Set(['defaultSecond', 'overlap', 'essayLayout']);
const WINNERS_REV_KEY = 'elton-exp-winners-rev';
const WINNERS_REV = '3';

/** @type {FlagDef[]} */
export const FLAG_DEFS = [
	{ id: 'defaultSecond', key: 'elton-exp-default-second', label: 'Default select second', hint: 'Winner — 2nd album / app' },
	{ id: 'overlap', key: 'elton-exp-overlap', label: 'Tilted dock', hint: 'Winner — overlap + tilt' },
	{ id: 'essayLayout', key: 'elton-exp-essay-layout', label: 'Essay Title+copy pair', hint: 'Winner — copy under title' }
];

/** Archived — themed card/player bg/border stay off (not winners). */
/** @type {FlagDef[]} */
export const ARCHIVED_FLAG_DEFS = [
	{ id: 'dockSelected', key: 'elton-exp-dock-selected', label: 'Extra dock depth', hint: 'Archived' },
	{ id: 'colorTheme', key: 'elton-exp-color-theme', label: 'Art color theme', hint: 'Archived — card/player bg' },
	{ id: 'textRead', key: 'elton-exp-text-read', label: 'Text readability', hint: 'Archived' },
	{ id: 'paletteBorder', key: 'elton-exp-palette-border', label: 'Palette border', hint: 'Archived — card/player border' }
];

export const ALL_FLAG_DEFS = [...FLAG_DEFS, ...ARCHIVED_FLAG_DEFS];

const COLOR_IDS = ['crop', 'wash', 'gen'];
const READ_IDS = ['ink', 'scrim', 'outline'];

/** @type {SliderDef[]} */
export const OVERLAP_SLIDERS = [
	{ id: 'overlapV', key: 'elton-exp-v', label: 'Vertical overlap', min: 0, max: 25, step: 1, def: 15 },
	{ id: 'overlapH', key: 'elton-exp-h', label: 'Horizontal nudge', min: 0, max: 20, step: 1, def: 4 },
	{ id: 'tiltDeg', key: 'elton-exp-tilt', label: 'Tilt degree', min: 0, max: 12, step: 1, def: 2 },
	{ id: 'baseScale', key: 'elton-exp-scale', label: 'Base scale', min: 85, max: 110, step: 1, def: 100 },
	{ id: 'activeScale', key: 'elton-exp-active', label: 'Active scale', min: 105, max: 120, step: 1, def: 110 },
	{ id: 'inactiveBlur', key: 'elton-exp-blur', label: 'Inactive blur', min: 0, max: 12, step: 1, def: 0 }
];
/** @type {SliderDef[]} */
const EXTRA_SLIDERS = [
	{ id: 'dockDepth', key: 'elton-exp-dock-depth', label: 'Extra dock depth', min: 0, max: 20, step: 1, def: 8 },
	{ id: 'colorStrength', key: 'elton-exp-color-str', label: 'Strength', min: 20, max: 100, step: 5, def: 70 },
	{ id: 'colorZoom', key: 'elton-exp-color-zoom', label: 'Crop zoom', min: 140, max: 360, step: 10, def: 220 },
	{ id: 'colorArtBlur', key: 'elton-exp-color-blur', label: 'Art blur', min: 0, max: 40, step: 2, def: 18 }
];

const ALL_SLIDERS = [...OVERLAP_SLIDERS, ...EXTRA_SLIDERS];
const COLOR_MODE_KEY = 'elton-exp-color-mode';
const READ_MODE_KEY = 'elton-exp-read-mode';
const PANEL_KEY = 'elton-exp-panel-open';
const LEGACY_PRESET_KEY = 'elton-exp-preset';
const LEGACY_ESSAY_MODE_KEY = 'elton-exp-essay-mode';

function migrateWinnersRev() {
	try {
		if (typeof localStorage === 'undefined' || localStorage.getItem(WINNERS_REV_KEY) === WINNERS_REV) return;
		for (const def of ALL_FLAG_DEFS) localStorage.removeItem(def.key);
		localStorage.removeItem(LEGACY_PRESET_KEY);
		localStorage.removeItem(LEGACY_ESSAY_MODE_KEY);
		localStorage.setItem(WINNERS_REV_KEY, WINNERS_REV);
	} catch {
		/* ignore */
	}
}

/** @param {string} key @param {boolean} fallback */
function readFlag(key, fallback) {
	try {
		if (typeof localStorage === 'undefined') return fallback;
		const raw = localStorage.getItem(key);
		if (raw === '1') return true;
		if (raw === '0') return false;
	} catch {
		/* ignore */
	}
	return fallback;
}

/** @param {string} key @param {string[]} allowed @param {string} fallback */
function readMode(key, allowed, fallback) {
	try {
		if (typeof localStorage === 'undefined') return fallback;
		const raw = localStorage.getItem(key);
		if (raw && allowed.includes(raw)) return raw;
	} catch {
		/* ignore */
	}
	return fallback;
}

/** @returns {Record<string, boolean | string | number>} */
function readAll() {
	migrateWinnersRev();
	/** @type {Record<string, boolean | string | number>} */
	const state = {};
	for (const def of ALL_FLAG_DEFS) state[def.id] = readFlag(def.key, DEFAULT_ON.has(def.id));
	state.colorMode = readMode(COLOR_MODE_KEY, COLOR_IDS, 'crop');
	state.readMode = readMode(READ_MODE_KEY, READ_IDS, 'ink');
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

/** @param {string} key @param {boolean} on @param {boolean} [defaultOn] */
function writeFlag(key, on, defaultOn = false) {
	try {
		if (typeof localStorage === 'undefined') return;
		if (on) {
			if (defaultOn) localStorage.removeItem(key);
			else localStorage.setItem(key, '1');
		} else if (defaultOn) localStorage.setItem(key, '0');
		else localStorage.removeItem(key);
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
	const def = ALL_FLAG_DEFS.find((d) => d.id === id);
	if (!def) return;
	writeFlag(def.key, on, DEFAULT_ON.has(id));
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

/** True when any surface experiment needs art URL / overlap CSS vars. */
/** @param {Record<string, boolean | string | number>} e */
export function needsSurfaceStyle(e) {
	return !!(e.overlap || e.dockSelected || e.colorTheme || e.textRead || e.paletteBorder);
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
	let lift = 0;
	let nudge = 0;
	let tilt = 0;
	if (e.overlap) {
		const v = (Number(e.overlapV) || 0) * 1.1;
		const h = Number(e.overlapH) || 0;
		nudge = -Math.max(h, 1);
		tilt = Math.min(12, Math.max(0, Number(e.tiltDeg) || 0));
		lift += v;
	}
	if (e.dockSelected) lift += Number(e.dockDepth) || 0;
	const base = [
		`--exp-lift:${lift / 10}px`,
		`--exp-nudge:${nudge / 10}px`,
		`--exp-tilt:${tilt}deg`,
		`--exp-s:${(Number(e.baseScale) || 100) / 100}`,
		`--exp-a:${(Number(e.activeScale) || 110) / 100}`,
		`--exp-blur:${Number(e.inactiveBlur) || 0}px`
	].join(';');
	return colorCss ? `${base};${colorCss}` : base;
}

/** @typedef {{ colors: string[], mono: boolean, ink: string, mute: string }} ArtPalette */
/** @type {Map<string, Promise<ArtPalette>>} */
const palCache = new Map();
const palFallback = () =>
	/** @type {ArtPalette} */ ({ colors: ['#6a6a6a', '#9a9a9a', '#c4c4c4'], mono: true, ink: '#141414', mute: '#3a3a3a' });
/** @param {number} r @param {number} g @param {number} b */
const toHex = (r, g, b) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;

/** @param {string} url @returns {Promise<ArtPalette>} */
export function sampleArt(url) {
	if (!url || typeof window === 'undefined') return Promise.resolve(palFallback());
	const hit = palCache.get(url);
	if (hit) return hit;
	const p = new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.decoding = 'async';
		img.onload = () => {
			try {
				const s = 24;
				const c = document.createElement('canvas');
				c.width = c.height = s;
				const ctx = c.getContext('2d', { willReadFrequently: true });
				if (!ctx) return resolve(palFallback());
				ctx.drawImage(img, 0, 0, s, s);
				const { data } = ctx.getImageData(0, 0, s, s);
				/** @type {Map<string, { n: number, r: number, g: number, b: number }>} */
				const buckets = new Map();
				let sumL = 0;
				let nL = 0;
				for (let i = 0; i < data.length; i += 4) {
					if (data[i + 3] < 200) continue;
					const r = data[i],
						g = data[i + 1],
						b = data[i + 2];
					const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
					sumL += L;
					nL++;
					if (L < 0.08 || L > 0.92 || Math.max(r, g, b) - Math.min(r, g, b) < 12) continue;
					const key = `${r >> 4},${g >> 4},${b >> 4}`;
					const cur = buckets.get(key);
					if (cur) {
						cur.n++;
						cur.r += r;
						cur.g += g;
						cur.b += b;
					} else buckets.set(key, { n: 1, r, g, b });
				}
				const avgL = nL ? sumL / nL : 0.85;
				const ink = avgL > 0.55 ? '#0e0e0e' : '#f7f4ef';
				const mute = avgL > 0.55 ? '#2e2e2e' : '#d9d3c8';
				const ranked = [...buckets.values()]
					.sort((a, b) => b.n - a.n)
					.slice(0, 5)
					.map((x) => ({ n: x.n, r: Math.round(x.r / x.n), g: Math.round(x.g / x.n), b: Math.round(x.b / x.n) }));
				if (!ranked.length) {
					return resolve({
						colors: avgL > 0.55 ? ['#5a5a5a', '#8a8a8a', '#b0b0b0'] : ['#c8c2b8', '#9a948a', '#6a655c'],
						mono: true,
						ink,
						mute
					});
				}
				const colors = ranked.slice(0, 3).map((x) => toHex(x.r, x.g, x.b));
				while (colors.length < 3) colors.push(colors[colors.length - 1]);
				const top = ranked[0];
				const share = top.n / ranked.reduce((a, x) => a + x.n, 0);
				const dist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
				resolve({
					colors,
					mono: share > 0.62 || ranked.length === 1 || ranked.slice(1).every((x) => dist(top, x) < 90),
					ink,
					mute
				});
			} catch (e) {
				reject(e);
			}
		};
		img.onerror = () => reject(new Error('art'));
		img.src = url;
	}).catch(() => palFallback());
	palCache.set(url, p);
	return p;
}

/** @param {ArtPalette} p */
export function paletteStyle(p) {
	const [c1, c2, c3] = p.colors;
	return `--exp-c1:${c1};--exp-c2:${c2};--exp-c3:${c3};--exp-ink:${p.ink};--exp-mute:${p.mute}`;
}

/** @type {WeakMap<object, number>} */
const palTokens = new WeakMap();
/**
 * @param {object} owner
 * @param {string} url
 * @param {(css: string, kind: 'mono' | 'multi' | null) => void} cb
 */
export function requestPalette(owner, url, cb) {
	const t = (palTokens.get(owner) || 0) + 1;
	palTokens.set(owner, t);
	if (!url) {
		cb('', null);
		return;
	}
	sampleArt(url).then((p) => {
		if (palTokens.get(owner) !== t) return;
		cb(paletteStyle(p), p.mono ? 'mono' : 'multi');
	});
}
