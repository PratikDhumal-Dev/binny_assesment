import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}

const STORAGE_KEY = 'users_data';
const API_URL = 'https://jsonplaceholder.typicode.com/users';

const OfflineDataScreen = () => {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    checkConnectivity();
    loadData();
  }, []);

  const checkConnectivity = async () => {
    try {
      // Simple connectivity check using fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setIsOnline(response.ok);
    } catch (error) {
      setIsOnline(false);
    }
  };

  const loadData = async () => {
    try {
      // Try to load cached data first
      const cachedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setUsers(parsedData.users);
        setLastUpdated(new Date(parsedData.timestamp));
      }

      // If online, fetch fresh data
      if (isOnline) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: User[] = await response.json();
      
      // Store data with timestamp
      const dataToStore = {
        users: data,
        timestamp: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      
      setUsers(data);
      setLastUpdated(new Date());
      
      Alert.alert('Success', 'Data fetched and cached successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      
      if (users.length === 0) {
        Alert.alert(
          'Network Error',
          'Failed to fetch data and no cached data available. Please check your internet connection.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Network Error',
          'Failed to fetch fresh data. Showing cached data instead.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkConnectivity();
    
    if (isOnline) {
      await fetchData();
    } else {
      Alert.alert(
        'Offline Mode',
        'You are currently offline. Showing cached data.',
        [{ text: 'OK' }]
      );
    }
    
    setRefreshing(false);
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUsers([]);
      setLastUpdated(null);
      Alert.alert('Success', 'Cache cleared successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => navigation.navigate('UserDetails', { id: item.id.toString() })}
      activeOpacity={0.7}
    >
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
        </View>
        <View style={styles.onlineIndicator}>
          <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#34C759' : '#FF3B30' }]} />
        </View>
      </View>
      
      <View style={styles.userDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="mail" size={16} color="#666" />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call" size={16} color="#666" />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="business" size={16} color="#666" />
          <Text style={styles.detailText}>{item.company.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.address.city}, {item.address.street}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users Data</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#34C759' : '#FF3B30' }]} />
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {lastUpdated && (
        <View style={styles.lastUpdatedContainer}>
          <Text style={styles.lastUpdatedText}>
            Last updated: {lastUpdated.toLocaleString()}
          </Text>
          <TouchableOpacity onPress={clearCache} style={styles.clearCacheButton}>
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            <Text style={styles.clearCacheText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>
      )}

      {users.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No users data available</Text>
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={fetchData}
            disabled={!isOnline}
          >
            <Text style={styles.fetchButtonText}>
              {isOnline ? 'Fetch Data' : 'Offline - No Data'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.userList}
        />
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Fetching data...</Text>
        </View>
      )}

      {/* <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Offline Support Features:</Text>
        <Text style={styles.infoText}>• Data cached in AsyncStorage</Text>
        <Text style={styles.infoText}>• Automatic offline detection</Text>
        <Text style={styles.infoText}>• Pull-to-refresh functionality</Text>
        <Text style={styles.infoText}>• Cache management options</Text>
        <Text style={styles.infoText}>• Graceful fallback to cached data</Text>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#111',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  lastUpdatedContainer: {
    backgroundColor: '#111',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  lastUpdatedText: {
    fontSize: 14,
    color: '#ccc',
  },
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearCacheText: {
    marginLeft: 5,
    color: '#FF3B30',
    fontSize: 14,
  },
  userList: {
    padding: 10,
  },
  userCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    color: '#ccc',
  },
  onlineIndicator: {
    padding: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  userDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#ccc',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  emptyText: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 20,
    marginBottom: 20,
  },
  fetchButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  fetchButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ccc',
  },
  infoContainer: {
    backgroundColor: '#111',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 2,
  },
});

export default OfflineDataScreen;
