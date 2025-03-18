let username: string = "";
let repoIds: string[] = [];
let userAvatars: { [key: string]: string } = {};
let repoCount: number = 0;

interface Contributor {
	login: string;
	avatar_url: string;
	url: string;
	[type: string]: any;
}

let contributors: { [key: string]: Contributor } = {};
let excepts: string[] = [];

function setExcepts(excepts_: string[]) {
	excepts = excepts_;
}

async function fetchRepos(username_: string) {
	repoIds = [];
	userAvatars = {};
	repoCount = 0;
	contributors = {};

	username = username_;
	const url = `https://api.github.com/users/${username}/repos?per_page=100`;

	await fetch(url, {
		headers: {
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
		},
	})
		.then(res => res.json())
		.then(data => {
			repoCount = data.length;

			data.forEach((repo: any) => {
				const id = repo.name.toLowerCase() as string;

				if (!excepts.includes(id) && !repoIds.includes(id) && repo.name !== username) {
					repoIds.push(id);
				} else {
					repoCount--;
				}
			});


		})
		.catch(err => console.error(err));
}

async function fetchContributors(contributor: any) {
	const url = `https://api.github.com/users/${contributor.login}`;

	await fetch(url, {
		headers: {
			Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
		},
	})
		.then(res => res.json())
		.then(data => {
			contributors[contributor.login] = data;
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
				data.forEach(async (contributor: any) => {
					if (Object.keys(userAvatars).length === 10) {
						return;
					}

					if (
						!excepts.includes(contributor.login.toLowerCase()) &&
						contributor.type === "User" &&
						contributor.login.toLowerCase() != username.toLowerCase()
					) {
						const avatarUrl = contributor.avatar_url;
						if (!Object.keys(userAvatars).includes(contributor.login)) {
							userAvatars[contributor.login] = avatarUrl;
							await fetchContributors(contributor);
						}
					}
				});
			}
		})
		.catch(err => console.error(err));
}

async function generateSVG(avatars: { [key: string]: string }): Promise<string> {
	const avatar_list = Object.keys(avatars);
	const maxAvatars = 10;
	const circleSize = 64;
	const space = 10;
	const svgWidth = (circleSize * Math.min(avatar_list.length, maxAvatars)) + space * (Math.min(avatar_list.length, maxAvatars) - 1);
	const svgHeight = circleSize;


	const base64Avatars: { [key: string]: string } = {};

	const promises = avatar_list.map(async (avatar) => {
		const base64 = await imageUrlToBase64(avatars[avatar]);
		base64Avatars[avatar] = base64;
	});

	await Promise.all(promises);

	const defs = Object.keys(base64Avatars)
		.map(
			(key, index) => `
            <pattern id="fill${index}" x="0" y="0" width="1" height="1" patternUnits="objectBoundingBox">
                <image
                    width="${circleSize}"
                    height="${circleSize}"
                    href="${base64Avatars[key]}"
                />
            </pattern>
        `
		)
		.join("\n");


	const circles = Object.keys(base64Avatars)
		.map(
			(key, index) => `
			<a href="${contributors[key].url}" target="_blank" title="${contributors[key].login}">
				<circle
					cx="${circleSize / 2 + index * (circleSize + space)}"
					cy="${circleSize / 2}"
					r="${circleSize / 2 - 1}"
					fill="url(#fill${index})"
				/>
			</a>
        `
		)
		.join("\n");
	
	const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
    <defs>
        ${defs}
    </defs>
    ${circles}
</svg>
    `
	return svg;
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


export { fetchRepos, fetchRepoDetails, generateSVG, repoIds, userAvatars, repoCount, username, contributors, setExcepts };
