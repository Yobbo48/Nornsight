import { createRuneReading } from '../apps/web/server/runeReadingService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  try {
    const reading = await createRuneReading(req.body);
    res.status(200).json({ reading });
  } catch (error) {
    const message =
      error?.message === 'OPENAI_API_KEY is missing.'
        ? 'La cle OpenAI n est pas configuree.'
        : error?.message || 'Erreur inconnue.';

    res.status(error?.statusCode || 500).json({ error: message });
  }
}
