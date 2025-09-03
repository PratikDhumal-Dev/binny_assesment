package com.pratik.dhumal.binny_assesment;

import android.app.ActivityManager;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;

public class DeviceInfoModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public DeviceInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DeviceInfoModule";
    }

    @ReactMethod
    public void getDeviceInfo(Callback callback) {
        try {
            WritableMap deviceInfo = Arguments.createMap();
            
            // OS Information
            deviceInfo.putString("osVersion", Build.VERSION.RELEASE);
            deviceInfo.putString("osName", "Android");
            deviceInfo.putString("platform", "android");
            
            // Android specific
            deviceInfo.putInt("apiLevel", Build.VERSION.SDK_INT);
            deviceInfo.putString("buildNumber", Build.DISPLAY);
            deviceInfo.putString("manufacturer", Build.MANUFACTURER);
            deviceInfo.putString("brand", Build.BRAND);
            deviceInfo.putString("product", Build.PRODUCT);
            deviceInfo.putString("device", Build.DEVICE);
            deviceInfo.putString("hardware", Build.HARDWARE);
            
            // App version
            try {
                PackageInfo pInfo = reactContext.getPackageManager().getPackageInfo(reactContext.getPackageName(), 0);
                deviceInfo.putString("appVersion", pInfo.versionName);
                deviceInfo.putInt("appVersionCode", pInfo.versionCode);
            } catch (PackageManager.NameNotFoundException e) {
                deviceInfo.putString("appVersion", "Unknown");
                deviceInfo.putInt("appVersionCode", 0);
            }
            
            // Screen information
            try {
                WindowManager wm = (WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE);
                DisplayMetrics displayMetrics = new DisplayMetrics();
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
                    // For Android 11+ (API 30+)
                    reactContext.getDisplay().getRealMetrics(displayMetrics);
                } else {
                    // For older versions
                    wm.getDefaultDisplay().getMetrics(displayMetrics);
                }
                deviceInfo.putInt("screenWidth", displayMetrics.widthPixels);
                deviceInfo.putInt("screenHeight", displayMetrics.heightPixels);
                deviceInfo.putDouble("screenDensity", displayMetrics.density);
                deviceInfo.putInt("screenDensityDpi", displayMetrics.densityDpi);
            } catch (Exception e) {
                // Fallback values if screen info fails
                deviceInfo.putInt("screenWidth", 0);
                deviceInfo.putInt("screenHeight", 0);
                deviceInfo.putDouble("screenDensity", 1.0);
                deviceInfo.putInt("screenDensityDpi", 160);
            }
            
            // Memory information
            ActivityManager.MemoryInfo memoryInfo = new ActivityManager.MemoryInfo();
            ActivityManager activityManager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
            activityManager.getMemoryInfo(memoryInfo);
            deviceInfo.putLong("totalMemory", memoryInfo.totalMem);
            deviceInfo.putLong("availableMemory", memoryInfo.availMem);
            deviceInfo.putLong("usedMemory", memoryInfo.totalMem - memoryInfo.availMem);
            
            // Storage information
            File path = Environment.getExternalStorageDirectory();
            StatFs stat = new StatFs(path.getPath());
            long blockSize = stat.getBlockSizeLong();
            long totalBlocks = stat.getBlockCountLong();
            long availableBlocks = stat.getAvailableBlocksLong();
            
            deviceInfo.putLong("totalStorage", totalBlocks * blockSize);
            deviceInfo.putLong("availableStorage", availableBlocks * blockSize);
            deviceInfo.putLong("usedStorage", (totalBlocks - availableBlocks) * blockSize);
            
            // Network information
            ConnectivityManager connectivityManager = (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo activeNetwork = connectivityManager.getActiveNetworkInfo();
            deviceInfo.putBoolean("isConnected", activeNetwork != null && activeNetwork.isConnected());
            deviceInfo.putString("networkType", activeNetwork != null ? activeNetwork.getTypeName() : "Unknown");
            
            callback.invoke(deviceInfo);
        } catch (Exception e) {
            // Log the error for debugging
            android.util.Log.e("DeviceInfoModule", "Error getting device info: " + e.getMessage(), e);
            
            WritableMap error = Arguments.createMap();
            error.putString("error", "Failed to get device info: " + e.getMessage());
            callback.invoke(error);
        }
    }
}
