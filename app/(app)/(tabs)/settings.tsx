import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { currency } = useSettingsStore();

  const handleLogout = () => {
    // Navigate back to login screen
    router.replace('/(auth)/login');
  };

  const handleCurrencyPicker = () => {
    router.push('/(app)/currency-picker');
  };

  const SettingItem = ({ icon, label, value, showArrow = true, color = Colors.text, onPress }: { icon: string, label: string, value?: string, showArrow?: boolean, color?: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Feather name={icon as any} size={20} color={color} />
        </View>
        <Text style={[styles.settingLabel, { color: color === Colors.danger ? Colors.danger : Colors.text }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {showArrow && <Feather name="chevron-right" size={18} color={Colors.textMuted} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pengaturan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=Aris+Styawa&background=3B82F6&color=fff' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editAvatar}>
              <Feather name="camera" size={14} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>Aris Styawa</Text>
          <Text style={styles.profileEmail}>aris@example.com</Text>
          
          <View style={styles.badgeContainer}>
            <View style={styles.badgeIconBg}>
              <Feather name="award" size={14} color="#F59E0B" />
            </View>
            <Text style={styles.badgeText}>Sultan Mabar (Level 4)</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Akun</Text>
          <View style={styles.card}>
            <SettingItem icon="user" label="Edit Profil" />
            <View style={styles.divider} />
            <SettingItem icon="credit-card" label="Metode Pembayaran (QRIS)" value="Selesai Diatur" color={Colors.secondary} />
            <View style={styles.divider} />
            <SettingItem icon="lock" label="Ubah Kata Sandi" />
            <View style={styles.divider} />
            <SettingItem icon="shield" label="Keamanan" />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferensi</Text>
          <View style={styles.card}>
            <SettingItem 
              icon="dollar-sign" 
              label="Mata Uang Utama" 
              value={`${currency.code} (${currency.symbol})`} 
              onPress={handleCurrencyPicker}
            />
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '15' }]}>
                  <Feather name="moon" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.settingLabel}>Mode Gelap</Text>
              </View>
              <Switch 
                value={true} 
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.text}
              />
            </View>
            <View style={styles.divider} />
            <SettingItem icon="bell" label="Notifikasi" />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Dukungan</Text>
          <View style={styles.card}>
            <SettingItem icon="help-circle" label="Pusat Bantuan" />
            <View style={styles.divider} />
            <SettingItem icon="info" label="Tentang Aplikasi" value="v1.0.0" />
          </View>
        </View>

        {/* Logout Section */}
        <TouchableOpacity style={[styles.card, styles.logoutCard]} onPress={handleLogout}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.danger + '15' }]}>
              <Feather name="log-out" size={20} color={Colors.danger} />
            </View>
            <Text style={[styles.settingLabel, { color: Colors.danger }]}>Keluar Akun</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.footerText}>Dibuat dengan ❤️ untuk Split Bill Cerdas</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F59E0B50',
  },
  badgeIconBg: {
    backgroundColor: '#F59E0B20',
    padding: 4,
    borderRadius: 10,
    marginRight: 6,
  },
  badgeText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textMuted,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 0,
  },
  logoutCard: {
    marginTop: 8,
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 10,
  },
});
