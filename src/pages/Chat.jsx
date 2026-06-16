import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { chatAPI } from '../services/api';
import ActivitySuggestions from '../components/ActivitySuggestions';
import GuidedHealing from '../components/GuidedHealing';

export default function Chat() {
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [matchName, setMatchName] = useState('Your Match');
  const [problem, setProblem] = useState('anxiety');
  const [activeTab, setActiveTab] = useState('chat'); // chat, activities, healing

  useEffect(() => {
    fetchMessages();
  }, [matchId]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getHistory(matchId);
      setMessages(response.data.messages || []);
      setMatchName(response.data.match_name || 'Your Match');
      setProblem(response.data.problem || 'anxiety');
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await chatAPI.sendMessage(matchId, newMessage);
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading chat...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Chat with {matchName}</h1>
        <p className="text-gray-600">Peer support for {problem}</p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex gap-3 mb-6 border-b-2 border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-3 font-semibold border-b-4 transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          💬 Free Chat
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`px-6 py-3 font-semibold border-b-4 transition-all whitespace-nowrap ${
            activeTab === 'activities'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          ⚡ Quick Relief
        </button>

        <button
          onClick={() => setActiveTab('healing')}
          className={`px-6 py-3 font-semibold border-b-4 transition-all whitespace-nowrap ${
            activeTab === 'healing'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          🌟 Guided Healing
        </button>
      </div>

      {/* TAB 1: FREE CHAT */}
      {activeTab === 'chat' && (
        <div className="h-[60vh] flex flex-col">
          <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-xl">👋 Start the conversation!</p>
                <p className="text-sm mt-2">Be honest. Be real. You're safe here.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === 'current' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender_id === 'current'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-300 text-gray-800'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
            <button
              onClick={handleSend}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: QUICK RELIEF ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-lg p-6">
          <ActivitySuggestions
            problemType={problem}
            matchName={matchName}
            onActivityComplete={(data) => console.log('Activity completed:', data)}
          />
        </div>
      )}

      {/* TAB 3: GUIDED HEALING JOURNEY */}
      {activeTab === 'healing' && (
        <div>
          <GuidedHealing
            problemType={problem}
            matchName={matchName}
            userId={matchId}
          />
        </div>
      )}
    </div>
  );
}
