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

async function generateSVG(avatars: string[]): Promise<string> {
	const maxAvatars = 10;
	const circleSize = 64;
	const space = 5;
	const svgWidth = (circleSize * Math.min(avatars.length, maxAvatars)) + space * (Math.min(avatars.length, maxAvatars) - 1);
	const svgHeight = circleSize;


	const base64Avatars = await Promise.all(
		avatars.slice(0, maxAvatars).map(async (avatar) => await imageUrlToBase64(avatar))
	);

	const defs = base64Avatars
		.map(
			(base64, index) => `
            <pattern id="fill${index}" x="0" y="0" width="1" height="1" patternUnits="objectBoundingBox">
                <image
                    width="${circleSize}"
                    height="${circleSize}"
                    href="${base64}"
                />
            </pattern>
        `
		)
		.join("\n");


	const circles = base64Avatars
		.map(
			(_, index) => `
            <circle
                cx="${circleSize / 2 + index * (circleSize + space)}"
                cy="${circleSize / 2}"
                r="${circleSize / 2 - 1}"
                stroke="#0d1117"
                stroke-width="3"
                fill="url(#fill${index})"
            />
        `
		)
		.join("\n");


	return `
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
    <defs>
        ${defs}
    </defs>
    ${circles}
</svg>
    `;
}

import axios from "axios";

async function imageUrlToBase64(url: string): Promise<string> {
	try {
		const response = await axios.get(url, { responseType: "arraybuffer" });
		const base64 = Buffer.from(response.data, "binary").toString("base64");
		const mimeType = response.headers["content-type"];
		return `data:${mimeType};base64,${base64}`;

	} catch (error) {
		console.error("Error converting image to base64:", error);
		throw error;
	}
}


export { fetchRepos, fetchRepoDetails, generateSVG, repoIds, userAvatars, repoCount, username };