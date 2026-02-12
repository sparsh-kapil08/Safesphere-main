import sys
import os
import time

# Ensure Heatmap root is in sys.path to import backend_api
current_dir = os.path.dirname(os.path.abspath(__file__))
heatmap_root = os.path.abspath(os.path.join(current_dir, '../../'))
if heatmap_root not in sys.path:
    sys.path.insert(0, heatmap_root)

from engines.voice_ai.inference.speech_recognizer import VoiceAIEngine

try:
    import backend_api
except ImportError:
    backend_api = None

def main():
    engine = VoiceAIEngine()

    print("\n🎙 Voice AI Security System Active. Listening for threats (e.g., 'help me', 'threatening')...\n")
    
    while True:
        try:
            # Listen to surroundings
            result = engine.run_once()
            
            # Extract text
            text = ""
            if isinstance(result, dict):
                text = result.get('text', " ".join(str(v) for v in result.values()))
            else:
                text = str(result)
            
            if text:
                print(f"Heard: {text}")
                text_lower = text.lower()
                
                # Check for suspicious keywords
                if "help me" in text_lower or "threatening" in text_lower or "help" in text_lower or "emergency" in text_lower or "bachao" in text_lower or "save me" in text_lower:
                    print(f"🚨 Suspicious activity detected: '{text}'")
                    
                    # Send instant SOS call
                    data = {"voice": text}
                    
                    if backend_api and hasattr(backend_api, 'send_sos'):
                        backend_api.send_sos(data)
                        print("SOS call sent via backend_api.")
                    else:
                        print(f"SOS Triggered! Data: {data}")
                        
        except KeyboardInterrupt:
            print("Stopping Voice AI...")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(1)



if __name__ == "__main__":
    main()
