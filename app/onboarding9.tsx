import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";

interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    logo?: string;
}

export default function Onboarding9() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
    const [formData, setFormData] = useState({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
    });
    const router = useRouter();
    const { onboardingData, updateOnboardingData } = useOnboarding();

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
                MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
                MontserratSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
            });
            setFontsLoaded(true);
        };
        loadFonts();
    }, []);

    // Load existing work experiences from onboarding data
    useEffect(() => {
        if (onboardingData.workExperiences) {
            setWorkExperiences(onboardingData.workExperiences);
        }
    }, [onboardingData.workExperiences]);

    const handleAddExperience = () => {
        setEditingExperience(null);
        setFormData({
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
        });
        setShowAddModal(true);
    };

    const handleEditExperience = (experience: WorkExperience) => {
        setEditingExperience(experience);
        setFormData({
            company: experience.company,
            position: experience.position,
            startDate: experience.startDate,
            endDate: experience.endDate,
            isCurrent: experience.isCurrent,
        });
        setShowAddModal(true);
    };

    const handleSaveExperience = () => {
        if (!formData.company.trim() || !formData.position.trim() || !formData.startDate.trim()) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        if (!formData.isCurrent && !formData.endDate.trim()) {
            Alert.alert("Error", "Please provide an end date or mark as current position");
            return;
        }

        const newExperience: WorkExperience = {
            id: editingExperience?.id || Date.now().toString(),
            company: formData.company.trim(),
            position: formData.position.trim(),
            startDate: formData.startDate.trim(),
            endDate: formData.isCurrent ? "Present" : formData.endDate.trim(),
            isCurrent: formData.isCurrent,
        };

        let updatedExperiences;
        if (editingExperience) {
            updatedExperiences = workExperiences.map(exp =>
                exp.id === editingExperience.id ? newExperience : exp
            );
        } else {
            updatedExperiences = [...workExperiences, newExperience];
        }

        setWorkExperiences(updatedExperiences);
        updateOnboardingData({ workExperiences: updatedExperiences });
        setShowAddModal(false);
        setEditingExperience(null);
    };

    const handleDeleteExperience = (id: string) => {
        Alert.alert(
            "Delete Experience",
            "Are you sure you want to delete this work experience?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const updatedExperiences = workExperiences.filter(exp => exp.id !== id);
                        setWorkExperiences(updatedExperiences);
                        updateOnboardingData({ workExperiences: updatedExperiences });
                    },
                },
            ]
        );
    };

    const handleContinue = () => {
        updateOnboardingData({ workExperiences });
        router.push("/onboarding8");
    };

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            {/* Back + Progress */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <View style={styles.progressBarContainer}>
                    {[...Array(8)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.step,
                                i <= 6 ? styles.activeStep : styles.inactiveStep,
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Work Experience</Text>
            <Text style={styles.subtitle}>
                Add your professional experience to highlight your career path
            </Text>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Work Experience List */}
                {workExperiences.length > 0 ? (
                    <View style={styles.experienceList}>
                        {workExperiences.map((experience) => (
                            <View key={experience.id} style={styles.experienceCard}>
                                <View style={styles.experienceHeader}>
                                    <View style={styles.companyLogo}>
                                        <Text style={styles.companyInitial}>
                                            {experience.company.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteExperience(experience.id)}
                                    >
                                        <Text style={styles.deleteIcon}>×</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.positionTitle}>{experience.position}</Text>
                                <Text style={styles.companyName}>{experience.company}</Text>
                                <Text style={styles.dateRange}>
                                    {experience.startDate} - {experience.endDate}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No work experience added yet</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Add your professional experience to showcase your career
                        </Text>
                    </View>
                )}

                {/* Add Experience Button */}
                <TouchableOpacity style={styles.addButton} onPress={handleAddExperience}>
                    <Text style={styles.addButtonText}>+ Add Experience</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Continue Button */}
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>

            {/* Add/Edit Modal */}
            <Modal visible={showAddModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingExperience ? "Edit Experience" : "Add Experience"}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Company name"
                            placeholderTextColor="#999"
                            value={formData.company}
                            onChangeText={(text) => setFormData({ ...formData, company: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Position/Job Title"
                            placeholderTextColor="#999"
                            value={formData.position}
                            onChangeText={(text) => setFormData({ ...formData, position: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Start Date (MM/YYYY)"
                            placeholderTextColor="#999"
                            value={formData.startDate}
                            onChangeText={(text) => setFormData({ ...formData, startDate: text })}
                        />

                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => setFormData({ ...formData, isCurrent: !formData.isCurrent })}
                            >
                                <View style={[styles.checkboxInner, formData.isCurrent && styles.checkboxChecked]}>
                                    {formData.isCurrent && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.checkboxLabel}>I currently work here</Text>
                        </View>

                        {!formData.isCurrent && (
                            <TextInput
                                style={styles.input}
                                placeholder="End Date (MM/YYYY)"
                                placeholderTextColor="#999"
                                value={formData.endDate}
                                onChangeText={(text) => setFormData({ ...formData, endDate: text })}
                            />
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowAddModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveExperience}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 25,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },
    backArrow: {
        fontSize: 24,
        marginRight: 10,
        padding: 8,
    },
    progressBarContainer: {
        flexDirection: "row",
        gap: 6,
        flex: 1,
    },
    step: {
        height: 6,
        borderRadius: 3,
        flex: 1,
    },
    activeStep: {
        backgroundColor: "#000",
    },
    inactiveStep: {
        backgroundColor: "#ccc",
    },
    title: {
        fontSize: 22,
        fontFamily: "MontserratBold",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "MontserratRegular",
        color: "#555",
        marginBottom: 30,
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 20,
    },
    experienceList: {
        marginBottom: 20,
    },
    experienceCard: {
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#000",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    experienceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    companyLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFD700",
        justifyContent: "center",
        alignItems: "center",
    },
    companyInitial: {
        fontSize: 16,
        fontFamily: "MontserratBold",
        color: "#000",
    },
    deleteButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteIcon: {
        fontSize: 16,
        color: "#666",
    },
    positionTitle: {
        fontSize: 16,
        fontFamily: "MontserratBold",
        color: "#000",
        marginBottom: 4,
    },
    companyName: {
        fontSize: 14,
        fontFamily: "MontserratRegular",
        color: "#666",
        marginBottom: 4,
    },
    dateRange: {
        fontSize: 12,
        fontFamily: "MontserratRegular",
        color: "#999",
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 16,
        fontFamily: "MontserratSemiBold",
        color: "#666",
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        fontFamily: "MontserratRegular",
        color: "#999",
        textAlign: "center",
    },
    addButton: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        borderWidth: 2,
        borderColor: "#000",
        borderStyle: "dashed",
        alignItems: "center",
        marginBottom: 20,
    },
    addButtonText: {
        fontSize: 16,
        fontFamily: "MontserratSemiBold",
        color: "#000",
    },
    continueButton: {
        backgroundColor: "#000",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 20,
    },
    continueText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "MontserratSemiBold",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        width: "90%",
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: "MontserratBold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16,
        fontSize: 16,
        fontFamily: "MontserratRegular",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    checkbox: {
        marginRight: 12,
    },
    checkboxInner: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "#ddd",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        backgroundColor: "#000",
        borderColor: "#000",
    },
    checkmark: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "MontserratBold",
    },
    checkboxLabel: {
        fontSize: 16,
        fontFamily: "MontserratRegular",
        color: "#000",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        paddingVertical: 12,
        marginRight: 10,
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: "MontserratSemiBold",
        color: "#666",
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#000",
        borderRadius: 8,
        paddingVertical: 12,
        marginLeft: 10,
        alignItems: "center",
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: "MontserratSemiBold",
        color: "#fff",
    },
});
