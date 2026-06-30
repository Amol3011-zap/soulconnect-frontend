import React, { useState } from 'react';
import { X } from 'lucide-react';

const CrisisBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-lg sm:text-base font-bold">
            🆘 In Crisis? Get Immediate Support
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <a
              href="tel:9152987821"
              className="hover:underline font-semibold"
              title="iCall 24/7 Helpline"
            >
              iCall: 9152987821
            </a>
            <a
              href="tel:1860-2662-345"
              className="hover:underline font-semibold"
              title="Vandrevala Foundation 24/7"
            >
              Vandrevala: 1860-2662-345
            </a>
            <a
              href="tel:9820466726"
              className="hover:underline font-semibold"
              title="AASRA 24/7"
            >
              AASRA: 9820466726
            </a>
          </div>
        </div>

        {/* Mobile view - show helpline as a button */}
        <div className="sm:hidden flex gap-2">
          <a
            href="tel:9152987821"
            className="bg-white text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-50"
          >
            Call Now
          </a>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-red-800 rounded transition-colors"
          aria-label="Close crisis banner"
        >
          <X size={20} />
        </button>
      </div>

      {/* Full helpline numbers for mobile */}
      <div className="sm:hidden bg-red-700 px-4 py-2 text-xs">
        <div className="font-semibold mb-1">India Helplines (All 24/7):</div>
        <div className="space-y-1">
          <div>iCall: <a href="tel:9152987821" className="font-bold">9152987821</a></div>
          <div>Vandrevala: <a href="tel:1860-2662-345" className="font-bold">1860-2662-345</a></div>
          <div>AASRA: <a href="tel:9820466726" className="font-bold">9820466726</a></div>
        </div>
      </div>
    </div>
  );
};

export default CrisisBanner;
