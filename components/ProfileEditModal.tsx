import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => void;
  currentData: any;
  editType: 'basic' | 'images' | 'experience' | 'skills' | 'social';
}

export default function ProfileEditModal({ visible, onClose, onSave, currentData, editType }: ProfileEditModalProps) {
  const [editedData, setEditedData] = useState(currentData);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImagePicker = async (index: number) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newImages = [...(editedData.profileImages || [])];
        newImages[index] = result.assets[0].uri;
        
        // Ensure we don't exceed the maximum number of images (3)
        const trimmedImages = newImages.slice(0, 3);
        
        setEditedData({ ...editedData, profileImages: trimmedImages });
        setSelectedImageIndex(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTextChange = (field: string, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleArrayItemChange = (field: string, index: number, value: string) => {
    const newArray = [...(editedData[field] || [])];
    newArray[index] = value;
    setEditedData({ ...editedData, [field]: newArray });
  };

  const handleAddArrayItem = (field: string) => {
    const newArray = [...(editedData[field] || []), ''];
    setEditedData({ ...editedData, [field]: newArray });
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    const newArray = (editedData[field] || []).filter((_: any, i: number) => i !== index);
    setEditedData({ ...editedData, [field]: newArray });
  };

  const handleSocialChange = (platform: string, value: string) => {
    setEditedData({
      ...editedData,
      socialProfiles: {
        ...editedData.socialProfiles,
        [platform]: value,
      },
    });
  };

  const renderBasicInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={editedData.name || ''}
          onChangeText={(value) => handleTextChange('name', value)}
          placeholder="Enter your full name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={editedData.age?.toString() || ''}
          onChangeText={(value) => handleTextChange('age', value)}
          placeholder="Enter your age"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {['Male', 'Female', 'Other'].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderOption,
                editedData.gender === gender && styles.genderOptionSelected
              ]}
              onPress={() => handleTextChange('gender', gender)}
            >
              <Text style={[
                styles.genderOptionText,
                editedData.gender === gender && styles.genderOptionTextSelected
              ]}>
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={editedData.location || ''}
          onChangeText={(value) => handleTextChange('location', value)}
          placeholder="Enter your location"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={editedData.bio || ''}
          onChangeText={(value) => handleTextChange('bio', value)}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );

  const renderImages = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Profile Images</Text>
      <Text style={styles.sectionSubtitle}>Tap on any image to replace it (Maximum 3 images)</Text>
      
      <View style={styles.imagesContainer}>
        {[0, 1, 2].map((index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageContainer}
            onPress={() => setSelectedImageIndex(index)}
          >
            {editedData.profileImages?.[index] ? (
              <Image
                source={{ uri: editedData.profileImages[index] }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>+</Text>
              </View>
            )}
            <Text style={styles.imageLabel}>Image {index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedImageIndex !== null && (
        <View style={styles.imageActionContainer}>
          <Text style={styles.imageActionText}>
            Replace Image {selectedImageIndex + 1}?
          </Text>
          <View style={styles.imageActionButtons}>
            <TouchableOpacity
              style={styles.imageActionButton}
              onPress={() => handleImagePicker(selectedImageIndex)}
            >
              <Text style={styles.imageActionButtonText}>Choose New Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.imageActionButton, styles.cancelButton]}
              onPress={() => setSelectedImageIndex(null)}
            >
              <Text style={[styles.imageActionButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderExperience = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Work Experience</Text>
      
      {(editedData.workExperiences || []).map((exp: any, index: number) => (
        <View key={index} style={styles.experienceItem}>
          <Text style={styles.itemTitle}>Experience {index + 1}</Text>
          <TextInput
            style={styles.input}
            value={exp.company || ''}
            onChangeText={(value) => {
              const newExp = [...(editedData.workExperiences || [])];
              newExp[index] = { ...newExp[index], company: value };
              setEditedData({ ...editedData, workExperiences: newExp });
            }}
            placeholder="Company name"
          />
          <TextInput
            style={styles.input}
            value={exp.position || ''}
            onChangeText={(value) => {
              const newExp = [...(editedData.workExperiences || [])];
              newExp[index] = { ...newExp[index], position: value };
              setEditedData({ ...editedData, workExperiences: newExp });
            }}
            placeholder="Position/Title"
          />
          <TextInput
            style={styles.input}
            value={exp.duration || ''}
            onChangeText={(value) => {
              const newExp = [...(editedData.workExperiences || [])];
              newExp[index] = { ...newExp[index], duration: value };
              setEditedData({ ...editedData, workExperiences: newExp });
            }}
            placeholder="Duration (e.g., 2020-2023)"
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveArrayItem('workExperiences', index)}
          >
            <Text style={styles.removeButtonText}>Remove Experience</Text>
          </TouchableOpacity>
        </View>
      ))}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddArrayItem('workExperiences')}
      >
        <Text style={styles.addButtonText}>+ Add Experience</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkills = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills & Certificates</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Skills</Text>
        {(editedData.skills || []).map((skill: string, index: number) => (
          <View key={index} style={styles.arrayItem}>
            <TextInput
              style={styles.input}
              value={skill}
              onChangeText={(value) => handleArrayItemChange('skills', index, value)}
              placeholder="Enter a skill"
            />
            <TouchableOpacity
              style={styles.removeArrayButton}
              onPress={() => handleRemoveArrayItem('skills', index)}
            >
              <Text style={styles.removeArrayButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addArrayButton}
          onPress={() => handleAddArrayItem('skills')}
        >
          <Text style={styles.addArrayButtonText}>+ Add Skill</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Certificates</Text>
        {(editedData.certificates || []).map((cert: any, index: number) => (
          <View key={index} style={styles.arrayItem}>
            <TextInput
              style={styles.input}
              value={cert.name || ''}
              onChangeText={(value) => {
                const newCerts = [...(editedData.certificates || [])];
                newCerts[index] = { ...newCerts[index], name: value };
                setEditedData({ ...editedData, certificates: newCerts });
              }}
              placeholder="Certificate name"
            />
            <TouchableOpacity
              style={styles.removeArrayButton}
              onPress={() => handleRemoveArrayItem('certificates', index)}
            >
              <Text style={styles.removeArrayButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addArrayButton}
          onPress={() => handleAddArrayItem('certificates')}
        >
          <Text style={styles.addArrayButtonText}>+ Add Certificate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSocial = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Social Profiles</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>LinkedIn URL</Text>
        <TextInput
          style={styles.input}
          value={editedData.socialProfiles?.linkedin || ''}
          onChangeText={(value) => handleSocialChange('linkedin', value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Instagram URL</Text>
        <TextInput
          style={styles.input}
          value={editedData.socialProfiles?.instagram || ''}
          onChangeText={(value) => handleSocialChange('instagram', value)}
          placeholder="https://instagram.com/yourprofile"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>GitHub URL</Text>
        <TextInput
          style={styles.input}
          value={editedData.socialProfiles?.github || ''}
          onChangeText={(value) => handleSocialChange('github', value)}
          placeholder="https://github.com/yourprofile"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Figma URL</Text>
        <TextInput
          style={styles.input}
          value={editedData.socialProfiles?.figma || ''}
          onChangeText={(value) => handleSocialChange('figma', value)}
          placeholder="https://figma.com/@yourprofile"
        />
      </View>
    </View>
  );

  const renderContent = () => {
    switch (editType) {
      case 'basic':
        return renderBasicInfo();
      case 'images':
        return renderImages();
      case 'experience':
        return renderExperience();
      case 'skills':
        return renderSkills();
      case 'social':
        return renderSocial();
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (editType) {
      case 'basic':
        return 'Edit Basic Information';
      case 'images':
        return 'Edit Profile Images';
      case 'experience':
        return 'Edit Work Experience';
      case 'skills':
        return 'Edit Skills & Certificates';
      case 'social':
        return 'Edit Social Profiles';
      default:
        return 'Edit Profile';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{getTitle()}</Text>
          <TouchableOpacity 
            onPress={() => {
              // Validate profile images if editing images
              if (editType === 'images') {
                const validImages = (editedData.profileImages || []).filter(img => img && img.trim() !== '');
                if (validImages.length === 0) {
                  Alert.alert('Error', 'Please add at least one profile image');
                  return;
                }
                if (validImages.length > 3) {
                  Alert.alert('Error', 'Maximum 3 images allowed');
                  return;
                }
                // Update with only valid images
                editedData.profileImages = validImages;
              }
              onSave(editedData);
            }} 
            style={styles.saveButton}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderContent()}
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
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#374151',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
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
  bioInput: {
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
  genderOptionText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#1F2937',
  },
  genderOptionTextSelected: {
    color: '#FFFFFF',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageContainer: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  placeholderImage: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  imageLabel: {
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
  },
  imageActionContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  imageActionText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  imageActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageActionButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  imageActionButtonText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  experienceItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#FFFFFF',
  },
  arrayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeArrayButton: {
    marginLeft: 8,
    padding: 8,
  },
  removeArrayButtonText: {
    fontSize: 18,
    color: '#EF4444',
    fontFamily: 'MontserratBold',
  },
  addArrayButton: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addArrayButtonText: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
    color: '#FFFFFF',
  },
});
