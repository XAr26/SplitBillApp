import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useRouter } from 'expo-router';

// Mock Data for Groups (Remains same)
const MOCKED_GROUPS = [
  { id: '1', name: 'Apartemen', members: 3, balance: 450000, type: 'debt', icon: 'home' },
  { id: '2', name: 'Liburan Bali', members: 5, balance: 1200000, type: 'receivable', icon: 'sun' },
  { id: '3', name: 'Makan-makan', members: 4, balance: 0, type: 'equal', icon: 'coffee' },
];

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const { currency } = useSettingsStore();
  const router = useRouter();

  // Mock Exchange Rates (Base: IDR)
  const exchangeRates: Record<string, number> = {
    'IDR': 1, 'USD': 16000, 'EUR': 17500, 'GBP': 20000, 'JPY': 105, 'SGD': 11800,
  };

  const formatCurrency = (amount: number) => {
    const rate = exchangeRates[currency.code] || 1;
    const convertedAmount = amount / rate;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currency.code === 'IDR' ? 0 : 2,
      maximumFractionDigits: currency.code === 'IDR' ? 0 : 2,
    }).format(Math.abs(convertedAmount));
    return `${convertedAmount < 0 ? '-' : ''}${currency.symbol} ${formatted}`;
  };

  const getCurrentDateString = () => {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { fontSize: width > 400 ? 28 : 24 }]}>Halo, Aris!</Text>
          <View style={styles.dateRow}>
            <Feather name="calendar" size={12} color={Colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.dateText}>{getCurrentDateString()}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" color={Colors.text} size={24} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Saldo</Text>
          <Text style={styles.balance}>{formatCurrency(1250000)}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.secondary + '20' }]}><Feather name="arrow-down-left" color={Colors.secondary} size={20} /></View>
              <View><Text style={styles.statLabel}>Dipinjam</Text><Text style={styles.statValuePositive}>{formatCurrency(2000000)}</Text></View>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.danger + '20' }]}><Feather name="arrow-up-right" color={Colors.danger} size={20} /></View>
              <View><Text style={styles.statLabel}>Meminjam</Text><Text style={styles.statValueNegative}>{formatCurrency(750000)}</Text></View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(app)/create-bill')}>
            <Feather name="plus" color={Colors.text} size={22} /><Text style={styles.actionText}>Tagihan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
            <Feather name="repeat" color={Colors.text} size={22} /><Text style={styles.actionText}>Settle Up</Text>
          </TouchableOpacity>
        </View>

        {/* Groups Section */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Grup Saya</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupsScroll}>
            {MOCKED_GROUPS.map(group => (
                <TouchableOpacity key={group.id} style={styles.groupCard}>
                    <View style={[styles.groupIcon, { backgroundColor: Colors.card }]}><Feather name={group.icon as any} size={20} color={Colors.primary} /></View>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupMembers}>{group.members} Anggota</Text>
                    <Text style={[styles.groupBalance, { color: group.type === 'receivable' ? Colors.secondary : group.type === 'debt' ? Colors.danger : Colors.textMuted }]}>
                        {group.balance > 0 ? formatCurrency(group.balance) : 'Lunas'}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Calendar Section (Compact Clickable Card) */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kalender Keuangan</Text>
        </View>
        <TouchableOpacity 
          style={styles.calendarCompactCard} 
          onPress={() => router.push('/(app)/calendar')}
        >
            <View style={styles.calIconBox}>
                <Feather name="calendar" size={24} color={Colors.primary} />
            </View>
            <View style={styles.calInfoBox}>
                <Text style={styles.calNextLabel}>Agenda Terdekat</Text>
                <Text style={styles.calNextTitle}>Bayar Kosan (5 Apr)</Text>
            </View>
            <View style={styles.calAmountBox}>
                <Text style={styles.calAmountNegative}>{formatCurrency(1500000)}</Text>
                <Feather name="chevron-right" size={16} color={Colors.textMuted} />
            </View>
        </TouchableOpacity>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Aktivitas Terbaru</Text></View>
        <View style={styles.activityList}>
            <View style={styles.activityItem}>
                <View style={styles.activityIcon}><Text style={styles.activityEmoji}>🍔</Text></View>
                <View style={{ flex:1 }}><Text style={styles.activityName}>Makan Siang</Text><Text style={styles.activityMeta}>Kantor • Hari ini</Text></View>
                <Text style={styles.activityAmountPositive}>+{formatCurrency(150000)}</Text>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
  greeting: { fontWeight: 'bold', color: Colors.text, marginTop: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  dateText: { fontSize: 12, color: Colors.primary, fontWeight: '600', textTransform: 'uppercase' },
  iconButton: { padding: 8, backgroundColor: Colors.card, borderRadius: 50, borderWidth: 1, borderColor: Colors.border, position: 'relative' },
  badge: { position: 'absolute', top: 6, right: 8, width: 8, height: 8, backgroundColor: Colors.danger, borderRadius: 4 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  card: { backgroundColor: Colors.card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: Colors.border, marginBottom: 32 },
  cardLabel: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  balance: { fontSize: 36, fontWeight: 'bold', color: Colors.text, marginBottom: 24 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 12, color: Colors.textMuted },
  statValuePositive: { fontSize: 14, fontWeight: 'bold', color: Colors.secondary },
  statValueNegative: { fontSize: 14, fontWeight: 'bold', color: Colors.danger },
  actionRow: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  actionButton: { flex: 1, backgroundColor: Colors.primary, height: 56, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  actionButtonSecondary: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  actionText: { color: Colors.text, fontSize: 16, fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  seeAll: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  groupsScroll: { gap: 16, paddingBottom: 16 },
  groupCard: { backgroundColor: Colors.card, width: 150, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: Colors.border },
  groupIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  groupName: { color: Colors.text, fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  groupMembers: { color: Colors.textMuted, fontSize: 12, marginBottom: 8 },
  groupBalance: { fontSize: 14, fontWeight: 'bold' },
  
  // Compact Calendar Card Styles
  calendarCompactCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.card, 
    padding: 16, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: Colors.border, 
    marginBottom: 32,
    gap: 16
  },
  calIconBox: { 
    width: 50, 
    height: 50, 
    borderRadius: 16, 
    backgroundColor: Colors.primary + '15', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  calInfoBox: { flex: 1 },
  calNextLabel: { color: Colors.textMuted, fontSize: 12, marginBottom: 2 },
  calNextTitle: { color: Colors.text, fontWeight: 'bold', fontSize: 15 },
  calAmountBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  calAmountNegative: { color: Colors.danger, fontWeight: 'bold', fontSize: 14 },

  activityList: { gap: 16 },
  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  activityIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  activityEmoji: { fontSize: 24 },
  activityName: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  activityMeta: { fontSize: 12, color: Colors.textMuted },
  activityAmountPositive: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary },
});
