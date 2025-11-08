import { useQuery } from '@tanstack/react-query';
import { GetAttendanceQueryParams, GetAttendanceSummaryQueryParams } from '../schemas/attendance-schemas';
import { AttendanceService } from '../services/attendance-service';

/**
 * Hook for fetching attendance records with optional filtering
 */
export const useAttendance = (params?: GetAttendanceQueryParams) => {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: () => AttendanceService.getAttendance(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching attendance records for a specific employee
 */
export const useEmployeeAttendance = (
  employeeId: number | undefined,
  params?: Omit<GetAttendanceQueryParams, 'employee_id'>
) => {
  const queryParams = employeeId ? { ...params, employee_id: employeeId } : undefined;

  return useQuery({
    queryKey: ['attendance', 'employee', employeeId, params],
    queryFn: () => {
      if (!employeeId) {
        throw new Error('Employee ID is required');
      }
      return AttendanceService.getAttendance(queryParams);
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching attendance records within a date range
 */
export const useAttendanceByDateRange = (
  startDate: string | undefined,
  endDate: string | undefined,
  params?: Omit<GetAttendanceQueryParams, 'start_date' | 'end_date'>
) => {
  const queryParams = startDate && endDate ? { ...params, start_date: startDate, end_date: endDate } : undefined;

  return useQuery({
    queryKey: ['attendance', 'dateRange', startDate, endDate, params],
    queryFn: () => {
      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }
      return AttendanceService.getAttendance(queryParams);
    },
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching attendance records by status
 */
export const useAttendanceByStatus = (
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | undefined,
  params?: Omit<GetAttendanceQueryParams, 'status'>
) => {
  const queryParams = status ? { ...params, status } : undefined;

  return useQuery({
    queryKey: ['attendance', 'status', status, params],
    queryFn: () => {
      if (!status) {
        throw new Error('Status is required');
      }
      return AttendanceService.getAttendance(queryParams);
    },
    enabled: !!status,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching paginated attendance records
 */
export const usePaginatedAttendance = (page: number = 0, limit: number = 10) => {
  const skip = page * limit;

  return useQuery({
    queryKey: ['attendance', 'paginated', page, limit],
    queryFn: () => AttendanceService.getAttendance({ skip, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching attendance summary for an employee
 */
export const useAttendanceSummary = (
  employeeId: number | undefined,
  params: GetAttendanceSummaryQueryParams | undefined
) => {
  return useQuery({
    queryKey: ['attendance', 'summary', employeeId, params],
    queryFn: () => {
      if (!employeeId) {
        throw new Error('Employee ID is required');
      }
      if (!params) {
        throw new Error('Month and year parameters are required');
      }
      return AttendanceService.getAttendanceSummary(employeeId, params);
    },
    enabled: !!employeeId && !!params,
    staleTime: 10 * 60 * 1000, // 10 minutes (summary data changes less frequently)
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching current month attendance summary for an employee
 */
export const useCurrentMonthAttendanceSummary = (employeeId: number | undefined) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = currentDate.getFullYear();

  return useAttendanceSummary(employeeId, {
    month: currentMonth,
    year: currentYear,
  });
};

/**
 * Hook for fetching attendance summary for a specific month and year
 */
export const useMonthlyAttendanceSummary = (
  employeeId: number | undefined,
  month: number | undefined,
  year: number | undefined
) => {
  const params = month && year ? { month, year } : undefined;
  return useAttendanceSummary(employeeId, params);
};