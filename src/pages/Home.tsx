import React, { useState, useEffect } from 'react';
import { PlaylistSelector } from '../components/PlaylistSelector';
import { GamePlayer } from '../components/GamePlayer';
import { Header } from '../components/Header';
import { SpotifyPlaylist, SpotifyTrack } from '../types/spotify';
import { getUserPlaylists, getPlaylistTracks, getTrackById } from '../services/spotifyApi';

interface HomeProps {
  challengeData?: any;
}

export const Home: React.FC<HomeProps> = ({ challengeData }) => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playedTracks, setPlayedTracks] = useState<Set<string>>(new Set());
  const [isReadyForNextTrack, setIsReadyForNextTrack] = useState(true);

  useEffect(() => {
    if (!challengeData) {
      getUserPlaylists()
        .then(data => {
          setPlaylists(data.items);
        })
        .catch(error => {
          console.error('Failed to fetch playlists:', error);
          setError('Failed to load playlists. Please try again.');
        });
    } else if (challengeData.length > 0 && isReadyForNextTrack) {
      const currentIndex = playedTracks.size;
      if (currentIndex < challengeData.length) {
        getTrackById(challengeData[currentIndex].trackId)
          .then(track => {
            setCurrentTrack(track);
            setIsReadyForNextTrack(false);
          })
          .catch(error => {
            console.error('Failed to fetch challenge track:', error);
            setError('Failed to load challenge track');
          });
      }
    }
  }, [challengeData, playedTracks, isReadyForNextTrack]);

  const handlePlaylistSelect = async (playlist: SpotifyPlaylist) => {
    try {
      setCurrentPlaylist(playlist);
      
      if (challengeData) {
        setIsReadyForNextTrack(true);
      } else {
        const response = await getPlaylistTracks(playlist.id);
        const validTracks = response.items
          .map(item => item.track)
          .filter(track => !playedTracks.has(track.id));

        if (validTracks.length === 0) {
          setError('No more unplayed tracks in this playlist!');
          return;
        }

        const randomTrack = validTracks[Math.floor(Math.random() * validTracks.length)];
        setCurrentTrack(randomTrack);
        setPlayedTracks(prev => new Set([...prev, randomTrack.id]));
      }
      
      setError(null);
    } catch (error) {
      console.error('Failed to get tracks:', error);
      setError('Failed to load tracks. Please try again.');
    }
  };

  const handleGameComplete = (score: number) => {
    if (currentTrack) {
      setPlayedTracks(prev => new Set([...prev, currentTrack.id]));
    }
  };

  const handlePlayAgain = () => {
    setIsReadyForNextTrack(true);
    if (!challengeData && currentPlaylist) {
      handlePlaylistSelect(currentPlaylist);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        {!currentTrack ? (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {challengeData ? 'Challenge Mode' : 'Your Playlists'}
            </h2>
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200">
                {error}
              </div>
            )}
            <PlaylistSelector 
              playlists={playlists} 
              onSelect={handlePlaylistSelect}
              challengeData={challengeData}
            />
          </div>
        ) : (
          <GamePlayer 
            track={currentTrack} 
            onGameComplete={handleGameComplete}
            onPlayAgain={handlePlayAgain}
            challengeData={challengeData}
          />
        )}
      </main>
    </div>
  );
};