import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const PREMIUM_ON  = new Set(['subscription.activated', 'subscription.created']);
const PREMIUM_OFF = new Set(['subscription.canceled', 'subscription.paused']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const event = req.body as { event_type: string; data?: { custom_data?: { user_id?: string } } };
  const userId = event?.data?.custom_data?.user_id;

  if (userId) {
    if (PREMIUM_ON.has(event.event_type)) {
      await supabase.from('users').update({ is_premium: true }).eq('id', userId);
    } else if (PREMIUM_OFF.has(event.event_type)) {
      await supabase.from('users').update({ is_premium: false }).eq('id', userId);
    }
  }

  return res.json({ received: true });
}
