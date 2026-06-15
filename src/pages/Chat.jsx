import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { chatAPI } from '../services/api';
import ActivitySuggestions from '../components/ActivitySuggestions';

export default function Chat() {
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [matchName, setMatchName] = useState('Your Match');
  const [problem, setProblem] = useState('anxiety');

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

  const handleActivityComplete = (activityData) => {
    console.log('Activity completed:', activityData);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
          {matchName[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <h1 className="font-bold text-gray-900">{matchName}</h1>
          <p className="text-xs text-gray-500 capitalize">{problem.replace(/_/g, ' ')}</p>
        </div>
      </div>

      {/* Activity Suggestions */}
      <ActivitySuggestions
        problemType={problem}
        matchName={matchName}
        onActivityComplete={handleActivityComplete}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#e9d5ff #f9fafb' }}>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">👋</div>
            <p className="text-gray-600 font-medium">Start the conversation!</p>
            <p className="text-sm text-gray-400 mt-1">Try an activity above first, then share how it went.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id}
              className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.is_mine
                  ? 'text-white rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
              }`}
                style={msg.is_mine ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)' } : {}}>
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors bg-white text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 disabled:opacity-40 transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
          ↑
        </button>
      </div>
    </div>
  );
}
