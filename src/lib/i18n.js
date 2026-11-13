import { writable, derived, get } from 'svelte/store';

/** @typedef {'en' | 'zh' | 'ja'} Locale */

export const LOCALE_LABELS = {
	en: 'EN',
	zh: '中',
	ja: '日'
};

const STORAGE_KEY = 'elton-site-lang';

/** @type {Record<Locale, Record<string, string>>} */
const DICT = {
	en: {
		welcome: "Welcome to my absolutely EPIC website, it's INSANE:",
		softwareApps: 'apps',
		videoEssays: 'essays',
		emailUpdates: 'email updates',
		actionsDesc: 'Put to-do lists on the calendar. Fully using since 2024.',
		actionsStatus: '2022 – current',
		visit: 'Visit',
		ready: 'Ready',
		blackboardsDesc:
			'Previously explain.mit.edu — ~800 students/teachers across ~10 MIT classes during COVID-19.',
		blackboardsStatus: '2018 (under rework) – current',
		zetteldrawDesc: 'notebook for jotting down ideas first, and worrying about organization later',
		zetteldrawStatus: '2026 (in private testing) – current',
		zenDesc: 'A calmer, less interruptive messaging system.',
		zenStatus: '2024 (in development)',
		comingSoon: 'coming soon',
		placesLived: 'Places lived',
		musicPlayer: 'Music player',
		play: 'Play',
		pause: 'Pause',
		recordings: 'Recordings',
		myPlaying: 'my playing',
		bachComingSoon: 'Coming soon',
		bachComingSoonTitle: 'Bach — coming soon',
		interests: 'Interests',
		subscribePreference: 'Email preference',
		essays: 'Essays',
		music: 'Music',
		modeDigest: 'Summary every 3 months',
		modeUpdates: 'Get emailed on updates for:',
		email: 'Email',
		subscribe: 'Subscribe',
		sending: 'Sending…',
		subscribed: 'Subscribed',
		onTheList: 'You’re on the list.',
		invalidEmail: 'That email doesn’t look right.',
		pickInterest: 'Pick at least one interest.',
		somethingWrong: 'Something went wrong. Try again in a bit.',
		couldntReach: 'Couldn’t reach the server. Check your connection and try again.',
		notConfigured:
			'Email isn’t configured yet. Set RESEND_API_KEY and SUBSCRIBE_NOTIFY_TO on the host.',
		backHome: '← Home',
		subscribeTitle: 'Email updates',
		subscribeSub:
			'Default is a summary every 3 months. Or get emailed on updates for apps and/or essays. Change your mind later by writing me.',
		contactSocial: 'Contact and social links',
		language: 'Language'
	},
	zh: {
		welcome: '欢迎来到我超赞的网站，真的很离谱：',
		softwareApps: '应用',
		videoEssays: '随笔',
		emailUpdates: '邮件更新',
		actionsDesc: '把待办放进日历。2024 年起一直在用。',
		actionsStatus: '2022 – 至今',
		visit: '访问',
		ready: '可用',
		blackboardsDesc:
			'前身 explain.mit.edu — COVID-19 期间约 800 名学生/教师、约 10 门 MIT 课程使用。',
		blackboardsStatus: '2018（重制中）– 至今',
		zetteldrawDesc: '先随手记下想法，组织以后再说的笔记本',
		zetteldrawStatus: '2026（私下测试中）– 至今',
		zenDesc: '更安静、少打断的消息系统。',
		zenStatus: '2024（开发中）',
		comingSoon: '即将推出',
		placesLived: '曾住过的地方',
		musicPlayer: '音乐播放器',
		play: '播放',
		pause: '暂停',
		recordings: '录音',
		myPlaying: '我的演奏',
		bachComingSoon: '即将推出',
		bachComingSoonTitle: '巴赫 — 即将推出',
		interests: '兴趣',
		subscribePreference: '邮件偏好',
		essays: '随笔',
		music: '音乐',
		modeDigest: '每三个月一份摘要',
		modeUpdates: '有更新时发邮件：',
		email: '邮箱',
		subscribe: '订阅',
		sending: '发送中…',
		subscribed: '已订阅',
		onTheList: '已加入列表。',
		invalidEmail: '这个邮箱看起来不对。',
		pickInterest: '请至少选一个兴趣。',
		somethingWrong: '出了点问题，稍后再试。',
		couldntReach: '连不上服务器，请检查网络后再试。',
		notConfigured: '邮件尚未配置。请在主机上设置 RESEND_API_KEY 和 SUBSCRIBE_NOTIFY_TO。',
		backHome: '← 首页',
		subscribeTitle: '邮件更新',
		subscribeSub:
			'默认每三个月一份摘要。也可以按应用和/或随笔有更新时发邮件。以后想改，写信给我就行。',
		contactSocial: '联系与社交链接',
		language: '语言'
	},
	ja: {
		welcome: 'ようこそ。ここはマジでヤバいサイトです：',
		softwareApps: 'アプリ',
		videoEssays: 'エッセイ',
		emailUpdates: 'メール更新',
		actionsDesc: 'ToDoをカレンダーに。2024年からずっと使っています。',
		actionsStatus: '2022 – 現在',
		visit: '開く',
		ready: '利用可',
		blackboardsDesc:
			'旧 explain.mit.edu — COVID-19期に約800人の学生/教師、約10のMIT授業で利用。',
		blackboardsStatus: '2018（再構築中）– 現在',
		zetteldrawDesc: 'まず考えを書き、整理は後回しにするためのノート',
		zetteldrawStatus: '2026（非公開テスト中）– 現在',
		zenDesc: 'より静かで、割り込みの少ないメッセージシステム。',
		zenStatus: '2024（開発中）',
		comingSoon: '近日公開',
		placesLived: '住んだ場所',
		musicPlayer: 'ミュージックプレーヤー',
		play: '再生',
		pause: '一時停止',
		recordings: '録音',
		myPlaying: '自分の演奏',
		bachComingSoon: '近日公開',
		bachComingSoonTitle: 'バッハ — 近日公開',
		interests: '興味',
		subscribePreference: 'メールの設定',
		essays: 'エッセイ',
		music: '音楽',
		modeDigest: '3か月ごとのまとめ',
		modeUpdates: '更新があったらメールで：',
		email: 'メール',
		subscribe: '登録',
		sending: '送信中…',
		subscribed: '登録済み',
		onTheList: 'リストに追加しました。',
		invalidEmail: 'メールアドレスが正しくないようです。',
		pickInterest: '興味を1つ以上選んでください。',
		somethingWrong: '問題が発生しました。しばらくしてから再度お試しください。',
		couldntReach: 'サーバーに接続できません。接続を確認してもう一度お試しください。',
		notConfigured:
			'メールは未設定です。ホストで RESEND_API_KEY と SUBSCRIBE_NOTIFY_TO を設定してください。',
		backHome: '← ホーム',
		subscribeTitle: 'メール更新',
		subscribeSub:
			'初期設定は3か月ごとのまとめです。アプリと／またはエッセイの更新メールも選べます。あとから変更したくなったら、メールください。',
		contactSocial: '連絡先とソーシャル',
		language: '言語'
	}
};

