// ============ PAGE INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    if(localStorage.getItem('fluentBharatLoggedIn') === 'true') {
        login();
    }
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatInput').value = transcript;
            toggleVoice();
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            toggleVoice();
        };
    }
    
    initializeVocabulary();
    initializeSettings();
});

// ============ LOGIN ============
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    
    document.getElementById('userName').textContent = email.split('@')[0];
    document.getElementById('userAvatar').textContent = email.charAt(0).toUpperCase();
    
    localStorage.setItem('fluentBharatLoggedIn', 'true');
    
    showPage('dashboardPage');
}

// ============ LOGOUT ============
function logout() {
    localStorage.removeItem('fluentBharatLoggedIn');
    location.reload();
}

// ============ PAGE NAVIGATION ============
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    document.getElementById(pageId).classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const titles = {
        'dashboardPage': { title: 'Dashboard', subtitle: 'Welcome back! Ready to practice today?' },
        'chatPage': { title: 'Practice Chat', subtitle: 'Chat with AI to improve your English fluency' },
        'vocabularyPage': { title: 'Vocabulary Builder', subtitle: 'Learn and practice new words daily' },
        'pronunciationPage': { title: 'Pronunciation Practice', subtitle: 'Improve your accent and speech clarity' },
        'subscriptionPage': { title: 'Subscription Plans', subtitle: 'Choose a plan that fits your learning goals' },
        'settingsPage': { title: 'Settings', subtitle: 'Customize your learning experience' }
    };
    
    if (titles[pageId]) {
        document.getElementById('pageTitle').textContent = titles[pageId].title;
        document.getElementById('pageSubtitle').textContent = titles[pageId].subtitle;
        
        const navItem = Array.from(document.querySelectorAll('.nav-item')).find(item => 
            item.getAttribute('onclick')?.includes(pageId)
        );
        if (navItem) navItem.classList.add('active');
    }
    
    currentPage = pageId;
}

