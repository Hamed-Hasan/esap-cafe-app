import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import {
  ChangePasswordFormData,
  LoginFormData,
  RegisterFormData
} from '../schemas/auth-schemas';
import { AuthService } from '../services/auth-service';
import { EmployeeService } from '../services/employee-service';
import { useAuth } from '../store/auth-store';

/**
 * Hook for user registration
 */
export const useRegisterMutation = () => {
  const { setLoading, setError, clearError } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterFormData) => AuthService.register(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      console.log('Registration response:', response);
      setLoading(false);
      if (response.id && response.email) {
        // Registration successful - response contains user data directly
        Alert.alert(
          'Success',
          'Account created successfully! Please sign in.',
          [
            {
              text: 'OK',
              onPress: () => {
                try {
                  router.push('/sign-in');
                } catch (error) {
                  console.warn('Navigation failed after registration');
                }
              },
            },
          ]
        );
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail) 
          ? response.detail.join(', ') 
          : response.detail || response.message || 'Registration failed';
        console.log('Registration failed:', errorMessage);
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      console.log('Registration mutation error:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
      setLoading(false);
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    },
  });
};

/**
 * Hook for user login
 */
export const useLoginMutation = () => {
  const { setLoading, setError, clearError, login, setEmployeeLoading, setEmployeeError } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) => AuthService.login(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: async (response) => {
      setLoading(false);
      if (response.access_token && response.user) {
        // Login successful - response contains user and tokens directly
        // Map the response user to match the full User interface
        const fullUser = {
          ...response.user,
          profile_image: null,
          password_reset_token: null,
          password_reset_expires: null,
          verification_token: null,
          verification_expires: null,
          is_deleted: false,
          hashed_password: '',
          failed_login_attempts: 0,
          locked_until: null,
        };
        
        // First set user and token
        login(fullUser, response.access_token);
        
        // Try to fetch employee data for this user
        setEmployeeLoading(true);
        setEmployeeError(null);
        
        try {
          const employeeResponse = await EmployeeService.getEmployeeByUserId(fullUser.id);
          // Update the login with employee data
          login(fullUser, response.access_token, employeeResponse.employee);
        } catch (employeeError: any) {
          // If employee fetch fails, continue with login but log the error
          console.warn('Failed to fetch employee data:', employeeError);
          const errorMsg = employeeError.response?.data?.message || 'Failed to fetch employee data';
          setEmployeeError(errorMsg);
        } finally {
          setEmployeeLoading(false);
        }
        
        // Invalidate and refetch user-related queries
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['employee'] });
        
        // Navigate to main app
        setTimeout(() => {
          try {
            router.replace('/');
          } catch (error) {
            console.warn('Navigation failed after login');
          }
        }, 100);
      } else {
        // Handle error response
        const errorMessage = Array.isArray(response.detail) 
          ? response.detail.join(', ') 
          : response.detail || response.message || 'Login failed';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      setLoading(false);
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    },
  });
};







/**
 * Hook for change password
 */
export const useChangePasswordMutation = () => {
  const { setLoading, setError, clearError } = useAuth();

  return useMutation({
    mutationFn: (data: ChangePasswordFormData) => AuthService.changePassword(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      if (response.success || response.message) {
        Alert.alert(
          'Success',
          response.message || 'Password changed successfully.',
        );
      } else {
        const errorMessage = Array.isArray(response.detail)
          ? response.detail.join(', ')
          : response.detail || response.error || 'Password change failed';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    },
    onError: (error: any) => {
      setLoading(false);
      const errorMessage = error.message || 'Password change failed';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    },
  });
};



/**
 * Hook for user logout
 */
export const useLogoutMutation = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      logout();
      // Use setTimeout to ensure navigation happens after state updates
      setTimeout(() => {
        try {
          router.replace('/sign-in');
        } catch (error) {
          console.warn('Navigation failed, user will need to manually navigate to sign-in');
        }
      }, 100);
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};