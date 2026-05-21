import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, email } = req.body as { userId: string; email: string };
  if (!userId || !email) return res.status(400).json({ error: 'Missing userId or email' });

  const response = await fetch('https://api.paddle.com/transactions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ price_id: process.env.VITE_PADDLE_PRICE_ID, quantity: 1 }],
      customer_email: email,
      custom_data: { user_id: userId },
      checkout: {
        url: process.env.APP_URL ?? 'https://fretify.online',
      },
    }),
  });

  const data = await response.json() as { data?: { checkout?: { url?: string } }; error?: { detail?: string } };

  if (!response.ok) {
    return res.status(500).json({ error: data.error?.detail ?? 'Paddle error' });
  }

  return res.json({ url: data.data?.checkout?.url });
}
