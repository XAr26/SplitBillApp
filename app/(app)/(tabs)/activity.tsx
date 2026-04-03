import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const { currency } = useSettingsStore();

  const formatCurrency = (amount: number) => `${currency.symbol} ${new Intl.NumberFormat('id-ID').format(amount)}`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Insight Keuangan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: Colors.danger + '20', borderColor: Colors.danger + '50' }]}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.danger }]}>
              <Feather name="arrow-up-right" size={18} color="#fff" />
            </View>
            <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
            <Text style={[styles.summaryValue, { color: Colors.danger }]}>{formatCurrency(2500000)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: Colors.secondary + '20', borderColor: Colors.secondary + '50' }]}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.secondary }]}>
              <Feather name="arrow-down-left" size={18} color="#fff" />
            </View>
            <Text style={styles.summaryLabel}>Total Penerimaan</Text>
            <Text style={[styles.summaryValue, { color: Colors.secondary }]}>{formatCurrency(1200000)}</Text>
          </View>
        </View>

        {/* Categories Breakdown (Mock Chart) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bulan Ini (Berdasarkan Kategori)</Text>
          <View style={styles.card}>
            
            <View style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>🍔 Makanan & Minuman</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(1200000)}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '60%', backgroundColor: '#F59E0B' }]} />
              </View>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>🎬 Hiburan</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(800000)}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '35%', backgroundColor: '#8B5CF6' }]} />
              </View>
            </View>

            <View style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>🚗 Transportasi</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(500000)}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '15%', backgroundColor: '#3B82F6' }]} />
              </View>
            </View>

          </View>
        </View>

        {/* Gamification: Top Payers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paling Cepat Bayar Hutang</Text>
          <View style={styles.card}>
            <View style={styles.leaderboardItem}>
              <Text style={styles.rankText}>1</Text>
              <View style={[styles.avatar, { backgroundColor: '#10B98120' }]}><Text style={{fontWeight: 'bold', color: '#10B981'}}>C</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.leaderboardName}>Citra</Text>
                <Text style={styles.leaderboardSubtitle}>Rata-rata bayar: 2 Hari</Text>
              </View>
              <Feather name="award" size={24} color="#F59E0B" />
            </View>
            <View style={styles.separator} />
            <View style={styles.leaderboardItem}>
              <Text style={styles.rankText}>2</Text>
              <View style={[styles.avatar, { backgroundColor: '#3B82F620' }]}><Text style={{fontWeight: 'bold', color: '#3B82F6'}}>B</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.leaderboardName}>Budi</Text>
                <Text style={styles.leaderboardSubtitle}>Rata-rata bayar: 5 Hari</Text>
              </View>
            </View>
          </View>
        </View>

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
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.text,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryAmount: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textMuted,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  leaderboardSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
});
