import OpenAI from 'openai';

// ⚠️  For production, move this call behind a backend route so the key
//     is never shipped in the browser bundle.
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are a nutrition label analyst. The user will send you a photo of a food nutrition facts panel.

Extract every nutrient you can see and return ONLY a valid JSON object — no markdown, no explanation, just raw JSON — in this exact shape:

{
  "servingSize": "1 cup (240ml)",
  "servingsPerContainer": 2,
  "nutrients": [
    {
      "id": "calories",
      "name": "Calories",
      "value": 210,
      "unit": "kcal",
      "status": "good",
      "label": "Good amount",
      "explanation": "Moderate calorie content for a single serving."
    }
  ],
  "summary": {
    "score": 72,
    "verdict": "Balanced",
    "highlights": ["High in protein", "Zero added sugar"]
  },
  "healthierAlternative": {
    "name": "Low-Sodium Vegetable Broth",
    "category": "food",
    "reason": "Same warmth and flavor with 75% less sodium and no saturated fat.",
    "swaps": ["75% less sodium", "no saturated fat", "lower calories"]
  }
}

Rules for every nutrient:
- "id" must be one of: calories, protein, carbohydrates, fat, saturatedFat, transFat, fiber, sugar, addedSugar, sodium, cholesterol, vitaminD, calcium, iron, potassium
- "status" must be one of: "good", "low", "too-much", "attention"
- "label" matches the status: "Good amount" | "Low" | "Too much" | "Needs attention"
- "explanation" is one short human-readable sentence (max 15 words) explaining why that status was assigned
- Base status on standard FDA daily values for a 2,000 calorie diet

For the summary:
- "score" is 0–100 reflecting overall nutritional quality
- "verdict" is one of: "Balanced", "Mixed", "Use caution"
- "highlights" is an array of 2–4 short strings (positive or cautionary facts)

For healthierAlternative:
- "name" is a specific real food or drink product/type (not generic like "eat vegetables")
- "category" must be "drink" if the scanned item is a beverage, otherwise "food"
- "reason" is one sentence explaining what makes it better based on this label's worst nutrients
- "swaps" is an array of 2–4 short strings showing the specific improvements (e.g. "60% less sugar", "more fiber", "no trans fat")
- The alternative MUST match the category — if it's a drink, suggest a drink; if food, suggest food

If the image is not a nutrition label or is unreadable, return:
{ "error": "Could not read a nutrition label from this image." }`;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is "data:image/jpeg;base64,<data>" — strip the prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeFoodLabel(imageFile) {
  const base64 = await fileToBase64(imageFile);
  const mimeType = imageFile.type || 'image/jpeg';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1200,
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64}`,
              detail: 'high',
            },
          },
          {
            type: 'text',
            text: 'Analyze this nutrition label and return the JSON breakdown.',
          },
        ],
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('AI returned an unreadable response. Please try again.');
  }

  if (parsed.error) {
    throw new Error(parsed.error);
  }

  return {
    scannedAt: new Date().toISOString(),
    servingSize: parsed.servingSize ?? 'Per serving',
    servingsPerContainer: parsed.servingsPerContainer ?? 1,
    nutrients: parsed.nutrients ?? [],
    summary: parsed.summary ?? { score: 50, verdict: 'Mixed', highlights: [] },
    healthierAlternative: parsed.healthierAlternative ?? null,
  };
}
