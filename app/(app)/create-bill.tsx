import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = [
  { id: 'food', name: 'Makanan', icon: 'shopping-bag', color: '#F59E0B' },
  { id: 'transport', name: 'Transport', icon: 'truck', color: '#3B82F6' },
  { id: 'shopping', name: 'Belanja', icon: 'shopping-cart', color: '#10B981' },
  { id: 'entertainment', name: 'Hiburan', icon: 'tv', color: '#8B5CF6' },
  { id: 'other', name: 'Lainnya', icon: 'grid', color: '#64748B' },
];

const FRIENDS = [
  { id: '1', name: 'Aris', avatar: 'A' },
  { id: '2', name: 'Budi', avatar: 'B' },
  { id: '3', name: 'Citra', avatar: 'C' },
  { id: '4', name: 'Dewi', avatar: 'D' },
];

export default function CreateBillScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currency } = useSettingsStore();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [selectedFriends, setSelectedFriends] = useState(['1']); // Aris is selected by default

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Eror', 'Silakan masukkan jumlah nominal yang valid.');
      return;
    }
    if (!description) {
      Alert.alert('Eror', 'Silakan masukkan deskripsi tagihan.');
      return;
    }

    // Success Simulation
    Alert.alert(
      'Sukses',
      'Tagihan berhasil dibuat dan dibagikan!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const toggleFriend = (id: string) => {
    if (selectedFriends.includes(id)) {
      if (selectedFriends.length > 1) {
        setSelectedFriends(selectedFriends.filter(f => f !== id));
      }
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const perPersonAmount = parseFloat(amount || '0') / selectedFriends.length;

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Custom Header */}
        <View style={styles.customHeader}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Feather name="x" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buat Tagihan Baru</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* AI Scanner Section */}
          <TouchableOpacity 
            style={styles.scannerBtn}
            onPress={() => {
              Alert.alert('AI Scanner (Simulasi)', 'Kamera akan terbuka di sini. Sistem OCR akan mendeteksi nama makanan dan harga secara otomatis dari foto struk restoran Anda.');
            }}
          >
            <View style={styles.scannerIconBg}>
              <Feather name="camera" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scannerTitle}>Scan Struk Cerdas (AI)</Text>
              <Text style={styles.scannerSubtitle}>Biarkan AI menginput tagihan Anda</Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Amount Section */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencyLabel}>{currency.code} ({currency.symbol})</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={Colors.textMuted + '50'}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Feather name="edit-3" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Untuk apa tagihan ini?"
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          {/* Category Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pilih Kategori</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '15' }
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Feather 
                    name={cat.icon as any} 
                    size={20} 
                    color={selectedCategory === cat.id ? cat.color : Colors.textMuted} 
                  />
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === cat.id && { color: cat.color, fontWeight: 'bold' }
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Members Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Patungan Dengan</Text>
              <Text style={styles.memberCount}>{selectedFriends.length} Orang</Text>
            </View>
            <View style={styles.friendList}>
              {FRIENDS.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={[
                    styles.friendItem,
                    selectedFriends.includes(friend.id) && styles.friendItemSelected
                  ]}
                  onPress={() => toggleFriend(friend.id)}
                >
                  <View style={[
                    styles.avatar,
                    selectedFriends.includes(friend.id) ? { backgroundColor: Colors.primary } : { backgroundColor: Colors.card }
                  ]}>
                    <Text style={styles.avatarText}>{friend.avatar}</Text>
                  </View>
                  <Text style={[
                    styles.friendName,
                    selectedFriends.includes(friend.id) && { color: Colors.primary, fontWeight: 'bold' }
                  ]}>
                    {friend.name}
                  </Text>
                  {selectedFriends.includes(friend.id) && (
                    <View style={styles.checkBadge}>
                      <Feather name="check" size={10} color={Colors.text} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary Section */}
          {parseFloat(amount || '0') > 0 && (
            <View style={styles.summaryCard}>
              <Feather name="info" size={16} color={Colors.primary} />
              <Text style={styles.summaryText}>
                Setiap orang akan membayar <Text style={styles.highlight}>{currency.symbol} {new Intl.NumberFormat('id-ID').format(perPersonAmount)}</Text>
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Simpan & Bagikan Tagihan</Text>
            <Feather name="send" size={18} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  closeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
    paddingBottom: 120,
  },
  scannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    padding: 16,
    borderRadius: 20,
  },
  scannerIconBg: {
    backgroundColor: '#3B82F6',
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scannerSubtitle: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 24,
  },
  currencyLabel: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  memberCount: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    height: 64,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  categoryText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  friendList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  friendItem: {
    alignItems: 'center',
    width: 70,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  friendName: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  friendItemSelected: {
    opacity: 1,
  },
  checkBadge: {
    position: 'absolute',
    top: 0,
    right: 5,
    backgroundColor: Colors.secondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryText: {
    color: Colors.text,
    fontSize: 14,
    flex: 1,
  },
  highlight: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
