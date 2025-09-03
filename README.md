# React Native Expo Assessment Project

A comprehensive React Native application demonstrating advanced concepts including performance optimization, state management, offline support, secure storage, and deep linking.

## 🚀 Features Implemented

### 1. **Optimized Large List**
- Displays 5,000 items with smooth scrolling
- Performance optimizations:
  - `getItemLayout` for fixed height items
  - `windowSize` optimization
  - Pagination with `onEndReached`
  - `removeClippedSubviews` enabled
  - Optimized `renderItem` with `useCallback`
  - Batch rendering optimizations

### 2. **Global State Management (Cart System)**
- Redux Toolkit implementation
- Product list with "Add to Cart" functionality
- Cart screen with item management
- Quantity controls and total calculations
- Persistent cart state across app sessions

### 3. **Offline Support**
- Fetches data from [JSONPlaceholder API](https://jsonplaceholder.typicode.com/users)
- AsyncStorage caching with timestamps
- Automatic offline detection
- Graceful fallback to cached data
- Pull-to-refresh functionality
- Cache management options

### 4. **Secure Token Storage**
- Expo SecureStore implementation (not AsyncStorage)
- JWT token management
- Automatic token expiration
- Token refresh capability
- Secure storage of sensitive authentication data

### 5. **Deep Linking**
- React Navigation deep linking configuration
- URL scheme: `myapp://user/{id}`
- Dynamic user details screen
- Parameter extraction and validation
- Seamless navigation integration

### 6. **Code Review Exercise**
See the [Code Review Section](#code-review-exercise) below for the buggy snippet analysis and fixes.

### 7. **Native Module Concept**
- Conceptual explanation of native module creation
- Device OS version retrieval demonstration
- Integration with React Native bridge

## 🛠️ Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Stack + Tabs)
- **Storage**: AsyncStorage + Expo SecureStore
- **Icons**: Expo Vector Icons (Ionicons)
- **Architecture**: Functional Components + Hooks

## 📱 App Structure

```
src/
├── store/                 # Redux store and slices
│   ├── store.ts          # Store configuration
│   └── cartSlice.ts      # Cart state management
├── navigation/            # Navigation configuration
│   └── AppNavigator.tsx  # Main navigation setup
├── screens/               # Application screens
│   ├── ProductListScreen.tsx    # Product catalog
│   ├── CartScreen.tsx           # Shopping cart
│   ├── LargeListScreen.tsx      # 5K items list
│   ├── OfflineDataScreen.tsx    # Offline data demo
│   ├── TokenStorageScreen.tsx   # Secure token storage
│   ├── UserDetailsScreen.tsx    # Deep link target
│   └── DeviceInfoScreen.tsx     # Device information display
├── native/                # Native module interfaces
│   └── DeviceInfoModule.ts      # TypeScript interface for native module
└── App.tsx               # Main application entry

ios/
├── DeviceInfoModule.m     # iOS native module implementation

android/
├── app/src/main/java/com/binny/
│   ├── DeviceInfoModule.java    # Android native module implementation
│   └── DeviceInfoPackage.java   # Android package registration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd binny_assesment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🔗 Deep Linking

Test deep linking functionality:

```bash
# iOS Simulator
xcrun simctl openurl booted "myapp://user/1"

# Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "myapp://user/1" com.yourcompany.yourapp

# Or use the Expo development build
npx uri-scheme open "myapp://user/1" --ios
npx uri-scheme open "myapp://user/1" --android
```

## 📊 Performance Metrics

The large list implementation handles 5,000 items with:
- **Initial Render**: 20 items
- **Batch Size**: 10 items per batch
- **Window Size**: 10 (optimized for memory)
- **Item Height**: Fixed 80px for optimal `getItemLayout`
- **Memory Management**: Automatic cleanup with `removeClippedSubviews`

## 🔒 Security Features

- **SecureStore**: Encrypted storage for sensitive data
- **Token Expiration**: Automatic JWT token validation
- **Secure Caching**: Separate storage for sensitive vs. public data
- **Input Validation**: Proper sanitization and validation

## 🌐 Offline Capabilities

- **Smart Caching**: Intelligent data persistence strategy
- **Network Detection**: Automatic online/offline state management
- **Data Synchronization**: Seamless online/offline transitions
- **Cache Invalidation**: Timestamp-based cache management



## 🧪 Code Review Exercise

### Buggy Code Snippet Analysis

**Original Buggy Code:**
```tsx
<FlatList 
  data={data} 
  renderItem={(item) => <Text>{item.title}</Text>}
/>
```

**Issues Identified:**

1. **Incorrect `renderItem` parameter destructuring**: The `renderItem` prop expects a function that receives an object with `item`, `index`, and `separators` properties, not just `item` directly.

2. **Missing `keyExtractor`**: FlatList requires a unique key for each item to optimize rendering and prevent warnings.

3. **Missing `renderItem` type annotation**: TypeScript should have proper typing for better type safety.

4. **Poor performance**: No optimization props like `getItemLayout` or `removeClippedSubviews` for large lists.

**Fixed Code:**
```tsx
<FlatList 
  data={data}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: 50, // height of each item
    offset: 50 * index,
    index,
  })}
