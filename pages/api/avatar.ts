import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// Extract username from the query parameters
	const { username } = req.query;

	if (!username || typeof username !== 'string') {
		return res.status(400).json({ error: 'Username is required' });
	}

	// Generate the SVG dynamically based on the username
	const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <defs>
        <pattern id="fill0" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
          <image width="64" height="64" href="https://avatars.githubusercontent.com/${username}?v=4" />
        </pattern>
      </defs>
      <circle cx="32" cy="32" r="32" stroke="#0d1117" strokeWidth="3" fill="url(#fill0)" />
    </svg>
  `;

	// Set the response type to SVG
	res.setHeader('Content-Type', 'image/svg+xml');
	res.status(200).send(svg);
}
