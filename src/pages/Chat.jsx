import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import ActivitySuggestions from '../components/ActivitySuggestions';

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [matchName, setMatchName] = useState('Your Match');
  const [problem, setProblem] = useState('anxiety');
  const [showActivity, setShowActivity] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => { fetchMessages(); }, [matchId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getHistory(matchId);
      setMessages(response.data.messages || []);
      setMatchName(response.data.match_name || 'Your Match');
      setProblem(response.data.problem || 'anxiety');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    const text = newMessage.trim();
    setNewMessage('');
    setSending(true);
    // Optimistic UI
    setMessages((prev) => [...prev, { id: Date.now(), message: text, is_mine: true, created_at: new Date().toISOString() }]);
    try {
      await chatAPI.sendMessage(matchId, text);
      await fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-10 h-10 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)' }}>
        <div className="flex items-center gap-3 px-4 py-4 max-w-2xl mx-auto w-full">
          <button onClick={() => navigate('/matches')}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0">
            ←
          </button>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #a855f7, #2563eb)' }}>
            {matchName[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">{matchName}</p>
            <p className="text-purple-300 text-xs capitalize">{problem.replace(/_/g, ' ')}</p>
          </div>
          <button
            onClick={() => setShowActivity(!showActivity)}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
            style={{ background: showActivity ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.1)', color: 'white' }}>
            💡 {showActivity ? 'Hide' : 'Activities'}
          </button>
        </div>
      </div>

      {/* Activity panel */}
      {showActivity && (
        <div className="shrink-0 bg-white border-b border-gray-100 px-4 py-3 max-w-2xl mx-auto w-full">
          <ActivitySuggestions
            problemType={problem}
            matchName={matchName}
            onActivityComplete={(data) => console.log('Activity:', data)}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#e9d5ff #f9fafb' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
              style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)' }}>
              👋
            </div>
            <p className="font-semibold text-gray-800 mb-1">Say hello to {matchName}!</p>
            <p className="text-sm text-gray-400 max-w-xs">Try an activity above first, then share how it went — it's a great conversation starter.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, i) => {
              const showTime = i === 0 || i === messages.length - 1 ||
                new Date(msg.created_at) - new Date(messages[i - 1]?.created_at) > 5 * 60 * 1000;
              return (
                <div key={msg.id}>
                  {showTime && msg.created_at && (
                    <p className="text-center text-xs text-gray-300 my-3">{formatTime(msg.created_at)}</p>
                  )}
                  <div className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed ${
                      msg.is_mine
                        ? 'text-white rounded-3xl rounded-br-lg'
                        : 'bg-white text-gray-800 rounded-3xl rounded-bl-lg shadow-sm border border-gray-100'
                    }`}
                      style={msg.is_mine ? { background: 'linear-gradient(135deg, #7c3aed, #2563eb)' } : {}}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${matchName}...`}
            className="flex-1 px-4 py-3 rounded-2xl text-sm text-gray-800 placeholder-gray-400 border-2 border-gray-100 focus:outline-none focus:border-purple-300 transition-colors bg-gray-50"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            {sending
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <span className="text-lg">↑</span>}
          </button>
        </div>
        <p className="text-center text-xs text-gray-300 mt-2">🔒 End-to-end encrypted · Anonymous</p>
      </div>
    </div>
  );
}