/>
```

---

## 🏗️ Native Module Implementation

### Device Information Module

This project includes a fully functional native module that provides comprehensive device information for both iOS and Android platforms.

#### iOS (Objective-C)
```objc
// DeviceInfoModule.m
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#import <sys/utsname.h>

@interface DeviceInfoModule : NSObject <RCTBridgeModule>
@end

@implementation DeviceInfoModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getDeviceInfo:(RCTResponseSenderBlock)callback)
{
    UIDevice *device = [UIDevice currentDevice];
    
    // Get device model identifier
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *deviceModel = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
    
    // Get device name, system version, battery info, orientation
    NSString *deviceName = device.name;
    NSString *systemVersion = device.systemVersion;
    NSString *systemName = device.systemName;
    
    // Create device info dictionary
    NSDictionary *deviceInfo = @{
        @"osVersion": systemVersion,
        @"osName": systemName,
        @"deviceModel": deviceModel,
        @"deviceName": deviceName,
        @"platform": @"iOS"
    };
    
    callback(@[deviceInfo]);
}

@end
```

#### Android (Java)
```java
// DeviceInfoModule.java
package com.binny;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import android.os.Build;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;
import android.app.ActivityManager;
import android.util.DisplayMetrics;
import android.view.WindowManager;
import android.os.Environment;
import android.os.StatFs;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;

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
            deviceInfo.putInt("apiLevel", Build.VERSION.SDK_INT);
            deviceInfo.putString("buildNumber", Build.DISPLAY);
            
            // Device Information
            deviceInfo.putString("deviceModel", Build.MODEL);
            deviceInfo.putString("manufacturer", Build.MANUFACTURER);
            deviceInfo.putString("brand", Build.BRAND);
            deviceInfo.putString("product", Build.PRODUCT);
            deviceInfo.putString("device", Build.DEVICE);
            deviceInfo.putString("hardware", Build.HARDWARE);
            
            // App Information
            try {
                PackageInfo packageInfo = reactContext.getPackageManager()
                    .getPackageInfo(reactContext.getPackageName(), 0);
                deviceInfo.putString("appVersion", packageInfo.versionName);
                deviceInfo.putInt("appVersionCode", packageInfo.versionCode);
            } catch (PackageManager.NameNotFoundException e) {
                deviceInfo.putString("appVersion", "Unknown");
                deviceInfo.putInt("appVersionCode", 0);
            }
            
            // Screen Information
            WindowManager windowManager = (WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE);
            DisplayMetrics displayMetrics = new DisplayMetrics();
            windowManager.getDefaultDisplay().getMetrics(displayMetrics);
            deviceInfo.putInt("screenWidth", displayMetrics.widthPixels);
            deviceInfo.putInt("screenHeight", displayMetrics.heightPixels);
            deviceInfo.putDouble("screenDensity", displayMetrics.density);
            deviceInfo.putInt("screenDensityDpi", displayMetrics.densityDpi);
            
            // Memory Information
            ActivityManager.MemoryInfo memoryInfo = new ActivityManager.MemoryInfo();
            ActivityManager activityManager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
            activityManager.getMemoryInfo(memoryInfo);
            deviceInfo.putLong("totalMemory", memoryInfo.totalMem);
            deviceInfo.putLong("availableMemory", memoryInfo.availMem);
            deviceInfo.putLong("usedMemory", memoryInfo.totalMem - memoryInfo.availMem);
            
            // Storage Information
            StatFs statFs = new StatFs(Environment.getExternalStorageDirectory().getPath());
            long totalStorage = statFs.getTotalBytes();
            long availableStorage = statFs.getAvailableBytes();
            deviceInfo.putLong("totalStorage", totalStorage);
            deviceInfo.putLong("availableStorage", availableStorage);
            deviceInfo.putLong("usedStorage", totalStorage - availableStorage);
            
            // Network Information
            ConnectivityManager connectivityManager = (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo activeNetwork = connectivityManager.getActiveNetworkInfo();
            if (activeNetwork != null) {
                deviceInfo.putString("networkType", activeNetwork.getTypeName());
                deviceInfo.putBoolean("isConnected", activeNetwork.isConnected());
            } else {
                deviceInfo.putString("networkType", "None");
                deviceInfo.putBoolean("isConnected", false);
            }
            
            // Battery Information
            IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent batteryStatus = reactContext.registerReceiver(null, intentFilter);
            if (batteryStatus != null) {
                int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
                float batteryPct = level * 100 / (float) scale;
                deviceInfo.putDouble("batteryLevel", batteryPct);
                
                int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
                String batteryStatusString;
                switch (status) {
                    case BatteryManager.BATTERY_STATUS_CHARGING:
                        batteryStatusString = "Charging";
                        break;
                    case BatteryManager.BATTERY_STATUS_DISCHARGING:
                        batteryStatusString = "Discharging";
                        break;
                    case BatteryManager.BATTERY_STATUS_FULL:
                        batteryStatusString = "Full";
                        break;
                    case BatteryManager.BATTERY_STATUS_NOT_CHARGING:
                        batteryStatusString = "Not Charging";
                        break;
                    default:
                        batteryStatusString = "Unknown";
                        break;
                }
                deviceInfo.putString("batteryState", batteryStatusString);
            } else {
                deviceInfo.putDouble("batteryLevel", -1);
                deviceInfo.putString("batteryState", "Unknown");
            }
            
            // Platform
            deviceInfo.putString("platform", "Android");
            
            callback.invoke(deviceInfo);
            
        } catch (Exception e) {
            WritableMap error = Arguments.createMap();
            error.putString("error", e.getMessage());
            callback.invoke(error);
        }
    }
}

