/** @type {import('./types').Essay} */
const essay = {
	slug: 'courage-to-be-blasphemous',
	title: 'The courage to be blasphemous',
	summary: '',
	lede:
		'It’s easy to have contrarian opinions when we don’t think much of others. The blindspot emerges when we have people we admire, whose words we accept as gospel. Or when we have total deference to beautiful ideas.',
	layout: 'continuous',
	heroImage: {
		src: '/courage-blasphemous-chart.png',
		alt: 'Government debt / savings chart'
	},
	sections: [
		{
			id: 'dangerous-freedom',
			title: 'Dangerous freedom',
			blocks: [
				{
					type: 'p',
					text: 'Theoretically, competitive elections lead to proper representation among voices, and a free press protects the public from propaganda.'
				},
				{
					type: 'p',
					text: 'Sri Lanka was a country Singapore looked up to - also small, multi-ethnic, and meticulously prepared by the British to be democratic. But it descended into a 26-year civil war that killed over 100,000 people, as policies overwhelmingly favored the majority Sinhalese population over the minority Tamil. It turns out it’s hard to win over voters explaining nuanced policies. Instead, appeals to race and religion become the winning strategy, and the press become weaponized by different political groups to incite fear, hatred and primal emotions.'
				},
				{
					type: 'p',
					text: 'On the other hand, Singapore was under dominant one-party rule since its founding, with limited freedoms on press. What were the advantages? They could execute multi-decade policies that required an extraordinary amount of public trust, such as mandatory savings (up to 40% at one point). The press is collaborative, and helps build trust between people and government, and prevent misunderstandings of tyranny.'
				},
				{
					type: 'quote',
					paragraphs: [
						'Democracy has preconditions - economic development, literacy, a growing middle class, trust for institutions, and a civic culture where people of conflicting views are willing to cooperate.'
					]
				}
			]
		},
		{
			id: 'uncompetitive-elections',
			title: 'Uncompetitive elections',
			blocks: [
				{
					type: 'quote',
					paragraphs: [
						'A precondition for an honest government is that candidates must not need large sums of money to get elected, or it must trigger off the cycle of corruption. The bane of most countries in Asia…',
						'To be elected to Taiwan’s legislative yuan in the 1990s, some KMT candidates spent as much as US$10-20 million. Once elected, they had to recoup and prepare for the next round by using their influence with government ministers and officials to get contracts awarded…',
						'The most expensive of all election systems is Japan’s. Japanese ministers and Diet members (MPs) are paid modest salaries and allowances. A Japanese MP requires over US$1 million a year to maintain his support staff both in Tokyo and in his constituency as well as to provide gifts to voters for birthdays, births, marriages and funerals.'
					],
					attribution: 'Lee Kuan Yew, From Third World to First, Keeping the Government Clean'
				},
				{
					type: 'p',
					text: 'Is he right? It seems so. Looking at the latest data for 2026 with government debts, a key indicator of honesty. Its savings is so high, one would mistakenly think the country has oil.'
				},
				{
					type: 'p',
					text: 'The lesson isn’t for more countries to be authoritarian, but to recognize that coming up with the best solutions requires a deep understanding of the constraints, a creative development of ideas, and a careful reasoning of trade-offs. Ideology induces the pride and laziness to ignore everything else and not have to debug reality.'
				}
			]
		},
		{
			id: 'conclusion',
			title: 'Conclusion',
			blocks: [
				{
					type: 'p',
					text: 'If it’s inevitable that sometimes we take others’ words as gospel, then equally, we must have the courage to be blasphemous.'
				},
				{
					type: 'p',
					text: 'When reality disagrees with our most admired beliefs, we should re-adjust decisively, and think with accuracy, nuance, and first principles, with reality as the guiding star.'
				}
			]
		}
	]
};

export default essay;
