import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Currencies, Currency } from '@/constants/Currencies';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CurrencyPickerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currency, setCurrency } = useSettingsStore();
  const [search, setSearch] = useState('');

  const filteredCurrencies = Currencies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: Currency) => {
    setCurrency(item);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Feather name="x" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pilih Mata Uang</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari mata uang..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Feather name="x-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredCurrencies}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.item, 
              currency.code === item.code && styles.selectedItem
            ]} 
            onPress={() => handleSelect(item)}
          >
            <View style={styles.itemLeft}>
              <View style={styles.symbolBadge}>
                <Text style={styles.symbolText}>{item.symbol}</Text>
              </View>
              <View>
                <Text style={styles.codeText}>{item.code}</Text>
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
            </View>
            {currency.code === item.code && (
              <Feather name="check" size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 24,
    marginVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedItem: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  symbolText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  nameText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
