
import type { NextApiRequest, NextApiResponse } from 'next';

type TokenResponse = {
  token: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

//   You can add additional security checks here (like checking origin)
//   For example:
  const allowedOrigins = ['https://edok-nextjs.vercel.app/'];
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).end('Forbidden');
  }

  // Return the Mapbox token
  res.status(200).json({ token: process.env.MAPBOX_TOKEN as string });
}