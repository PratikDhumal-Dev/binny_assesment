import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ID_KEY = 'user_id';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresAt: string;
}

const TokenStorageScreen = () => {
  const [tokens, setTokens] = useState<StoredTokens | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inputToken, setInputToken] = useState('');
  const [inputRefreshToken, setInputRefreshToken] = useState('');
  const [inputUserId, setInputUserId] = useState('');

  useEffect(() => {
    loadStoredTokens();
  }, []);

  const loadStoredTokens = async () => {
    try {
      setLoading(true);
      
      const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const userId = await SecureStore.getItemAsync(USER_ID_KEY);
      
      if (accessToken && refreshToken && userId) {
        // Check if token is expired
        const expiresAt = await SecureStore.getItemAsync('token_expires_at');
        const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;
        
        if (isExpired) {
          Alert.alert(
            'Token Expired',
            'Your authentication token has expired. Please store a new one.',
            [{ text: 'OK' }]
          );
          await clearTokens();
          return;
        }
        
        setTokens({
          accessToken,
          refreshToken,
          userId,
          expiresAt: expiresAt || 'No expiration set',
        });
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      Alert.alert('Error', 'Failed to load stored tokens');
    } finally {
      setLoading(false);
    }
  };

  const storeTokens = async () => {
    if (!inputToken.trim() || !inputRefreshToken.trim() || !inputUserId.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setSaving(true);
      
      // Generate expiration time (24 hours from now)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      // Store tokens securely
      await SecureStore.setItemAsync(TOKEN_KEY, inputToken.trim());
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, inputRefreshToken.trim());
      await SecureStore.setItemAsync(USER_ID_KEY, inputUserId.trim());
      await SecureStore.setItemAsync('token_expires_at', expiresAt);
      
      const newTokens: StoredTokens = {
        accessToken: inputToken.trim(),
        refreshToken: inputRefreshToken.trim(),
        userId: inputUserId.trim(),
        expiresAt,
      };
      
      setTokens(newTokens);
      setInputToken('');
      setInputRefreshToken('');
      setInputUserId('');
      
      Alert.alert('Success', 'Tokens stored securely!');
    } catch (error) {
      console.error('Error storing tokens:', error);
      Alert.alert('Error', 'Failed to store tokens');
    } finally {
      setSaving(false);
    }
  };

  const clearTokens = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_ID_KEY);
      await SecureStore.deleteItemAsync('token_expires_at');
      
      setTokens(null);
      Alert.alert('Success', 'Tokens cleared successfully!');
    } catch (error) {
      console.error('Error clearing tokens:', error);
      Alert.alert('Error', 'Failed to clear tokens');
    }
  };

  const refreshTokens = async () => {
    if (!tokens) {
      Alert.alert('Error', 'No tokens to refresh');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate token refresh API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate new expiration time
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      // Update stored tokens
      await SecureStore.setItemAsync('token_expires_at', newExpiresAt);
      
      setTokens(prev => prev ? { ...prev, expiresAt: newExpiresAt } : null);
      
      Alert.alert('Success', 'Tokens refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      Alert.alert('Error', 'Failed to refresh tokens');
    } finally {
      setLoading(false);
    }
  };

  const generateDummyTokens = () => {
    const dummyAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const dummyRefreshToken = 'refresh_token_' + Math.random().toString(36).substr(2, 9);
    const dummyUserId = 'user_' + Math.floor(Math.random() * 1000);
    
    setInputToken(dummyAccessToken);
    setInputRefreshToken(dummyRefreshToken);
    setInputUserId(dummyUserId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading tokens...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Secure Token Storage</Text>
          <Text style={styles.headerSubtitle}>
            Using Expo SecureStore for sensitive data
          </Text>
        </View>

      {/* Token Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Store New Tokens</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Access Token:</Text>
          <TextInput
            style={styles.textInput}
            value={inputToken}
            onChangeText={setInputToken}
            placeholder="Enter access token"
            placeholderTextColor="#ccc"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Refresh Token:</Text>
          <TextInput
            style={styles.textInput}
            value={inputRefreshToken}
            onChangeText={setInputRefreshToken}
            placeholder="Enter refresh token"
            placeholderTextColor="#ccc"
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>User ID:</Text>
          <TextInput
            style={styles.textInput}
            value={inputUserId}
            onChangeText={setInputUserId}
            placeholder="Enter user ID"
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.generateButton]}
            onPress={generateDummyTokens}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.buttonText}>Generate Dummy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.storeButton]}
            onPress={storeTokens}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="save" size={20} color="white" />
            )}
            <Text style={styles.buttonText}>
              {saving ? 'Storing...' : 'Store Tokens'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stored Tokens Section */}
      {tokens && (
        <View style={styles.tokensSection}>
          <Text style={styles.sectionTitle}>Stored Tokens</Text>
          
          <View style={styles.tokenCard}>
            <View style={styles.tokenHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#34C759" />
              <Text style={styles.tokenStatus}>Valid</Text>
            </View>
            
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenLabel}>Access Token:</Text>
              <Text style={styles.tokenValue} numberOfLines={2}>
                {tokens.accessToken.substring(0, 50)}...
              </Text>
            </View>
            
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenLabel}>Refresh Token:</Text>
              <Text style={styles.tokenValue} numberOfLines={1}>
                {tokens.refreshToken}
              </Text>
            </View>
            
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenLabel}>User ID:</Text>
              <Text style={styles.tokenValue}>{tokens.userId}</Text>
            </View>
            
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenLabel}>Expires At:</Text>
              <Text style={styles.tokenValue}>
                {new Date(tokens.expiresAt).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.refreshButton]}
              onPress={refreshTokens}
              disabled={loading}
            >
              <Ionicons name="refresh-circle" size={20} color="white" />
              <Text style={styles.buttonText}>
                {loading ? 'Refreshing...' : 'Refresh Tokens'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={clearTokens}
            >
              <Ionicons name="trash" size={20} color="white" />
              <Text style={styles.buttonText}>Clear Tokens</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Security Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Security Features</Text>
        <View style={styles.infoItem}>
          <Ionicons name="lock-closed" size={20} color="#34C759" />
          <Text style={styles.infoText}>Uses Expo SecureStore (not AsyncStorage)</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
          <Text style={styles.infoText}>Data encrypted at rest</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={20} color="#34C759" />
          <Text style={styles.infoText}>Automatic token expiration</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="refresh" size={20} color="#34C759" />
          <Text style={styles.infoText}>Token refresh capability</Text>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#111',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ccc',
  },
  inputSection: {
    backgroundColor: '#111',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#222',
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  generateButton: {
    backgroundColor: '#FF9500',
  },
  storeButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tokensSection: {
    backgroundColor: '#111',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  tokenCard: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tokenStatus: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
  },
  tokenInfo: {
    marginBottom: 10,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ccc',
    marginBottom: 2,
  },
  tokenValue: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'monospace',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  refreshButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  infoSection: {
    backgroundColor: '#111',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ccc',
  },
});

export default TokenStorageScreen;
