import { NativeModules } from 'react-native';

interface DeviceInfo {
  // OS Information
  osVersion: string;
  osName: string;
  platform: string;
  
  // iOS specific
  deviceModel?: string;
  deviceName?: string;
  orientation?: string;
  batteryLevel?: number;
  batteryState?: string;
  
  // Android specific
  apiLevel?: number;
  buildNumber?: string;
  manufacturer?: string;
  brand?: string;
  product?: string;
  device?: string;
  hardware?: string;
  appVersion?: string;
  appVersionCode?: number;
  screenWidth?: number;
  screenHeight?: number;
  screenDensity?: number;
  screenDensityDpi?: number;
  totalMemory?: number;
  availableMemory?: number;
  usedMemory?: number;
  totalStorage?: number;
  availableStorage?: number;
  usedStorage?: number;
  networkType?: string;
  isConnected?: boolean;
}

interface DeviceInfoModuleInterface {
  getDeviceInfo(callback: (deviceInfo: DeviceInfo | { error: string }) => void): void;
}

const { DeviceInfoModule } = NativeModules;

export const getDeviceInfo = (): Promise<DeviceInfo> => {
  return new Promise((resolve, reject) => {
    if (DeviceInfoModule) {
      DeviceInfoModule.getDeviceInfo((result: DeviceInfo | { error: string }) => {
        if ('error' in result) {
          reject(new Error(result.error));
        } else {
          resolve(result);
        }
      });
    } else {
      reject(new Error('DeviceInfoModule not available'));
    }
  });
};

export type { DeviceInfo };
