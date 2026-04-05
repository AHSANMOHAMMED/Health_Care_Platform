import React, { useState, useEffect } from 'react';
import {
  User,
  FileText,
  Upload, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Camera,
  Download
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/axios';

interface MedicalHistory {
  allergies: string[];
  medications: string[];
  conditions: string[];
  surgeries: Array<{
    name: string;
    date: string;
    complications?: string;
  }>;
  familyHistory: Array<{
    condition: string;
    relation: string;
  }>;
  lifestyle: {
    smoking: boolean;
    alcohol: boolean;
    exercise: string;
    diet: string;
  };
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  coverageType: string;
}

export default function PatientOnboarding() {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    phone: '',
    email: user?.email || '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    allergies: [],
    medications: [],
    conditions: [],
    surgeries: [],
    familyHistory: [],
    lifestyle: {
      smoking: false,
      alcohol: false,
      exercise: '',
      diet: ''
    }
  });

  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo>({
    provider: '',
    policyNumber: '',
    groupNumber: '',
    coverageType: ''
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!personalInfo.firstName) newErrors.firstName = 'First name is required';
        if (!personalInfo.lastName) newErrors.lastName = 'Last name is required';
        if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!personalInfo.gender) newErrors.gender = 'Gender is required';
        if (!personalInfo.phone) newErrors.phone = 'Phone number is required';
        if (!personalInfo.address) newErrors.address = 'Address is required';
        if (!personalInfo.emergencyContact.name) newErrors.emergencyName = 'Emergency contact name is required';
        if (!personalInfo.emergencyContact.phone) newErrors.emergencyPhone = 'Emergency contact phone is required';
        break;
      
      case 2:
        if (medicalHistory.allergies.length === 0) {
          newErrors.allergies = 'Please add allergies or mark as "None"';
        }
        if (medicalHistory.medications.length === 0) {
          newErrors.medications = 'Please add current medications or mark as "None"';
        }
        break;
      
      case 3:
        if (!insuranceInfo.provider) newErrors.provider = 'Insurance provider is required';
        if (!insuranceInfo.policyNumber) newErrors.policyNumber = 'Policy number is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedDocuments([...uploadedDocuments, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
  };

  const addListItem = (category: keyof MedicalHistory, value: string) => {
    if (value.trim()) {
      setMedicalHistory(prev => ({
        ...prev,
        [category]: [...(prev[category] as string[]), value.trim()]
      }));
    }
  };

  const removeListItem = (category: keyof MedicalHistory, index: number) => {
    setMedicalHistory(prev => ({
      ...prev,
      [category]: (prev[category] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add personal info
      formData.append('personalInfo', JSON.stringify(personalInfo));
      formData.append('medicalHistory', JSON.stringify(medicalHistory));
      formData.append('insuranceInfo', JSON.stringify(insuranceInfo));
      
      // Add documents
      uploadedDocuments.forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });

      await api.post('/patient/onboarding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Redirect to patient dashboard
      window.location.href = '/patient';
    } catch (error) {
      console.error('Onboarding error:', error);
      setErrors({ submit: 'Failed to complete onboarding. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dateOfBirth ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                <select
                  value={personalInfo.gender}
                  onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.gender ? 'border-red-300' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Blood Type</label>
                <select
                  value={personalInfo.bloodType}
                  onChange={(e) => setPersonalInfo({...personalInfo, bloodType: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={personalInfo.email}
                  disabled
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                <input
                  type="text"
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-slate-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={personalInfo.emergencyContact.name}
                    onChange={(e) => setPersonalInfo({
                      ...personalInfo, 
                      emergencyContact: {...personalInfo.emergencyContact, name: e.target.value}
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.emergencyName ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  {errors.emergencyName && <p className="text-red-500 text-sm mt-1">{errors.emergencyName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={personalInfo.emergencyContact.phone}
                    onChange={(e) => setPersonalInfo({
                      ...personalInfo, 
                      emergencyContact: {...personalInfo.emergencyContact, phone: e.target.value}
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.emergencyPhone ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    value={personalInfo.emergencyContact.relation}
                    onChange={(e) => setPersonalInfo({
                      ...personalInfo, 
                      emergencyContact: {...personalInfo.emergencyContact, relation: e.target.value}
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Spouse, Parent, Friend"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Medical History</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Allergies *</label>
              <div className="space-y-2">
                {medicalHistory.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {allergy}
                    </span>
                    <button
                      onClick={() => removeListItem('allergies', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an allergy (e.g., Penicillin, Peanuts)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addListItem('allergies', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input');
                      if (input) {
                        addListItem('allergies', input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {errors.allergies && <p className="text-red-500 text-sm mt-1">{errors.allergies}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Medications *</label>
              <div className="space-y-2">
                {medicalHistory.medications.map((medication, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                      {medication}
                    </span>
                    <button
                      onClick={() => removeListItem('medications', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add current medication (e.g., Aspirin 100mg)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addListItem('medications', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input');
                      if (input) {
                        addListItem('medications', input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {errors.medications && <p className="text-red-500 text-sm mt-1">{errors.medications}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Medical Conditions</label>
              <div className="space-y-2">
                {medicalHistory.conditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                      {condition}
                    </span>
                    <button
                      onClick={() => removeListItem('conditions', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add medical condition (e.g., Diabetes, Hypertension)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addListItem('conditions', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input');
                      if (input) {
                        addListItem('conditions', input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Lifestyle</label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={medicalHistory.lifestyle.smoking}
                      onChange={(e) => setMedicalHistory({
                        ...medicalHistory,
                        lifestyle: {...medicalHistory.lifestyle, smoking: e.target.checked}
                      })}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Smoking</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={medicalHistory.lifestyle.alcohol}
                      onChange={(e) => setMedicalHistory({
                        ...medicalHistory,
                        lifestyle: {...medicalHistory.lifestyle, alcohol: e.target.checked}
                      })}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Alcohol Consumption</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Exercise Frequency</label>
                  <select
                    value={medicalHistory.lifestyle.exercise}
                    onChange={(e) => setMedicalHistory({
                      ...medicalHistory,
                      lifestyle: {...medicalHistory.lifestyle, exercise: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="none">None</option>
                    <option value="rarely">Rarely (1-2 times/month)</option>
                    <option value="sometimes">Sometimes (1-2 times/week)</option>
                    <option value="regularly">Regularly (3-4 times/week)</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Diet Type</label>
                  <select
                    value={medicalHistory.lifestyle.diet}
                    onChange={(e) => setMedicalHistory({
                      ...medicalHistory,
                      lifestyle: {...medicalHistory.lifestyle, diet: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select diet type</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="mediterranean">Mediterranean</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Insurance Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Insurance Provider *</label>
                <input
                  type="text"
                  value={insuranceInfo.provider}
                  onChange={(e) => setInsuranceInfo({...insuranceInfo, provider: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.provider ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder="e.g., Blue Cross Blue Shield"
                />
                {errors.provider && <p className="text-red-500 text-sm mt-1">{errors.provider}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Policy Number *</label>
                <input
                  type="text"
                  value={insuranceInfo.policyNumber}
                  onChange={(e) => setInsuranceInfo({...insuranceInfo, policyNumber: e.target.value})}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.policyNumber ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors.policyNumber && <p className="text-red-500 text-sm mt-1">{errors.policyNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Group Number</label>
                <input
                  type="text"
                  value={insuranceInfo.groupNumber}
                  onChange={(e) => setInsuranceInfo({...insuranceInfo, groupNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Coverage Type</label>
                <select
                  value={insuranceInfo.coverageType}
                  onChange={(e) => setInsuranceInfo({...insuranceInfo, coverageType: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select coverage type</option>
                  <option value="HMO">HMO</option>
                  <option value="PPO">PPO</option>
                  <option value="EPO">EPO</option>
                  <option value="POS">POS</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Document Upload</h3>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto text-slate-400 mb-4" size={48} />
              <p className="text-slate-600 mb-2">Upload medical documents</p>
              <p className="text-sm text-slate-500 mb-4">
                PDF, JPG, PNG files up to 10MB each
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <Upload size={16} className="mr-2" />
                Choose Files
              </label>
            </div>

            {uploadedDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Uploaded Documents</h4>
                {uploadedDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="text-slate-400" size={20} />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Recommended Documents</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Government-issued ID (Driver's License, Passport)</li>
                <li>• Insurance card</li>
                <li>• Recent medical records</li>
                <li>• List of current medications</li>
                <li>• Allergy test results (if applicable)</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">Complete Your Profile</h1>
            <p className="text-slate-600 mt-1">Let's set up your medical profile for personalized care</p>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-slate-600">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <span className="text-red-700">{errors.submit}</span>
              </div>
            )}

            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="px-8 py-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Complete Onboarding
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
