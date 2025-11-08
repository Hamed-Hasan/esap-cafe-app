import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const getButtonStyles = () => {
    let baseStyles = 'rounded-xl items-center justify-center flex-row';
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyles += ' px-4 py-2';
        break;
      case 'medium':
        baseStyles += ' px-6 py-3';
        break;
      case 'large':
        baseStyles += ' px-8 py-4';
        break;
    }
    
    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyles += disabled || loading ? ' bg-text-muted dark:bg-text-muted-dark' : ' bg-primary dark:bg-primary-dark';
        break;
      case 'secondary':
        baseStyles += disabled || loading ? ' bg-text-muted dark:bg-text-muted-dark' : ' bg-secondary dark:bg-secondary-dark';
        break;
      case 'outline':
        baseStyles += ` border-2 ${disabled || loading ? 'border-text-muted dark:border-text-muted-dark bg-transparent' : 'border-primary dark:border-primary-dark bg-transparent'}`;
        break;
    }
    
    return baseStyles;
  };
  
  const getTextStyles = () => {
    let textStyles = 'font-semibold';
    
    // Size text styles
    switch (size) {
      case 'small':
        textStyles += ' text-sm';
        break;
      case 'medium':
        textStyles += ' text-base';
        break;
      case 'large':
        textStyles += ' text-lg';
        break;
    }
    
    // Variant text styles
    switch (variant) {
      case 'primary':
      case 'secondary':
        textStyles += ' text-text-primary-dark dark:text-text-primary-dark';
        break;
      case 'outline':
        textStyles += disabled || loading ? ' text-text-muted dark:text-text-muted-dark' : ' text-primary dark:text-primary-dark';
        break;
    }
    
    return textStyles;
  };

  return (
    <TouchableOpacity
      className={`${getButtonStyles()} ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#482C20' : '#FFFFFF'} // Will use theme colors when React Native supports it
          className="mr-2"
        />
      )}
      <Text className={getTextStyles()}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;