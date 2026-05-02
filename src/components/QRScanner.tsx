import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X, AlertCircle } from 'lucide-react';
import { Button } from './ui/Base';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Success
        try {
          // Check if it's a MedVault URL or just an ID
          if (decodedText.includes('/doctor/patient/')) {
            const id = decodedText.split('/').pop();
            if (id) onScan(id);
          } else {
            onScan(decodedText);
          }
          scanner.clear();
          onClose();
        } catch (e) {
          console.error("Scanner Error:", e);
        }
      },
      (errorMessage) => {
        // Ignored most errors as they are frequent during scanning
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Scanner Cleanup Error:", err));
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">QR Scanner</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative aspect-square w-full max-w-[400px] mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10">
          <div id="qr-reader" className="w-full h-full"></div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-white/60 text-sm">Align the patient's QR code within the frame</p>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">Scanning and verifying...</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 border border-red-500/30">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

      </div>
    </div>
  );
};
