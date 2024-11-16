"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
	const [repoCount, setRepoCount] = useState<number>(0);
	const [repoIds, setSepoIds] = useState<string[]>([]);
	const [username, setUsername] = useState<string>('')

	const submitHandler = (e: React.MouseEvent) => {
		e.preventDefault();
		const inputField = document.getElementById("inputField") as HTMLInputElement;
		const inputValue = inputField.value;
		fetchRepos(inputValue);
	}

	function fetchRepos(username: string) {
		setUsername(username);
		const url = `https://api.github.com/users/${username}/repos`;
		fetch(url)
			.then(res => res.json())
			.then(data => {
				setRepoCount(data.length);
				
				data.forEach((repo: any) => {
					const id = repo.name as string;

					if (!repoIds.includes(id)) {
						repoIds.push(id);
					} else {
						console.log(repoIds);
						console.log("Repo already exists");
					}
				});


			})
			.catch(err => console.error(err));
	}

	function fetchRepoDetails(repoId: string) {
		const url = `https://api.github.com/repos/${username}/${repoId}/contributors`;
		fetch(url)
			.then(res => res.json())
			.then(data => console.log(data))
			.catch(err => console.error(err));
	}

	useEffect(() => {
		if (repoCount > 0 && repoCount === repoIds.length) {
			repoIds.forEach(repoId => fetchRepoDetails(repoId));
		}
	});
		

	return (
		<main className="grid grid-rows-3 h-screen w-6/12 m-auto gap-4 pt-4 pb-4">
			<div className="flex justify-center items-center">
				<label htmlFor="inputField">Input:</label>
				<input type="text" id="inputField" placeholder="Enter text here" />
				<button onClick={submitHandler}>Submit</button>
			</div>
			<div className="border-2 row-span-2">Hello</div>
		</main>
	);
}
