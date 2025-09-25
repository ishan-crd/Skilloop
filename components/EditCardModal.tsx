import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EditCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (userInfo: UserInfo) => void;
  currentUserInfo: UserInfo;
}

interface UserInfo {
  name: string;
  jobTitle: string;
  company: string;
  website: string;
  socialProfiles: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    figma?: string;
    upwork?: string;
  };
}

export default function EditCardModal({ visible, onClose, onSave, currentUserInfo }: EditCardModalProps) {
  console.log('EditCardModal rendered with visible:', visible);
  const [userInfo, setUserInfo] = useState<UserInfo>(currentUserInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!userInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!userInfo.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!userInfo.company.trim()) {
      newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(userInfo);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Card</Text>
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
            <View style={styles.previewCard}>
              <View style={styles.previewProfileImage}>
                <Text style={styles.previewImageText}>👤</Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewName}>{userInfo.name || 'Your Name'}</Text>
                <Text style={styles.previewRole}>{userInfo.jobTitle || 'Your Job Title'}</Text>
                <Text style={styles.previewCompany}>{userInfo.company || 'Your Company'}</Text>
                {userInfo.website && (
                  <Text style={styles.previewWebsite}>{userInfo.website}</Text>
                )}
                <View style={styles.previewSocialIcons}>
                  {userInfo.socialProfiles?.linkedin && (
                    <View style={[styles.previewSocialIcon, styles.linkedinIcon]}>
                      <Text style={[styles.previewSocialText, styles.linkedinText]}>in</Text>
                    </View>
                  )}
                  {userInfo.socialProfiles?.instagram && (
                    <View style={styles.previewSocialIcon}>
                      <Text style={styles.previewSocialText}>📷</Text>
                    </View>
                  )}
                  {userInfo.socialProfiles?.twitter && (
                    <View style={styles.previewSocialIcon}>
                      <Text style={styles.previewSocialText}>X</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={userInfo.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={[styles.input, errors.age ? styles.inputError : null]}
                value={userInfo.age}
                onChangeText={(value) => handleInputChange('age', value)}
                keyboardType="numeric"
                placeholder="Enter your age"
              />
              {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderOption,
                      userInfo.gender === gender && styles.genderOptionSelected,
                      errors.gender && !userInfo.gender && styles.genderOptionError,
                    ]}
                    onPress={() => handleInputChange('gender', gender)}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      userInfo.gender === gender && styles.genderOptionTextSelected,
                    ]}>
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={[styles.input, errors.location ? styles.inputError : null]}
                value={userInfo.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="Enter your location"
              />
              {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
            </View>
          </View>

          {/* Professional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Job Title</Text>
              <TextInput
                style={[styles.input, errors.jobTitle ? styles.inputError : null]}
                value={userInfo.jobTitle}
                onChangeText={(value) => handleInputChange('jobTitle', value)}
                placeholder="Enter your job title"
              />
              {errors.jobTitle ? <Text style={styles.errorText}>{errors.jobTitle}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company</Text>
              <TextInput
                style={[styles.input, errors.company ? styles.inputError : null]}
                value={userInfo.company}
                onChangeText={(value) => handleInputChange('company', value)}
                placeholder="Enter your company"
              />
              {errors.company ? <Text style={styles.errorText}>{errors.company}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Website (Optional)</Text>
              <TextInput
                style={styles.input}
                value={userInfo.website}
                onChangeText={(value) => handleInputChange('website', value)}
                placeholder="Enter your website URL"
              />
            </View>
          </View>

          {/* Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About You</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio (minimum 10 words)</Text>
              <TextInput
                style={[styles.bioInput, errors.bio ? styles.inputError : null]}
                value={userInfo.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                placeholder="Tell us about yourself..."
                multiline
                numberOfLines={4}
              />
              {errors.bio ? <Text style={styles.errorText}>{errors.bio}</Text> : null}
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
    backgroundColor: '#FFFFFF',
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
    color: '#000',
    marginBottom: 4,
  },
  previewRole: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#000',
    marginBottom: 4,
  },
  previewCompany: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#000',
    marginBottom: 8,
  },
  previewWebsite: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#3B82F6',
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'MontserratRegular',
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  genderOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  genderOptionError: {
    borderColor: '#EF4444',
  },
  genderOptionText: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
  },
  genderOptionTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'MontserratSemiBold',
  },
});
