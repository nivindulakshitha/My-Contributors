"use client";
import { fetchRepos, repoIds, userAvatars, fetchRepoDetails, generateSVG} from "@/utils/app";

export default function Home() {
	const submitHandler = async (e: React.MouseEvent) => {
		e.preventDefault();
		const inputField = document.getElementById("inputField") as HTMLInputElement;
		const inputValue = inputField.value;
		await fetchRepos(inputValue);

		const promises = repoIds.map(repoId => fetchRepoDetails(repoId));
		await Promise.all(promises);

		document.querySelector("svg")?.remove();
		const svg = generateSVG(userAvatars);

		const div = document.querySelector("#svg-holder");
		const svgElement = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
		div?.appendChild(svgElement);
	}

	return (
		<main className="grid grid-rows-3 h-screen w-6/12 m-auto gap-4 pt-4 pb-4">
			<div className="flex justify-center items-center">
				<label htmlFor="inputField">Input:</label>
				<input type="text" id="inputField" placeholder="Enter text here" />
				<button onClick={submitHandler}>Submit</button>
			</div>
			<div id="svg-holder" className="border-2 row-span-2">
				
			</div>
		</main>
	);
}
