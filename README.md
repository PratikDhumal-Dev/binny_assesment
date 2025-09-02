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
│   └── UserDetailsScreen.tsx    # Deep link target
└── App.tsx               # Main application entry
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

---

## 🔍 Code Review Exercise

### Buggy Snippet Analysis

**Original Code:**
```jsx
<FlatList data={data} renderItem={(item) => <Text>{item.title}</Text>}/>
```

### Issues Identified:

1. **Incorrect Parameter Destructuring**: `renderItem` receives an object with `{ item, index, separators }`, not just `item`
2. **Missing Key Prop**: FlatList requires unique keys for performance optimization
3. **Missing TypeScript Types**: No type safety for the data structure
4. **Poor Performance**: No optimization props for large lists

### Fixed Version:

```tsx
<FlatList 
  data={data} 
  renderItem={({ item, index }) => (
    <Text key={item.id || index}>{item.title}</Text>
  )}
  keyExtractor={(item) => item.id.toString()}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  windowSize={10}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  removeClippedSubviews={true}
/>
```

### Key Improvements:

- ✅ **Proper destructuring**: `{ item, index }` instead of just `item`
- ✅ **Key extraction**: `keyExtractor` for optimal performance
- ✅ **Performance props**: `getItemLayout`, `windowSize`, batching options
- ✅ **Memory optimization**: `removeClippedSubviews` enabled
- ✅ **Type safety**: Proper TypeScript interfaces

---

## 🏗️ Native Module Concept

### Conceptual Implementation

While this project doesn't include actual native code, here's how you would implement a native module to get device OS version:

#### iOS (Objective-C)
```objc
// DeviceInfoModule.m
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

@interface DeviceInfoModule : NSObject <RCTBridgeModule>
@end

@implementation DeviceInfoModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getOSVersion:(RCTResponseSenderBlock)callback)
{
    NSString *osVersion = [[UIDevice currentDevice] systemVersion];
    callback(@[osVersion]);
}

@end
```

#### Android (Java)
```java
// DeviceInfoModule.java
package com.yourapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.os.Build;

public class DeviceInfoModule extends ReactContextBaseJavaModule {
    
    public DeviceInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    
    @Override
    public String getName() {
        return "DeviceInfoModule";
    }
    
    @ReactMethod
    public void getOSVersion(Callback callback) {
        String osVersion = Build.VERSION.RELEASE;
        callback.invoke(osVersion);
    }
}
```

#### React Native Usage
```tsx
import { NativeModules } from 'react-native';

const { DeviceInfoModule } = NativeModules;

const getOSVersion = async () => {
  try {
    const osVersion = await DeviceInfoModule.getOSVersion();
    console.log('Device OS Version:', osVersion);
    return osVersion;
  } catch (error) {
    console.error('Error getting OS version:', error);
  }
};
```

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
