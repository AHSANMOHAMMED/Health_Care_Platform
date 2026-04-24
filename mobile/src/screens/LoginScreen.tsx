import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, KeyboardAvoidingView, Platform, 
  Image, ActivityIndicator 
} from 'react-native';
import { ShieldCheck, Lock, Mail, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { api } from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { tokens, user } = response.data;
      
      // Store token and user data
      await AsyncStorage.setItem('access_token', tokens.accessToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      
      setLoading(false);
      navigation.replace('Dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#4f46e5', '#7c3aed']}
            style={styles.logoIcon}
          >
            <ShieldCheck color="#fff" size={40} />
          </LinearGradient>
          <Text style={styles.logoText}>MediConnect</Text>
          <Text style={styles.logoSub}>Clinical Portal Mobile</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Mail color="#64748b" size={18} />
              <TextInput 
                style={styles.input}
                placeholder="patient@mediconnect.lk"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <ChevronRight color="#fff" size={18} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  inner: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logoText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  logoSub: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
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
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  forgotBtn: {
    alignItems: 'center',
  },
  forgotText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 40,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  signUpText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '700',
  }
});
