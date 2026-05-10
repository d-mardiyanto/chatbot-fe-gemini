import { GoogleGenAI } from 'https://esm.sh/@google/genai';

// Initialize Gemini
let ai;
const API_KEY = window.CHIBI_CONFIG.apiKey;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

// UI Elements
const chatToggle = document.getElementById('chat-toggle');
const chatBox = document.getElementById('chat-box');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const typingIndicator = document.getElementById('typing-indicator');
const suggestionButtons = document.querySelectorAll('.suggestion-btn');

// State
let isChatOpen = false;

// Chat Logic
function toggleChat() {
  isChatOpen = !isChatOpen;
  chatBox.classList.toggle('translate-y-full', !isChatOpen);
  chatBox.classList.toggle('opacity-0', !isChatOpen);
  chatBox.classList.toggle('pointer-events-none', !isChatOpen);
}

function addMessage(text, isUser = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`;
  
  const inner = document.createElement('div');
  inner.className = `max-w-[80%] px-4 py-2 ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`;
  inner.textContent = text;
  
  msgDiv.appendChild(inner);
  chatMessages.appendChild(msgDiv);
  
  // Auto scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleSendMessage(text) {
  if (!text.trim()) return;
  
  addMessage(text, true);
  chatInput.value = '';
  
  if (!ai) {
    addMessage("I'm sorry, I'm not connected to my brain right now! Please check the API key.");
    return;
  }
  
  // Show typing
  typingIndicator.classList.remove('hidden');
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction: "You are Chibi, a cute 3D AI assistant mascot. You are friendly, helpful, and speak with a slightly playful and optimistic tone. You keep your answers concise and engaging. Use emojis occasionally. Your branding is light blue and white."
      }
    });
    
    const aiText = response.text;
    
    typingIndicator.classList.add('hidden');
    addMessage(aiText || "I'm drawing a blank! Can you say that again?", false);
  } catch (error) {
    console.error('Gemini Error:', error);
    typingIndicator.classList.add('hidden');
    addMessage("Oops! Something went wrong in my circuits. Try again?");
  }
}

// Event Listeners
chatToggle.addEventListener('click', toggleChat);
chatClose.addEventListener('click', toggleChat);

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSendMessage(chatInput.value);
});

suggestionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    handleSendMessage(btn.textContent);
  });
});

// Scroll Animations
function handleReveal() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const revealTop = el.getBoundingClientRect().top;
    const revealPoint = 150;
    
    if (revealTop < windowHeight - revealPoint) {
      el.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleReveal);
window.addEventListener('load', handleReveal);

// Mascot Floating Animation (handled by CSS, but can add JS interactive bits here if needed)
console.log("ChibiAI Initialized 🤖✨");
