import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Minus, 
  Plus, 
  Monitor, 
  Smartphone, 
  Moon, 
  Sun, 
  Contrast, 
  Keyboard, 
  MousePointer, 
  Zap, 
  Shield, 
  Users, 
  MessageSquare, 
  Phone, 
  Video, 
  BookOpen, 
  Download, 
  Upload, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  ChevronRight, 
  X, 
  Save,
  RefreshCw
} from 'lucide-react';
import { api } from '../api/axios';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

interface AccessibilitySettings {
  language: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceNavigation: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  darkMode: boolean;
  autoTranslate: boolean;
  subtitlesEnabled: boolean;
  voiceCommands: boolean;
  simplifiedUI: boolean;
  largeButtons: boolean;
  highVisibility: boolean;
  focusIndicators: boolean;
  readingGuide: boolean;
  dyslexiaFont: boolean;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', rtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false }
];

export default function AccessibilitySettings() {
  const [activeTab, setActiveTab] = useState<'language' | 'visual' | 'audio' | 'navigation' | 'advanced'>('language');
  const [settings, setSettings] = useState<AccessibilitySettings>({
    language: 'en',
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    voiceNavigation: false,
    colorBlindMode: 'none',
    darkMode: false,
    autoTranslate: false,
    subtitlesEnabled: true,
    voiceCommands: false,
    simplifiedUI: false,
    largeButtons: false,
    highVisibility: false,
    focusIndicators: true,
    readingGuide: false,
    dyslexiaFont: false
  });

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/user/accessibility-settings');
      const userSettings = response.data;
      setSettings(userSettings);
      
      const lang = languages.find(l => l.code === userSettings.language) || languages[0];
      setSelectedLanguage(lang);
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setSaveStatus('saving');
      await api.post('/user/accessibility-settings', settings);
      setSaveStatus('saved');
      
      // Apply settings to document
      applySettingsToDocument(settings);
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const applySettingsToDocument = (settings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Apply font size
    root.style.fontSize = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px'
    }[settings.fontSize];

    // Apply dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.style.removeProperty('--transition-duration');
    }

    // Apply color blind mode
    root.classList.remove('color-blind-protanopia', 'color-blind-deuteranopia', 'color-blind-tritanopia');
    if (settings.colorBlindMode !== 'none') {
      root.classList.add(`color-blind-${settings.colorBlindMode}`);
    }

    // Apply dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }

    // Apply RTL for Arabic
    if (selectedLanguage.rtl) {
      root.dir = 'rtl';
    } else {
      root.dir = 'ltr';
    }

    // Set lang attribute
    root.lang = settings.language;
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    updateSetting('language', language.code);
  };

  const resetToDefaults = () => {
    setSettings({
      language: 'en',
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      voiceNavigation: false,
      colorBlindMode: 'none',
      darkMode: false,
      autoTranslate: false,
      subtitlesEnabled: true,
      voiceCommands: false,
      simplifiedUI: false,
      largeButtons: false,
      highVisibility: false,
      focusIndicators: true,
      readingGuide: false,
      dyslexiaFont: false
    });
    
    const english = languages.find(l => l.code === 'en') || languages[0];
    setSelectedLanguage(english);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'accessibility-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          
          const lang = languages.find(l => l.code === importedSettings.language) || languages[0];
          setSelectedLanguage(lang);
        } catch (error) {
          console.error('Failed to import settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Accessibility & Language</h1>
              <p className="text-slate-600 mt-1">Customize your experience for better accessibility</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm">Settings saved</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={16} />
                  <span className="text-sm">Save failed</span>
                </div>
              )}
            </div>
            <button
              onClick={saveSettings}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Settings Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Globe size={20} className="text-slate-600" />
            <div>
              <p className="text-sm font-medium text-slate-900">Language</p>
              <p className="text-sm text-slate-600">{selectedLanguage.nativeName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Type size={20} className="text-slate-600" />
            <div>
              <p className="text-sm font-medium text-slate-900">Font Size</p>
              <p className="text-sm text-slate-600 capitalize">{settings.fontSize.replace('-', ' ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <Contrast size={20} className="text-slate-600" />
            <div>
              <p className="text-sm font-medium text-slate-900">Display Mode</p>
              <p className="text-sm text-slate-600">
                {settings.darkMode ? 'Dark' : 'Light'} 
                {settings.highContrast ? ' + High Contrast' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'language', name: 'Language', icon: Globe },
              { id: 'visual', name: 'Visual', icon: Eye },
              { id: 'audio', name: 'Audio', icon: Volume2 },
              { id: 'navigation', name: 'Navigation', icon: Keyboard },
              { id: 'advanced', name: 'Advanced', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Language</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedLanguage.code === language.code
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <p className="font-medium text-slate-900">{language.nativeName}</p>
                          <p className="text-sm text-slate-600">{language.name}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Language Features</h4>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw size={20} className="text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Auto-Translate</p>
                      <p className="text-sm text-slate-600">Automatically translate medical content</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('autoTranslate', !settings.autoTranslate)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoTranslate ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoTranslate ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={20} className="text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Subtitles & Captions</p>
                      <p className="text-sm text-slate-600">Show subtitles for video content</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('subtitlesEnabled', !settings.subtitlesEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.subtitlesEnabled ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.subtitlesEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Visual Tab */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Display Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Font Size</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'small', label: 'Small', preview: 'Aa' },
                        { value: 'medium', label: 'Medium', preview: 'Aa' },
                        { value: 'large', label: 'Large', preview: 'Aa' },
                        { value: 'extra-large', label: 'Extra Large', preview: 'Aa' }
                      ].map((size) => (
                        <button
                          key={size.value}
                          onClick={() => updateSetting('fontSize', size.value as any)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.fontSize === size.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className={`text-center ${
                            size.value === 'small' ? 'text-sm' :
                            size.value === 'medium' ? 'text-base' :
                            size.value === 'large' ? 'text-lg' : 'text-xl'
                          }`}>
                            <div className="font-bold">{size.preview}</div>
                            <div className="text-xs text-slate-600 mt-1">{size.label}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Moon size={20} className="text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Dark Mode</p>
                          <p className="text-sm text-slate-600">Reduce eye strain in low light</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('darkMode', !settings.darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.darkMode ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Contrast size={20} className="text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">High Contrast</p>
                          <p className="text-sm text-slate-600">Increase text contrast</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('highContrast', !settings.highContrast)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.highContrast ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Color Blind Mode</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'none', label: 'None' },
                        { value: 'protanopia', label: 'Protanopia' },
                        { value: 'deuteranopia', label: 'Deuteranopia' },
                        { value: 'tritanopia', label: 'Tritanopia' }
                      ].map((mode) => (
                        <button
                          key={mode.value}
                          onClick={() => updateSetting('colorBlindMode', mode.value as any)}
                          className={`p-3 rounded-lg border-2 transition-all text-sm ${
                            settings.colorBlindMode === mode.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Type size={20} className="text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Dyslexia Font</p>
                          <p className="text-sm text-slate-600">Use dyslexia-friendly fonts</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('dyslexiaFont', !settings.dyslexiaFont)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.dyslexiaFont ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.dyslexiaFont ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap size={20} className="text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Reduced Motion</p>
                          <p className="text-sm text-slate-600">Minimize animations</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.reducedMotion ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Audio Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Volume2 size={20} className="text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">Screen Reader</p>
                        <p className="text-sm text-slate-600">Enable screen reader support</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('screenReader', !settings.screenReader)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.screenReader ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.screenReader ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mic size={20} className="text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">Voice Commands</p>
                        <p className="text-sm text-slate-600">Control the app with your voice</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('voiceCommands', !settings.voiceCommands)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.voiceCommands ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.voiceCommands ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Navigation size={20} className="text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">Voice Navigation</p>
                        <p className="text-sm text-slate-600">Navigate using voice commands</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('voiceNavigation', !settings.voiceNavigation)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.voiceNavigation ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.voiceNavigation ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tab */}
          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Navigation Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Keyboard size={20} className="text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">Keyboard Navigation</p>
                        <p className="text-sm text-slate-600">Navigate using keyboard only</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.keyboardNavigation ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MousePointer size={20} className="text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">Focus Indicators</p>
                        <p className="text-sm text-slate-600">Show clear focus indicators</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('focusIndicators', !settings.focusIndicators)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.focusIndicators ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.focusIndicators ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye size={20} className="text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">Reading Guide</p>
                        <p className="text-sm text-slate-600">Show reading guide for text</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('readingGuide', !settings.readingGuide)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.readingGuide ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.readingGuide ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Plus size={20} className="text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Large Buttons</p>
                          <p className="text-sm text-slate-600">Increase button sizes</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('largeButtons', !settings.largeButtons)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.largeButtons ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.largeButtons ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye size={20} className="text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">High Visibility</p>
                          <p className="text-sm text-slate-600">Increase visibility of elements</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('highVisibility', !settings.highVisibility)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.highVisibility ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.highVisibility ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Advanced Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Layout size={20} className="text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">Simplified UI</p>
                        <p className="text-sm text-slate-600">Use simplified interface</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('simplifiedUI', !settings.simplifiedUI)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.simplifiedUI ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.simplifiedUI ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Import/Export Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={exportSettings}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100"
                  >
                    <Download size={20} className="text-slate-600" />
                    <div className="text-left">
                      <p className="font-medium text-slate-900">Export Settings</p>
                      <p className="text-sm text-slate-600">Download your settings</p>
                    </div>
                  </button>

                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <Upload size={20} className="text-slate-600" />
                    <div className="text-left">
                      <p className="font-medium text-slate-900">Import Settings</p>
                      <p className="text-sm text-slate-600">Upload settings file</p>
                    </div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Reset Settings</h4>
                <button
                  onClick={resetToDefaults}
                  className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <RefreshCw size={20} className="text-red-600" />
                  <div className="text-left">
                    <p className="font-medium text-red-900">Reset to Defaults</p>
                    <p className="text-sm text-red-600">Restore default accessibility settings</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <HelpCircle className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Need Help with Accessibility?</h4>
            <p className="text-blue-700 text-sm mb-3">
              Our support team is available to help you configure the best accessibility settings for your needs.
            </p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Phone size={16} />
                Call Support
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 border border-blue-200">
                <MessageSquare size={16} />
                Live Chat
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 border border-blue-200">
                <BookOpen size={16} />
                Accessibility Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