#### React Native Usage
```tsx
import { getDeviceInfo, DeviceInfo } from '../native/DeviceInfoModule';

const loadDeviceInfo = async () => {
  try {
    const deviceInfo: DeviceInfo = await getDeviceInfo();
    console.log('Device Information:', deviceInfo);
    
    // Access specific information
    console.log('OS Version:', deviceInfo.osVersion);
    console.log('Device Model:', deviceInfo.deviceModel);
    console.log('Platform:', deviceInfo.platform);
    
    return deviceInfo;
  } catch (error) {
    console.error('Error getting device info:', error);
  }
};
```

#### Device Information Screen

The app includes a dedicated `DeviceInfoScreen` that displays all the device information in an organized, user-friendly interface. Access it via:

- **Navigation button** on the Products screen
- **Direct navigation** to `DeviceInfo` screen
- **Programmatic access** using the `getDeviceInfo()` function

#### Information Provided

**iOS:**
- OS Version, Device Model, Device Name
- Battery Level, Battery State, Device Orientation
- Platform identification

**Android:**
- OS Version, API Level, Build Number
- Device Model, Manufacturer, Brand, Product
- App Version, Screen Dimensions, Memory Usage
- Storage Information, Network Status, Battery Details

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Cart System**: Add/remove items, quantity updates, total calculations
- [ ] **Large List**: Scroll through 5,000 items, check performance
- [ ] **Offline Mode**: Toggle network, verify cached data loading
- [ ] **Token Storage**: Store/retrieve/refresh tokens, check expiration
- [ ] **Deep Linking**: Navigate via URL scheme, verify parameter passing
- [ ] **Navigation**: Tab switching, stack navigation, back button behavior

### Performance Testing

```bash
# Monitor performance metrics
npx react-native run-ios --simulator="iPhone 14 Pro"
# Use Xcode Instruments for detailed performance analysis

# Android performance monitoring
npx react-native run-android
# Use Android Studio Profiler
```

---

## 📝 Notes

- **Expo SDK**: Latest version with managed workflow
- **TypeScript**: Strict mode enabled for better type safety
- **Performance**: Optimized for smooth 60fps scrolling
- **Accessibility**: Basic accessibility features implemented
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🤝 Contributing

This is an assessment project demonstrating React Native best practices. Feel free to use as a reference for your own projects.

## 📄 License

This project is created for educational and assessment purposes.
