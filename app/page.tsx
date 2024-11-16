"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";

export default function Home() {
	const [repoCount, setRepoCount] = useState<number>(0);
	const [repoIds, setSepoIds] = useState<string[]>([]);
	const [username, setUsername] = useState<string>('');
	const [userAvatars, setUserAvatars] = useState<string[]>([]);

	const submitHandler = (e: React.MouseEvent) => {
		e.preventDefault();
		const inputField = document.getElementById("inputField") as HTMLInputElement;
		const inputValue = inputField.value;
		fetchRepos(inputValue);
	}

	function fetchRepos(username: string) {
		setUsername(username);
		const url = `https://api.github.com/users/${username}/repos`;
		fetch(url, {
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
			},
		})
			.then(res => res.json())
			.then(data => {
				setRepoCount(data.length);

				data.forEach((repo: any) => {
					const id = repo.name as string;

					if (!repoIds.includes(id) && repo.name !== username) {
						repoIds.push(id);
					} else {
						console.log("Repo already exists");
						setRepoCount(prevCount => prevCount - 1);
					}
				});


			})
			.catch(err => console.error(err));
	}

	function fetchRepoDetails(repoId: string) {
		const url = `https://api.github.com/repos/${username}/${repoId}/contributors`;
		fetch(url, {
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
			},
		})
			.then(res => res.json())
			.then(data => {
				if (data.length > 1) {
					data.forEach((contributor: any) => {
						const avatarUrl = contributor.avatar_url;

						imageUrlToBase64(avatarUrl).then((base64) => {
							const image = document.querySelector("#fill0 image") as HTMLImageElement;
							image.setAttribute("xlink:href", base64 as string);
						});

						if (contributor.login != username && !userAvatars.includes(avatarUrl)) {
							setUserAvatars(prevAvatars => [...prevAvatars, avatarUrl]);
						}
					});
				}
			})
			.catch(err => console.error(err));
	}

	function imageUrlToBase64(url: string) {
		return fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Failed to fetch image: ${response.status}`);
				}
				return response.blob(); // Get the image as a blob
			})
			.then(blob => {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result); // Base64 result
					reader.onerror = reject;
					reader.readAsDataURL(blob); // Convert blob to Base64
				});
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}

	useEffect(() => {
		repoIds.forEach(repoId => fetchRepoDetails(repoId));
	}, [repoCount, repoIds]);

	useEffect(() => {
		console.log(generateSVG(userAvatars));
	}, [userAvatars]);


	function generateSVG(avatars: any[]) {
		const maxAvatars = 10;
		const svgWidth = 64 * Math.min(avatars.length, maxAvatars);
		const svgHeight = 64;

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
            <svg x="${index * 64}" y="0" width="64" height="64">
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



	return (
		<main className="grid grid-rows-3 h-screen w-6/12 m-auto gap-4 pt-4 pb-4">
			<div className="flex justify-center items-center">
				<label htmlFor="inputField">Input:</label>
				<input type="text" id="inputField" placeholder="Enter text here" />
				<button onClick={submitHandler}>Submit</button>
			</div>
			<div className="border-2 row-span-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="268" height="64" viewBox="0 0 268 64">
					<svg x="0" y="0" width="64" height="64">
						<title>nivindulakshitha</title>
						<circle cx="32" cy="32" r="32" stroke="#0d1117" strokeWidth="3" fill="url(#fill0)" />
						<defs>
							<pattern id="fill0" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
								<image
									width="64"
									height="64"
									href="https://avatars.githubusercontent.com/u/136731064?v=4"
								/>
							</pattern>
						</defs>
					</svg>
				</svg>

			</div>
		</main>
	);
}
