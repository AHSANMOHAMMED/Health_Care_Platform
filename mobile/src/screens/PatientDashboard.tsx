import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  StyleSheet, Dimensions, Image 
} from 'react-native';
import { 
  Activity, Calendar, Pill, Brain, 
  CreditCard, Bell, Menu, ShieldCheck,
  ChevronRight, Heart, Star, LogOut
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/axios';

const { width } = Dimensions.get('window');

export default function PatientDashboard({ navigation }: any) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [prescriptions, setPrescriptions] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Fetch real data
        const [apptRes, rxRes] = await Promise.all([
          api.get(`/appointments/patient/${parsedUser.id}`),
          api.get(`/prescriptions/patient/${parsedUser.id}`)
        ]);
        
        setAppointments(apptRes.data || []);
        setPrescriptions(rxRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity>
            <Menu color="#94a3b8" size={24} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <ShieldCheck color="#6366f1" size={20} />
            <Text style={styles.logoText}>MediConnect</Text>
          </View>
          <TouchableOpacity>
            <Bell color="#94a3b8" size={24} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeLabel}>Good Morning,</Text>
          <Text style={styles.welcomeName}>{user?.firstName || 'Guest'} {user?.lastName || ''}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Status Card */}
        <LinearGradient
          colors={['#4f46e5', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Activity color="#fff" size={20} />
            </View>
            <Text style={styles.cardTag}>NEXT APPOINTMENT</Text>
          </View>
          <Text style={styles.cardTitle}>{appointments[0]?.doctorName || 'No upcoming'}</Text>
          <Text style={styles.cardSubtitle}>
            {appointments[0] ? `${appointments[0].specialization} · ${appointments[0].date}` : 'Schedule a checkup today'}
          </Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>View Details</Text>
            <ChevronRight color="#fff" size={16} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Services</Text>
        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.gridItem}
            onPress={() => navigation.navigate('AiChecker')}
          >
            <View style={[styles.gridIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Brain color="#6366f1" size={24} />
            </View>
            <Text style={styles.gridLabel}>AI Doctor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={handleLogout}>
            <View style={[styles.gridIcon, { backgroundColor: 'rgba(244, 63, 94, 0.1)' }]}>
              <LogOut color="#f43f5e" size={24} />
            </View>
            <Text style={styles.gridLabel}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Health Stats */}
        <Text style={styles.sectionTitle}>Your Health Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          <View style={styles.statCard}>
            <Heart color="#f43f5e" size={20} />
            <Text style={styles.statValue}>72 bpm</Text>
            <Text style={styles.statLabel}>Heart Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Activity color="#6366f1" size={20} />
            <Text style={styles.statValue}>120/80</Text>
            <Text style={styles.statLabel}>Blood Pressure</Text>
          </View>
          <View style={styles.statCard}>
            <Star color="#f59e0b" size={20} />
            <Text style={styles.statValue}>98.6°F</Text>
            <Text style={styles.statLabel}>Temperature</Text>
          </View>
        </ScrollView>

        {/* Recent Prescriptions */}
        <Text style={styles.sectionTitle}>Recent Prescriptions</Text>
        {prescriptions.length > 0 ? prescriptions.map((p, i) => (
          <View key={i} style={styles.prescriptionItem}>
            <View style={styles.pIconContainer}>
              <Pill color="#6366f1" size={20} />
            </View>
            <View style={styles.pInfo}>
              <Text style={styles.pName}>{p.medicineName}</Text>
              <Text style={styles.pDesc}>{p.dosage} · {p.duration}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.pLink}>Refill</Text>
            </TouchableOpacity>
          </View>
        )) : (
          <Text style={{ color: '#64748b', fontSize: 14 }}>No prescriptions found.</Text>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  welcomeSection: {
    marginBottom: 10,
  },
  welcomeLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  welcomeName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mainCard: {
    padding: 24,
    borderRadius: 32,
    marginBottom: 32,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTag: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  gridItem: {
    width: (width - 52) / 2,
    backgroundColor: '#111B2E',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  gridIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  statsScroll: {
    marginBottom: 32,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  statCard: {
    width: 140,
    backgroundColor: '#111B2E',
    padding: 20,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  prescriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111B2E',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  pIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  pInfo: {
    flex: 1,
  },
  pName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  pDesc: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
  pLink: {
    color: '#6366f1',
    fontSize: 13,
    fontWeight: '800',
  }
});
