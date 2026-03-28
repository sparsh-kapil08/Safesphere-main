/* ============================================
   SAFESPHERE - VANILLA JAVASCRIPT
   ============================================ */

// ============================================
// TOAST NOTIFICATIONS
// ============================================
import supabase from './Supabase.js';

// Define the ML API URL. For Vite, use import.meta.env with VITE_ prefix.
// Create a .env file in your project root and add:
// VITE_ML_API_URL=http://your-api-url.com
const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

class Toast {
    static show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 300ms ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// Add slideOutRight animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    /* Police Map Styles */
    .live-map-police {
        height: 450px;
        width: 100%;
        border-radius: 16px;
        overflow: hidden;
        background: #2d3748;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .live-map-police .map-container {
        height: 100%;
        width: 100%;
    }
    /* Police Map Marker Styles */
    .incident-marker { border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 2px 8px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
    .incident-marker.critical { background-color: #ef4444; }
    .incident-marker.high { background-color: #f97316; }
    .incident-marker.medium { background-color: #f59e0b; }
    .incident-marker.low { background-color: #10b981; }
    /* Guardian Map Marker Styles */
    .location-pin-guardian {
        position: relative;
        width: 40px;
        height: 40px;
    }
    .location-pin-guardian img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    .ping-animation-guardian {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        background: rgba(99, 102, 241, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: guardian-ping 1.5s ease-out infinite;
    }
    @keyframes guardian-ping { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } }
    .auth-shell {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
    }
    .auth-card {
        width: 100%;
        max-width: 460px;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.16);
        border: 1px solid #e2e8f0;
        padding: 22px;
    }
    .auth-tabs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 14px;
    }
    .auth-tab {
        border: 1px solid #cbd5e1;
        background: #f8fafc;
        color: #0f172a;
        border-radius: 10px;
        padding: 10px;
        font-weight: 600;
        cursor: pointer;
    }
    .auth-tab.active {
        border-color: #0ea5e9;
        background: #e0f2fe;
        color: #0c4a6e;
    }
    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .auth-form input,
    .auth-form select {
        width: 100%;
        padding: 12px;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        font-size: 14px;
        background: #fff;
    }
    .auth-submit {
        border: 0;
        border-radius: 10px;
        padding: 12px;
        font-weight: 700;
        color: #fff;
        background: linear-gradient(135deg, #0284c7, #0ea5e9);
        cursor: pointer;
    }
    .auth-submit:disabled {
        opacity: 0.7;
        cursor: wait;
    }
`;
document.head.appendChild(style);

// ============================================
// CHAT WIDGET - COMPLETE REWRITE
// ============================================

class ChatWidget {
    constructor() {
        // Get all DOM elements
        this.widget = document.querySelector('.chat-widget');
        this.trigger = document.getElementById('chatTrigger');
        this.container = document.getElementById('chatContainer');
        this.widget = document.getElementById('chatdiv');
        this.closeBtn = document.getElementById('chatClose');
        this.messagesContainer = document.getElementById('chatMessages');
        this.inputField = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSend');
        
        // Verify all elements exist
        if (!this.trigger || !this.container || !this.closeBtn || !this.messagesContainer) {
            console.error('❌ Chat Widget: Missing required elements');
            console.log('Elements:', {
                trigger: !!this.trigger,
                container: !!this.container,
                closeBtn: !!this.closeBtn,
                messagesContainer: !!this.messagesContainer
            });
            return;
        }

        // Initialize event listeners
        this.attachEventListeners();
        console.log('✅ Chat Widget: Initialized successfully');
        console.log('Widget container:', this.container);
    }

    attachEventListeners() {
        // Main trigger button
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleChat();
        });

        // Close button
        this.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeChat();
        });

        // Send button
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSendMessage();
            });
        }

        // Enter key in input
        if (this.inputField) {
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
        }

        // Quick prompts
        document.querySelectorAll('.quick-prompt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const prompt = btn.textContent.trim();
                this.sendMessageWithText(prompt);
            });
        });

        // Close chat when clicking outside the widget
        document.addEventListener('click', (e) => {
            // Only close if chat is open and click is outside
            if (this.isOpen && this.widget && !this.widget.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {

            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        console.log('Opening chat...');
        console.log('Before: container classes =', this.container.className);
        
        // Only manipulate what's needed
        this.container.classList.add('open');
        this.trigger.classList.add('hidden');
        
        console.log('After: container classes =', this.container.className);
        console.log('Computed style opacity:', window.getComputedStyle(this.container).opacity);
        console.log('Computed style visibility:', window.getComputedStyle(this.container).visibility);
        
        // Delay focus to ensure smooth animation
        setTimeout(() => {
            if (this.inputField) {
                this.inputField.focus();
            }
        }, 300);

        console.log('✅ Chat opened');
    }

    closeChat() {
        this.isOpen = false;
        console.log('Closing chat...');
        
        // Remove open class from container
        this.container.classList.remove('open');
        // Show trigger button again
        this.trigger.classList.remove('hidden');
        
        console.log('✅ Chat closed');
    }

    handleSendMessage() {
        const text = this.inputField ? this.inputField.value.trim() : '';
        if (!text) return;
        
        this.sendMessageWithText(text);
    }

    sendMessageWithText(text) {
        // Add user message
        this.addMessage(text, 'user');
        
        // Clear input
        if (this.inputField) {
            this.inputField.value = '';
        }

        // Simulate bot typing indicator
        this.addMessage('Typing...', 'bot-typing');

        // Generate and send bot response
        setTimeout(() => {
            // Remove typing indicator
            const typingMsg = this.messagesContainer.querySelector('.bot-typing-message');
            if (typingMsg) typingMsg.remove();
            
            // Add bot response
            const response = this.generateBotResponse(text);
            this.addMessage(response, 'bot');
        }, 1200);
    }

    addMessage(text, sender) {
        if (!this.messagesContainer) return;

        const messageWrapper = document.createElement('div');
        messageWrapper.className = `message-wrapper ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;

        const messageBubble = document.createElement('div');
        messageBubble.className = `message-bubble ${sender}-message`;
        
        // Handle multi-line text
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            if (line.trim()) {
                const p = document.createElement('p');
                p.textContent = line;
                messageBubble.appendChild(p);
                if (index < lines.length - 1) {
                    messageBubble.appendChild(document.createElement('br'));
                }
            }
        });

        messageWrapper.appendChild(messageBubble);
        this.messagesContainer.appendChild(messageWrapper);
        
        // Auto-scroll to bottom
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 0);
    }

    generateBotResponse(userMessage) {
        const msg = userMessage.toLowerCase();

        // Safety emergency responses
        if (/unsafe|danger|threat|abuse|hit|attack|violence/i.test(msg)) {
            return "🚨 EMERGENCY PROTOCOL ACTIVATED\n\n✓ Sharing location with trusted contacts\n✓ Alerting nearby authorities\n✓ Recording incident\n\nStay safe. Press SOS for immediate help.";
        }

        // Following/stalking
        if (/follow|stalking|stalker|being followed|tail|pursuit/i.test(msg)) {
            return "⚠️ IMMEDIATE ACTION NEEDED\n\n✓ Move to crowded public area\n✓ Call Police: India (100), USA (911), UK (999)\n✓ Alert trusted contacts\n\nDo not confront. Stay visible in public.";
        }

        // Legal help
        if (/legal|law|rights|court|fir|complaint|justice/i.test(msg)) {
            return "⚖️ YOUR LEGAL RIGHTS\n\n1. File FIR (First Information Report)\n2. Protection Order from courts\n3. Restraining order against stalker\n4. Evidence collection is your right\n5. Self-defense is legal\n\nContact: Legal Aid Cell (toll-free)";
        }

        // Emergency services
        if (/emergency|police|ambulance|hospital|911|112/i.test(msg)) {
            return "🚨 EMERGENCY CONTACTS\n\n🇮🇳 India:\n• Police: 100\n• Ambulance: 102\n• Women Helpline: 1091\n\n🇺🇸 USA: 911\n🇬🇧 UK: 999\n🇪🇺 EU: 112";
        }

        // Emotional support
        if (/afraid|scared|fear|anxiety|panic|stress|depressed/i.test(msg)) {
            return "💪 YOUR FEELINGS ARE VALID\n\n✓ You're not alone\n✓ Trust your instincts\n✓ Talk to someone you trust\n✓ Professional help is available\n\nHotlines:\n• AASRA: 9820466726\n• iCall: 9152987821";
        }

        // Self-defense
        if (/defense|self-defense|protect|safety/i.test(msg)) {
            return "🛡️ SAFETY & SELF-DEFENSE\n\n✓ Take self-defense classes\n✓ Carry whistle/keychain\n✓ Trust your gut feeling\n✓ Stay alert, aware\n✓ Plan escape routes\n\nOur app features:\n• Safe route planning\n• Nearby help finder\n• Live location sharing";
        }

        // Help/support general
        if (/help|assist|support|guide|advice/i.test(msg)) {
            return "🤝 HOW CAN I HELP?\n\n📍 Route Safety\n🗺️ Find Nearby Help\n🆘 Emergency Contacts\n⚖️ Legal Information\n🛡️ Self-Defense Tips\n💪 Emotional Support\n📚 Educational Resources\n\nWhat do you need?";
        }

        // Mental health
        if (/mental|health|counseling|therapy|depression/i.test(msg)) {
            return "🧠 MENTAL HEALTH SUPPORT\n\n✓ Therapy & counseling\n✓ Support groups\n✓ Meditation resources\n✓ Hotlines & chat support\n\nFree Resources:\n• MyIndianFamily.com\n• Psychology Today (therapist finder)";
        }

        // Default response
        return "👋 I'm Sakhi, your safety AI assistant.\n\nI can help with:\n🆘 Emergencies\n⚖️ Legal Rights\n📍 Safe Routes\n🛡️ Self-Defense\n💪 Emotional Support\n\nWhat's on your mind?";
    }
}

