import { fetchRepoDetails, fetchRepos, generateSVG, repoIds, userAvatars, setExcepts } from '@/utils/app';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { username } = req.query;
	const { excepts } = req.query as { excepts: string };

	if (excepts) {
		const excepts_list = excepts.split(',').map(e => e.trim().toLocaleLowerCase());
		setExcepts(excepts_list);
		console.log('Excepts:', excepts_list);
	}

	if (!username || typeof username !== 'string') {
		return res.status(400).json({ error: 'Username is required' });
	}

	await fetchRepos(username);

	const promises = repoIds.map(repoId => fetchRepoDetails(repoId));
	await Promise.all(promises);
	const svg = await generateSVG(userAvatars);
	
	res.setHeader('Content-Type', 'image/svg+xml');
	res.status(200).send(svg);
}
