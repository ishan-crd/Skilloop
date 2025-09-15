import React, { createContext, ReactNode, useContext, useState } from 'react';

interface OnboardingData {
  // Basic Information (onboarding2)
  name: string;
  age: string;
  gender: string;
  location: string;
  
  // Profile Images (onboarding3)
  profileImages: string[];
  
  // Professional Info (onboarding4)
  bio: string;
  skills: string[];
  
  // Business Card (onboarding5)
  jobTitle: string;
  company: string;
  website: string;
  socialProfiles: {
    linkedin: string;
    instagram: string;
    twitter: string;
    github: string;
    upwork: string;
    figma: string;
    behance: string;
    dribbble: string;
  };
  
  // Role (onboarding1)
  role: string;
  
  // Certificates (onboarding7)
  certificates: Array<{
    id: string;
    title: string;
    organization: string;
    issueDate: string;
    imageUri: string;
    url: string;
  }>;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  clearOnboardingData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    age: '',
    gender: '',
    location: '',
    profileImages: [],
    bio: '',
    skills: [],
    jobTitle: '',
    company: '',
    website: '',
    socialProfiles: {
      linkedin: '',
      instagram: '',
      twitter: '',
      github: '',
      upwork: '',
      figma: '',
      behance: '',
      dribbble: '',
    },
    role: '',
    certificates: [],
  });

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const clearOnboardingData = () => {
    setOnboardingData({
      name: '',
      age: '',
      location: '',
      gender: '',
      profileImages: [],
      bio: '',
      skills: [],
      jobTitle: '',
      company: '',
      website: '',
      socialProfiles: {
        linkedin: '',
        instagram: '',
        twitter: '',
        github: '',
        upwork: '',
        figma: '',
        behance: '',
        dribbble: '',
      },
      role: '',
      certificates: [],
    });
  };

  return (
    <OnboardingContext.Provider value={{
      onboardingData,
      updateOnboardingData,
      clearOnboardingData,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};