// ============================================
// VIDEO RECORDER - SOS INCIDENT RECORDING
// ============================================

class VideoRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.stream = null;
        this.isRecording = false;
        this.recordingStartTime = null;
        this.recordingDuration = 0;
    }

    /**
     * Start video recording from device camera
     * @returns {Promise<boolean>} True if recording started successfully
     */
    async startRecording() {
        try {
            // Request access to camera and microphone
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: true
            });

            const mimeType = this.getSupportedMimeType();
            if (!mimeType) {
                throw new Error('No supported MIME type for video recording');
            }

            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: mimeType
            });

            this.recordedChunks = [];
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onerror = (event) => {
                console.error('❌ Recording error:', event.error);
                Toast.show('Recording error: ' + event.error, 'error');
            };

            this.mediaRecorder.start();
            console.log('✅ Video recording started');
            return true;

        } catch (error) {
            console.error('❌ Failed to start recording:', error);
            
            if (error.name === 'NotAllowedError') {
                Toast.show('Camera/Microphone access denied. Enable permissions in settings.', 'error');
            } else if (error.name === 'NotFoundError') {
                Toast.show('No camera/microphone found on this device', 'error');
            } else {
                Toast.show('Failed to access camera: ' + error.message, 'error');
            }
            
            return false;
        }
    }

    /**
     * Stop video recording and return the blob
     * @returns {Promise<Blob|null>} Video blob or null if failed
     */
    async stopRecording() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                resolve(null);
                return;
            }

            this.mediaRecorder.onstop = () => {
                // Stop all tracks
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }

                // Create blob from recorded chunks
                const mimeType = this.mediaRecorder.mimeType;
                const blob = new Blob(this.recordedChunks, { type: mimeType });

                this.isRecording = false;
                this.recordingDuration = Date.now() - this.recordingStartTime;

                console.log(`✅ Recording stopped. Duration: ${(this.recordingDuration / 1000).toFixed(2)}s, Size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }

    /**
     * Get supported MIME type for video recording
     * @returns {string|null} Supported MIME type
     */
    getSupportedMimeType() {
        const types = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=h264,opus',
            'video/webm',
            'video/mp4'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return null;
    }

    /**
     * Get current recording status
     */
    getStatus() {
        return {
            isRecording: this.isRecording,
            duration: this.recordingDuration,
            durationFormatted: this.formatDuration(this.recordingDuration)
        };
    }

    /**
     * Format milliseconds to readable format
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// ============================================
// ACTION CARDS & SOS BUTTON
// ============================================

class ActionHandler {
    static init() {
        // Action cards
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                ActionHandler.handleAction(action);
            });
        });

        // SOS Button
        const sosButton = document.getElementById('sosButton');
        if (sosButton) {
            sosButton.addEventListener('click', () => ActionHandler.triggerSOS());
        }
    }

    static handleAction(action) {
        const messages = {
            call: '☎️ Calling Emergency Services (911)...',
            location: '📍 Location Shared with emergency contacts!',
            voice: '🎤 Voice SOS Recording Started...',
            'fake-call': '☎️ Fake Call Initiated...'
        };

        Toast.show(messages[action] || 'Action triggered', 'info');
    }

    static triggerSOS() {
        // Launch video recording modal instead of immediately sending
        ActionHandler.openVideoRecordingModal();
    }

    static openVideoRecordingModal() {
        Toast.show('🎥 Opening SOS Video Recording...', 'info');
        
        const app = document.getElementById('app') || document.body;
        
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'video-recording-modal active';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 300ms ease-out;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 24px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 300ms ease-out;
            ">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #ef4444; font-size: 24px;">🚨 SOS RECORDING</h2>
                    <button class="video-close-btn" style="
                        background: none;
                        border: none;
                        font-size: 28px;
                        cursor: pointer;
                        color: #666;
                        padding: 0;
                    ">✕</button>
                </div>

                <!-- Instructions -->
                <div style="
                    background: #fef2f2;
                    border-left: 4px solid #ef4444;
                    padding: 12px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #666;
                ">
                    <strong>⚠️ Important:</strong> Record the threat/incident. Your video will be analyzed by our threat detection AI and the incident will be saved to your record.
                </div>

                <!-- Video Feed -->
                <video id="video-preview" style="
                    width: 100%;
                    background: #000;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    aspect-ratio: 16/9;
                    object-fit: cover;
                " playsinline autoplay muted></video>

                <!-- Timer Display -->
                <div id="recording-timer" style="
                    text-align: center;
                    font-size: 32px;
                    font-weight: bold;
                    color: #10b981;
                    margin-bottom: 16px;
                    display: none;
                    font-family: monospace;
                ">00:00</div>

                <!-- Status Message -->
                <div id="recording-status" style="
                    text-align: center;
                    font-size: 14px;
                    color: #ef4444;
                    margin-bottom: 16px;
                    font-weight: 500;
                ">Ready to record</div>

                <!-- Controls -->
                <div style="display: flex; gap: 12px;">
                    <button id="start-recording-btn" style="
                        flex: 1;
                        background: #ef4444;
                        color: white;
                        border: none;
                        padding: 14px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 200ms;
                    ">🎥 START RECORDING</button>
                    <button id="stop-recording-btn" style="
                        flex: 1;
                        background: #10b981;
                        color: white;
                        border: none;
                        padding: 14px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 200ms;
                        display: none;
                    ">⏹️ STOP & SEND</button>
                </div>

                <!-- Cancel -->
                <button id="cancel-recording-btn" style="
                    width: 100%;
                    background: #e5e7eb;
                    color: #666;
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-top: 12px;
                    transition: all 200ms;
                ">CANCEL</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize video recorder
        const recorder = new VideoRecorder();
        let timerInterval = null;
        let recordingInProgress = false;

        // Get elements
        const videoPreview = modal.querySelector('#video-preview');
        const startBtn = modal.querySelector('#start-recording-btn');
        const stopBtn = modal.querySelector('#stop-recording-btn');
        const cancelBtn = modal.querySelector('#cancel-recording-btn');
        const closeBtn = modal.querySelector('.video-close-btn');
        const timerDisplay = modal.querySelector('#recording-timer');
        const statusDisplay = modal.querySelector('#recording-status');

        // Start Recording
        startBtn.addEventListener('click', async () => {
            const success = await recorder.startRecording();
            if (success) {
                recordingInProgress = true;
                
                // Show video preview
                videoPreview.srcObject = recorder.stream;
                
                // Update UI
                startBtn.style.display = 'none';
                stopBtn.style.display = 'block';
                timerDisplay.style.display = 'block';
                statusDisplay.textContent = '🔴 RECORDING IN PROGRESS';
                statusDisplay.style.color = '#ef4444';

                // Start timer
                timerInterval = setInterval(() => {
                    const status = recorder.getStatus();
                    timerDisplay.textContent = status.durationFormatted;
                }, 100);

                Toast.show('🔴 Recording started - speak clearly about the incident', 'success');
            }
        });

        // Stop Recording
        stopBtn.addEventListener('click', async () => {
            if (timerInterval) clearInterval(timerInterval);
            
            stopBtn.disabled = true;
            statusDisplay.textContent = '⏳ Processing video...';
            statusDisplay.style.color = '#f59e0b';

            // Stop recording
            const videoBlob = await recorder.stopRecording();

            if (!videoBlob) {
                statusDisplay.textContent = 'Failed to record video';
                statusDisplay.style.color = '#ef4444';
                stopBtn.disabled = false;
                return;
            }

            // Send to backend
            recordingInProgress = false;
            await ActionHandler.sendSOSWithVideo(videoBlob, recorder);
            
            // Close modal
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            if (recordingInProgress) {
                recorder.stopRecording().then(blob => {
                    if (blob) {
                        console.log('Recording discarded');
                    }
                });
            }
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
            Toast.show('SOS recording cancelled', 'info');
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            cancelBtn.click();
        });

        // Add keyframe animations
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .video-recording-modal.active {
                animation: fadeIn 300ms ease-out;
            }
        `;
        document.head.appendChild(styleTag);
    }

    static async sendSOSWithVideo(videoBlob, recorder) {
        Toast.show('📤 Uploading video to threat detection...', 'info');
        
        try {
            // Get location
            const location = await new Promise((resolve) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                        () => resolve({ lat: 0, lng: 0 })
                    );
                } else {
                    resolve({ lat: 0, lng: 0 });
                }
            });

            // Create FormData for multipart upload
            const formData = new FormData();
            formData.append('video', videoBlob, 'sos_recording.webm');
            formData.append('type', 'SOS');
            formData.append('latitude', location.lat);
            formData.append('longitude', location.lng);
            formData.append('duration_seconds', Math.floor(recorder.recordingDuration / 1000));

            // Upload to backend
            const response = await fetch(`${ML_API_URL}/api/sos-video`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                Toast.show('✅ SOS Alert sent! Video being analyzed...', 'success', 5000);
                console.log('SOS Response:', result);
            } else {
                Toast.show('⚠️ SOS sent, but video processing encountered an error', 'error', 4000);
            }

        } catch (error) {
            console.error('Error sending SOS video:', error);
            Toast.show('❌ Failed to send SOS: ' + error.message, 'error', 5000);
        }
    }

    static async sendVoiceSOS(voiceText) {
        Toast.show('🚨 Voice SOS detected! Sending alert...', 'error', 5000);
        console.log(`🚨 Voice SOS detected! Sending alert for text: "${voiceText}"`);
        
        try {
            // Get location
            const location = await new Promise((resolve) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
                        () => resolve({ lat: 0, lng: 0, accuracy: 0 }) // Fallback
                    );
                } else {
                    resolve({ lat: 0, lng: 0, accuracy: 0 }); // Fallback
                }
            });

            // Create SOS payload for /api/sos
            const sosData = {
                type: 'Voice SOS',
                details: `Voice SOS Detected: "${voiceText}"`,
                location: {
                    lat: location.lat,
                    lng: location.lng
                },
                severity: 'CRITICAL'
            };

            // Send to backend /api/sos endpoint
            const response = await fetch(`${ML_API_URL}/api/sos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sosData)
            });

            const result = await response.json();

            if (response.ok) {
                Toast.show(`✅ Voice SOS Alert sent! Incident ID: ${result.incident_id}`, 'success', 5000);
                console.log('Voice SOS Response:', result);
            } else {
                Toast.show(`⚠️ SOS sent, but backend reported an error: ${result.detail || 'Unknown error'}`, 'error', 5000);
                console.error('Backend error on voice SOS:', result);
            }
        } catch (error) {
            console.error('Error sending Voice SOS:', error);
            Toast.show('❌ Failed to send Voice SOS: ' + error.message, 'error', 5000);
        }
    }
}

// ============================================
// VOICE SECURITY AI
// ============================================

class VoiceSecurity {
    static init() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Voice SOS: Web Speech API not supported in this browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log('🎙️ Voice SOS: Microphone active. Listening for keywords (e.g., "help me")...');
        };

        recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const text = event.results[last][0].transcript.toLowerCase().trim();
            console.log(`👂 Voice SOS Heard: "${text}"`);

            if (text.includes('help me') || text.includes('save me') || text.includes('emergency') || text.includes('threatening')) {
                console.warn(`🚨 Voice SOS: Threat detected ("${text}")! Sending alert directly...`);
                ActionHandler.sendVoiceSOS(text);
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') return;
            console.error('Voice SOS Error:', event.error);
            if (event.error === 'not-allowed') {
                console.warn('Voice SOS: Microphone permission denied. Please enable microphone access.');
                Toast.show('⚠️ Enable microphone for Voice SOS', 'warning');
            }
        };

        recognition.onend = () => {
            console.log('🎙️ Voice SOS: Session ended. Restarting...');
            try {
                recognition.start();
            } catch (e) {
                // Ignore errors if already started
            }
        };

        // Attempt to start immediately
        console.log('🎙️ Voice SOS: Initializing...');
        try {
            recognition.start();
        } catch (e) {
            console.error('Voice SOS: Failed to start:', e);
        }
        
        window.voiceSecurity = recognition;
    }
}

// ============================================
// SMOOTH SCROLLING
// ============================================

class SmoothScroll {
    static init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// RESPONSIVE MENU
// ============================================

class MenuHandler {
    static init() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navbarLinks = document.querySelector('.navbar-links');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navbarLinks.style.display = navbarLinks.style.display === 'flex' ? 'none' : 'flex';
            });
        }
    }
}

// ============================================
// INITIALIZE ALL
// ============================================

try {
    console.log('⏳ Initializing SafeSphere...');
    
    // Initialize chat widget
    new ChatWidget();
    console.log('✅ Chat widget ready');

    // Initialize action handlers
    ActionHandler.init();
    console.log('✅ Actions ready');

    // Initialize smooth scrolling
    SmoothScroll.init();
    console.log('✅ Navigation ready');

    // Initialize responsive menu
    MenuHandler.init();
    console.log('✅ Menu ready');

    // Initialize Voice Security

    // Ensure an application container exists for role pages
    if (!document.getElementById('app')) {
        const app = document.createElement('div');
        app.id = 'app';
        document.body.appendChild(app);
    }

    // ============================================
    // INLINE DASHBOARD PAGES
    // ============================================

    // USER DASHBOARD
    const UserPage = {
        init(params = {}) {
            const app = document.getElementById('app');
            const currentProfile = window.__safesphere_profile || null;
            const authUser = window.__safesphere_auth_user || null;
            const profileName = currentProfile && currentProfile.full_name ? currentProfile.full_name.trim() : '';
            const metaName = authUser && authUser.user_metadata && authUser.user_metadata.full_name ? authUser.user_metadata.full_name.trim() : '';
            const emailPrefix = authUser && authUser.email ? authUser.email.split('@')[0] : '';
            const greetingName = (profileName || metaName || emailPrefix || 'User').replace(/[<>]/g, '');
            const Role = window.__safesphere_role || 'user';
            let sosActive = false;
            let threatDetected = false;

            // Show threat after 5 seconds for demo
            setTimeout(() => {
                threatDetected = true;
                updateThreatAlert();
            }, 5000);

            function updateThreatAlert() {
                const threatAlert = app.querySelector('.threat-alert');
                if (threatAlert) {
                    if (threatDetected) {
                        threatAlert.style.display = 'flex';
                        threatAlert.style.animation = 'slideDown 400ms ease-out';
                    } else {
                        threatAlert.style.opacity = '0';
                        setTimeout(() => {
                            threatAlert.style.display = 'none';
                        }, 300);
                    }
                }
            }

            app.innerHTML = `
                <div class="user-dashboard-wrapper">
                    <!-- Background Ambience -->
                    <div class="dashboard-background">
                        <div class="bg-blob bg-blob-1"></div>
                        <div class="bg-blob bg-blob-2"></div>
                    </div>
                            <!-- Emergency Actions -->
        <section class="emergency-actions">
            <div class="section-header">
                <h2>Emergency Actions</h2>
                <div class="divider"></div>
            </div>

            <div class="actions-grid">
                <div class="action-card" data-action="call">
                    <div class="action-icon accent-red">☎️</div>
                    <p class="action-title">Call Emergency</p>
                </div>
                <div class="action-card" data-action="location">
                    <div class="action-icon accent-blue">📍</div>
                    <p class="action-title">Share Location</p>
                </div>
                <div class="action-card" data-action="voice">
                    <div class="action-icon accent-orange">🎤</div>
                    <p class="action-title">Voice SOS</p>
                </div>
                <div class="action-card" data-action="fake-call">
                    <div class="action-icon accent-purple">☎️</div>
                    <p class="action-title">Fake Call</p>
                </div>
            </div>
        </section>


                    <!-- Main Content -->
                    <main class="user-main-content">
                        <!-- Greeting Section -->
                        <div class="user-greeting">
                            <h1>Hi, <span class="text-highlight">${greetingName}</span></h1>
                            <p>You are in a <span class="safe-zone-badge">Safe Zone</span></p>
                        </div>

                        <!-- Threat Alert Banner -->
                        <div class="threat-alert" style="display: ${threatDetected ? 'flex' : 'none'}">
                            <div class="threat-alert-bar"></div>
                            <div class="threat-icon">⚠️</div>
                            <div class="threat-content">
                                <h3>Threat Detected Nearby</h3>
                                <p>Loud noise detected 200m ahead. Recommending alternative route.</p>
                                <div class="threat-actions">
                                    <button class="btn-avoid">Avoid Area</button>
                                    <button class="btn-dismiss" id="dismiss-threat">Dismiss</button>
                                </div>
                            </div>
                        </div>

                        <!-- SOS Button Section -->
                        <div class="sos-section">
                            ${sosActive ? '<div class="ripple ripple-1"></div><div class="ripple ripple-2"></div>' : ''}
                            <button class="sos-button ${sosActive ? 'active' : ''}" id="sos-btn">
                                <div class="sos-content">
                                    <span class="sos-text">${sosActive ? 'SOS' : 'SOS'}</span>
                                    <span class="sos-subtext">${sosActive ? 'SENDING ALERT...' : 'HOLD 3 SEC'}</span>
                                </div>
                                ${!sosActive ? '<div class="sos-ring"></div>' : ''}
                            </button>
                            <p class="sos-message">${sosActive ? 'Notifying Emergency Contacts & Police...' : 'Tap for Emergency Assistance'}</p>
                        </div>

                        <!-- Feature Cards -->
                        <div class="feature-cards-grid">
                            <!-- Safe Route Card -->
                            <div class="feature-card feature-card-blue" data-feature="safe-route">
                                <div class="feature-icon">🧭</div>
                                <h3>Safe Route</h3>
                                <p>AI-powered safest path to destination</p>
                            </div>

                            <!-- Fake Call Card -->
                            <div class="feature-card feature-card-purple" data-feature="fake-call">
                                <div class="feature-icon">☎️</div>
                                <h3>Fake Call</h3>
                                <p>Simulate an incoming call instantly</p>
                            </div>

                            <!-- Threat Map Card -->
                            <div class="feature-card feature-card-wide feature-card-orange" data-feature="threat-map">
                                <div class="feature-icon-group">
                                    <div class="feature-icon-large">📍</div>
                                    <div class="feature-info">
                                        <h3>Threat Map</h3>
                                        <p>2 reports near your location</p>
                                    </div>
                                </div>
                                <div class="feature-alert-badge">⚠️</div>
                                <div class="feature-card-pattern"></div>
                            </div>
                        </div>
                    </main>

                    <!-- Bottom Navigation -->
                    <nav class="bottom-nav">
                        <button class="nav-btn nav-btn-active">🏠</button>
                        <button class="nav-btn">📍</button>
                        <button class="nav-btn">👥</button>
                        <button class="nav-btn">🎤</button>
                    </nav>
                </div>
            `;

            // Event listeners
            const sosBtn = document.getElementById('sos-btn');
            sosBtn?.addEventListener('click', () => {
                // Trigger video recording for SOS
                ActionHandler.triggerSOS();
            });

            const dismissBtn = document.getElementById('dismiss-threat');
            dismissBtn?.addEventListener('click', () => {
                threatDetected = false;
                updateThreatAlert();
                Toast.show('✓ Threat alert dismissed', 'info');
            });

            const avoidBtn = app.querySelector('.btn-avoid');
            avoidBtn?.addEventListener('click', () => {
                Toast.show('📍 Alternative route calculated', 'info');
            });

            // Feature card clicks (event delegation)
            const featureGrid = app.querySelector('.feature-cards-grid');
            featureGrid?.addEventListener('click', (e) => {
                const card = e.target.closest('.feature-card');
                if (!card) return;

                const feature = card.dataset.feature;
                const title = card.querySelector('h3')?.textContent || 'Feature';

                switch (feature) {
                    case 'threat-map':
                        console.log('Threat map card clicked');
                        UserPage.openThreatMap();
                        break;
                    case 'safe-route':
                        // Placeholder for safe route functionality
                        UserPage.openSafeRouteModal();
                        break;
                    case 'fake-call':
                         // Placeholder for fake call functionality
                        Toast.show(`✓ ${title} activated`, 'info');
                        break;
                    default:
                        Toast.show(`✓ ${title} activated`, 'info');
                        break;
                }
            });

            // Nav button clicks
            const navBtns = app.querySelectorAll('.nav-btn');
            navBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    navBtns.forEach(b => b.classList.remove('nav-btn-active'));
                    btn.classList.add('nav-btn-active');
                });
            });
        },

        openThreatMap() {
            console.log('openThreatMap called');
            const app = document.getElementById('app');
            
            // Create heatmap modal
            const modal = document.createElement('div');
            modal.className = 'heatmap-modal active';
            modal.innerHTML = `
                <div class="heatmap-container">
                    <div class="heatmap-header">
                        <h2>Threat Map</h2>
                        <button class="heatmap-close" id="heatmap-close">✕</button>
                    </div>
                    <div class="heatmap-content">
                        <div id="heatmap" class="heatmap-canvas"></div>
                        <div class="heatmap-legend">
                            <h4>Threat Levels</h4>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #ffff00;"></div>
                                <span>Low</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #ff9900;"></div>
                                <span>Medium</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #ff3300;"></div>
                                <span>High</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #990000;"></div>
                                <span>Critical</span>
                            </div>
                        </div>
                    </div>
                    <div class="heatmap-footer">
                        <p class="threat-count">Loading threats...</p>
                    </div>
                </div>
            `;
            
            app.appendChild(modal);
            console.log('Heatmap modal appended to the DOM');
            
            // Close button handler
            const closeBtn = modal.querySelector('#heatmap-close');
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            });
            
            // Load threat data and initialize map
            this.initThreatMap(modal);
        },

        openSafeRouteModal() {
            const app = document.getElementById('app');
            
            const modal = document.createElement('div');
            modal.className = 'heatmap-modal active';
            modal.innerHTML = `
                <div class="heatmap-container">
                    <div class="heatmap-header">
                        <h2>🧭 Safe Route Finder</h2>
                        <button class="heatmap-close" id="route-close">✕</button>
                    </div>
                    <div class="heatmap-content" style="display: flex; flex-direction: column; gap: 10px; height: 100%;">
                        <div class="route-input-group" style="display: flex; gap: 10px; padding: 10px; background: #fff; z-index: 1000;">
                            <input type="text" id="route-dest" placeholder="Enter destination (e.g. Central Park)" style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #ccc; font-size: 16px;">
                            <button id="route-go" style="background: #6366f1; color: white; border: none; padding: 0 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">GO</button>
                        </div>
                        <div id="route-map" class="heatmap-canvas" style="flex: 1; min-height: 400px; border-radius: 8px;"></div>
                        <div class="route-stats" style="padding: 15px; background: #f3f4f6; border-radius: 8px; display: none;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <h4 style="margin: 0;">Route Analysis</h4>
                                <span id="safety-badge" class="safe-zone-badge" style="font-size: 12px;">CALCULATING</span>
                            </div>
                            <p id="route-msg" style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Analyzing threat patterns...</p>
                        </div>
                    </div>
                </div>
            `;
            
            app.appendChild(modal);
            
            const closeBtn = modal.querySelector('#route-close');
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            });

            // Initialize map
            this.initSafeRouteMap(modal);
        },

        initSafeRouteMap(modal) {
            if (!navigator.geolocation) {
                Toast.show('Geolocation not supported', 'error');
                return;
            }

            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                const mapContainer = modal.querySelector('#route-map');
                const map = L.map(mapContainer).setView([userLat, userLng], 14);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(map);
                
                // User marker
                const userMarker = L.circleMarker([userLat, userLng], {
                    radius: 8,
                    fillColor: '#6366f1',
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 1
                }).addTo(map).bindPopup('Start Location');

                // Handle Go button
                const goBtn = modal.querySelector('#route-go');
                const input = modal.querySelector('#route-dest');
                const stats = modal.querySelector('.route-stats');
                const msg = modal.querySelector('#route-msg');
                const badge = modal.querySelector('#safety-badge');

                let routeLayer = null;
                let destMarker = null;
                let threatLayer = L.layerGroup().addTo(map);

                goBtn.addEventListener('click', async () => {
                    const query = input.value.trim();
                    if (!query) return;

                    goBtn.textContent = '...';
                    goBtn.disabled = true;
                    stats.style.display = 'block';
                    msg.textContent = 'Geocoding destination...';

                    try {
                        // 1. Geocode
                        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                        const geoData = await geoRes.json();
                        
                        if (!geoData || geoData.length === 0) {
                            throw new Error('Location not found');
                        }

                        const destLat = parseFloat(geoData[0].lat);
                        const destLng = parseFloat(geoData[0].lon);

                        // Update map bounds
                        if (destMarker) map.removeLayer(destMarker);
                        destMarker = L.marker([destLat, destLng]).addTo(map).bindPopup(geoData[0].display_name);
                        
                        const group = new L.featureGroup([userMarker, destMarker]);
                        map.fitBounds(group.getBounds().pad(0.2));

                        msg.textContent = 'Calculating safest route via AI...';

                        // 2. Call Backend API
                        const apiRes = await fetch(`${ML_API_URL}/route/calculate`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                start_lat: userLat,
                                start_lng: userLng,
                                end_lat: destLat,
                                end_lng: destLng
                            })
                        });
                        
                        const routeData = await apiRes.json();
                        console.log('Route API response:', apiRes.status, routeData);

                        if (routeData.success && routeData.route) {
                            if (routeLayer) map.removeLayer(routeLayer);
                            threatLayer.clearLayers();
                            
                            // Draw route
                            const coords = routeData.route.geometry.coordinates.map(c => [c[1], c[0]]); // GeoJSON is lng,lat -> Leaflet lat,lng
                            
                            // Determine safety score (backend uses `safety_score` 0.0-1.0)
                            const safetyScore = (routeData.route && routeData.route.safety_score) || routeData.safety_score || 1.0;
                            // Color: green (safe), amber (moderate), red (danger)
                            let color = '#10b981';
                            if (safetyScore < 0.4) color = '#ef4444';
                            else if (safetyScore < 0.7) color = '#f59e0b';
                            
                            routeLayer = L.polyline(coords, {
                                color: color,
                                weight: 5,
                                opacity: 0.8,
                                lineCap: 'round'
                            }).addTo(map);

                            // Draw threats (backend may return `threats`, `threats_near_route`, or `threat_details`)
                            const threats = routeData.threats || routeData.threats_near_route || (routeData.threat_details ? (Array.isArray(routeData.threat_details) ? routeData.threat_details : [routeData.threat_details]) : []);
                            if (threats && threats.length > 0) {
                                threats.forEach(threat => {
                                    const tLat = threat.latitude;
                                    const tLng = threat.longitude;
                                    const level = (threat.threat_level || threat.threatLevel || 'MEDIUM').toUpperCase();
                                    let tColor = '#f59e0b';
                                    if (level === 'HIGH' || level === 'CRITICAL') tColor = '#ef4444';
                                    const radiusKm = threat.radius_km || threat.radiusKm || 0.8;
                                    L.circle([tLat, tLng], {
                                        color: tColor,
                                        fillColor: tColor,
                                        fillOpacity: 0.18,
                                        radius: (radiusKm * 1000),
                                        weight: 1
                                    }).addTo(threatLayer).bindPopup(`
                                        <strong>${level} THREAT</strong><br>
                                        ${threat.behavior_summary || threat.summary || 'Suspicious activity'}
                                    `);
                                });
                            }

                            // Update UI
                            badge.textContent = routeData.routing_mode || 'SAFE';
                            badge.style.background = color;
                            msg.innerHTML = `
                                <strong>Best Route Found</strong><br>
                                Safety Score: ${Math.round((safetyScore || 0) * 100)}%<br>
                                Analyzed ${routeData.routes_analyzed || routeData.alternatives_analyzed || 1} alternatives.<br>
                                Avoiding identified threat zones.
                            `;
                        } else {
                            // Log detailed backend response for debugging
                            console.warn('Safe route not available:', routeData);
                            // If backend provided an error payload, log specifics
                            if (routeData && routeData.error) {
                                console.error('Route calculation error:', routeData.error, routeData.message || '', routeData.threats_blocking || routeData.threats_near_route || routeData.threat_details || null);
                            } else if (routeData && routeData.threats_blocking) {
                                console.info('Threats blocking routes:', routeData.threats_blocking);
                            }

                            msg.textContent = 'Could not calculate a safe route.';
                            // Optionally show recommendation if backend provided it
                            if (routeData && routeData.recommendations && Array.isArray(routeData.recommendations)) {
                                msg.innerHTML += '<br><small>' + routeData.recommendations.join(' · ') + '</small>';
                            }
                        }

                    } catch (error) {
                        console.error(error);
                        msg.textContent = 'Error: ' + error.message;
                        Toast.show('Route calculation failed', 'error');
                    } finally {
                        goBtn.textContent = 'GO';
                        goBtn.disabled = false;
                    }
                });

            }, (err) => {
                Toast.show('Location access denied', 'error');
            });
        },

        initThreatMap(modal) {
            console.log('initThreatMap called');
            // Get user location
            if (navigator.geolocation) {
                console.log('Geolocation is available, trying to get position...');
                navigator.geolocation.getCurrentPosition(async (position) => {
                    console.log('Geolocation position received:', position);
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    
                    // Initialize Leaflet map
                    console.log('Initializing Leaflet map...');
                    const mapContainer = modal.querySelector('#heatmap');
                    const map = L.map(mapContainer).setView([userLat, userLng], 14);
                    console.log('Leaflet map initialized');
                    
                    // Add tile layer
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 19
                    }).addTo(map);
                    
                    // Add user location marker
                    L.circleMarker([userLat, userLng], {
                        radius: 8,
                        fillColor: '#8b5cf6',
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map).bindPopup('📍 Your Location');
                    
                    // Fetch threat data
                    const apiUrl = `${ML_API_URL}/heatmap/nearby?lat=${userLat}&lng=${userLng}&radius_km=5&limit=100`;
                    console.log('Fetching threat data from:', apiUrl);
                    try {
                        const response = await fetch(apiUrl);
                        console.log('Fetch response received:', response);
                        const data = await response.json();
                        console.log('Threat data received:', data);
                        
                        if (data.zones && data.zones.length > 0) {
                            console.log(`Found ${data.zones.length} threat zones`);
                            // Add circles for each threat zone
                            data.zones.forEach(zone => {
                                const intensity = Math.min(zone.weight || zone.avg || 0.5, 1);
                                const colors = ['#ffff00', '#ff9900', '#ff6600', '#ff3300', '#990000'];
                                const colorIndex = Math.floor(intensity * (colors.length - 1));
                                
                                L.circle([zone.lat, zone.lng], {
                                    radius: 100 + (intensity * 50),
                                    fillColor: colors[colorIndex],
                                    color: colors[colorIndex],
                                    weight: 1,
                                    opacity: 0.3,
                                    fillOpacity: 0.3 + (intensity * 0.4)
                                }).addTo(map).bindPopup(`
                                    <div style="font-size: 12px;">
                                        <strong>Threat Zone</strong><br>
                                        Incidents: ${zone.count}<br>
                                        Threat Level: ${(intensity * 100).toFixed(0)}%
                                    </div>
                                `);
                            });
                            
                            // Update threat count
                            const countElement = modal.querySelector('.threat-count');
                            if (countElement) {
                                countElement.textContent = `${data.zones.length} threat zone(s) detected within 5km`;
                            }
                        } else {
                            console.log('No threat zones detected in the area.');
                            const countElement = modal.querySelector('.threat-count');
                            if (countElement) {
                                countElement.textContent = '✓ No threats detected in your area';
                            }
                        }
                    } catch (error) {
                        console.error('Error loading threat data:', error);
                        const countElement = modal.querySelector('.threat-count');
                        if (countElement) {
                            countElement.textContent = 'Unable to load threat data';
                        }
                        Toast.show('⚠️ Could not load threat map data', 'error');
                    }
                }, (error) => {
                    console.error('Geolocation error:', error);
                    Toast.show('📍 Location access required for threat map', 'error');
                });
            } else {
                console.log('Geolocation is not supported by this browser.');
                Toast.show('📍 Geolocation not supported', 'error');
            }
        },

        teardown() {
            const app = document.getElementById('app');
            if (app) app.innerHTML = '';
        }
    };

    // GUARDIAN DASHBOARD
    const GuardianPage = {
        async init(params = {}) {
            const app = document.getElementById('app');
            
            // Fetch guardian data from the new JSON file
            let lovedOneData;
            try {
                const response = await fetch('./loved-one.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                lovedOneData = await response.json();
            } catch (error) {
                console.error("Could not load loved-one data:", error);
                Toast.show("Failed to load dashboard data.", "error");
                // Use fallback data
                lovedOneData = {
                    name: "Sarah Parker",
                    status: "Safe at Work",
                    location: { name: "Design District, 4th Ave", latitude: 40.7128, longitude: -74.0060 },
                    lastUpdate: "Just now",
                    battery: 85,
                    signal: "Strong",
                    isSafe: true,
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
                    timeline: [{ id: 1, time: "09:30 AM", event: "Arrived at Office", type: "safe" }],
                    alerts: [{ id: 1, type: "Route Deviation", time: "Yesterday", message: "Detour detected.", resolved: true }]
                };
            }

            const { name, status, location, lastUpdate, battery, signal, isSafe, avatar, timeline, alerts } = lovedOneData;

            app.innerHTML = `
                <div class="guardian-dashboard-container">
                    <!-- Header Greeting -->
                    <header class="guardian-header">
                        <h1>Hello, <span class="text-pink">Martha</span></h1>
                        <p>Here is ${name}'s activity for today.</p>
                    </header>

                    <div class="guardian-grid">
                        <!-- Left Column: Profile & Status -->
                        <div class="guardian-left-column">
                            <!-- Loved One Profile Card -->
                            <div class="profile-card">
                                <div class="profile-avatar">
                                    <img src="${avatar}" alt="${name}" />
                                </div>
                                <h2 class="profile-name">${name}</h2>
                                <div class="profile-status ${isSafe ? 'safe' : 'unsafe'}">
                                    <span class="status-dot"></span>
                                    ${status}
                                </div>

                                <!-- Vitals -->
                                <div class="vitals-section">
                                    <div class="vital">
                                        <span class="vital-icon">🔋</span>
                                        <span class="vital-value">${battery}%</span>
                                    </div>
                                    <div class="vital-divider"></div>
                                    <div class="vital">
                                        <span class="vital-icon">📶</span>
                                        <span class="vital-value">${signal}</span>
                                    </div>
                                    <div class="vital-divider"></div>
                                    <div class="vital">
                                        <span class="vital-icon">🕐</span>
                                        <span class="vital-value">${lastUpdate}</span>
                                    </div>
                                </div>

                                <!-- Quick Actions -->
                                <div class="quick-actions">
                                    <button class="action-btn message-btn" id="guardian-message">💬 Message</button>
                                    <button class="action-btn call-btn" id="guardian-call">☎️ Call</button>
                                    <button class="action-btn video-btn" id="guardian-video">🎥 Video Check-in</button>
                                </div>
                            </div>

                            <!-- Alert History -->
                            <div class="alert-history">
                                <h3>⚠️ Alert History</h3>
                                <div class="alerts-list">
                                    ${alerts.map(alert => `
                                        <div class="alert-item">
                                            <div class="alert-header">
                                                <span class="alert-type">${alert.type}</span>
                                                <span class="alert-time">${alert.time}</span>
                                            </div>
                                            <p class="alert-message">${alert.message}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="guardian-right-column">
                            <!-- Live Map Card -->
                            <div class="live-map-card">
                                <div class="map-container" id="guardian-live-map"></div>
                                <div class="map-controls">
                                    <button class="map-btn" id="guardian-map-recenter">📍</button>
                                </div>
                            </div>

                            <!-- Activity Timeline -->
                            <div class="activity-timeline">
                                <h3>Today's Journey</h3>
                                <div class="timeline-items">
                                    ${timeline.map((item, index) => `
                                        <div class="timeline-item" style="animation-delay: ${index * 100}ms">
                                            <div class="timeline-dot ${index === 0 ? 'active' : ''}"></div>
                                            <div class="timeline-content">
                                                <div class="timeline-header">
                                                    <h4>${item.event}</h4>
                                                    <span class="timeline-time">${item.time}</span>
                                                </div>
                                                ${index === 0 ? '<p class="timeline-status">Running on schedule. No anomalies detected.</p>' : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="view-history-btn">→ View Full History</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Initialize map after innerHTML is set
            this.initGuardianMap(location.latitude, location.longitude, name, avatar, status);

            // Attach event listeners
            document.getElementById('guardian-message')?.addEventListener('click', () => {
                Toast.show(`💬 Opening message to ${name}...`, 'info');
            });

            document.getElementById('guardian-call')?.addEventListener('click', () => {
                Toast.show(`☎️ Calling ${name}...`, 'info');
            });

            document.getElementById('guardian-video')?.addEventListener('click', () => {
                Toast.show('🎥 Starting video check-in...', 'info');
            });

            document.getElementById('guardian-map-recenter')?.addEventListener('click', () => {
                Toast.show('📍 Opening live map...', 'info');
            });
        },

        initGuardianMap(lat, lng, name, avatar, status) {
            const mapContainer = document.getElementById('guardian-live-map');
            if (!mapContainer) {
                console.error('Map container not found for guardian dashboard');
                return;
            }
            
            // Use requestAnimationFrame to ensure map initializes after DOM paint for better perceived speed
            requestAnimationFrame(() => {
                const map = L.map(mapContainer, {
                    zoomControl: false,
                    attributionControl: false,
                    preferCanvas: true // Use Canvas renderer for better performance
                }).setView([lat, lng], 15);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    crossOrigin: true, // Enable CORS for faster tile loading
                    maxZoom: 20
                }).addTo(map);

                const customIcon = L.divIcon({
                    className: 'custom-map-marker',
                    html: `<div class="location-pin-guardian"><div class="ping-animation-guardian"></div><img src="${avatar}" alt="${name}" /></div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                });

                L.marker([lat, lng], { icon: customIcon }).addTo(map)
                    .bindPopup(`<b>${name}</b><br>${status}`)
                    .openPopup();
                
                // Force a resize check to ensure tiles load correctly if container size was dynamic
                setTimeout(() => map.invalidateSize(), 200);
            });
        },

        teardown() {
            const app = document.getElementById('app');
            if (app) app.innerHTML = '';
        }
    };

    // POLICE DASHBOARD
    const PolicePage = {
        updateInterval: null,

        async init(params = {}) {
            const app = document.getElementById('app');
            
            let activeAlerts = [];
            try {
                const response = await fetch(`${ML_API_URL}/alerts/active`);
                const data = await response.json();
                if (data.alerts) {
                    activeAlerts = data.alerts.map(alert => ({
                        id: alert.id,
                        type: alert.type || 'SOS Emergency',
                        location: alert.latitude && alert.longitude ? `${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}` : 'Unknown Location',
                        time: new Date(alert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        details: alert.details || 'No details provided',
                        priority: alert.severity || 'CRITICAL',
                        status: alert.status || 'Active'
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch active alerts:', error);
                // Fallback data for demo if fetch fails
                activeAlerts = [
                    {
                        id: 1,
                        type: 'SOS Emergency',
                        location: 'Central Park, Near Boat House, NY',
                        time: 'Just now',
                        details: 'Panic button activated by user. Location tracking enabled. Ambient audio recording started.',
                        priority: 'High',
                        status: 'Active'
                    }
                ];
            }

            // Fetch total incidents count
            let totalIncidentsCount = 45;
            try {
                const response = await fetch(`${ML_API_URL}/incidents?limit=1000`);
                const data = await response.json();
                if (data.count !== undefined) {
                    totalIncidentsCount = data.count;
                }
            } catch (error) {
                console.error('Failed to fetch total incidents count:', error);
            }

            const recentLogs = [
                { id: 101, type: 'SOS Alert', location: 'Broadway St', time: '10:42 AM', details: 'User reported feeling unsafe. Patrol unit #42 responded.', status: 'Resolved' },
                { id: 102, type: 'Geofence Breach', location: 'Times Square', time: '09:15 AM', details: 'Child safety watch exited safe zone. Parent notified.', status: 'Resolved' },
                { id: 103, type: 'SOS Alert', location: 'Brooklyn Bridge', time: 'Yesterday', details: 'Accidental trigger confirmed by user call.', status: 'False Alarm' },
            ];

            const stats = {
                activeUnits: 12,
                totalIncidents: totalIncidentsCount,
                avgResponse: '4m 30s'
            };

            app.innerHTML = `
                <div class="police-dashboard-wrapper">
                    <!-- Sidebar Navigation -->
                    <nav class="police-sidebar">
                        <div class="sidebar-logo">🛡️</div>
                        <div class="sidebar-icons">
                            <button class="nav-icon active">📡</button>
                            <button class="nav-icon">📍</button>
                            <button class="nav-icon">👥</button>
                            <button class="nav-icon">📊</button>
                        </div>
                        <div class="sidebar-profile">
                            <img src="https://ui-avatars.com/api/?name=Officer&background=0D8ABC&color=fff" alt="Officer" />
                        </div>
                    </nav>

                    <!-- Main Content -->
                    <main class="police-main">
                        <!-- Header -->
                        <header class="police-header">
                            <div class="header-left">
                                <span class="header-badge">Officer Dashboard</span>
                                <h1>Command Center</h1>
                                <p>Real-time monitoring and dispatch interface</p>
                            </div>
                            <div class="header-right">
                                <div class="status-indicator">
                                    <span class="status-pulse"></span>
                                    System Operational
                                </div>
                                <button class="notification-btn" id="police-notifications">
                                    🔔
                                    <span class="notification-dot"></span>
                                </button>
                            </div>
                        </header>

                        <!-- Stats Grid -->
                        <div class="stats-grid">
                            <div class="stat-card stat-blue">
                                <div class="stat-icon">👥</div>
                                <div class="stat-content">
                                    <p class="stat-label">Active Patrol Units</p>
                                    <h3 class="stat-value">${stats.activeUnits}</h3>
                                    <span class="stat-trend">+2 deployed</span>
                                </div>
                            </div>
                            <div class="stat-card stat-orange">
                                <div class="stat-icon">⚠️</div>
                                <div class="stat-content">
                                    <p class="stat-label">Total Incidents Today</p>
                                    <h3 class="stat-value">${stats.totalIncidents}</h3>
                                    <span class="stat-trend">High volume alert</span>
                                </div>
                            </div>
                            <div class="stat-card stat-green">
                                <div class="stat-icon">⏱️</div>
                                <div class="stat-content">
                                    <p class="stat-label">Avg Response Time</p>
                                    <h3 class="stat-value">${stats.avgResponse}</h3>
                                    <span class="stat-trend">30s faster than avg</span>
                                </div>
                            </div>
                        </div>

                        <!-- Main Content Grid -->
                        <div class="police-content-grid">
                            <!-- Left: Map & Alerts -->
                            <div class="police-main-feed">
                                <!-- Live Map -->
                                <section class="live-map-police">
                                    <div id="police-live-map" class="map-container"></div>
                                </section>

                                <!-- Active Alerts -->
                                <section class="alerts-section">
                                    <h2 class="alerts-title">
                                        <span class="alerts-icon">🚨</span>
                                        Live Critical Alerts
                                        <span class="alerts-count">${activeAlerts.length} Active</span>
                                    </h2>
                                    <div class="alerts-list">
                                        ${activeAlerts.map((alert, index) => `
                                            <div class="alert-card alert-${alert.priority.toLowerCase()}" style="animation-delay: ${index * 100}ms">
                                                <div class="alert-icon alert-icon-${alert.priority.toLowerCase()}">
                                                    ${alert.type.includes('Voice') ? '📻' : alert.type.includes('Route') ? '📍' : '🚨'}
                                                </div>
                                                <div class="alert-content">
                                                    <div class="alert-header-line">
                                                        <h3 class="alert-type">${alert.type}</h3>
                                                        <span class="alert-priority alert-priority-${alert.priority.toLowerCase()}">${alert.priority} Priority</span>
                                                    </div>
                                                    <div class="alert-details-box">
                                                        <span class="details-label">Incident Details:</span>
                                                        <p class="details-text">"${alert.details}"</p>
                                                    </div>
                                                    <div class="alert-meta">
                                                        <span class="meta-item">📍 ${alert.location}</span>
                                                        <span class="meta-item">🕐 ${alert.time}</span>
                                                    </div>
                                                </div>
                                                <div class="alert-actions">
                                                    <button class="btn-dispatch alert-btn-${alert.priority.toLowerCase()}">
                                                        📡 Dispatch Unit
                                                    </button>
                                                    <button class="btn-contact">☎️ Contact User</button>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </section>
                            </div>

                            <!-- Right Sidebar -->
                            <aside class="police-sidebar-right">
                                <!-- Quick Actions -->
                                <section class="quick-actions">
                                    <button class="quick-action-btn qa-indigo">📡<span>Broadcast Alert</span></button>
                                    <button class="quick-action-btn qa-slate">📍<span>Unit Map</span></button>
                                    <button class="quick-action-btn qa-blue">📊<span>Generate Report</span></button>
                                    <button class="quick-action-btn qa-gray">⚙️<span>Settings</span></button>
                                </section>

                                <!-- Recent Logs -->
                                <section class="recent-logs">
                                    <div class="logs-header">
                                        <h2>Recent Logs</h2>
                                        <button class="view-all-btn">View All</button>
                                    </div>
                                    <div class="logs-list">
                                        <div class="logs-timeline"></div>
                                        ${recentLogs.map((log) => `
                                            <div class="log-item">
                                                <div class="log-dot log-${log.status.toLowerCase().replace(' ', '-')}"></div>
                                                <div class="log-content">
                                                    <div class="log-header">
                                                        <span class="log-type">${log.type}</span>
                                                        <span class="log-status log-status-${log.status.toLowerCase().replace(' ', '-')}">${log.status}</span>
                                                    </div>
                                                    <p class="log-details">${log.details}</p>
                                                    <div class="log-footer">
                                                        <span class="log-location">${log.location}</span>
                                                        <span class="log-time">${log.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </section>
                            </aside>
                        </div>
                    </main>
                </div>
            `;

            // Event listeners
            document.getElementById('police-notifications')?.addEventListener('click', () => {
                Toast.show('🔔 Notification center opened', 'info');
            });

            const dispatchButtons = app.querySelectorAll('.btn-dispatch');
            dispatchButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    Toast.show('📡 Dispatching patrol unit...', 'success');
                });
            });

            const contactButtons = app.querySelectorAll('.btn-contact');
            contactButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    Toast.show('☎️ Calling user...', 'info');
                });
            });

            const quickActionButtons = app.querySelectorAll('.quick-action-btn');
            quickActionButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Find the specific button - look for "Generate Report" text or qa-blue class
                    if (btn.classList.contains('qa-blue') || btn.textContent.includes('Generate Report')) {
                        PolicePage.openGenerateReportModal();
                    } else {
                        Toast.show('⚡ Action triggered', 'info');
                    }
                });
            });

            // Initialize the map
            this.initPoliceMap();

            // Start live updates
            this.startLiveUpdates();
        },

        async initPoliceMap() {
            const mapContainer = document.getElementById('police-live-map');
            if (!mapContainer) {
                console.error('Police map container not found');
                return;
            }

            // Default center for the map
            const centerLat = 28.7128;
            const centerLng = 77.0060;

            const map = L.map(mapContainer, {
                zoomControl: false,
                attributionControl: false,
                preferCanvas: true
            }).setView([centerLat, centerLng], 12);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom: 20
            }).addTo(map);

            // Fetch ALL incidents (not just nearby)
            try {
                const response = await fetch(`${ML_API_URL}/incidents?limit=500`);
                const data = await response.json();

                if (data.incidents && data.incidents.length > 0) {
                    // Create feature group to auto-fit bounds
                    const featureGroup = L.featureGroup();

                    data.incidents.forEach(incident => {
                        if (incident.latitude && incident.longitude) {
                            const level = (incident.threat_level || 'low').toLowerCase();
                            const iconHtml = `<div class="incident-marker ${level}">${level.charAt(0).toUpperCase()}</div>`;
                            
                            const customIcon = L.divIcon({
                                className: 'custom-map-icon',
                                html: iconHtml,
                                iconSize: [30, 30],
                                iconAnchor: [15, 15]
                            });

                            const marker = L.marker([incident.latitude, incident.longitude], { icon: customIcon })
                                .bindPopup(`<b>${incident.threat_level} Threat</b><br>${incident.behavior_summary || 'No details'}<br><small>ID: ${incident.incident_id}</small>`);
                            
                            featureGroup.addLayer(marker);
                        }
                    });

                    // Add feature group to map
                    featureGroup.addTo(map);

                    // Auto-fit map to show all incidents
                    if (featureGroup.getLayers().length > 0) {
                        map.fitBounds(featureGroup.getBounds().pad(0.1));
                    }

                    Toast.show(`📍 Loaded ${data.incidents.length} incidents on the map.`, 'success');
                } else {
                    Toast.show('No incidents in the system.', 'info');
                }
            } catch (error) {
                console.error('Failed to load incidents for police map:', error);
                Toast.show('Could not load incident data.', 'error');
            }
        },

        startLiveUpdates() {
            if (this.updateInterval) clearInterval(this.updateInterval);
            this.updateInterval = setInterval(() => this.updateDashboard(), 5000);
        },

        async updateDashboard() {
            try {
                // Update Alerts Count
                const alertsRes = await fetch(`${ML_API_URL}/alerts/active`);
                const alertsData = await alertsRes.json();
                
                if (alertsData.alerts) {
                    const countSpan = document.querySelector('.alerts-count');
                    if (countSpan) countSpan.textContent = `${alertsData.alerts.length} Active`;
                }

                // Update Total Incidents Stat
                const incidentsRes = await fetch(`${ML_API_URL}/incidents?limit=1000`);
                const incidentsData = await incidentsRes.json();
                if (incidentsData.count !== undefined) {
                    const statValues = document.querySelectorAll('.stat-value');
                    // Total incidents is the second stat card (index 1)
                    if (statValues[1]) statValues[1].textContent = incidentsData.count;
                }
            } catch (e) {
                console.error('Dashboard update error:', e);
            }
        },

        openGenerateReportModal() {
            Toast.show('📋 Opening incident report form...', 'info');
            
            const modal = document.createElement('div');
            modal.className = 'incident-report-modal active';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                animation: fadeIn 300ms ease-out;
                overflow-y: auto;
            `;

            modal.innerHTML = `
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    max-width: 700px;
                    width: 90%;
                    margin: 20px auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: slideUp 300ms ease-out;
                ">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px;">
                        <h2 style="margin: 0; color: #1f2937; font-size: 24px;">📋 Generate Incident Report</h2>
                        <button class="incident-close-btn" style="
                            background: none;
                            border: none;
                            font-size: 28px;
                            cursor: pointer;
                            color: #666;
                            padding: 0;
                        ">✕</button>
                    </div>

                    <!-- Form -->
                    <form id="incident-report-form" style="display: flex; flex-direction: column; gap: 16px;">
                        
                        <!-- Row 1: Threat Level & Score -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Threat Level *</label>
                                <select name="threat_level" required style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #d1d5db;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    background: white;
                                    cursor: pointer;
                                ">
                                    <option value="">Select threat level</option>
                                    <option value="LOW">LOW</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="CRITICAL">CRITICAL</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Threat Score (0-1) *</label>
                                <input type="number" name="threat_score" min="0" max="1" step="0.01" required placeholder="0.5" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #d1d5db;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                " />
                            </div>
                        </div>

                        <!-- Row 2: Location -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Latitude *</label>
                                <input type="number" name="latitude" step="0.0001" required placeholder="28.7128" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #d1d5db;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                " />
                            </div>
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Longitude *</label>
                                <input type="number" name="longitude" step="0.0001" required placeholder="77.0060" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #d1d5db;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                " />
                            </div>
                        </div>

                        <!-- Row 3: People & Weapons -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">People Count</label>
                                <input type="number" name="people_count" min="0" placeholder="0" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #d1d5db;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                " />
                            </div>
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Weapon Detected</label>
                                <select name="weapon_detected" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #d1d5db;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    background: white;
                                    cursor: pointer;
                                ">
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Is Critical</label>
                                <select name="is_critical" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #d1d5db;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    background: white;
                                    cursor: pointer;
                                ">
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                        </div>

                        <!-- Row 4: Weapon Types -->
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Weapon Types (if applicable)</label>
                            <input type="text" name="weapon_types" placeholder="e.g., Gun, Knife, Explosives" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #d1d5db;
                                border-radius: 6px;
                                font-size: 14px;
                                box-sizing: border-box;
                            " />
                        </div>

                        <!-- Row 5: Behavior Summary -->
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Behavior Summary *</label>
                            <textarea name="behavior_summary" required placeholder="Describe the incident, suspicious behavior, or threat..." style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #d1d5db;
                                border-radius: 6px;
                                font-size: 14px;
                                box-sizing: border-box;
                                min-height: 100px;
                                resize: vertical;
                            "></textarea>
                        </div>

                        <!-- Row 6: Source & Mode -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Source ID</label>
                                <input type="text" name="source_id" placeholder="e.g., Officer Name or ID" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #d1d5db;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                " />
                            </div>
                            <div>
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Mode (Detection Method)</label>
                                <select name="mode" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #d1d5db;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    background: white;
                                    cursor: pointer;
                                ">
                                    <option value="">Select mode</option>
                                    <option value="MANUAL_REPORT">Manual Report</option>
                                    <option value="SOS">SOS Alert</option>
                                    <option value="VIDEO_ANALYSIS">Video Analysis</option>
                                    <option value="PATROL_OBSERVATION">Patrol Observation</option>
                                    <option value="CITIZEN_REPORT">Citizen Report</option>
                                </select>
                            </div>
                        </div>

                        <!-- Row 7: Severity -->
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Severity</label>
                            <select name="severity" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #d1d5db;
                                border-radius: 6px;
                                font-size: 14px;
                                background: white;
                                cursor: pointer;
                            ">
                                <option value="">Select severity</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        <!-- Row 8: Location Accuracy -->
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #1f2937;">Location Accuracy (meters)</label>
                            <input type="number" name="location_accuracy_m" min="0" placeholder="50" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #d1d5db;
                                border-radius: 6px;
                                font-size: 14px;
                                box-sizing: border-box;
                            " />
                        </div>

                        <!-- Submit & Cancel -->
                        <div style="display: flex; gap: 12px; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                            <button type="submit" style="
                                flex: 1;
                                background: #0ea5e9;
                                color: white;
                                border: none;
                                padding: 12px;
                                border-radius: 8px;
                                font-size: 16px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 200ms;
                            ">✅ Submit Report</button>
                            <button type="button" id="cancel-report-btn" style="
                                flex: 1;
                                background: #e5e7eb;
                                color: #666;
                                border: none;
                                padding: 12px;
                                border-radius: 8px;
                                font-size: 16px;
                                cursor: pointer;
                                transition: all 200ms;
                            ">Cancel</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Get form and buttons
            const form = modal.querySelector('#incident-report-form');
            const closeBtn = modal.querySelector('.incident-close-btn');
            const cancelBtn = modal.querySelector('#cancel-report-btn');

            // Close modal handler
            const closeModal = () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            };

            // Form submission
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Collect form data
                const formData = new FormData(form);
                
                // Generate incident_id if not provided
                const incidentId = `INC_${new Date().toISOString().replace(/[:\-T.Z]/g, '').slice(0, 14)}_${Math.floor(Math.random() * 10000)}`;
                
                // Get weapon types and convert to array
                const weaponTypesStr = formData.get('weapon_types') || '';
                const weaponTypesArray = weaponTypesStr.trim() ? weaponTypesStr.split(',').map(w => w.trim()).filter(w => w) : [];
                
                const incidentData = {
                    incident_id: incidentId,
                    timestamp: new Date().toISOString(),
                    threat_level: formData.get('threat_level'),
                    threat_score: parseFloat(formData.get('threat_score')),
                    latitude: parseFloat(formData.get('latitude')),
                    longitude: parseFloat(formData.get('longitude')),
                    people_count: formData.get('people_count') ? parseInt(formData.get('people_count')) : 0,
                    weapon_detected: formData.get('weapon_detected') === 'true',
                    weapon_types: weaponTypesArray,
                    behavior_summary: formData.get('behavior_summary'),
                    is_critical: formData.get('is_critical') === 'true',
                    full_telemetry: {
                        source: 'MANUAL_REPORT',
                        created_by: formData.get('source_id') || 'Officer',
                        creation_timestamp: new Date().toISOString(),
                        severity: formData.get('severity') || 'Unknown'
                    },
                    source_id: formData.get('source_id') || 'MANUAL_INPUT',
                    mode: formData.get('mode') || 'MANUAL_REPORT',
                    location_accuracy_m: formData.get('location_accuracy_m') ? parseFloat(formData.get('location_accuracy_m')) : 50
                };

                // Validate required fields
                if (!incidentData.threat_level || !incidentData.behavior_summary || !incidentData.latitude || !incidentData.longitude) {
                    Toast.show('❌ Please fill in all required fields', 'error');
                    return;
                }

                // Submit to backend
                try {
                    const submitBtn = form.querySelector('button[type="submit"]');
                    submitBtn.disabled = true;
                    submitBtn.textContent = '⏳ Submitting...';

                    const response = await fetch(`${ML_API_URL}/threats/report`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(incidentData)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        Toast.show('✅ Incident report submitted successfully!', 'success', 4000);
                        console.log('Incident created:', result);
                        closeModal();
                        
                        // Refresh map if available
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    } else {
                        Toast.show(`❌ Error: ${result.detail || 'Failed to submit report'}`, 'error');
                        submitBtn.disabled = false;
                        submitBtn.textContent = '✅ Submit Report';
                    }
                } catch (error) {
                    console.error('Error submitting incident report:', error);
                    Toast.show('❌ Network error: ' + error.message, 'error');
                    const submitBtn = form.querySelector('button[type="submit"]');
                    submitBtn.disabled = false;
                    submitBtn.textContent = '✅ Submit Report';
                }
            });

            // Close button handlers
            closeBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);

            // Close when clicking outside modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        },

        teardown() {
            if (this.updateInterval) clearInterval(this.updateInterval);
            const app = document.getElementById('app');
            if (app) app.innerHTML = '';
        }
    };

    const APP_ROLES = ['user', 'guardian', 'police'];
    let roleSwitcher = null;

    function normalizeRole(role) {
        return APP_ROLES.includes(role) ? role : 'user';
    }

    function ensureAppContainerPlacement(role) {
        const app = document.getElementById('app');
        const heroSection = document.querySelector('.hero') || document.querySelector('.heroes');
        if (!app) return;

        if (heroSection && role === 'user') {
            heroSection.parentNode.insertBefore(app, heroSection.nextSibling);
            return;
        }
        document.body.appendChild(app);
    }

    // Role-aware page loader (inline pages)
    async function loadRolePage(role = 'user', params = {}) {
        try {
            const pages = {
                user: UserPage,
                guardian: GuardianPage,
                police: PolicePage
            };

            const page = pages[role];
            if (page && typeof page.init === 'function') {
                if (window.__safesphere_current_page && window.__safesphere_current_page.teardown) {
                    try { window.__safesphere_current_page.teardown(); } catch(e){}
                }
                window.__safesphere_current_page = page;
                await page.init(params);
                console.log(`✅ Loaded role page: ${role}`);
            } else {
                console.warn(`Role page for '${role}' not found`);
            }
            if (role == 'user'){
                VoiceSecurity.init();
                console.log('✅ Voice Security ready');
            }
        } catch (err) {
            console.error('Failed to load role page', role, err);
        }
    }

    async function fetchOrCreateProfile(user) {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('user_id, email, full_name, role')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.error('Profile fetch failed:', error);
                return null;
            }

            if (profile) return profile;

            const fullName = (user.user_metadata && user.user_metadata.full_name) || '';
            const requestedRole = normalizeRole((user.user_metadata && user.user_metadata.role) || 'user');

            const { data: inserted, error: insertError } = await supabase
                .from('profiles')
                .insert({
                    user_id: user.id,
                    email: user.email,
                    full_name: fullName,
                    role: requestedRole
                })
                .select('user_id, email, full_name, role')
                .single();

            if (insertError) {
                console.error('Profile create failed:', insertError);
                return null;
            }

            return inserted;
        } catch (err) {
            console.error('Profile resolve error:', err);
            return null;
        }
    }

    async function persistUserRole(role) {
        const user = window.__safesphere_auth_user;
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({ role: normalizeRole(role) })
            .eq('user_id', user.id);

        if (error) {
            console.error('Role update failed:', error);
            Toast.show('Could not save role. Check RLS policies.', 'error');
        }
    }

    function ensureRoleSwitcher(currentRole = 'user') {
        if (!roleSwitcher) {
            const container = document.createElement('div');
            container.id = 'role-switcher';
            container.className = 'role-switcher';

            const label = document.createElement('label');
            label.className = 'role-switcher-label';
            label.textContent = 'Role:';
            container.appendChild(label);

            const select = document.createElement('select');
            select.className = 'role-switcher-select';
            APP_ROLES.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r;
                const icons = { user: 'User', guardian: 'Guardian', police: 'Police' };
                opt.textContent = `${icons[r]} Dashboard`;
                select.appendChild(opt);
            });

            select.addEventListener('change', async (e) => {
                const newRole = normalizeRole(e.target.value);
                await window.setRole(newRole, { persistRemote: true });
                Toast.show(`Switched to ${newRole.toUpperCase()} role`, 'info', 2000);
                setTimeout(() => window.scrollTo(0, 0), 100);
            });

            container.appendChild(select);
            document.body.appendChild(container);
            roleSwitcher = { container, select };
        }

        roleSwitcher.select.value = normalizeRole(currentRole);
    }

    function removeRoleSwitcher() {
        if (roleSwitcher && roleSwitcher.container) {
            roleSwitcher.container.remove();
        }
        roleSwitcher = null;
    }

    const AuthPage = {
        render(mode = 'signin') {
            const app = document.getElementById('app');
            if (!app) return;

            app.innerHTML = `
                <div class="auth-shell">
                    <div class="auth-card">
                        <div class="auth-tabs">
                            <button class="auth-tab ${mode === 'signin' ? 'active' : ''}" data-auth-mode="signin">Sign In</button>
                            <button class="auth-tab ${mode === 'signup' ? 'active' : ''}" data-auth-mode="signup">Sign Up</button>
                        </div>

                        <form id="auth-form" class="auth-form">
                            <input type="email" id="auth-email" placeholder="Email" required>
                            <input type="password" id="auth-password" placeholder="Password (min 6 chars)" minlength="6" required>

                            <input type="text" id="auth-name" placeholder="Full Name" ${mode === 'signup' ? '' : 'style="display:none;"'}>
                            <select id="auth-role" ${mode === 'signup' ? '' : 'style="display:none;"'}>
                                <option value="user">User</option>
                                <option value="guardian">Guardian</option>
                                <option value="police">Police</option>
                            </select>

                            <button type="submit" id="auth-submit" class="auth-submit">
                                ${mode === 'signin' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            `;

            ensureAppContainerPlacement('user');

            const tabs = app.querySelectorAll('.auth-tab');
            const form = app.querySelector('#auth-form');
            const nameInput = app.querySelector('#auth-name');
            const roleSelect = app.querySelector('#auth-role');
            const submitBtn = app.querySelector('#auth-submit');

            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.render(tab.dataset.authMode);
                });
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = app.querySelector('#auth-email').value.trim();
                const password = app.querySelector('#auth-password').value;
                const fullName = nameInput.value.trim();
                const role = normalizeRole(roleSelect.value);

                submitBtn.disabled = true;
                submitBtn.textContent = mode === 'signin' ? 'Signing In...' : 'Creating Account...';

                try {
                    if (mode === 'signin') {
                        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                        if (error) throw error;
                        if (data && data.session && data.session.user) {
                            await AuthFlow.handleSignedInUser(data.session.user);
                        }
                    } else {
                        const { data, error } = await supabase.auth.signUp({
                            email,
                            password,
                            options: {
                                data: {
                                    full_name: fullName,
                                    role
                                }
                            }
                        });

                        if (error) throw error;

                        if (data && data.session && data.session.user) {
                            await AuthFlow.handleSignedInUser(data.session.user);
                        } else {
                            Toast.show('Signup successful. Check your email to verify and sign in.', 'success', 5000);
                            this.render('signin');
                        }
                    }
                } catch (err) {
                    console.error('Auth failed:', err);
                    Toast.show(err.message || 'Authentication failed', 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
                }
            });
        }
    };

    const AuthFlow = {
        async handleSignedInUser(user) {
            window.__safesphere_auth_user = user;

            const profile = await fetchOrCreateProfile(user);
            window.__safesphere_profile = profile || null;
            const role = normalizeRole((profile && profile.role) || localStorage.getItem('safesphere_role') || 'user');

            wireProfileButton();
            await window.setRole(role, { persistRemote: false });

            Toast.show(`Welcome ${profile && profile.full_name ? profile.full_name : 'back'}!`, 'success', 2000);
        },

        async handleSignOut() {
            if (window.__safesphere_current_page && window.__safesphere_current_page.teardown) {
                try { window.__safesphere_current_page.teardown(); } catch (e) {}
            }
            window.__safesphere_auth_user = null;
            window.__safesphere_profile = null;
            removeRoleSwitcher();
            wireProfileButton();
            AuthPage.render('signin');
        },

        async bootstrap() {
            wireProfileButton();

            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Session read failed:', error);
            }

            if (data && data.session && data.session.user) {
                await this.handleSignedInUser(data.session.user);
            } else {
                await this.handleSignOut();
            }

            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    await this.handleSignOut();
                    Toast.show('Signed out successfully', 'info');
                }

                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && session.user) {
                    await this.handleSignedInUser(session.user);
                }
            });
        }
    };

    // Expose loader and setter globally for console/tools
    window.loadRolePage = loadRolePage;
    window.setRole = async (r, options = { persistRemote: true }) => {
        const nextRole = normalizeRole(r);
        localStorage.setItem('safesphere_role', nextRole);
        document.body.dataset.role = nextRole;

        ensureAppContainerPlacement(nextRole);
        if (options.persistRemote) {
            await persistUserRole(nextRole);
        }

        await loadRolePage(nextRole, { role: nextRole });

        if (roleSwitcher && roleSwitcher.select) {
            roleSwitcher.select.value = nextRole;
        }
    };

    function wireProfileButton() {
        const profileBtn = document.querySelector('.profile-btn');
        const profileText = profileBtn ? profileBtn.querySelector('.profile-text') : null;

        if (!profileBtn) return;

        const user = window.__safesphere_auth_user;
        if (user) {
            profileBtn.title = `Signed in as ${user.email || 'user'}. Click to logout.`;
            if (profileText) profileText.textContent = 'Logout';
            profileBtn.onclick = async () => {
                const { error } = await supabase.auth.signOut();
                if (error) {
                    Toast.show(error.message || 'Logout failed', 'error');
                }
                if(Role == 'User'){
                    VoiceSecurity.init();
                    console.log('✅ Voice Security ready');
                }
            };
        } else {
            profileBtn.title = 'Login to continue';
            if (profileText) profileText.textContent = 'Login';
            profileBtn.onclick = () => {
                AuthPage.render('signin');
                const app = document.getElementById('app');
                if (app) app.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
        }
    }

    AuthFlow.bootstrap();

    console.log('✅ SafeSphere online!');
} catch (error) {
    console.error('Error:', error);
}

// ============================================
// SERVICE WORKER (Optional PWA support)
// ============================================
