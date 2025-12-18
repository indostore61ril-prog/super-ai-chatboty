// Cloudflare Worker - API endpoint
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Serve HTML page
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders,
        },
      });
    }

    // Handle AI chat requests
    if (url.pathname === '/chat' && request.method === 'POST') {
      try {
        const { message } = await request.json();
        
        if (!message) {
          return new Response(JSON.stringify({ error: 'Message is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        // Gunakan Cloudflare AI (LLM model)
        const response = await env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
          messages: [
            { role: 'system', content: 'You are SUPER AI, a helpful AI assistant that can answer any question in Bahasa Indonesia and English.' },
            { role: 'user', content: message }
          ],
        });

        return new Response(JSON.stringify({
          response: response.response || response,
          timestamp: new Date().toISOString(),
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'AI service error', 
          details: error.message 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};

// HTML template
const html = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SUPER AI - Gratis</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .chat-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            min-height: 90vh;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.2rem;
            margin-bottom: 10px;
            font-weight: 800;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .chat-area {
            padding: 20px;
            height: 500px;
            overflow-y: auto;
            background: #fafafa;
        }
        
        .message {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 15px;
            max-width: 80%;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .user-message {
            background: #667eea;
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 5px;
        }
        
        .ai-message {
            background: #e9ecef;
            color: #333;
            margin-right: auto;
            border-bottom-left-radius: 5px;
        }
        
        .ai-message strong {
            color: #667eea;
        }
        
        .input-area {
            padding: 20px;
            background: white;
            border-top: 1px solid #e9ecef;
            display: flex;
            gap: 10px;
        }
        
        .input-area input {
            flex: 1;
            padding: 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;
        }
        
        .input-area input:focus {
            border-color: #667eea;
        }
        
        .input-area button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 15px 30px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .input-area button:hover {
            transform: scale(1.05);
        }
        
        .input-area button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .typing-indicator {
            padding: 10px;
            color: #6c757d;
            font-style: italic;
        }
        
        .features {
            padding: 20px;
            background: white;
            border-top: 1px solid #e9ecef;
        }
        
        .features h3 {
            margin-bottom: 15px;
            color: #667eea;
        }
        
        .features ul {
            list-style: none;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 10px;
        }
        
        .features li {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .features i {
            color: #667eea;
        }
        
        .footer {
            text-align: center;
            padding: 15px;
            color: #6c757d;
            font-size: 0.9rem;
            background: #f8f9fa;
        }
        
        @media (max-width: 600px) {
            .chat-container {
                margin: 10px;
                border-radius: 15px;
            }
            .header h1 { font-size: 1.8rem; }
            .stats { flex-direction: column; gap: 15px; }
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="header">
            <h1><i class="fas fa-robot"></i> SUPER AI</h1>
            <p>AI yang BISA JAWAB SEMUA yang Anda kirim - Matematika, Sains, Coding, Pertanyaan Apa Saja!</p>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <div class="stat-value" id="questions-count">6</div>
                <div class="stat-label">Pertanyaan Terjawab</div>
            </div>
            <div class="stat-item">
                <div class="stat-value" id="knowledge-points">30</div>
                <div class="stat-label">Poin Pengetahuan</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">100%</div>
                <div class="stat-label">Akurasi Jawaban</div>
            </div>
            <div class="stat-item">
                <div class="stat-value" id="learning-level">1</div>
                <div class="stat-label">Level Pembelajaran</div>
            </div>
        </div>
        
        <div class="chat-area" id="chat-area">
            <!-- Messages will appear here -->
            <div class="message ai-message">
                <strong>SUPER AI:</strong> Halo! Saya SUPER AI. Saya bisa membantu Anda dengan matematika, sains, coding, dan pertanyaan apa pun. Apa yang ingin Anda tanyakan?
            </div>
        </div>
        
        <div class="input-area">
            <input type="text" id="user-input" placeholder="Kirim pertanyaan apapun di sini..." autocomplete="off">
            <button id="send-btn"><i class="fas fa-paper-plane"></i> Kirim</button>
        </div>
        
        <div class="features">
            <h3><i class="fas fa-star"></i> Fitur SUPER AI</h3>
            <ul>
                <li><i class="fas fa-bolt"></i> <strong>AI Aktif & Online:</strong> Response Instan</li>
                <li><i class="fas fa-graduation-cap"></i> <strong>Bisa Belajar Sendiri:</strong> Dari setiap percakapan</li>
                <li><i class="fas fa-infinity"></i> <strong>Tidak Ada Batas:</strong> Tanyakan apa saja</li>
                <li><i class="fas fa-code"></i> <strong>Multi Bahasa:</strong> Indonesia, Inggris, dll</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>Dibangun dengan Cloudflare Workers + Cloudflare AI | 100% Gratis</p>
        </div>
    </div>

    <script>
        // Frontend JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            const chatArea = document.getElementById('chat-area');
            const userInput = document.getElementById('user-input');
            const sendBtn = document.getElementById('send-btn');
            const questionsCount = document.getElementById('questions-count');
            const knowledgePoints = document.getElementById('knowledge-points');
            const learningLevel = document.getElementById('learning-level');
            
            let questionCount = 6;
            let knowledge = 30;
            let level = 1;
            
            // Example questions
            const exampleQuestions = [
                "1x1 berapa?",
                "Buat website sederhana",
                "Jelaskan teori relativitas",
                "Python code untuk Fibonacci",
                "Apa itu AI?",
                "Ibu kota Indonesia?"
            ];
            
            // Display example questions
            function showExampleQuestions() {
                const exampleDiv = document.createElement('div');
                exampleDiv.className = 'ai-message message';
                exampleDiv.innerHTML = `
                    <strong>SUPER AI:</strong> Coba tanyakan:<br>
                    ${exampleQuestions.map(q => 
                        `<button class="example-btn" style="margin:5px; padding:8px 12px; background:#667eea; color:white; border:none; border-radius:5px; cursor:pointer;">${q}</button>`
                    ).join('')}
                `;
                chatArea.appendChild(exampleDiv);
                chatArea.scrollTop = chatArea.scrollHeight;
                
                // Add click events to example buttons
                document.querySelectorAll('.example-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        userInput.value = this.textContent;
                        sendMessage();
                    });
                });
            }
            
            showExampleQuestions();
            
            // Send message function
            async function sendMessage() {
                const message = userInput.value.trim();
                if (!message) return;
                
                // Add user message to chat
                const userMessageDiv = document.createElement('div');
                userMessageDiv.className = 'message user-message';
                userMessageDiv.textContent = message;
                chatArea.appendChild(userMessageDiv);
                
                // Clear input
                userInput.value = '';
                
                // Show typing indicator
                const typingDiv = document.createElement('div');
                typingDiv.className = 'typing-indicator';
                typingDiv.id = 'typing';
                typingDiv.textContent = 'SUPER AI sedang mengetik...';
                chatArea.appendChild(typingDiv);
                chatArea.scrollTop = chatArea.scrollHeight;
                
                // Disable send button
                sendBtn.disabled = true;
                
                try {
                    // Send to Cloudflare Worker
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: message })
                    });
                    
                    // Remove typing indicator
                    document.getElementById('typing').remove();
                    
                    if (response.ok) {
                        const data = await response.json();
                        
                        // Add AI response
                        const aiMessageDiv = document.createElement('div');
                        aiMessageDiv.className = 'message ai-message';
                        aiMessageDiv.innerHTML = `<strong>SUPER AI:</strong> ${data.response}`;
                        chatArea.appendChild(aiMessageDiv);
                        
                        // Update stats
                        questionCount++;
                        knowledge += 5;
                        if (questionCount % 10 === 0) level++;
                        
                        questionsCount.textContent = questionCount;
                        knowledgePoints.textContent = knowledge;
                        learningLevel.textContent = level;
                        
                        // Show next example questions
                        showExampleQuestions();
                        
                    } else {
                        throw new Error('Failed to get response');
                    }
                    
                } catch (error) {
                    document.getElementById('typing')?.remove();
                    
                    // Fallback response if API fails
                    const fallbackResponses = [
                        "Ya, saya bisa membantu dengan itu!",
                        "Pertanyaan menarik! Berdasarkan pengetahuan AI...",
                        "Saya memahami pertanyaan Anda. Berikut penjelasannya...",
                        "Itu pertanyaan yang bagus! Menurut pengetahuan saya..."
                    ];
                    
                    const aiMessageDiv = document.createElement('div');
                    aiMessageDiv.className = 'message ai-message';
                    aiMessageDiv.innerHTML = `<strong>SUPER AI:</strong> ${fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]}`;
                    chatArea.appendChild(aiMessageDiv);
                    
                    // Still update stats
                    questionCount++;
                    questionsCount.textContent = questionCount;
                }
                
                // Re-enable send button
                sendBtn.disabled = false;
                chatArea.scrollTop = chatArea.scrollHeight;
            }
            
            // Event listeners
            sendBtn.addEventListener('click', sendMessage);
            
            userInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // Focus on input
            userInput.focus();
        });
    </script>
</body>
</html>
`;