import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/rewind/Navbar';
import { PhotoUpload } from '@/components/rewind/PhotoUpload';
import { TerminalConsole } from '@/components/rewind/TerminalConsole';
import { EraCard } from '@/components/rewind/EraCard';
import { PolaroidGrid, GenerationResult } from '@/components/rewind/PolaroidGrid';
import { getEraList, eraConfig, eraOrder } from '@/lib/decadePrompts';
import { Zap } from 'lucide-react';

const TimeTravelLab = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'generating' | 'complete'>('idle');
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [activeEra, setActiveEra] = useState<string | null>(null);

  const eras = getEraList();

  const handlePhotoSelect = (_file: File, previewUrl: string) => {
    setPhoto(previewUrl);
    setStatus('ready');
  };

  const toggleEra = (eraId: string) => {
    setSelectedEras(prev => 
      prev.includes(eraId) 
        ? prev.filter(id => id !== eraId)
        : [...prev, eraId]
    );
  };

  const selectAllEras = () => {
    setSelectedEras(eraOrder);
  };

  const handleGenerate = async () => {
    if (!photo || selectedEras.length === 0) return;
    
    setStatus('generating');
    const initialResults: GenerationResult[] = selectedEras.map(eraId => ({
      eraId,
      imageUrl: '',
      status: 'generating' as const
    }));
    setResults(initialResults);

    // Simulate generation
    for (const eraId of selectedEras) {
      await new Promise(r => setTimeout(r, 1000));
      setResults(prev => prev.map(r => 
        r.eraId === eraId 
          ? { ...r, imageUrl: `https://picsum.photos/seed/${eraId}/512/512`, status: 'complete' as const }
          : r
      ));
    }
    
    setStatus('complete');
  };

  const selectedEraConfig = activeEra ? eraConfig[activeEra] : (selectedEras.length > 0 ? eraConfig[selectedEras[0]] : null);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display text-gradient-gold text-center mb-12"
          >
            TIME TRAVEL LAB
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Left: Console */}
            <div className="space-y-6">
              <TerminalConsole selectedEra={selectedEraConfig} status={status} />
            </div>

            {/* Center: Photo Upload */}
            <div className="space-y-6">
              <h2 className="text-xl font-display text-chrome">MASTER PHOTO</h2>
              <PhotoUpload 
                currentPhoto={photo}
                onPhotoSelect={handlePhotoSelect}
                onClear={() => { setPhoto(null); setStatus('idle'); }}
              />
            </div>

            {/* Right: Controls */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display text-chrome">SELECT ERAS</h2>
                <button onClick={selectAllEras} className="text-xs text-primary hover:underline">
                  Select All
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {eras.map(era => (
                  <button
                    key={era.id}
                    onClick={() => toggleEra(era.id)}
                    className={`era-badge ${era.badgeClass} ${selectedEras.includes(era.id) ? 'ring-2 ring-primary' : 'opacity-50'}`}
                  >
                    {era.icon} {era.year}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!photo || selectedEras.length === 0 || status === 'generating'}
                className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-5 h-5" />
                {status === 'generating' ? 'Generating...' : 'Generate All Eras'}
              </button>
            </div>
          </div>

          {/* Era Cards Rail */}
          <div className="mb-12">
            <h2 className="text-2xl font-display text-chrome mb-6">ERA DESTINATIONS</h2>
            <div className="vinyl-crate">
              {eras.map((era, index) => (
                <EraCard 
                  key={era.id} 
                  era={era} 
                  index={index}
                  isSelected={selectedEras.includes(era.id)}
                  onClick={() => toggleEra(era.id)}
                />
              ))}
            </div>
          </div>

          {/* Results Grid */}
          {results.length > 0 && (
            <PolaroidGrid
              results={results}
              activeEra={activeEra}
              onSelectEra={setActiveEra}
              onDownloadAll={() => console.log('Download all')}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default TimeTravelLab;
