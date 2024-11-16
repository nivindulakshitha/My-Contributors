import { fetchRepoDetails, fetchRepos, generateSVG, repoIds, userAvatars } from '@/utils/app';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { username } = req.query;

	if (!username || typeof username !== 'string') {
		return res.status(400).json({ error: 'Username is required' });
	}

	await fetchRepos(username);

	const promises = repoIds.map(repoId => fetchRepoDetails(repoId));
	await Promise.all(promises);
	const svg = generateSVG(userAvatars);
	
	res.setHeader('Content-Type', 'image/svg+xml');
	res.status(200).send(svg);
}
