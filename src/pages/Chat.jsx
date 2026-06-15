import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { chatAPI } from '../services/api';

export default function Chat() {
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, [matchId]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getHistory(matchId);
      setMessages(response.data.messages || []);
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
    <div className="max-w-2xl mx-auto px-4 py-8 h-[90vh] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-300 text-gray-800">
              {msg.message}
            </div>
          </div>
        ))}
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
  );
}
