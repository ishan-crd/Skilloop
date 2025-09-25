import React, { useState } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EditProfileImagesModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (images: string[]) => void;
  currentImages: string[];
}

export default function EditProfileImagesModal({ visible, onClose, onSave, currentImages }: EditProfileImagesModalProps) {
  const [images, setImages] = useState<string[]>(currentImages);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleReplaceImage = (index: number) => {
    Alert.alert(
      'Replace Image',
      'Choose how you want to replace this image:',
      [
        { text: 'Take Photo', onPress: () => handleTakePhoto(index) },
        { text: 'Choose from Gallery', onPress: () => handleChooseFromGallery(index) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleTakePhoto = (index: number) => {
    // TODO: Implement camera functionality
    Alert.alert('Camera', 'Camera functionality will be implemented soon');
  };

  const handleChooseFromGallery = (index: number) => {
    // TODO: Implement image picker functionality
    Alert.alert('Gallery', 'Image picker functionality will be implemented soon');
  };

  const handleAddNewImage = () => {
    if (images.length >= 4) {
      Alert.alert('Limit Reached', 'You can only have up to 4 profile images');
      return;
    }
    
    Alert.alert(
      'Add New Image',
      'Choose how you want to add a new image:',
      [
        { text: 'Take Photo', onPress: () => handleTakePhoto(images.length) },
        { text: 'Choose from Gallery', onPress: () => handleChooseFromGallery(images.length) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 2) {
      Alert.alert('Minimum Required', 'You must have at least 2 profile images');
      return;
    }
    
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
          }
        }
      ]
    );
  };

  const handleSave = () => {
    if (images.length < 2) {
      Alert.alert('Error', 'You must have at least 2 profile images');
      return;
    }
    onSave(images);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile Images</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Profile Images</Text>
            <Text style={styles.subtitle}>Tap on an image to replace it. You need at least 2 images.</Text>
            
            <View style={styles.imagesGrid}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <TouchableOpacity
                    style={[
                      styles.imageWrapper,
                      selectedImageIndex === index && styles.selectedImage
                    ]}
                    onPress={() => handleImagePress(index)}
                  >
                    <Image source={{ uri: image }} style={styles.profileImage} />
                    <View style={styles.imageOverlay}>
                      <Text style={styles.imageNumber}>{index + 1}</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.imageActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleReplaceImage(index)}
                    >
                      <Text style={styles.actionButtonText}>Replace</Text>
                    </TouchableOpacity>
                    {images.length > 2 && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.removeButton]}
                        onPress={() => handleRemoveImage(index)}
                      >
                        <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
              
              {images.length < 4 && (
                <TouchableOpacity style={styles.addImageContainer} onPress={handleAddNewImage}>
                  <View style={styles.addImageWrapper}>
                    <Text style={styles.addImageIcon}>+</Text>
                    <Text style={styles.addImageText}>Add Image</Text>
                  </View>
                </TouchableOpacity>
              )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    marginBottom: 20,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImage: {
    borderColor: '#3B82F6',
  },
  profileImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'MontserratBold',
  },
  imageActions: {
    marginTop: 8,
    gap: 4,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
  },
  removeButton: {
    backgroundColor: '#EF4444',
  },
  removeButtonText: {
    color: '#FFFFFF',
  },
  addImageContainer: {
    width: '48%',
    marginBottom: 20,
  },
  addImageWrapper: {
    height: 150,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  addImageIcon: {
    fontSize: 32,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  addImageText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#9CA3AF',
  },
});
