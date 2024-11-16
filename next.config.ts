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
				],
			},
		];
	},

	images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: 'avatars.githubusercontent.com',
		}],
	}
};