/** @type {import('svelte/store').Writable<Locale>} */
export const locale = writable('en');

/** @type {import('svelte/store').Writable<Locale[]>} */
export const offeredLocales = writable(/** @type {Locale[]} */ (['en']));

export const messages = derived(locale, ($locale) => DICT[$locale] || DICT.en);

/** @returns {Locale | null} */
export function detectSecondaryLocale() {
	if (typeof navigator === 'undefined') return null;
	const primary = (navigator.languages && navigator.languages[0]) || navigator.language || '';
	const tag = String(primary).toLowerCase();
	if (tag.startsWith('zh')) return 'zh';
	if (tag.startsWith('ja')) return 'ja';
	return null;
}

/** Call once in the browser (e.g. LanguageToggle onMount). */
export function initLocale() {
	if (typeof window === 'undefined') return;

	const secondary = detectSecondaryLocale();
	/** @type {Locale[]} */
	const offered = secondary ? ['en', secondary] : ['en'];
	offeredLocales.set(offered);

	let saved = null;
	try {
		saved = localStorage.getItem(STORAGE_KEY);
	} catch (e) {
		/* ignore */
	}

	if (saved && offered.includes(/** @type {Locale} */ (saved))) {
		locale.set(/** @type {Locale} */ (saved));
	} else {
		locale.set('en');
	}
}

/** @param {Locale} next */
export function setLocale(next) {
	const offered = get(offeredLocales);
	if (!offered.includes(next)) return;
	locale.set(next);
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch (e) {
		/* ignore */
	}
}
