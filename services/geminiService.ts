
import { GoogleGenAI, Type } from "@google/genai";
import { JourneyProtocol, MorphLevel, Track, CurrentVibration, DesiredResonance, MomentSignal, AlchemyRecipe, StellarSignature, InnerEchoPlan, AlchemyJourneyPlan, GlobalSeedPreferences } from "../types";

/**
 * Robust retry utility with exponential backoff for handling 429 Resource Exhausted errors.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED');
    if (retries > 0 && isRetryable) {
      console.warn(`Gemini API Quota hit. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const getSessionIntro = async (
  protocol: JourneyProtocol,
  current: CurrentVibration,
  goal: DesiredResonance
): Promise<string> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, poetic intro (under 40 words) for a sound journey using protocol "${protocol}". The user is moving from a state of "${current}" to a desired resonance of "${goal}". Use gentle, alchemical language that feels supportive and grounding.`,
    });
    return response.text || "Welcome to the resonance field. Allow the frequencies to guide your transition home.";
  });
};

export const generateAffirmation = async (
  current: CurrentVibration,
  goal: DesiredResonance
): Promise<string> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a single short, poetic affirmation (under 15 words) for someone moving from "${current}" to "${goal}". No labels, just pure supportive resonance.`,
    });
    return response.text?.trim().replace(/^"|"$/g, '') || "I am balanced and aligned with my highest resonance.";
  });
};

export const getMetaphysicalInsight = async (
  part: string
): Promise<{meaning: string, frequency: string, tone: string, chakra: string, balancing: string}> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide metaphysical insight for physical tension or pressure in: "${part}". 
      Return a JSON response reflecting:
      - meaning: spiritual/emotional meaning (1 sentence)
      - frequency: recommended Hz for balancing (e.g. "528Hz")
      - tone: recommended sound texture
      - chakra: associated energy center
      - balancing: a short, simple balancing ritual (1 sentence)
      
      Return JSON matching the schema precisely.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meaning: { type: Type.STRING },
            frequency: { type: Type.STRING },
            tone: { type: Type.STRING },
            chakra: { type: Type.STRING },
            balancing: { type: Type.STRING }
          },
          required: ["meaning", "frequency", "tone", "chakra", "balancing"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return {
        meaning: "Tension here often relates to a need for grounded expression and rhythmic release.",
        frequency: "432Hz",
        tone: "Deep Earthy Hum",
        chakra: "Root",
        balancing: "Visualize red light flowing through this area as you exhale slowly."
      };
    }
  });
};

export const generateAlchemyJourneyPlan = async (
  intent: string,
  vibe: string,
  signature: StellarSignature
): Promise<AlchemyJourneyPlan> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a gentle, grounded guide translating patterns into a sound architecture.
      Create an "Alchemy Lab Sound Journey Plan" using the user's Stellar Harmonix:
      - Intention: ${intent}
      - Desired Elemental Vibe: ${vibe}
      - Harmonix Keys: ${signature.harmonicKeys.join(', ')}
      - Creative Tendencies: ${signature.creativeAlchemy.join(', ')}

      GUIDELINES:
      - Total words under 170.
      - Opening Tone: Texture + emotional tone words (e.g. "grainy, nostalgic warmth").
      - Arc: 2-3 specific alchemical steps.
      - Frequency Direction: General ranges, non-medical (e.g. "low-end resonance", "shimmering high-mids").
      - Closing Tone: A final texture.
      - Mantra: 1 short, lyric-free mantra line (optional).
      - No absolutes or medical claims.
      - End with: "Take what resonates, leave the rest."

      Return JSON matching the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            openingTone: { type: Type.STRING },
            arc: { type: Type.ARRAY, items: { type: Type.STRING } },
            frequencyDirection: { type: Type.STRING },
            closingTone: { type: Type.STRING },
            mantra: { type: Type.STRING }
          },
          required: ["openingTone", "arc", "frequencyDirection", "closingTone"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return {
        openingTone: "Low, hum-like warmth with a velvety texture.",
        arc: ["Softening the outer edges of the field.", "Inviting rhythmic flow into the center."],
        frequencyDirection: "Subtle focus on steady, low-end vibrations.",
        closingTone: "Crystalline and spacious.",
        mantra: "Flowing into the quiet center."
      };
    }
  });
};

export const generateInnerEchoPlan = async (
  currentEnergy: string,
  signature: StellarSignature
): Promise<InnerEchoPlan> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a gentle, grounded guide translating patterns into human language.
      Create a short "Inner Echo plan" using the user’s Stellar Harmonix details:
      - Current Energy: ${currentEnergy}
      - Harmonix Keys: ${signature.harmonicKeys.join(', ')}
      - Regulation Tendencies: ${signature.regulationTendencies.join(', ')}

      GUIDELINES:
      - Total words under 140.
      - Grounding Line: Reflect their current energy poetically.
      - Breath Sync: A 20-40 second suggestion.
      - Sound Soften: Describe tone/texture (e.g. warm cello, deep rainfall). No medical claims.
      - Reflection Question: A gentle inquiry.
      - Tone: Invitational, avoiding absolutes.
      - DO NOT use the words "welcome" or "blessing".

      Return JSON matching the schema precisely.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            groundingLine: { type: Type.STRING },
            breathSync: { type: Type.STRING },
            soundSoften: { type: Type.STRING },
            reflectionQuestion: { type: Type.STRING }
          },
          required: ["groundingLine", "breathSync", "soundSoften", "reflectionQuestion"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return {
        groundingLine: "The current density in your field is simply a witness to your depth.",
        breathSync: "Allow 30 seconds of rhythmic, soft exhales to settle the heart space.",
        soundSoften: "Deep, resonant woodwind tones that mimic the slow pulse of a forest.",
        reflectionQuestion: "What part of this pattern is ready to find its stillness?"
      };
    }
  });
};

export const generateStellarSignature = async (
  birthDate: string,
  birthTime: string,
  birthLocation: string
): Promise<StellarSignature> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a gentle, grounded guide translating cosmic patterns into human language.
      Generate a person’s Stellar Harmonix using their birth details:
      - Date of Birth: ${birthDate}
      - Time of Birth: ${birthTime || 'Unknown'}
      - Location of Birth: ${birthLocation}

      This is not an identity, label, or destiny. It is a reflective harmonic pattern meant to support curiosity and embodiment.

      GUIDELINES:
      - Use soft, invitational language: "may", "often", "tends to", "you might notice".
      - Avoid absolutes, predictions, or directives.
      - Title: Your Stellar Harmonix
      - 1) Harmonix Keys (3–5 short key phrases)
      - 2) Harmonic Overview (2–4 sentences)
      - 3) Regulation Tendencies (3–5 bullet points)
      - 4) Creative Alchemy Tendencies (3–5 bullet points)
      - Close with a sovereignty reminder (mirror, not rule; self-trust).

      Return JSON matching the schema precisely.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            harmonicKeys: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-5 short key phrases."
            },
            overview: { 
              type: Type.STRING,
              description: "2-4 sentences describing the harmonic baseline."
            },
            regulationTendencies: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-5 bullet points regarding natural regulation."
            },
            creativeAlchemy: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-5 bullet points regarding creative or alchemical tendencies."
            }
          },
          required: ["harmonicKeys", "overview", "regulationTendencies", "creativeAlchemy"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return {
        harmonicKeys: ["Soft Emergence", "Fluid Stillness", "Deep Resonance"],
        overview: "A gentle, flowing resonance that seeks balance between stillness and potential. You might notice a natural inclination toward integration over speed.",
        regulationTendencies: [
          "Finding grounding through low-frequency sound.",
          "Rhythmic pauses to reset the nervous system.",
          "Somatic awareness of subtle environmental shifts."
        ],
        creativeAlchemy: [
          "Transmuting observation into artistic expression.",
          "Using silence as a medium for new ideas.",
          "A preference for collaborative, non-linear growth."
        ]
      };
    }
  });
};

export const generateAlchemyRecipe = async (
  signal: MomentSignal,
  protocol: JourneyProtocol,
  vibe: CurrentVibration,
  goal: DesiredResonance,
  signature?: StellarSignature
): Promise<AlchemyRecipe> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const sigContext = signature ? `Stellar Harmonix Context: Keys: ${signature.harmonicKeys.join(', ')}. Overview: ${signature.overview}` : "";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As the Resonance Guide for an Alchemical Sound Portal, create a healing Alchemy Recipe.
      Alchemist Context:
      - Current Activity: ${signal.activity} (Attunement: ${signal.intent})
      - Current Feelings: ${signal.feelings?.join(', ') || 'Neutral Integration'}
      - Time: ${signal.timeAvailable}m
      - Current State: ${vibe}
      - Desired State: ${goal}
      - Protocol: ${protocol}
      ${sigContext}

      GUIDELINES:
      - You are a compassionate DJ and grounded mirror.
      - Use the Stellar Harmonix context to inform the tone and phase descriptions if available.
      - NEVER use traditional chant-based mantras like "Om", "Aum", or "Namaste".
      - Mantras must be secular, poetic, or starlight-aligned affirmations.
      - THIS IS A POSITIVE-ONLY PLATFORM. Strictly avoid all negative emotional terms.
      - FINAL VALIDATION: Perform a language validation pass: replace heavy emotional words with neutral, compassionate alternatives.

      Return JSON:
      1. morphTarget (0.0 music-forward, 1.0 field-forward).
      2. phases (3 phases totalling ${signal.timeAvailable}m).
      3. mantra (Poetic starlight anchor).
      4. suggestedVolume (Description like 'Soft as starlight' or 'Pulse of the heart').`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            morphTarget: { type: Type.NUMBER },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  desc: { type: Type.STRING }
                },
                required: ["label", "duration", "desc"]
              }
            },
            mantra: { type: Type.STRING },
            suggestedVolume: { type: Type.STRING }
          },
          required: ["morphTarget", "phases", "mantra", "suggestedVolume"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return {
        morphTarget: 0.5,
        phases: [
          { label: "Clearing", duration: "2m", desc: "Releasing the day's residue." },
          { label: "Resonance", duration: "10m", desc: "Anchoring your new frequency." },
          { label: "Integration", duration: "3m", desc: "Sealing the alchemical shift." }
        ],
        mantra: "The field is open and I am aligned.",
        suggestedVolume: "Soft as moonlight."
      };
    }
  });
};

export const generateJourneyPlaylist = async (
  protocol: JourneyProtocol,
  morph: MorphLevel,
  neededCount: number,
  userTracks?: Track[],
  current?: CurrentVibration,
  goal?: DesiredResonance,
  signal?: MomentSignal,
  globalSeedPrefs?: GlobalSeedPreferences
): Promise<Track[]> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const context = `Moving from ${current} to ${goal}. Activity: ${signal?.activity}. Feelings: ${signal?.feelings?.join(', ')}.`;
    
    // Extract manual preferences if any exist
    const manualSeeds = userTracks?.filter(t => t.source === 'manual') || [];
    
    // Incorporate Global Preferences if enabled
    let manualContext = "";
    if (globalSeedPrefs?.enabled && globalSeedPrefs.genre) {
        manualContext = `Global Alchemist Selections (Persistent): Genre: ${globalSeedPrefs.genre}, Top Songs: ${globalSeedPrefs.songsAndArtists}. `;
    }

    if (manualSeeds.length > 0) {
      manualContext += `Current Session Seeds: ${manualSeeds.map(s => `Genre: ${s.metadata?.genre}, Top Songs: ${s.metadata?.preferences}`).join('; ')}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a Music Curator for an Alchemical Sound Portal, select ${neededCount} track titles/artists for a retuned 432Hz journey.
      Context: ${context}
      Protocol: ${protocol}
      ${manualContext}
      
      Focus: Sound healing, deep resonance, and musical alchemy. 
      The tracks should specifically mirror the energy of the provided manual preferences (genres and artists).
      Ensure energy levels match the activity. No medical claims.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              duration: { type: Type.STRING },
            },
            required: ["title", "artist", "duration"]
          }
        }
      }
    });

    try {
      const json = JSON.parse(response.text);
      return json.map((t: any, i: number) => ({
        id: `support-${Date.now()}-${i}`,
        title: t.title,
        artist: t.artist,
        duration: t.duration,
        source: 'platform',
        type: 'Support',
        frequency: '432Hz'
      }));
    } catch (e) {
      return [];
    }
  });
};
