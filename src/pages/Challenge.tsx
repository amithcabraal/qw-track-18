import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Home } from './Home';
import { decodeGameChallenge } from '../utils/challenge';

export const Challenge: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [challengeData, setChallengeData] = useState<any>(null);

  useEffect(() => {
    if (code) {
      try {
        const decoded = decodeGameChallenge(code);
        setChallengeData(decoded);
      } catch (error) {
        console.error('Invalid challenge code:', error);
      }
    }
  }, [code]);

  if (!challengeData) {
    return <div>Loading challenge...</div>;
  }

  return <Home challengeData={challengeData} />;
};