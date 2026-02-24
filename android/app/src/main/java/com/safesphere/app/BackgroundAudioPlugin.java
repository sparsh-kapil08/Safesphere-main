package com.safesphere.app;

import android.content.Intent;
import android.os.Build;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Capacitor plugin to control background audio service
 */
@CapacitorPlugin(name = "BackgroundAudio")
public class BackgroundAudioPlugin extends Plugin {
    
    @PluginMethod
    public void startBackgroundService(PluginCall call) {
        try {
            Intent serviceIntent = new Intent(getContext(), BackgroundAudioService.class);
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                getContext().startForegroundService(serviceIntent);
            } else {
                getContext().startService(serviceIntent);
            }
            
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to start background service: " + e.getMessage());
        }
    }
    
    @PluginMethod
    public void stopBackgroundService(PluginCall call) {
        try {
            Intent serviceIntent = new Intent(getContext(), BackgroundAudioService.class);
            getContext().stopService(serviceIntent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to stop background service: " + e.getMessage());
        }
    }
    
    @PluginMethod
    public void checkPermissions(PluginCall call) {
        // You can add permission checking logic here
        call.resolve();
    }
}
