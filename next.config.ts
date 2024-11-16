module.exports = {
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: "img-src 'self' https://avatars.githubusercontent.com data:;",
					},

					{
						key: "Content-Security-Policy",
						value: "img-src 'self' https://github.githubassets.com data:;",
					},
					{
						key: "Content-Security-Policy",
						value: "img-src 'self' https://github.com data:;",
					},
				],
			},
		];
	},

	images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: 'avatars.githubusercontent.com',
		},
		{
			protocol: 'https',
			hostname: 'github.githubassets.com',
		}

		],
	}
};
