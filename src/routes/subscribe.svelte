<script>
	import SubscribeForm from '$lib/SubscribeForm.svelte';
</script>

<svelte:head>
	<title>Email updates</title>
</svelte:head>

<div class="page">
	<p class="back"><a href="/">← Home</a></p>

	<h1 class="title">Email updates</h1>
	<p class="sub">
		Two quiet options. Pick what fits — you can change your mind later by writing me.
	</p>

	<SubscribeForm />
</div>

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
