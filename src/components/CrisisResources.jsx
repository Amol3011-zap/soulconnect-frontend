import React, { useState } from 'react';

const resources = [
  { name: 'AASRA (India)', phone: '9820466726', country: 'India' },
  { name: 'iCall (India)', phone: '9152987821', country: 'India' },
  { name: 'Vandrevala Foundation', phone: '9999666555', country: 'India' },
  { name: 'Suicide & Crisis Lifeline (US)', phone: '988', country: 'US' },
  { name: 'Samaritans (UK)', phone: '116123', country: 'UK' },
];

export default function CrisisResources() {
  const [showResources, setShowResources] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowResources(!showResources)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg hover:bg-red-700 z-40"
        title="Crisis Help"
      >
        🆘
      </button>

      {showResources && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 mb-4">Crisis Resources</h2>

            <div className="space-y-3 mb-6">
              {resources.map((resource, i) => (
                <div key={i} className="border border-gray-200 p-3 rounded-lg">
                  <p className="font-semibold text-gray-800">{resource.name}</p>
                  <p className="text-red-600 font-bold text-lg">{resource.phone}</p>
                  <p className="text-xs text-gray-500">{resource.country}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600 mb-4">
              <strong>In immediate danger?</strong> Call your local emergency services (911 in US, 100 in India).
            </p>

            <button
              onClick={() => setShowResources(false)}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
