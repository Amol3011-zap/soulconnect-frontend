import React from 'react';

export default function Premium() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upgrade to Premium</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Free</h2>
          <p className="text-gray-600 mb-6">Perfect for getting started</p>
          <p className="text-4xl font-bold mb-6">Rs.0<span className="text-lg text-gray-600">/month</span></p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2"><span className="text-green-600">✓</span><span>Unlimited peer matching</span></li>
            <li className="flex items-center gap-2"><span className="text-green-600">✓</span><span>1:1 chat</span></li>
            <li className="flex items-center gap-2"><span className="text-green-600">✓</span><span>Browse healers</span></li>
            <li className="flex items-center gap-2"><span className="text-gray-400">✗</span><span className="text-gray-400">Priority matching</span></li>
            <li className="flex items-center gap-2"><span className="text-gray-400">✗</span><span className="text-gray-400">Unlimited meetups</span></li>
          </ul>

          <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold cursor-default">
            Current Plan
          </button>
        </div>

        <div className="bg-purple-600 text-white rounded-lg p-8 shadow-xl relative">
          <div className="absolute top-4 right-4 bg-yellow-400 text-purple-600 px-3 py-1 rounded-full text-xs font-bold">
            POPULAR
          </div>

          <h2 className="text-2xl font-bold mb-4">Premium</h2>
          <p className="mb-6">Unlock full potential</p>
          <p className="text-4xl font-bold mb-6">Rs.299<span className="text-lg opacity-90">/month</span></p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2"><span>✓</span><span>Priority matching (10 min)</span></li>
            <li className="flex items-center gap-2"><span>✓</span><span>Unlimited meetups</span></li>
            <li className="flex items-center gap-2"><span>✓</span><span>20% healer discounts</span></li>
            <li className="flex items-center gap-2"><span>✓</span><span>Expand search (50km)</span></li>
            <li className="flex items-center gap-2"><span>✓</span><span>Progress tracking</span></li>
            <li className="flex items-center gap-2"><span>✓</span><span>Ad-free experience</span></li>
          </ul>

          <button className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Upgrade Now
          </button>

          <p className="text-xs opacity-75 text-center mt-4">Cancel anytime. No questions asked.</p>
        </div>
      </div>
    </div>
  );
}
