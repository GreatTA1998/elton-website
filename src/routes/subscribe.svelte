<script>
	import SiteFooter from '$lib/SiteFooter.svelte';
	import SubscribeForm from '$lib/SubscribeForm.svelte';
	import { messages } from '$lib/i18n.js';
</script>

<svelte:head>
	<title>{$messages.subscribeTitle}</title>
</svelte:head>

<div class="page">
	<p class="back"><a href="/">{$messages.backHome}</a></p>

	<h1 class="title">{$messages.subscribeTitle}</h1>
	<p class="sub">
		{$messages.subscribeSub}
	</p>

	<SubscribeForm />
</div>

<SiteFooter />

<style>
	.page {
		width: 100%;
		max-width: 40rem;
		padding: 2.25rem 2rem 4rem;
		box-sizing: border-box;
	}

	.back {
		margin: 0 0 2rem;
		font-size: 0.9rem;
		color: #6a6a6a;
	}

	.back a {
		text-decoration: none;
	}

	.back a:hover {
		text-decoration: underline;
		color: #2c2c2c;
	}

	.title {
		margin: 0 0 0.4em;
		font-size: 1.35rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: #2c2c2c;
		line-height: 1.3;
	}

	.sub {
		margin: 0 0 1.75rem;
		font-size: 0.95rem;
		line-height: 1.55;
		color: #6a6a6a;
		max-width: 28rem;
	}
</style>
