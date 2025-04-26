import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newChat = [...chat, { type: 'user', text: message }];
    setChat(newChat);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/chatbot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok) {
        setChat([...newChat, { type: 'bot', text: data.response }]);
      } else {
        setChat([...newChat, { type: 'bot', text: data.error || 'Bot failed to respond.' }]);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setMessage('');
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <span className="chatbot-icon">🌫</span>
          <h2>Air Quality Assistant</h2>
        </div>
        <div className="chatbot-subtitle">Ask me about pollution levels, health advice, and more</div>
      </div>

      <div className="chatbot-messages">
        {chat.length === 0 && (
          <div className="welcome-message">
            <p>Hello! I'm your air quality assistant. How can I help you today?</p>
            <div className="suggestions">
              <button onClick={() => setMessage("What's the AQI in my area?")}>Current AQI</button>
              <button onClick={() => setMessage("How does PM2.5 affect health?")}>PM2.5 Effects</button>
              <button onClick={() => setMessage("Best masks for pollution?")}>Pollution Masks</button>
            </div>
          </div>
        )}

        {chat.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bot-message typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chatbot-input">
        <input
          type="text"
          placeholder="Ask about air quality..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !message.trim()}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            <span className="send-icon">↑</span>
          )}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ChatBot;