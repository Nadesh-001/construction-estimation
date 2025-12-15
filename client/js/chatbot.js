// ===================================
// AI CHATBOT
// ===================================

// Chatbot state
let chatbotOpen = false;
let messageHistory = [];

// Knowledge base for construction-related queries
const knowledgeBase = {
    services: [
        "We offer comprehensive construction services including:",
        "• Residential Construction",
        "• Commercial Projects",
        "• Architectural Design",
        "• Project Management",
        "• Cost Estimation",
        "• Interior Design"
    ],
    costs: [
        "Our construction costs vary by quality:",
        "• Normal: ₹1,200/sq.ft",
        "• Standard: ₹1,500/sq.ft",
        "• High-End: ₹2,000/sq.ft",
        "• Luxury: ₹2,500/sq.ft",
        "",
        "Use our calculators above for detailed estimates!"
    ],
    materials: [
        "Current material prices (approximate):",
        "• Cement: ₹400/bag",
        "• Steel: ₹65/kg",
        "• Bricks: ₹8/piece",
        "• Sand: ₹50/ton",
        "• Aggregate: ₹60/ton",
        "",
        "Prices vary by location. Use our calculators for accurate estimates."
    ],
    timeline: [
        "Typical construction timeline:",
        "• 1000 sq.ft: 6-8 months",
        "• 2000 sq.ft: 10-12 months",
        "• 3000+ sq.ft: 12-18 months",
        "",
        "Timeline depends on design complexity and weather conditions."
    ],
    contact: [
        "Get in touch with us:",
        "📱 WhatsApp: +91 6374698498",
        "📧 Email: arunarchitect4u@gmail.com",
        "🌐 Website: arunarchiconstructions.com",
        "📍 Location: 8°08'02.9\"N 77°27'17.6\"E"
    ],
    calculators: [
        "We have 6 different calculators:",
        "1. Construction Cost Calculator - Get overall project cost",
        "2. Concrete for Slabs - Calculate concrete requirements",
        "3. Raw Material Calculator - Estimate all materials",
        "4. Paints Calculator - Calculate paint requirements",
        "5. Ready Mix Calculator - RMC volume calculation",
        "6. Detailed Cost Breakdown - Complete project analysis",
        "",
        "Scroll up to use any calculator!"
    ],
    quality: [
        "We offer 4 quality levels:",
        "",
        "🏠 Normal (₹1,200/sq.ft):",
        "Basic construction with standard materials",
        "",
        "🏡 Standard (₹1,500/sq.ft):",
        "Good quality with better finishes",
        "",
        "🏘️ High-End (₹2,000/sq.ft):",
        "Premium materials and finishes",
        "",
        "🏰 Luxury (₹2,500/sq.ft):",
        "Top-tier materials and custom design"
    ],
    default: [
        "I'm here to help with construction-related questions!",
        "",
        "You can ask me about:",
        "• Our services",
        "• Construction costs",
        "• Material prices",
        "• Project timeline",
        "• How to use calculators",
        "• Contact information"
    ]
};

// ===================================
// INITIALIZE CHATBOT
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    setupChatbot();
});

function setupChatbot() {
    const toggleButton = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');

    if (toggleButton) {
        toggleButton.addEventListener('click', toggleChatbot);
    }
}

// ===================================
// TOGGLE CHATBOT
// ===================================

function toggleChatbot() {
    const chatWindow = document.getElementById('chatbot-window');
    chatbotOpen = !chatbotOpen;

    if (chatbotOpen) {
        chatWindow.classList.add('active');
        document.getElementById('chatbot-input-field').focus();
    } else {
        chatWindow.classList.remove('active');
    }
}

// ===================================
// SEND MESSAGE
// ===================================

function sendMessage() {
    const input = document.getElementById('chatbot-input-field');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');

    // Clear input
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Generate response after delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000); // Random delay 1-2 seconds
}

// ===================================
// SEND QUICK REPLY
// ===================================

function sendQuickReply(message) {
    // Add user message
    addMessage(message, 'user');

    // Show typing indicator
    showTypingIndicator();

    // Generate response after delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, 'bot');
    }, 800);
}

// ===================================
// ADD MESSAGE
// ===================================

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatbot-messages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';

    // Handle multi-line responses
    if (Array.isArray(text)) {
        content.innerHTML = text.join('<br>');
    } else {
        content.textContent = text;
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store in history
    messageHistory.push({ type, text, timestamp: new Date() });
}

// ===================================
// TYPING INDICATOR
// ===================================

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    content.appendChild(indicator);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// ===================================
// GENERATE RESPONSE
// ===================================

function generateResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check for keywords and return appropriate response
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you')) {
        return knowledgeBase.services;
    }

    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('rate')) {
        return knowledgeBase.costs;
    }

    if (lowerMessage.includes('material') || lowerMessage.includes('cement') || lowerMessage.includes('steel')) {
        return knowledgeBase.materials;
    }

    if (lowerMessage.includes('time') || lowerMessage.includes('duration') || lowerMessage.includes('how long')) {
        return knowledgeBase.timeline;
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
        return knowledgeBase.contact;
    }

    if (lowerMessage.includes('calculator') || lowerMessage.includes('calculate') || lowerMessage.includes('estimate')) {
        return knowledgeBase.calculators;
    }

    if (lowerMessage.includes('quality') || lowerMessage.includes('normal') || lowerMessage.includes('standard') || lowerMessage.includes('luxury')) {
        return knowledgeBase.quality;
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return [
            "Hello! 👋 Welcome to Arun Architecture & Constructions!",
            "",
            "I'm here to help you with:",
            "• Construction cost estimates",
            "• Material pricing",
            "• Project information",
            "• Using our calculators",
            "",
            "What would you like to know?"
        ];
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return [
            "You're welcome! 😊",
            "",
            "Feel free to ask if you have any other questions about construction or our services.",
            "",
            "You can also:",
            "• Use our calculators above",
            "• Contact us directly",
            "• Create an account to save estimates"
        ];
    }

    if (lowerMessage.includes('help')) {
        return knowledgeBase.default;
    }

    // Default response with suggestions
    return [
        "I'm not sure I understand that question. Let me help you!",
        "",
        "You can ask me about:",
        "• 'What are your services?'",
        "• 'How much does construction cost?'",
        "• 'What are material prices?'",
        "• 'How to calculate costs?'",
        "• 'How to contact you?'",
        "",
        "Or use the quick reply buttons below!"
    ];
}

// ===================================
// HANDLE ENTER KEY
// ===================================

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}

// Make functions globally available
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.sendQuickReply = sendQuickReply;
window.handleChatKeyPress = handleChatKeyPress;
