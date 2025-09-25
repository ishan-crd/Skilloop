import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface EditWorkExperienceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (experiences: WorkExperience[]) => void;
  currentExperiences: WorkExperience[];
}

export default function EditWorkExperienceModal({ visible, onClose, onSave, currentExperiences }: EditWorkExperienceModalProps) {
  const [experiences, setExperiences] = useState<WorkExperience[]>(currentExperiences);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newExperience, setNewExperience] = useState<WorkExperience>({
    id: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false,
  });

  const handleAddNew = () => {
    setEditingIndex(experiences.length);
    setNewExperience({
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setNewExperience({ ...experiences[index] });
  };

  const handleSaveExperience = () => {
    if (!newExperience.company.trim() || !newExperience.position.trim()) {
      Alert.alert('Error', 'Company and position are required');
      return;
    }

    const updatedExperiences = [...experiences];
    if (editingIndex === experiences.length) {
      // Adding new experience
      updatedExperiences.push(newExperience);
    } else {
      // Editing existing experience
      updatedExperiences[editingIndex!] = newExperience;
    }
    
    setExperiences(updatedExperiences);
    setEditingIndex(null);
    setNewExperience({
      id: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewExperience({
      id: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    });
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      'Delete Experience',
      'Are you sure you want to delete this work experience?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedExperiences = experiences.filter((_, i) => i !== index);
            setExperiences(updatedExperiences);
          }
        }
      ]
    );
  };

  const handleSave = () => {
    onSave(experiences);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Work Experience</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
                <Text style={styles.addButtonText}>+ Add Experience</Text>
              </TouchableOpacity>
            </View>

            {/* Existing Experiences */}
            {experiences.map((experience, index) => (
              <View key={experience.id} style={styles.experienceCard}>
                <View style={styles.experienceHeader}>
                  <View style={styles.experienceInfo}>
                    <Text style={styles.companyName}>{experience.company}</Text>
                    <Text style={styles.positionName}>{experience.position}</Text>
                    <Text style={styles.dateRange}>
                      {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                    </Text>
                  </View>
                  <View style={styles.experienceActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEdit(index)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(index)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {experience.description && (
                  <Text style={styles.description}>{experience.description}</Text>
                )}
              </View>
            ))}

            {/* Add/Edit Form */}
            {editingIndex !== null && (
              <View style={styles.editForm}>
                <Text style={styles.formTitle}>
                  {editingIndex === experiences.length ? 'Add New Experience' : 'Edit Experience'}
                </Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Company *</Text>
                  <TextInput
                    style={styles.input}
                    value={newExperience.company}
                    onChangeText={(value) => setNewExperience(prev => ({ ...prev, company: value }))}
                    placeholder="Enter company name"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Position *</Text>
                  <TextInput
                    style={styles.input}
                    value={newExperience.position}
                    onChangeText={(value) => setNewExperience(prev => ({ ...prev, position: value }))}
                    placeholder="Enter your position"
                  />
                </View>

                <View style={styles.dateRow}>
                  <View style={styles.dateInput}>
                    <Text style={styles.label}>Start Date</Text>
                    <TextInput
                      style={styles.input}
                      value={newExperience.startDate}
                      onChangeText={(value) => setNewExperience(prev => ({ ...prev, startDate: value }))}
                      placeholder="MM/YYYY"
                    />
                  </View>
                  <View style={styles.dateInput}>
                    <Text style={styles.label}>End Date</Text>
                    <TextInput
                      style={[styles.input, newExperience.current && styles.disabledInput]}
                      value={newExperience.endDate}
                      onChangeText={(value) => setNewExperience(prev => ({ ...prev, endDate: value }))}
                      placeholder="MM/YYYY"
                      editable={!newExperience.current}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.checkbox, newExperience.current && styles.checkboxSelected]}
                  onPress={() => setNewExperience(prev => ({ ...prev, current: !prev.current }))}
                >
                  <Text style={[styles.checkboxText, newExperience.current && styles.checkboxTextSelected]}>
                    ✓
                  </Text>
                  <Text style={[styles.checkboxLabel, newExperience.current && styles.checkboxLabelSelected]}>
                    I currently work here
                  </Text>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={styles.textArea}
                    value={newExperience.description}
                    onChangeText={(value) => setNewExperience(prev => ({ ...prev, description: value }))}
                    placeholder="Describe your role and achievements..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.cancelFormButton} onPress={handleCancelEdit}>
                    <Text style={styles.cancelFormButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveFormButton} onPress={handleSaveExperience}>
                    <Text style={styles.saveFormButtonText}>Save Experience</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
  },
  experienceCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  experienceInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 4,
  },
  positionName: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
  },
  experienceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#374151',
    marginTop: 8,
    lineHeight: 20,
  },
  editForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxSelected: {
    backgroundColor: '#3B82F6',
  },
  checkboxText: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    textAlign: 'center',
    fontSize: 12,
    color: 'transparent',
  },
  checkboxTextSelected: {
    color: '#FFFFFF',
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#374151',
  },
  checkboxLabelSelected: {
    color: '#FFFFFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelFormButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelFormButtonText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#374151',
  },
  saveFormButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveFormButtonText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#FFFFFF',
  },
});
