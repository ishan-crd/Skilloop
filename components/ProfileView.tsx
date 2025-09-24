import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const ProfileView: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Mock data for experience and certifications
  const experiences = [
    { id: '1', company: 'Deloitte', logo: 'D', color: '#FFFFFF', borderColor: '#000000' },
    { id: '2', company: 'McDonald\'s', logo: 'M', color: '#FF0000', borderColor: '#000000' },
  ];

  const certifications = [
    { id: '1', company: 'Meta', logo: '∞', color: '#FFFFFF', borderColor: '#000000' },
    { id: '2', company: 'IIMA', logo: 'IIMA', color: '#0066CC', borderColor: '#000000' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Name */}
      <Text style={styles.name}>{user.name || 'Erik Tyler'}</Text>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: (user.profile_images && user.profile_images.length > 0) 
              ? user.profile_images[0] 
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
          }} 
          style={styles.profileImage} 
        />
      </View>

      {/* Date, Gender, Location Bar */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          {user.age ? `${user.age} years old` : 'Age not specified'} • {user.gender || 'Not specified'} • {user.location || 'Location not specified'}
        </Text>
      </View>

      {/* Current Position */}
      <View style={styles.positionBar}>
        <Text style={styles.positionText}>
          {user.job_title || 'Position not specified'} at {user.company || 'Company not specified'}
        </Text>
      </View>

      {/* Profile Image (second one) */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: (user.profile_images && user.profile_images.length > 1) 
              ? user.profile_images[1] 
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
          }} 
          style={styles.profileImage} 
        />
      </View>

      {/* Bio */}
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>{user.bio || 'No bio available'}</Text>
      </View>

      {/* Profile Image (third one) */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: (user.profile_images && user.profile_images.length > 2) 
              ? user.profile_images[2] 
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
          }} 
          style={styles.profileImage} 
        />
      </View>

      {/* Experience Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.countText}>+{experiences.length}</Text>
        </View>
        <View style={styles.logoContainer}>
          {experiences.map((exp) => (
            <View 
              key={exp.id} 
              style={[
                styles.logoBox, 
                { 
                  backgroundColor: exp.color,
                  borderColor: exp.borderColor 
                }
              ]}
            >
              <Text style={[
                styles.logoText, 
                { color: exp.color === '#FFFFFF' ? '#000000' : '#FFFFFF' }
              ]}>
                {exp.logo}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Certification Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Certification</Text>
          <Text style={styles.countText}>+{certifications.length}</Text>
        </View>
        <View style={styles.logoContainer}>
          {certifications.map((cert) => (
            <View 
              key={cert.id} 
              style={[
                styles.logoBox, 
                { 
                  backgroundColor: cert.color,
                  borderColor: cert.borderColor 
                }
              ]}
            >
              <Text style={[
                styles.logoText, 
                { color: cert.color === '#FFFFFF' ? '#000000' : '#FFFFFF' }
              ]}>
                {cert.logo}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  name: {
    fontSize: 28,
    fontFamily: 'MontserratBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#000000',
  },
  infoBar: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000000',
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#000000',
    textAlign: 'center',
  },
  positionBar: {
    backgroundColor: '#E8F4FD',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  positionText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#000000',
    textAlign: 'center',
  },
  bioContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  bioText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#000000',
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    color: '#000000',
  },
  countText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#000000',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    textAlign: 'center',
  },
});

export default ProfileView;
