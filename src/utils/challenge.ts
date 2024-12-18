import { GameResult } from '../types/game';

export const encodeGameChallenge = (games: GameResult[]): string => {
  const challenge = games.map(game => ({
    id: game.trackId,
    s: game.score,
    t: game.time
  }));
  
  return btoa(JSON.stringify(challenge));
};

export const decodeGameChallenge = (code: string): { 
  trackId: string;
  score: number;
  time: number;
}[] => {
  try {
    const decoded = JSON.parse(atob(code));
    return decoded.map((game: any) => ({
      trackId: game.id,
      score: game.s,
      time: game.t
    }));
  } catch {
    throw new Error('Invalid challenge code');
  }
};