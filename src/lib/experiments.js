/**
 * TEMP discoverability A/B scaffold — delete this file, ExperimentsPanel.svelte,
 * expSurfaces.css, and every `// TEMP experiments` hook when the test is done.
 */
import { writable, get } from 'svelte/store';
import { ALBUM_IDS, nowPlaying } from './nowPlaying.js';

/** @typedef {{ id: string, key: string, label: string, hint: string }} FlagDef */
/** @typedef {{ id: string, label: string, hint: string }} PresetDef */
/** @typedef {{ id: string, key: string, label: string, min: number, max: number, step: number, def: number }} SliderDef */

/** @type {FlagDef[]} */
export const FLAG_DEFS = [
	{ id: 'defaultSecond', key: 'elton-exp-default-second', label: 'Default select second', hint: 'Start on 2nd album / app' },
	{ id: 'overlap', key: 'elton-exp-overlap', label: 'Enable overlap', hint: 'Selected thumb docks into music pill / app card' },
	{ id: 'dockSelected', key: 'elton-exp-dock-selected', label: 'Extra dock depth', hint: 'Adds a little more depth on the selected item' },
	{ id: 'colorTheme', key: 'elton-exp-color-theme', label: 'Art color theme', hint: 'Restyle music pill / app card from selected art' },
	{ id: 'essayLayout', key: 'elton-exp-essay-layout', label: 'Essay layout modes', hint: 'Consolidate title / media / copy so reading is not split across columns' },
	{ id: 'textRead', key: 'elton-exp-text-read', label: 'Text readability', hint: 'Stronger type contrast on music pill / app card' },
	{ id: 'paletteBorder', key: 'elton-exp-palette-border', label: 'Palette border', hint: 'Outline from art colors (mono or multi gradient)' }
];

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
/** @type {PresetDef[]} */
export const READ_MODES = [
	{ id: 'ink', label: 'Adaptive ink', hint: 'Dark/light type from art luminance' },
	{ id: 'scrim', label: 'Soft scrim', hint: 'Light veil under the text block' },
	{ id: 'outline', label: 'Outlined type', hint: 'Halo / shadow so type clears the art' }
];

/** @type {PresetDef[]} */
export const ESSAY_MODES = [
	{ id: 'caption', label: 'Caption stack', hint: 'Titles left; media with copy stacked under it' },
	{ id: 'sheet', label: 'Feature sheet', hint: 'Titles above; media + copy as one sheet below' },
	{ id: 'pair', label: 'Title+copy pair', hint: 'Selected title keeps copy beside it; media alone' }
];

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
const ESSAY_MODE_KEY = 'elton-exp-essay-mode';
const READ_MODE_KEY = 'elton-exp-read-mode';
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
	state.essayMode = 'caption';
	state.readMode = 'ink';
	try {
		if (typeof localStorage !== 'undefined') {
			const p = localStorage.getItem(PRESET_KEY);
			if (p && PRESETS.some((x) => x.id === p)) state.preset = p;
			const m = localStorage.getItem(COLOR_MODE_KEY);
			if (m && COLOR_MODES.some((x) => x.id === m)) state.colorMode = m;
			const em = localStorage.getItem(ESSAY_MODE_KEY);
			if (em && ESSAY_MODES.some((x) => x.id === em)) state.essayMode = em;
			const r = localStorage.getItem(READ_MODE_KEY);
			if (r && READ_MODES.some((x) => x.id === r)) state.readMode = r;
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

/** @param {string} modeId */
export function setEssayMode(modeId) {
	if (!ESSAY_MODES.some((p) => p.id === modeId)) return;
	writeStr(ESSAY_MODE_KEY, modeId);
	experiments.update((prev) => ({ ...prev, essayMode: modeId }));
}

/** @param {string} modeId */
export function setReadMode(modeId) {
	if (!READ_MODES.some((p) => p.id === modeId)) return;
	writeStr(READ_MODE_KEY, modeId);
	experiments.update((prev) => ({ ...prev, readMode: modeId }));
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
		let v = Number(e.overlapV) || 0;
		const h = Number(e.overlapH) || 0;
		if (e.preset === 'deep') v *= 1.25;
		else if (e.preset === 'tilt') {
			v *= 1.1;
			nudge = -Math.max(h, 1);
			tilt = 2;
		}
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
