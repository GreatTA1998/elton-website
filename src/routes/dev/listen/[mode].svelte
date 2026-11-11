<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export function load({ params }) {
		const n = Number(params.mode);
		const mode = n === 2 || n === 3 ? n : 1;
		return {
			status: 302,
			redirect: `/?listen=${mode}`
		};
	}
</script>
