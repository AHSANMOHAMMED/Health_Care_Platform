import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  ScrollView, StyleSheet, KeyboardAvoidingView, 
  Platform, ActivityIndicator, Image 
} from 'react-native';
import { 
  Bot, Send, Mic, Image as ImageIcon, 
  ChevronLeft, Brain, Languages, AlertTriangle,
  MapPin, Phone
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Sinhala', label: 'සිංහල' },
  { code: 'Tamil', label: 'தமிழ்' },
];

import { api } from '../api/axios';

export default function AiChecker({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState('English');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: '1', role: 'ai', content: 'Hello! I am your AI Symptom Doctor. Describe your symptoms (e.g. fever, cough) and I will provide a professional assessment.' }
  ]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = { id: Date.now().toString(), role: 'user', content: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.post('/ai/symptom-checker', { 
        symptoms: inputText 
      });
      
      const analysisText = response.data.analysis || 'Analysis received';
      
      const aiMsg = { 
        id: (Date.now()+1).toString(), 
        role: 'ai', 
        content: analysisText,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg = { 
        id: (Date.now()+1).toString(), 
        role: 'ai', 
        content: 'I encountered an error analyzing your symptoms. Please check your connection.',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const userMsg = { id: Date.now().toString(), role: 'user', content: '(Image uploaded)', image: result.assets[0].uri };
      setMessages(prev => [...prev, userMsg]);
      setLoading(true);
      // Analyze logic here
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Brain color="#6366f1" size={18} />
          <Text style={styles.titleText}>AI Symptom Checker</Text>
        </View>
        <TouchableOpacity style={styles.langToggle}>
          <Languages color="#6366f1" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.chatContent}>
        {messages.map(msg => (
          <View key={msg.id} style={[
            styles.messageContainer,
            msg.role === 'user' ? styles.userMessage : styles.aiMessage
          ]}>
            <View style={[
              styles.bubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble
            ]}>
              {msg.image && <Image source={{ uri: msg.image }} style={styles.msgImage} />}
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator color="#6366f1" />
            <Text style={styles.loadingText}>Analyzing symptoms...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[styles.inputArea, { paddingBottom: insets.bottom + 10 }]}>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.iconBtn}>
              <ImageIcon color="#94a3b8" size={20} />
            </TouchableOpacity>
            <TextInput 
              style={styles.input}
              placeholder="Describe symptoms..."
              placeholderTextColor="#64748b"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.iconBtn}>
              <Mic color="#94a3b8" size={20} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSend}
              style={[styles.sendBtn, !inputText && styles.disabledSend]}
            >
              <Send color="#fff" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  langToggle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 24,
  },
  userBubble: {
    backgroundColor: '#4f46e5',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#111B2E',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  msgImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 4,
    marginBottom: 20,
  },
  loadingText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '700',
  },
  inputArea: {
    backgroundColor: '#0D0D18',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111B2E',
    borderRadius: 24,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    maxHeight: 100,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  disabledSend: {
    opacity: 0.5,
  }
});
