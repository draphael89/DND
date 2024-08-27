import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'A fantasy landscape for a D&D adventure' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('An error occurred while generating the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <button
        onClick={generateImage}
        disabled={isLoading}
        className="bg-accent text-primary px-6 py-2 rounded-full hover:bg-accent-600 transition-colors disabled:opacity-50"
      >
        Generate Scene Image
      </button>
      {isLoading && <p className="mt-4">Generating image...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4"
        >
          <Image src={imageUrl} alt="Generated scene" width={512} height={512} className="rounded-lg shadow-lg" />
        </motion.div>
      )}
    </div>
  );
}