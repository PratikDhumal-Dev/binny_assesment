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
    
    // Get device name
    NSString *deviceName = device.name;
    
    // Get system version
    NSString *systemVersion = device.systemVersion;
    
    // Get system name
    NSString *systemName = device.systemName;
    
    // Get device orientation
    UIDeviceOrientation orientation = device.orientation;
    NSString *orientationString;
    switch (orientation) {
        case UIDeviceOrientationPortrait:
            orientationString = @"Portrait";
            break;
        case UIDeviceOrientationPortraitUpsideDown:
            orientationString = @"Portrait Upside Down";
            break;
        case UIDeviceOrientationLandscapeLeft:
            orientationString = @"Landscape Left";
            break;
        case UIDeviceOrientationLandscapeRight:
            orientationString = @"Landscape Right";
            break;
        default:
            orientationString = @"Unknown";
            break;
    }
    
    // Get battery level
    device.batteryMonitoringEnabled = YES;
    float batteryLevel = device.batteryLevel;
    
    // Get battery state
    UIDeviceBatteryState batteryState = device.batteryState;
    NSString *batteryStateString;
    switch (batteryState) {
        case UIDeviceBatteryStateUnknown:
            batteryStateString = @"Unknown";
            break;
        case UIDeviceBatteryStateUnplugged:
            batteryStateString = @"Unplugged";
            break;
        case UIDeviceBatteryStateCharging:
            batteryStateString = @"Charging";
            break;
        case UIDeviceBatteryStateFull:
            batteryStateString = @"Full";
            break;
        default:
            batteryStateString = @"Unknown";
            break;
    }
    
    // Create device info dictionary
    NSDictionary *deviceInfo = @{
        @"osVersion": systemVersion,
        @"osName": systemName,
        @"deviceModel": deviceModel,
        @"deviceName": deviceName,
        @"orientation": orientationString,
        @"batteryLevel": @(batteryLevel),
        @"batteryState": batteryStateString,
        @"platform": @"iOS"
    };
    
    callback(@[deviceInfo]);
}

@end
