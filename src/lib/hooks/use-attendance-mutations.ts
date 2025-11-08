import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import {
  MarkAttendanceFormData,
  ProcessDailyAttendanceData,
} from '../schemas/attendance-schemas';
import { AttendanceService } from '../services/attendance-service';
import { LocationGPSService } from '../services/location-gps-service';

/**
 * Hook for marking attendance
 */
export const useMarkAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAttendanceFormData) => AttendanceService.markAttendance(data),
    onSuccess: (response) => {
      if (response.success || response.attendance) {
        // Invalidate attendance queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
        Alert.alert(
          'Success',
          response.message || 'Attendance marked successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to previous screen
                setTimeout(() => {
                  try {
                    router.back();
                  } catch (error) {
                    console.warn('Navigation failed after marking attendance');
                  }
                }, 100);
              },
            },
          ]
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to mark attendance';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to mark attendance';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for marking attendance without navigation (for silent operations)
 */
export const useMarkAttendanceSilentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAttendanceFormData) => AttendanceService.markAttendance(data),
    onSuccess: (response) => {
      if (response.success || response.attendance) {
        // Invalidate attendance queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
      }
    },
    onError: (error: any) => {
      console.error('Silent attendance marking failed:', error.message);
    },
  });
};

/**
 * Hook for processing daily attendance
 */
export const useProcessDailyAttendanceMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ProcessDailyAttendanceData) => 
      AttendanceService.processDailyAttendance(data.process_date),
    onSuccess: (data) => {
      // Invalidate attendance queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      
      Alert.alert(
        "Success",
        data.message || "Daily attendance processed successfully",
        [{ text: "OK" }]
      );
    },
    onError: (error: any) => {
      console.error("Process daily attendance error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to process daily attendance",
        [{ text: "OK" }]
      );
    },
  });
};

/**
 * Hook for processing daily attendance without alert (for silent operations)
 */
export const useProcessDailyAttendanceSilentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProcessDailyAttendanceData) => 
      AttendanceService.processDailyAttendance(data.process_date),
    onSuccess: () => {
      // Invalidate attendance queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (error: any) => {
      console.error("Process daily attendance error:", error);
    },
  });
};

/**
 * Hook for bulk marking attendance (if needed for multiple employees)
 */
export const useBulkMarkAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attendanceData: MarkAttendanceFormData[]) => {
      const results = await Promise.allSettled(
        attendanceData.map(data => AttendanceService.markAttendance(data))
      );
      
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return {
        successful,
        failed,
        total: attendanceData.length,
        results,
      };
    },
    onSuccess: (response) => {
      // Invalidate attendance queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      
      if (response.failed === 0) {
        Alert.alert(
          'Success',
          `All ${response.successful} attendance records marked successfully!`
        );
      } else {
        Alert.alert(
          'Partial Success',
          `${response.successful} records marked successfully, ${response.failed} failed.`
        );
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to mark bulk attendance';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for quick check-in (simplified attendance marking)
 */
export const useQuickCheckInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: number) => {
      const now = new Date();
      
      // Get current GPS location
      let latitude: number | undefined;
      let longitude: number | undefined;
      
      try {
        const hasPermission = await LocationGPSService.handleLocationPermissionFlow();
        if (hasPermission) {
          const locationData = await LocationGPSService.getCurrentLocation();
          latitude = locationData.latitude;
          longitude = locationData.longitude;
        }
      } catch (error) {
        console.warn('Failed to get location for check-in:', error);
        // Continue without location data
      }
      
      const attendanceData: MarkAttendanceFormData = {
        employee_id: employeeId,
        attendance_date: now.toISOString().split('T')[0], // YYYY-MM-DD format
        check_in_time: now.toISOString(),
        latitude,
        longitude,
        bio_check_in: true, // Set to true since biometric authentication was used
        bio_check_out: false,
        remarks: 'Quick check-in with GPS location',
      };
      console.log('📤 Sending check-in data to hr/attendance/mark:', JSON.stringify(attendanceData, null, 2));
      return AttendanceService.markAttendance(attendanceData);
    },
    onSuccess: (response) => {
      console.log('✅ Check-in successful response from hr/attendance/mark:', JSON.stringify(response, null, 2));
      if (response.success || response.attendance) {
        // Invalidate attendance queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
        Alert.alert('Success', 'Checked in successfully!');
      } else {
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to check in';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to check in';
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for quick check-out (update existing attendance record)
 */
export const useQuickCheckOutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: number) => {
      const now = new Date();
      
      // Get current GPS location
      let latitude: number | undefined;
      let longitude: number | undefined;
      
      try {
        const hasPermission = await LocationGPSService.handleLocationPermissionFlow();
        if (hasPermission) {
          const locationData = await LocationGPSService.getCurrentLocation();
          latitude = locationData.latitude;
          longitude = locationData.longitude;
        }
      } catch (error) {
        console.warn('Failed to get location for check-out:', error);
        // Continue without location data
      }
      
      const attendanceData: MarkAttendanceFormData = {
        employee_id: employeeId,
        attendance_date: now.toISOString().split('T')[0], // YYYY-MM-DD format
        check_in_time: now.toISOString(), // This might need to be the original check-in time
        check_out_time: now.toISOString(),
        latitude,
        longitude,
        bio_check_in: false, // Keep existing check-in bio status
        bio_check_out: true, // Set to true since biometric authentication was used for check-out
        remarks: 'Quick check-out with GPS location',
      };
      console.log('📤 Sending check-out data to hr/attendance/mark:', JSON.stringify(attendanceData, null, 2));
      return AttendanceService.markAttendance(attendanceData);
    },
    onSuccess: (response) => {
      console.log('✅ Check-out successful response from hr/attendance/mark:', JSON.stringify(response, null, 2));
      if (response.success || response.attendance) {
        // Invalidate attendance queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
        Alert.alert('Success', 'Checked out successfully!');
      } else {
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.message || 'Failed to check out';
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to check out';
      Alert.alert('Error', errorMessage);
    },
  });
};