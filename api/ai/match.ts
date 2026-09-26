import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('GoogleGenAI initialization warning in serverless function:', err);
  }
}

export default async function handler(req: any, res: any) {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        // keep as is
      }
    }
    const { query, products } = payload || {};

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'La requête de recherche est requise.' });
    }

    // Default intelligent rule-based matcher for fallback
    const queryLower = query.toLowerCase();
    const matched = (products || []).filter((p: any) => {
      const nameMatch = p.name.toLowerCase().includes(queryLower);
      const categoryMatch = p.category.toLowerCase().includes(queryLower);
      const locMatch = p.location.toLowerCase().includes(queryLower);
      const descMatch = (p.description || '').toLowerCase().includes(queryLower);
      return nameMatch || categoryMatch || locMatch || descMatch;
    });

    if (!ai && process.env.GEMINI_API_KEY) {
      try {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });
      } catch (e) {
        console.warn('Failed to re-init GoogleGenAI:', e);
      }
    }

    if (!ai || !process.env.GEMINI_API_KEY) {
      const explanation =
        matched.length > 0
          ? `J'ai trouvé ${matched.length} offre(s) de producteurs locaux correspondant à votre recherche "${query}".`
          : `Aucune offre exacte pour "${query}". Voici les produits frais actuellement disponibles près de chez vous.`;

      return res.status(200).json({
        matchedProductIds: matched.map((m: any) => m.id),
        explanation,
        recommendedProductId: matched[0]?.id || (products && products[0]?.id),
      });
    }

    const prompt = `Tu es l'assistant agricole bienveillant de la plateforme AgriLink au Cameroun et en Afrique Centrale.
Un acheteur (débutant du numérique) recherche un produit agricole avec la demande suivante : "${query}".

Voici le catalogue des produits actuellement disponibles chez les producteurs :
${JSON.stringify(
  (products || []).map((p: any) => ({
    id: p.id,
    nom: p.name,
    producteur: p.farmerName,
    localisation: p.location,
    prix: `${p.pricePerUnit} FCFA/${p.unit}`,
    disponible: `${p.availableQty} ${p.unit}`,
  }))
)}

Consignes :
1. Analyse la demande pour identifier le produit, la quantité voulue (si mentionnée) et la ville/localisation.
2. Identifie les IDs des produits correspondants.
3. Rédige un message court, très chaleureux, encourageant et très simple à comprendre (en français courant, sans jargon).
4. Retourne UNIQUEMENT un objet JSON valide avec ce format :
{
  "matchedProductIds": ["id1", "id2"],
  "explanation": "Texte court et limpide pour l'acheteur",
  "recommendedProductId": "id du meilleur choix ou null",
  "detectedQuantity": nombre ou null,
  "detectedCity": "nom de ville ou null"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        matchedProductIds: matched.map((m: any) => m.id),
        explanation: `Voici les producteurs disponibles pour votre recherche "${query}".`,
        recommendedProductId: matched[0]?.id || null,
      };
    }

    if (!Array.isArray(data.matchedProductIds) || data.matchedProductIds.length === 0) {
      data.matchedProductIds = matched.map((m: any) => m.id);
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Erreur Vercel Serverless /api/ai/match:', error);
    return res.status(500).json({
      error: "Erreur lors de l'analyse intelligente",
      details: error.message,
    });
  }
}
