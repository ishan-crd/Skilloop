import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomizeCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (customizations: CardCustomizations) => void;
  currentCustomizations: CardCustomizations;
}

interface CardCustomizations {
  cardBackgroundColor: string;
  textColor: string;
  nameColor: string;
  roleColor: string;
  websiteColor: string;
  socialIconBackground: string;
  socialIconTextColor: string;
}

const colorOptions = [
  { name: 'Default', value: '#FFFFFF', textColor: '#000000' },
  { name: 'Black', value: '#000000', textColor: '#FFFFFF' },
  { name: 'Blue', value: '#3B82F6', textColor: '#FFFFFF' },
  { name: 'Purple', value: '#8B5CF6', textColor: '#FFFFFF' },
  { name: 'Green', value: '#10B981', textColor: '#FFFFFF' },
  { name: 'Red', value: '#EF4444', textColor: '#FFFFFF' },
  { name: 'Orange', value: '#F59E0B', textColor: '#000000' },
  { name: 'Pink', value: '#EC4899', textColor: '#FFFFFF' },
];

export default function CustomizeCardModal({ visible, onClose, onSave, currentCustomizations }: CustomizeCardModalProps) {
  console.log('CustomizeCardModal rendered with visible:', visible);
  const [customizations, setCustomizations] = useState<CardCustomizations>(currentCustomizations);

  const handleColorChange = (field: keyof CardCustomizations, color: string, textColor: string) => {
    setCustomizations(prev => ({
      ...prev,
      [field]: color,
      ...(field === 'cardBackgroundColor' && { textColor, nameColor: textColor, roleColor: textColor, websiteColor: textColor })
    }));
  };

  const handleSave = () => {
    onSave(customizations);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Customize Card</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Live Preview Section */}
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Live Preview</Text>
            <View style={[styles.previewCard, { backgroundColor: customizations.cardBackgroundColor }]}>
              <View style={styles.previewProfileImage}>
                <Text style={styles.previewImageText}>👤</Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={[styles.previewName, { color: customizations.nameColor }]}>John Doe</Text>
                <Text style={[styles.previewRole, { color: customizations.roleColor }]}>Full Stack Developer</Text>
                <Text style={[styles.previewWebsite, { color: customizations.websiteColor }]}>Website/Portfolio</Text>
                <View style={styles.previewSocialIcons}>
                  <View style={[styles.previewSocialIcon, styles.linkedinIcon]}>
                    <Text style={[styles.previewSocialText, styles.linkedinText]}>in</Text>
                  </View>
                  <View style={styles.previewSocialIcon}>
                    <Text style={styles.previewSocialText}>📷</Text>
                  </View>
                  <View style={styles.previewSocialIcon}>
                    <Text style={styles.previewSocialText}>X</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* Card Background Color */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Background</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color.name}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    customizations.cardBackgroundColor === color.value && styles.selectedColor
                  ]}
                  onPress={() => handleColorChange('cardBackgroundColor', color.value, color.textColor)}
                >
                  <Text style={[styles.colorText, { color: color.textColor }]}>
                    {color.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Text Colors */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Text Colors</Text>
            
            <View style={styles.colorRow}>
              <Text style={styles.colorLabel}>Name Color:</Text>
              <View style={styles.colorGrid}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={`name-${color.name}`}
                    style={[
                      styles.smallColorOption,
                      { backgroundColor: color.value },
                      customizations.nameColor === color.value && styles.selectedColor
                    ]}
                    onPress={() => handleColorChange('nameColor', color.value, color.textColor)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.colorRow}>
              <Text style={styles.colorLabel}>Role Color:</Text>
              <View style={styles.colorGrid}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={`role-${color.name}`}
                    style={[
                      styles.smallColorOption,
                      { backgroundColor: color.value },
                      customizations.roleColor === color.value && styles.selectedColor
                    ]}
                    onPress={() => handleColorChange('roleColor', color.value, color.textColor)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.colorRow}>
              <Text style={styles.colorLabel}>Website Color:</Text>
              <View style={styles.colorGrid}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={`website-${color.name}`}
                    style={[
                      styles.smallColorOption,
                      { backgroundColor: color.value },
                      customizations.websiteColor === color.value && styles.selectedColor
                    ]}
                    onPress={() => handleColorChange('websiteColor', color.value, color.textColor)}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Social Icons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Icons</Text>
            
            <View style={styles.colorRow}>
              <Text style={styles.colorLabel}>Icon Background:</Text>
              <View style={styles.colorGrid}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={`social-bg-${color.name}`}
                    style={[
                      styles.smallColorOption,
                      { backgroundColor: color.value },
                      customizations.socialIconBackground === color.value && styles.selectedColor
                    ]}
                    onPress={() => handleColorChange('socialIconBackground', color.value, color.textColor)}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewSection: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  previewProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImageText: {
    fontSize: 24,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    marginBottom: 4,
  },
  previewRole: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    marginBottom: 8,
  },
  previewWebsite: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    marginBottom: 8,
  },
  previewSocialIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  previewSocialIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewSocialText: {
    fontSize: 10,
    fontFamily: 'MontserratBold',
    color: '#000',
  },
  linkedinIcon: {
    backgroundColor: '#0077B5',
  },
  linkedinText: {
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
  },
  title: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#3B82F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Add bottom padding to ensure content doesn't get cut off
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 80,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  smallColorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#3B82F6',
  },
  colorText: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorLabel: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#000',
    width: 120,
  },
});
