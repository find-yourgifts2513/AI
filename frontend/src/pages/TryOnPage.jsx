import React, { useState, useEffect, useRef } from 'react';
import { Camera, Sparkles, Move, Maximize2, RotateCcw, Shirt, Check } from 'lucide-react';
import { fetchWardrobeItems } from '../services/api';

export default function TryOnPage() {
  const [items, setItems] = useState([]);
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  // Interactive positioning state
  const [topPos, setTopPos] = useState({ x: 120, y: 150, scale: 1 });
  const [accPos, setAccPos] = useState({ x: 160, y: 80, scale: 1 });

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    loadItems();
    return () => {
      stopCamera();
    };
  }, []);

  const loadItems = async () => {
    try {
      const data = await fetchWardrobeItems();
      setItems(data);
      const firstTop = data.find(i => i.category === 'top');
      const firstAcc = data.find(i => i.category === 'accessory');
      if (firstTop) setSelectedTop(firstTop);
      if (firstAcc) setSelectedAccessory(firstAcc);
    } catch (e) {
      console.error(e);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('This browser does not support live camera access. The mannequin preview remains available.');
      setCameraActive(false);
      return;
    }

    const getCameraOptions = () => ([
      {
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      },
      {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      },
      {
        video: true,
        audio: false
      }
    ]);

    try {
      let stream = null;

      for (const options of getCameraOptions()) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(options);
          break;
        } catch (error) {
          if (error.name !== 'NotAllowedError' && error.name !== 'NotFoundError' && error.name !== 'OverconstrainedError') {
            throw error;
          }
        }
      }

      if (!stream) {
        throw new Error('No compatible camera stream available');
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        await videoRef.current.play().catch(() => {
          // Some browsers require a gesture to start playback, and the stream remains usable.
        });
      }

      setCameraActive(true);
    } catch (e) {
      console.error('Camera access failed:', e);
      stopCamera();
      setCameraError('Camera access was blocked or unavailable on this device. Please allow access or keep using the mannequin preview.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>WebAR Virtual Fitting Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-800 dark:text-slate-100 tracking-tight">
          Interactive WebAR Virtual Try-On
        </h1>
        <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
          Preview how your uploaded wardrobe tops and accessories look on your webcam feed or mannequin overlay in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AR Fitting Canvas */}
        <div className="lg:col-span-2 bg-stone-900 rounded-3xl p-4 shadow-2xl relative flex flex-col items-center justify-center min-h-[480px] overflow-hidden border border-slate-700">
          
          {/* Top Control Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-xs font-bold flex items-center space-x-1.5 border border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AR Canvas Mode: {cameraActive ? 'Live Camera Feed' : 'Mannequin Overlay'}</span>
            </span>

            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                cameraActive ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {cameraActive ? 'Stop Live Camera' : 'Turn On Live Camera'}
            </button>
          </div>

          {cameraError && (
            <div className="absolute top-16 left-4 right-4 z-30 rounded-xl border border-amber-400/60 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100 backdrop-blur-sm">
              {cameraError}
            </div>
          )}

          {/* Canvas Preview Area */}
          <div className="relative w-[360px] h-[450px] bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-800">
            
            {/* Background Stream or Mannequin */}
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
                alt="Virtual Model"
                className="w-full h-full object-cover opacity-80"
              />
            )}

            {/* Accessory Layer */}
            {selectedAccessory && (
              <div
                className="absolute z-10 cursor-move transition-transform duration-100 group"
                style={{
                  left: `${accPos.x}px`,
                  top: `${accPos.y}px`,
                  transform: `scale(${accPos.scale})`
                }}
              >
                <img
                  src={selectedAccessory.imageUrl}
                  alt={selectedAccessory.name}
                  className="w-20 h-20 object-contain drop-shadow-2xl"
                />
              </div>
            )}

            {/* Top Clothing AR Overlay Layer */}
            {selectedTop && (
              <div
                className="absolute z-10 cursor-move transition-transform duration-100 group"
                style={{
                  left: `${topPos.x}px`,
                  top: `${topPos.y}px`,
                  transform: `scale(${topPos.scale})`
                }}
              >
                <img
                  src={selectedTop.imageUrl}
                  alt={selectedTop.name}
                  className="w-44 h-52 object-contain drop-shadow-2xl opacity-90"
                />
              </div>
            )}

          </div>

          {/* Bottom Adjuster Bar */}
          <div className="mt-4 flex items-center space-x-4 text-xs text-slate-300">
            <button
              onClick={() => setTopPos(p => ({ ...p, scale: p.scale + 0.1 }))}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold"
            >
              Zoom In Top
            </button>
            <button
              onClick={() => setTopPos(p => ({ ...p, scale: Math.max(0.5, p.scale - 0.1) }))}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold"
            >
              Zoom Out Top
            </button>
            <button
              onClick={() => { setTopPos({ x: 120, y: 150, scale: 1 }); setAccPos({ x: 160, y: 80, scale: 1 }); }}
              className="px-3 py-1 rounded-lg bg-rose-900/60 text-rose-300 font-bold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Alignment</span>
            </button>
          </div>

        </div>

        {/* Item Picker Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-stone-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
          
          {/* Select Top */}
          <div>
            <h4 className="font-extrabold text-stone-800 dark:text-slate-100 text-sm mb-3 flex items-center space-x-2">
              <Shirt className="w-4 h-4 text-rose-500" />
              <span>Select Upper Top for Try-On</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {items.filter(i => i.category === 'top').map((item, idx) => {
                const isSelected = selectedTop?._id === item._id || selectedTop?.id === item.id;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedTop(item)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 relative transition-all ${
                      isSelected ? 'border-rose-500 ring-2 ring-rose-300' : 'border-stone-200 dark:border-slate-700'
                    }`}
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-500 text-white">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Accessory */}
          <div>
            <h4 className="font-extrabold text-stone-800 dark:text-slate-100 text-sm mb-3 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Select Accessory Overlay</span>
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {items.filter(i => i.category === 'accessory').map((item, idx) => {
                const isSelected = selectedAccessory?._id === item._id || selectedAccessory?.id === item.id;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedAccessory(item)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 relative transition-all ${
                      isSelected ? 'border-amber-500 ring-2 ring-amber-300' : 'border-stone-200 dark:border-slate-700'
                    }`}
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 p-0.5 rounded-full bg-amber-500 text-white">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
