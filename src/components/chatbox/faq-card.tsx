import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface FAQCardProps {
  faq: {
    id: string;
    question: string;
    category: string;
    icon: string;
    answer: string;
  };
  onPress: (faq: any) => void;
  isDark: boolean;
}

export default function FAQCard({ faq, onPress, isDark }: FAQCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      HOURS: '#FF6B6B',
      DELIVERY: '#4ECDC4',
      MENU: '#45B7D1',
      RESERVATIONS: '#96CEB4',
      AMENITIES: '#FFEAA7',
      PAYMENT: '#DDA0DD'
    };
    return colors[category] || '#A67C52';
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(faq)}
      className={`p-4 rounded-xl mr-3 min-w-[280px] ${
        isDark ? 'bg-primary-dark' : 'bg-primary-light'
      }`}
      style={{
        shadowColor: isDark ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center mb-3">
        <View 
          className="w-8 h-8 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: getCategoryColor(faq.category) + '20' }}
        >
          <FontAwesome5 
            name={faq.icon} 
            size={14} 
            color={getCategoryColor(faq.category)} 
          />
        </View>
        <View className="flex-1">
          <Text className={`text-xs font-medium mb-1 ${
            isDark ? 'text-text-secondary-dark' : 'text-text-secondary'
          }`}>
            {faq.category}
          </Text>
        </View>
      </View>
      
      <Text className={`text-sm font-medium leading-5 ${
        isDark ? 'text-text-primary-dark' : 'text-text-primary'
      }`}>
        {faq.question}
      </Text>
    </TouchableOpacity>
  );
}