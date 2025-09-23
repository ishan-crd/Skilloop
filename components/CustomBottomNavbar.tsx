import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomBottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      id: 'discover',
      label: 'Discover',
      icon: '🧭',
      path: '/discover',
    },
    {
      id: 'matches',
      label: 'Matches',
      icon: '🤝',
      path: '/matches',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '💬',
      path: '/messages',
    },
    {
      id: 'profile',
      label: 'Hub',
      icon: '🏠',
      path: '/profile',
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.navItem}
          onPress={() => handleNavigation(item.path)}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={[
            styles.label,
            isActive(item.path) && styles.activeLabel
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingBottom: 0,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    width: '100%',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  icon: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
    color: '#6B7280',
  },
  activeLabel: {
    color: '#000000',
  },
});

export default CustomBottomNavbar;