// ============ CHAT ============
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addMessage(aiResponse, 'bot');
        speakResponse(aiResponse);
    }, 1000);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `message-${sender}`);
    
    const now = new Date();
    const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
    messageDiv.innerHTML = `
        ${text}
        <div class="message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes('hello') || userMessageLower.includes('hi')) {
        return "Hello! How are you today? I'm here to help you practice English.";
    }
    
    if (userMessageLower.includes('how are you')) {
        return "I'm doing great, thank you for asking! Ready to practice English with you.";
    }
    
    if (userMessageLower.includes('hobby') || userMessageLower.includes('hobbies')) {
        return "That's a great hobby! How long have you been doing it? What do you enjoy most about it?";
    }
    
    if (userMessageLower.includes('food') || userMessageLower.includes('eat')) {
        return "Food is a great topic! Can you describe the taste and how it's prepared?";
    }
    
    if (userMessageLower.includes('travel') || userMessageLower.includes('vacation')) {
        return "Traveling is wonderful! Where did you go and what was your favorite part of the trip?";
    }
    
    if (userMessageLower.includes('thank')) {
        return "You're welcome! Keep practicing and you'll continue to improve.";
    }
    
    const responses = [
        "That's interesting! Can you tell me more about that?",
        "Great point! How did that make you feel?",
        "I understand. What happened next?",
        "That's a good example. Can you think of another situation where this applies?",
        "Thanks for sharing! Let's practice using some related vocabulary: 'experience', 'situation', 'perspective'."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

function startTopic(topic) {
    document.getElementById('chatInput').value = topic;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// ============ VOICE ============
function toggleVoice() {
    const voiceBtn = document.getElementById('voiceBtn');
    
    if (!recognition) {
        alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
        return;
    }
    
    if (isListening) {
        recognition.stop();
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        isListening = false;
    } else {
        recognition.start();
        voiceBtn.classList.add('listening');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        isListening = true;
    }
}

function speakResponse(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

// ============ VOCABULARY ============
function initializeVocabulary() {
    const vocabularyData = [
        { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing", example: "She gave an eloquent speech at the conference." },
        { word: "Pragmatic", meaning: "Dealing with things sensibly and realistically", example: "His pragmatic approach solved the problem quickly." },
        { word: "Resilient", meaning: "Able to withstand or recover quickly from difficult conditions", example: "Children are often more resilient than adults." },
        { word: "Ubiquitous", meaning: "Present, appearing, or found everywhere", example: "Mobile phones have become ubiquitous in modern society." },
        { word: "Meticulous", meaning: "Showing great attention to detail; very careful and precise", example: "She was meticulous in her research." }
    ];
    
    const container = document.createElement('div');
    container.id = 'vocabularyPage';
    container.className = 'page hidden';
    container.innerHTML = `
        <div class="vocabulary-container">
            <div class="vocabulary-header">
                <h2>Today's Words</h2>
                <p>Learn 5 new words every day</p>
            </div>
            
            <div class="word-cards" id="wordCards">
                ${vocabularyData.map((word, index) => `
                    <div class="card word-card" onclick="showWordDetail(${index})">
                        <div class="word-header">
                            <h3>${word.word}</h3>
                            <span class="word-level">Intermediate</span>
                        </div>
                        <p>${word.meaning}</p>
                        <div class="word-actions">
                            <button class="btn btn-outline btn-sm" onclick="practiceWord('${word.word}', event)">
                                <i class="fas fa-volume-up"></i> Practice
                            </button>
                            <button class="btn btn-outline btn-sm" onclick="addToFlashcards('${word.word}', event)">
                                <i class="fas fa-plus"></i> Save
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="practice-section">
                <h3><i class="fas fa-gamepad"></i> Practice Exercises</h3>
                <div class="practice-cards">
                    <div class="card practice-card" onclick="startFlashcards()">
                        <h4><i class="fas fa-layer-group"></i> Flashcards</h4>
                        <p>Review saved words with flashcards</p>
                        <span class="badge">42 cards</span>
                    </div>
                    
                    <div class="card practice-card" onclick="startQuiz()">
                        <h4><i class="fas fa-question-circle"></i> Quiz</h4>
                        <p>Test your vocabulary knowledge</p>
                        <span class="badge">10 questions</span>
                    </div>
                    
                    <div class="card practice-card" onclick="startSentencePractice()">
                        <h4><i class="fas fa-comment-alt"></i> Sentences</h4>
                        <p>Practice using words in sentences</p>
                        <span class="badge">New</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.content-wrapper').appendChild(container);
}

function showWordDetail(index) {
    alert(`Word details for word #${index + 1}`);
}

function practiceWord(word, event) {
    event.stopPropagation();
    speakResponse(`The word is ${word}. Let's practice pronouncing it. ${word}. ${word}. Good job!`);
}

function addToFlashcards(word, event) {
    event.stopPropagation();
    alert(`"${word}" has been added to your flashcards!`);
}

function startFlashcards() {
    alert('Starting flashcards practice!');
}

function startQuiz() {
    alert('Starting vocabulary quiz!');
}

function startSentencePractice() {
    alert('Starting sentence practice!');
}

// ============ PRONUNCIATION ============
function initializePronunciation() {
    const container = document.createElement('div');
    container.id = 'pronunciationPage';
    container.className = 'page hidden';
    container.innerHTML = `
        <div class="pronunciation-container">
            <div class="pronunciation-stats">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fas fa-microphone-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>87%</h3>
                        <p>Overall Score</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-info">
                        <h3>24</h3>
                        <p>Sessions Completed</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-info">
                        <h3>+12%</h3>
                        <p>This Month</p>
                    </div>
                </div>
            </div>
            
            <div class="pronunciation-exercises">
                <h3><i class="fas fa-dumbbell"></i> Practice Exercises</h3>
                
                <div class="exercise-card card" onclick="startMinimalPairs()">
                    <div class="exercise-icon">
                        <i class="fas fa-exchange-alt"></i>
                    </div>
                    <div class="exercise-content">
                        <h4>Minimal Pairs</h4>
                        <p>Practice similar sounding words like "ship" and "sheep"</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 75%"></div>
                        </div>
                    </div>
                    <button class="btn btn-primary">Start</button>
                </div>
                
                <div class="exercise-card card" onclick="startTongueTwisters()">
                    <div class="exercise-icon">
                        <i class="fas fa-language"></i>
                    </div>
                    <div class="exercise-content">
                        <h4>Tongue Twisters</h4>
                        <p>Improve articulation with fun tongue twisters</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 60%"></div>
                        </div>
                    </div>
                    <button class="btn btn-primary">Start</button>
                </div>
                
                <div class="exercise-card card" onclick="startSentenceStress()">
                    <div class="exercise-icon">
                        <i class="fas fa-volume-up"></i>
                    </div>
                    <div class="exercise-content">
                        <h4>Sentence Stress</h4>
                        <p>Learn where to place emphasis in sentences</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 45%"></div>
                        </div>
                    </div>
                    <button class="btn btn-primary">Start</button>
                </div>
            </div>
            
            <div class="pronunciation-history">
                <h3><i class="fas fa-history"></i> Recent Practice</h3>
                <div class="history-list">
                    <div class="history-item">
                        <div class="history-icon success">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="history-content">
                            <h4>Vowel Sounds</h4>
                            <p>Completed just now • Score: 92%</p>
                        </div>
                    </div>
                    
                    <div class="history-item">
                        <div class="history-icon warning">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div class="history-content">
                            <h4>Consonant Clusters</h4>
                            <p>2 hours ago • Score: 78%</p>
                        </div>
                    </div>
                    
                    <div class="history-item">
                        <div class="history-icon success">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="history-content">
                            <h4>Intonation Practice</h4>
                            <p>Yesterday • Score: 85%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.content-wrapper').appendChild(container);
}

function startMinimalPairs() {
    alert('Starting Minimal Pairs practice!');
}

function startTongueTwisters() {
    alert('Starting Tongue Twisters practice!');
}

function startSentenceStress() {
    alert('Starting Sentence Stress practice!');
}

// ============ SETTINGS ============
function initializeSettings() {
    const container = document.createElement('div');
    container.id = 'settingsPage';
    container.className = 'page hidden';
    container.innerHTML = `
        <div class="settings-container">
            <div class="settings-section">
                <h3><i class="fas fa-user-cog"></i> Profile Settings</h3>
                
                <div class="settings-group">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" class="form-control" id="fullName" value="John Smith" placeholder="Enter your full name">
                    </div>
                    
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" class="form-control" id="userEmail" value="john@example.com" placeholder="Enter your email">
                    </div>
                    
                    <div class="form-group">
                        <label>Native Language</label>
                        <select class="form-control" id="nativeLanguage">
                            <option value="hindi" selected>Hindi</option>
                            <option value="tamil">Tamil</option>
                            <option value="telugu">Telugu</option>
                            <option value="bengali">Bengali</option>
                            <option value="marathi">Marathi</option>
                            <option value="gujarati">Gujarati</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="saveProfile()">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </div>
            
            <div class="settings-section">
                <h3><i class="fas fa-bell"></i> Notifications</h3>
                
                <div class="settings-group">
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Daily Reminders</h4>
                            <p>Get notified to practice daily</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="dailyReminders" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Progress Reports</h4>
                            <p>Weekly progress updates</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="progressReports" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>New Features</h4>
                            <p>Notifications about new features</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="featureUpdates" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="settings-section">
                <h3><i class="fas fa-volume-up"></i> Speech Settings</h3>
                
                <div class="settings-group">
                    <div class="form-group">
                        <label>AI Voice Speed</label>
                        <input type="range" id="voiceSpeed" min="0.5" max="1.5" step="0.1" value="0.9">
                        <div class="range-labels">
                            <span>Slow</span>
                            <span>Normal</span>
                            <span>Fast</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>AI Voice Pitch</label>
                        <input type="range" id="voicePitch" min="0.5" max="1.5" step="0.1" value="1.0">
                        <div class="range-labels">
                            <span>Low</span>
                            <span>Normal</span>
                            <span>High</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Voice Gender</label>
                        <select class="form-control" id="voiceGender">
                            <option value="female" selected>Female</option>
                            <option value="male">Male</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn btn-secondary" onclick="testVoiceSettings()">
                    <i class="fas fa-play"></i> Test Voice
                </button>
            </div>
            
            <div class="settings-section danger">
                <h3><i class="fas fa-exclamation-triangle"></i> Danger Zone</h3>
                
                <div class="settings-group">
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Delete Account</h4>
                            <p>Permanently delete your account and all data</p>
                        </div>
                        <button class="btn btn-danger" onclick="deleteAccount()">
                            <i class="fas fa-trash"></i> Delete Account
                        </button>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Reset Progress</h4>
                            <p>Reset all your learning progress</p>
                        </div>
                        <button class="btn btn-outline" onclick="resetProgress()">
                            <i class="fas fa-redo"></i> Reset Progress
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.content-wrapper').appendChild(container);
}

function saveProfile() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('userEmail').value;
    const language = document.getElementById('nativeLanguage').value;
    
    alert(`Profile saved!\nName: ${fullName}\nEmail: ${email}\nNative Language: ${language}`);
}

function testVoiceSettings() {
    const speed = document.getElementById('voiceSpeed').value;
    const pitch = document.getElementById('voicePitch').value;
    const gender = document.getElementById('voiceGender').value;
    
    const testMessage = `This is a test of the voice settings. Speed: ${speed}, Pitch: ${pitch}, Gender: ${gender}.`;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(testMessage);
        utterance.lang = 'en-IN';
        utterance.rate = parseFloat(speed);
        utterance.pitch = parseFloat(pitch);
        speechSynthesis.speak(utterance);
    }
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        alert('Account deletion requested. This feature would be implemented in a real application.');
    }
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
        alert('Progress reset requested. This feature would be implemented in a real application.');
    }
}

// ============ ANIMATIONS ============
setTimeout(() => {
    if (document.getElementById('dashboardPage') && !document.getElementById('dashboardPage').classList.contains('hidden')) {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    }
}, 500);

// Initialize pages that need DOM elements
setTimeout(() => {
    initializePronunciation();
}, 100);