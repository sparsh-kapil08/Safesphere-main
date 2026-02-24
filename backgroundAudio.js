// JavaScript Bridge for Background Audio Service
// Add this to your script.js or create a new module

/**
 * Background Audio Service Controller
 * Controls the native Android foreground service for background microphone access
 */
class BackgroundAudioController {
    
    /**
     * Start the background audio service
     * @returns {Promise<void>}
     */
    static async startService() {
        try {
            // Check if running on Android via Capacitor
            if (window.Capacitor && window.Capacitor.Plugins.BackgroundAudio) {
                await window.Capacitor.Plugins.BackgroundAudio.startBackgroundService();
                console.log('✅ Background audio service started');
                return true;
            } else {
                console.warn('⚠️ Background audio service not available (web mode)');
                return false;
            }
        } catch (error) {
            console.error('❌ Failed to start background service:', error);
            return false;
        }
    }
    
    /**
     * Stop the background audio service
     * @returns {Promise<void>}
     */
    static async stopService() {
        try {
            if (window.Capacitor && window.Capacitor.Plugins.BackgroundAudio) {
                await window.Capacitor.Plugins.BackgroundAudio.stopBackgroundService();
                console.log('✅ Background audio service stopped');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Failed to stop background service:', error);
            return false;
        }
    }
    
    /**
     * Request notification permission (required for foreground service)
     * @returns {Promise<boolean>}
     */
    static async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return true;
    }
}

// Export for use in your app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundAudioController;
}

// Usage Example:
// When SOS is triggered:
// await BackgroundAudioController.requestNotificationPermission();
// await BackgroundAudioController.startService();
//
// When SOS is resolved:
// await BackgroundAudioController.stopService();
