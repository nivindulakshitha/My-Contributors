let username: string = "";
let repoIds: string[] = [];
let userAvatars: string[] = [];
let repoCount: number = 0;

async function fetchRepos(username_: string) {
	repoIds = [];
	userAvatars = [];
	repoCount = 0;
	username = username_;
	const url = `https://api.github.com/users/${username}/repos`;

	await fetch(url, {
		headers: {
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
		},
	})
		.then(res => res.json())
		.then(data => {
			repoCount = data.length;

			data.forEach((repo: any) => {
				const id = repo.name as string;

				if (!repoIds.includes(id) && repo.name !== username) {
					repoIds.push(id);
				} else {
					console.log("Repo already exists");
					repoCount--;
				}
			});


		})
		.catch(err => console.error(err));
}

async function fetchRepoDetails(repoId: string) {
	const url = `https://api.github.com/repos/${username}/${repoId}/contributors`;

	await fetch(url, {
		headers: {
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
		},
	})
		.then(res => res.json())
		.then(data => {
			if (data.length > 1) {
				data.forEach((contributor: any) => {
					const avatarUrl = contributor.avatar_url;

					if (contributor.login != username && !userAvatars.includes(avatarUrl)) {
						userAvatars.push(avatarUrl);
					}
				});
			}
		})
		.catch(err => console.error(err));
}

function generateSVG(avatars: any[]) {
	const maxAvatars = 10;
	const svgWidth = (64 * Math.min(avatars.length, maxAvatars)) + 10 * (avatars.slice(0, maxAvatars).length - 1);
	const svgHeight = 64;
	const space = 5;

	const defs = avatars
		.slice(0, maxAvatars)
		.map(
			(avatar, index) => `
            <pattern id="fill${index}" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
                <image
                    width="64"
                    height="64"
                    href="${avatar}"
                />
            </pattern>
        `
		)
		.join("\n");

	const circles = avatars
		.slice(0, maxAvatars)
		.map(
			(avatar, index) => `
            <svg x="${(index * 64) + (space * index)}" y="0" width="64" height="64">
                <circle cx="32" cy="32" r="32" stroke="#0d1117" strokeWidth="3" fill="url(#fill${index})" />
            </svg>
        `
		)
		.join("\n");

	return `
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
    <defs>
        ${defs}
    </defs>
    ${circles}
</svg>
    `;
}

export { fetchRepos, fetchRepoDetails, generateSVG, repoIds, userAvatars, repoCount, username };