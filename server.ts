import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK safely
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
    console.warn('GoogleGenAI initialization warning:', err);
  }
}

// AI Smart Matching Endpoint for AgriLink
app.post('/api/ai/match', async (req, res) => {
  try {
    const { query, products } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'La requête de recherche est requise.' });
    }

    // Default intelligent rule-based matcher for fallback or fast response
    const queryLower = query.toLowerCase();
    const matched = (products || []).filter((p: any) => {
      const nameMatch = p.name.toLowerCase().includes(queryLower);
      const categoryMatch = p.category.toLowerCase().includes(queryLower);
      const locMatch = p.location.toLowerCase().includes(queryLower);
      const descMatch = (p.description || '').toLowerCase().includes(queryLower);
      return nameMatch || categoryMatch || locMatch || descMatch;
    });

    if (!ai || !process.env.GEMINI_API_KEY) {
      // High-quality deterministic matching when API key is unavailable
      const explanation = matched.length > 0
        ? `J'ai trouvé ${matched.length} offre(s) de producteurs locaux correspondant à votre recherche "${query}".`
        : `Aucune offre exacte pour "${query}". Voici les produits frais actuellement disponibles près de chez vous.`;

      return res.json({
        matchedProductIds: matched.map((m: any) => m.id),
        explanation,
        recommendedProductId: matched[0]?.id || (products && products[0]?.id),
      });
    }

    // Call Gemini 3.8 Flash for intelligent natural language parsing
    const prompt = `Tu es l'assistant agricole bienveillant de la plateforme AgriLink au Cameroun et en Afrique Centrale.
Un acheteur (débutant du numérique) recherche un produit agricole avec la demande suivante : "${query}".

Voici le catalogue des produits actuellement disponibles chez les producteurs :
${JSON.stringify((products || []).map((p: any) => ({
  id: p.id,
  nom: p.name,
  producteur: p.farmerName,
  localisation: p.location,
  prix: `${p.pricePerUnit} FCFA/${p.unit}`,
  disponible: `${p.availableQty} ${p.unit}`,
})))}

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

    // Ensure matchedProductIds is at least a valid array
    if (!Array.isArray(data.matchedProductIds) || data.matchedProductIds.length === 0) {
      data.matchedProductIds = matched.map((m: any) => m.id);
    }

    return res.json(data);
  } catch (error: any) {
    console.error('Error in /api/ai/match:', error);
    return res.status(500).json({
      error: 'Erreur lors de l\'analyse intelligente',
      details: error.message,
    });
  }
});

// AI Demand Forecasting Endpoint for Producers
app.post('/api/ai/forecast', async (req, res) => {
  try {
    const { producerLocation, currentProducts } = req.body;

    if (!ai || !process.env.GEMINI_API_KEY) {
      return res.json({
        trendTitle: 'Tendances du marché local',
        advice: 'Le maïs, le manioc et le plantain sont actuellement très recherchés dans votre zone. Les acheteurs privilégient les livraisons rapides.',
        highDemandProducts: ['Plantain', 'Maïs doux', 'Tomates'],
        pricingInsight: 'Les prix du plantain sont stables entre 2 500 et 4 000 FCFA le régime.',
      });
    }

    const prompt = `Tu es l'économiste et conseiller agricole de l'application AgriLink.
Un producteur situé à "${producerLocation || 'Yaoundé'}" souhaite connaître les prévisions de la demande pour optimiser ses récoltes et ses ventes.
Ses produits actuels : ${JSON.stringify(currentProducts || [])}.

Donne-lui un conseil clair, rassurant et pratique (en français simple, accessible à un débutant du digital).
Rappelle qu'il s'agit d'une aide à la décision et non d'une garantie absolue.
Réponds UNIQUEMENT en JSON avec la structure :
{
  "trendTitle": "Titre court",
  "advice": "Conseil principal en 2 phrases simples",
  "highDemandProducts": ["Produit 1", "Produit 2"],
  "pricingInsight": "Indication sur les prix constatés"
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
        trendTitle: 'Forte demande constatée',
        advice: 'Le maïs et le plantain sont particulièrement recherchés cette semaine par les ménages et les restaurateurs.',
        highDemandProducts: ['Plantain', 'Maïs', 'Tomates fraîches'],
        pricingInsight: 'Des prix justes favorisent des commandes récurrentes.',
      };
    }

    return res.json(data);
  } catch (error: any) {
    console.error('Error in /api/ai/forecast:', error);
    return res.json({
      trendTitle: 'Aide à la décision marché',
      advice: 'La demande en produits vivriers frais reste soutenue. Privilégiez des récoltes échelonnées.',
      highDemandProducts: ['Manioc', 'Plantain', 'Légumes verts'],
      pricingInsight: 'Prix direct producteur avantageux pour les deux parties.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`AgriLink server running on http://localhost:${port}`);
  });
}

startServer();
