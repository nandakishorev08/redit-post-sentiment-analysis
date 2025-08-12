import React, { useState } from 'react';
import axios from 'axios';
function App() {
  const [username, setUsername] = useState('');
  const [caption, setCaption] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock database of usernames to captions
  const mockCaptions = {
    alice: "Feeling great today! Excited about the future!",
    bob: "I've been so tired and sad lately...",
    charlie: "Sometimes life feels hopeless and worthless.",
    diana: "Just another regular day.",
  };

  // Analyze emotion based on caption text
  const analyzeEmotion = (sentiment) => {
  if (!sentiment) return 'Unknown';

  if (sentiment.toLowerCase() === 'negative') {
    return 'Negative';
  }

  return 'Positive';
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!username) return;

  setLoading(true);
  setCaption(null);
  setEmotion(null);

  try {
    const apiBase = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const res = await axios.get(`${apiBase}/post-emotion`, {
      params: {
        user_id: username,
      },
    });

    const sentiment = res.data.message.title.sentiment;
    //console.log(res.data.message.title.title)
    const captionText = res.data.message.title;
    const result = analyzeEmotion(sentiment);

    setCaption(captionText.title);
    setEmotion(result);
  } catch (err) {
    console.error(err);
    setCaption("Error fetching sentiment.");
    setEmotion("Unknown");
  }

  setLoading(false);
};


  const emotionIcon = {
    Positive: "😊",
    Negative: "😞",
    "At Risk": "⚠",
    Unknown: "❓",
  };

  // Color for emotion label
  const emotionColor = {
    Positive: '#218838',
    Negative: '#dc3545',
    'At Risk': '#e6b800',
    Unknown: '#333',
  };

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <h2 style={{ marginBottom: 8 ,color:"black"}}>Mental State Analyzer</h2>
        <p style={{ color: '#666', marginTop: 0, marginBottom: 18 }}>
          Enter the username to see their recent post and analyze the emotional state.
        </p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="off"
          />
          <button
            type="submit"
            style={styles.button}
            disabled={loading || !username.trim()}
          >
            {loading ? 'Retrieving...' : 'Analyze'}
          </button>
        </form>
        {caption && (
          <div style={{ marginTop: 32, textAlign: 'left' }}>
            <h4 style={{color:"black"}}>User's Caption:</h4>
            <p style={{ fontStyle: 'italic', fontSize: 16,color:"black" }}>{caption}</p>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 40 }}>{emotionIcon[emotion]}</div>
              <div style={{
                fontWeight: 'bold',
                color: emotionColor[emotion],
                fontSize: 24,
                marginTop: 6
              }}>
                {emotion}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    width: "100vw",
    background: 'linear-gradient(120deg, #f8fafc 0%, #e2eafc 100%)',
    paddingTop: 0,
    paddingBottom: 0,
    justifycontent: 'centre',
    display: 'flex', 
    alignItems: 'centre', 
    margin: 0,
  
  },
  container: {
    background: '#fff',
    maxWidth: 1000,
    margin: '0 auto',
    padding: '32px 28px 34px 28px',
    borderRadius: 12,
    boxShadow: '0 4px 32px rgba(50, 80, 130, .09)',
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginTop: 10,
  },
  input: {
    padding: 12,
    fontSize: 18,
    borderRadius: 6,
    border: '1.5px solid #ccc',
    outline: 'none',
  },
  button: {
    background: '#2176ff',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    padding: '12px 0',
    fontWeight: 700,
    fontSize: 18,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default App;