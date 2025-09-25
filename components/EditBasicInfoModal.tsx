import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface BasicInfo {
  name: string;
  age: string;
  gender: string;
  location: string;
  bio: string;
}

interface EditBasicInfoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (info: BasicInfo) => void;
  currentInfo: BasicInfo;
}

export default function EditBasicInfoModal({ visible, onClose, onSave, currentInfo }: EditBasicInfoModalProps) {
  const [info, setInfo] = useState<BasicInfo>(currentInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof BasicInfo, value: string) => {
    setInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!info.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!info.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(info.age)) || Number(info.age) < 18 || Number(info.age) > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    if (!info.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }
    if (!info.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(info);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Basic Info</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={info.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={[styles.input, errors.age ? styles.inputError : null]}
                value={info.age}
                onChangeText={(value) => handleInputChange('age', value)}
                placeholder="Enter your age"
                keyboardType="numeric"
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
                      info.gender === gender && styles.genderOptionSelected,
                      errors.gender && info.gender !== gender && styles.genderOptionError
                    ]}
                    onPress={() => handleInputChange('gender', gender)}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      info.gender === gender && styles.genderOptionTextSelected
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
                value={info.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="Enter your location"
              />
              {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.bioInput, errors.bio ? styles.inputError : null]}
                value={info.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                placeholder="Tell us about yourself..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    color: '#000',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    paddingBottom: 100,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    color: '#EF4444',
    marginTop: 4,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  genderOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  genderOptionError: {
    borderColor: '#EF4444',
  },
  genderOptionText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#1F2937',
  },
  genderOptionTextSelected: {
    color: '#FFFFFF',
  },
});
