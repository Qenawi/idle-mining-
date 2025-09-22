import { GoogleGenAI } from "@google/genai";
import { GameState } from '../types';
import { GameManager } from "../managers/GameManager";

const SI_SUFFIXES = ['', 'K', 'M', 'B', 'T'];
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

// Duplicating this function here to avoid circular dependency issues
// and to ensure the AI service is self-contained.
const formatNumberForAI = (num: number): string => {
    if (num < 1000) return num.toFixed(0);
    
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier < SI_SUFFIXES.length) {
        const suffix = SI_SUFFIXES[tier];
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        return scaled.toFixed(2) + suffix;
    }

    const exp = tier - SI_SUFFIXES.length;
    const firstLetter = ALPHABET[Math.floor(exp / ALPHABET.length)];
    const secondLetter = ALPHABET[exp % ALPHABET.length];
    const suffix = `${firstLetter}${secondLetter}`;
    
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;

    return scaled.toFixed(2) + suffix;
};

export async function getGameTip(gameState: GameState, gameManager: GameManager): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const getTotal = (map: { [key: string]: number }) => Object.values(map).reduce((s, c) => s + c, 0);

  const elevatorStorageCapacity = gameManager.getElevatorStorageCapacity(gameState.elevator);
  const elevatorStorageLoad = getTotal(gameState.elevator.storage);
  const elevatorStorageFullness = elevatorStorageCapacity > 0 ? Math.round((elevatorStorageLoad / elevatorStorageCapacity) * 100) : 0;

  const summary = `
    - Cash: $${formatNumberForAI(gameState.cash)}
    - Mineshafts: ${gameState.mineShafts.length} shafts. Levels: ${gameState.mineShafts.map(s => s.level).join(', ')}.
    - Elevator: Level ${gameState.elevator.level}. Storage is ${elevatorStorageFullness}% full.
    - Pipeline: Level ${gameState.cart.level}.
    - Market: Level ${gameState.market.level}.
    - Idle Income: $${formatNumberForAI(gameManager.getIdleIncome())}/s
  `;

  const prompt = `You are an expert advisor for the game "Idle Mining Tycoon". Your goal is to help the player make smart decisions.
  Analyze the following game state summary and provide one short, actionable tip (max 25 words) to guide the player.
  Focus on identifying the biggest bottleneck or the most valuable next upgrade. For example, if elevator storage is nearly full, suggest upgrading the pipeline. If a certain upgrade is very affordable compared to income, suggest it.

  Game State:
  ${summary}

  Your concise tip:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const tip = response.text;
    
    if (!tip) {
      throw new Error("Received an empty response from the AI.");
    }
    
    return tip.trim();
  } catch (error) {
    console.error("Error fetching AI tip:", error);
    throw new Error("Could not get a tip from the AI advisor. Please try again later.");
  }
}