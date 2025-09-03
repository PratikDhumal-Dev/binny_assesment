import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getDeviceInfo, DeviceInfo } from '../native/DeviceInfoModule';

const DeviceInfoScreen = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await getDeviceInfo();
      setDeviceInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load device info');
      Alert.alert('Error', 'Failed to load device information');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderInfoSection = (title: string, data: Record<string, any>) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {Object.entries(data).map(([key, value]) => (
        <View key={key} style={styles.infoRow}>
          <Text style={styles.infoLabel}>{key}:</Text>
          <Text style={styles.infoValue}>
            {typeof value === 'number' && (key.includes('Memory') || key.includes('Storage'))
              ? formatBytes(value)
              : String(value)}
          </Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading device information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={80} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDeviceInfo}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!deviceInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No device information available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Device Information</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadDeviceInfo}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* OS Information */}
        {renderInfoSection('Operating System', {
          'OS Name': deviceInfo.osName,
          'OS Version': deviceInfo.osVersion,
          'Platform': deviceInfo.platform,
          ...(deviceInfo.apiLevel && { 'API Level': deviceInfo.apiLevel }),
          ...(deviceInfo.buildNumber && { 'Build Number': deviceInfo.buildNumber }),
        })}

        {/* Device Information */}
        {renderInfoSection('Device Details', {
          ...(deviceInfo.deviceModel && { 'Model': deviceInfo.deviceModel }),
          ...(deviceInfo.deviceName && { 'Name': deviceInfo.deviceName }),
          ...(deviceInfo.manufacturer && { 'Manufacturer': deviceInfo.manufacturer }),
          ...(deviceInfo.brand && { 'Brand': deviceInfo.brand }),
          ...(deviceInfo.product && { 'Product': deviceInfo.product }),
          ...(deviceInfo.device && { 'Device': deviceInfo.device }),
          ...(deviceInfo.hardware && { 'Hardware': deviceInfo.hardware }),
        })}

        {/* App Information */}
        {renderInfoSection('Application', {
          ...(deviceInfo.appVersion && { 'Version': deviceInfo.appVersion }),
          ...(deviceInfo.appVersionCode && { 'Version Code': deviceInfo.appVersionCode }),
        })}

        {/* Screen Information */}
        {renderInfoSection('Display', {
          ...(deviceInfo.screenWidth && { 'Width': `${deviceInfo.screenWidth}px` }),
          ...(deviceInfo.screenHeight && { 'Height': `${deviceInfo.screenHeight}px` }),
          ...(deviceInfo.screenDensity && { 'Density': deviceInfo.screenDensity }),
          ...(deviceInfo.screenDensityDpi && { 'DPI': deviceInfo.screenDensityDpi }),
        })}

        {/* Memory Information */}
        {renderInfoSection('Memory', {
          ...(deviceInfo.totalMemory && { 'Total': formatBytes(deviceInfo.totalMemory) }),
          ...(deviceInfo.availableMemory && { 'Available': formatBytes(deviceInfo.availableMemory) }),
          ...(deviceInfo.usedMemory && { 'Used': formatBytes(deviceInfo.usedMemory) }),
        })}

        {/* Storage Information */}
        {renderInfoSection('Storage', {
          ...(deviceInfo.totalStorage && { 'Total': formatBytes(deviceInfo.totalStorage) }),
          ...(deviceInfo.availableStorage && { 'Available': formatBytes(deviceInfo.availableStorage) }),
          ...(deviceInfo.usedStorage && { 'Used': formatBytes(deviceInfo.usedStorage) }),
        })}

        {/* Network Information */}
        {renderInfoSection('Network', {
          ...(deviceInfo.networkType && { 'Type': deviceInfo.networkType }),
          ...(deviceInfo.isConnected !== undefined && { 'Connected': deviceInfo.isConnected ? 'Yes' : 'No' }),
        })}

        {/* Battery Information */}
        {renderInfoSection('Battery', {
          ...(deviceInfo.batteryLevel !== undefined && { 'Level': `${Math.round(deviceInfo.batteryLevel)}%` }),
          ...(deviceInfo.batteryState && { 'State': deviceInfo.batteryState }),
        })}

        {/* Orientation (iOS) */}
        {deviceInfo.orientation && renderInfoSection('Orientation', {
          'Current': deviceInfo.orientation,
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#111',
    margin: 10,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#ccc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeviceInfoScreen;
