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
	const maxAvatars = 10; // Maximum number of avatars to display
	const circleSize = 64; // Diameter of each circle
	const space = 5; // Space between circles
	const svgWidth = (circleSize * Math.min(avatars.length, maxAvatars)) + space * (Math.min(avatars.length, maxAvatars) - 1);
	const svgHeight = circleSize;

	// Convert avatar URLs to base64
	const base64Avatars = await Promise.all(
		avatars.slice(0, maxAvatars).map(async (avatar) => await imageUrlToBase64(avatar))
	);

	console.log(base64Avatars);

	// Create `defs` section for patterns
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

	// Create circles with patterns
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

	// Combine everything into an SVG
	return `
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
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
		// Fetch the image as an array buffer
		const response = await axios.get(url, { responseType: "arraybuffer" });

		// Convert the buffer to a base64 string
		const base64 = Buffer.from(response.data, "binary").toString("base64");

		// Determine the image MIME type
		const mimeType = response.headers["content-type"];

		// Return the base64 image with the data URI format
		return `data:${mimeType};base64,${base64}`;
	} catch (error) {
		console.error("Error converting image to base64:", error);
		throw error;
	}
}


export { fetchRepos, fetchRepoDetails, generateSVG, repoIds, userAvatars, repoCount, username };