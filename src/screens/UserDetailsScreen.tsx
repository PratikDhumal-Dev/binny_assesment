import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    geo: {
      lat: string;
      lng: string;
    };
  };
}

interface RouteParams {
  id: string;
}

const UserDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = route.params as RouteParams;
  const userId = parseInt(id);

  useEffect(() => {
    loadUserData();
  }, [id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from cache first
      const cachedData = await AsyncStorage.getItem('users_data');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const foundUser = parsedData.users.find((u: User) => u.id === userId);
        
        if (foundUser) {
          setUser(foundUser);
          setLoading(false);
          return;
        }
      }

      // If not in cache, try to fetch from API
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      
      if (!response.ok) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      const userData: User = await response.json();
      setUser(userData);
      
      // Cache the user data
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const existingUserIndex = parsedData.users.findIndex((u: User) => u.id === userId);
        
        if (existingUserIndex >= 0) {
          parsedData.users[existingUserIndex] = userData;
        } else {
          parsedData.users.push(userData);
        }
        
        await AsyncStorage.setItem('users_data', JSON.stringify(parsedData));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRefresh = () => {
    loadUserData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading user details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={80} color="#FF3B30" />
        <Text style={styles.errorTitle}>Error Loading User</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="person-remove" size={80} color="#FF9500" />
        <Text style={styles.errorTitle}>User Not Found</Text>
        <Text style={styles.errorMessage}>
          User with ID {userId} could not be found.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
                  <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>User Details</Text>
                  <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color="#ffffff" />
        </TouchableOpacity>
        </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userUsername}>@{user.username}</Text>
        <Text style={styles.userId}>ID: {user.id}</Text>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="globe" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Website</Text>
            <Text style={styles.infoValue}>{user.website}</Text>
          </View>
        </View>
      </View>

      {/* Company Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="business" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Company Name</Text>
            <Text style={styles.infoValue}>{user.company.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="chatbubble" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Catch Phrase</Text>
            <Text style={styles.infoValue}>{user.company.catchPhrase}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="briefcase" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Business</Text>
            <Text style={styles.infoValue}>{user.company.bs}</Text>
          </View>
        </View>
      </View>

      {/* Address Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Street</Text>
            <Text style={styles.infoValue}>
              {user.address.street}, {user.address.suite}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="map" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>City & ZIP</Text>
            <Text style={styles.infoValue}>
              {user.address.city}, {user.address.zipcode}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="navigate" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Coordinates</Text>
            <Text style={styles.infoValue}>
              Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}
            </Text>
          </View>
        </View>
      </View>

      {/* Deep Link Info */}
      <View style={styles.deepLinkInfo}>
        <Text style={styles.deepLinkTitle}>Deep Link Information</Text>
        <Text style={styles.deepLinkText}>
          This screen was opened via deep link: myapp://user/{userId}
        </Text>
        <Text style={styles.deepLinkText}>
          The user ID parameter was extracted from the URL and used to fetch user data.
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  refreshButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#111',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
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
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#000',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userUsername: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
  },
  userId: {
    fontSize: 14,
    color: '#ccc',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  section: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ccc',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  deepLinkInfo: {
    backgroundColor: '#1a1a2e',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffffff',
  },
  deepLinkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  deepLinkText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 5,
    lineHeight: 20,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserDetailsScreen;
