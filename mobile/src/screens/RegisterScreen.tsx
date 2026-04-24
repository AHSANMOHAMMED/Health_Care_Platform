import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, 
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { User, Mail, Lock, Phone, MapPin, ChevronRight, ArrowLeft, Stethoscope, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '../api/axios';

export default function RegisterScreen({ navigation }: any) {
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+94');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });

      setLoading(false);
      if (role === 'DOCTOR') {
        Alert.alert(
          'Registration Successful',
          'Your account is pending administrative approval. We will notify you once it is approved.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert(
          'Success',
          'Account created successfully! Please log in.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Registration Failed', err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F', '#111B2E']} style={styles.background} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#94a3b8" size={24} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join MediConnect Lanka Healthcare Network</Text>
          </View>

          <View style={styles.roleContainer}>
            <TouchableOpacity 
              onPress={() => setRole('PATIENT')}
              style={[styles.roleCard, role === 'PATIENT' && styles.roleCardActive]}
            >
              <Users color={role === 'PATIENT' ? '#6366f1' : '#94a3b8'} size={24} />
              <Text style={[styles.roleText, role === 'PATIENT' && styles.roleTextActive]}>Patient</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setRole('DOCTOR')}
              style={[styles.roleCard, role === 'DOCTOR' && styles.roleCardActive]}
            >
              <Stethoscope color={role === 'DOCTOR' ? '#06b6d4' : '#94a3b8'} size={24} />
              <Text style={[styles.roleText, role === 'DOCTOR' && styles.roleTextActive]}>Doctor</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputWrapper}>
                <User color="#64748b" size={18} />
                <TextInput 
                  style={styles.input}
                  placeholder="Aruni"
                  placeholderTextColor="#64748b"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputWrapper}>
                <User color="#64748b" size={18} />
                <TextInput 
                  style={styles.input}
                  placeholder="Wijesinghe"
                  placeholderTextColor="#64748b"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail color="#64748b" size={18} />
                <TextInput 
                  style={styles.input}
                  placeholder="aruni@example.com"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Phone color="#64748b" size={18} />
                <TextInput 
                  style={styles.input}
                  placeholder="+94 77 123 4567"
                  placeholderTextColor="#64748b"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock color="#64748b" size={18} />
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.submitBtn}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Register Now</Text>
                  <ChevronRight color="#fff" size={18} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#111B2E',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  roleCardActive: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  roleText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
  },
  roleTextActive: {
    color: '#fff',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111B2E',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  }
});
