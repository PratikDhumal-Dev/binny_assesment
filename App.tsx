import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  return (
    <Provider store={store}>
      <StatusBar style="light" />
      {isLoading ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <AppNavigator />
      )}
    </Provider>
  );
}
