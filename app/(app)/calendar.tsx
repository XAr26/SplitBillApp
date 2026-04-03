import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
const firstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

// Initial Data for Events on Calendar
const INITIAL_EVENTS: Record<string, any[]> = {
  '2026-04-05': [{ id: 'c1', type: 'debt', title: 'Bayar Kosan', amount: 1500000 }],
  '2026-04-12': [{ id: 'c2', type: 'receivable', title: 'Piutang Budi', amount: 50000 }],
  '2026-04-20': [{ id: 'c3', type: 'debt', title: 'Listrik', amount: 350000 }],
};

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currency } = useSettingsStore();

  // Dynamic Date & Events State
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0]); 
  const [events, setEvents] = useState<Record<string, any[]>>(INITIAL_EVENTS);
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleDeleteEvent = (date: string, id: string) => {
    Alert.alert('Hapus Tagihan', 'Apakah Anda yakin ingin menghapus tagihan ini?', [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Hapus', 
        style: 'destructive',
        onPress: () => {
          const updatedEvents = { ...events };
          updatedEvents[date] = updatedEvents[date].filter(e => e.id !== id);
          if (updatedEvents[date].length === 0) delete updatedEvents[date];
          setEvents(updatedEvents);
        }
      }
    ]);
  };

  const handleQuickAdd = (date: string) => {
     // For demo, we add a mock bill. In production, this can open a modal.
     const newEvent = { 
        id: Math.random().toString(), 
        type: 'debt', 
        title: 'Tagihan Baru', 
        amount: 100000 
     };
     const updatedEvents = { ...events };
     if (!updatedEvents[date]) updatedEvents[date] = [];
     updatedEvents[date].push(newEvent);
     setEvents(updatedEvents);
     Alert.alert('Sukses', 'Tagihan cepat berhasil ditambahkan ke tanggal ' + date);
  };



  const getCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);
    const days = [];
    for (let i = 0; i < startDay; i++) days.push({ id: `e-${i}`, empty: true });
    for (let d = 1; d <= totalDays; d++) {
        const dStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({ id: dStr, day: d, date: dStr });
    }
    return days;
  };

  const renderDayItem = ({ item }: { item: any }) => {
    if (item.empty) return <View style={styles.dayCell} />;
    
    const hasEvent = events[item.date];
    const isSelected = selectedDate === item.date;
    const isToday = item.date === new Date().toISOString().split('T')[0];

    return (
        <TouchableOpacity style={[styles.dayCell, isSelected && styles.selectedDayCell]} onPress={() => setSelectedDate(item.date)}>
            <Text style={[styles.dayText, isSelected && styles.selectedDayText, isToday && !isSelected && { color: Colors.primary, fontWeight: 'bold' }]}>{item.day}</Text>
            {hasEvent && (
                <View style={styles.dotRow}>
                    {hasEvent.some(e => e.type === 'debt') && <View style={[styles.dot, { backgroundColor: Colors.danger }]} />}
                    {hasEvent.some(e => e.type === 'receivable') && <View style={[styles.dot, { backgroundColor: Colors.secondary }]} />}
                </View>
            )}
        </TouchableOpacity>
    );
  };

  const formatCurrency = (amount: number) => `${currency.symbol} ${new Intl.NumberFormat('id-ID').format(amount)}`;
  const selectedEvents = events[selectedDate] || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Feather name="x" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kalender Keuangan</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={handlePrevMonth}><Feather name="chevron-left" size={24} color={Colors.text} /></TouchableOpacity>
            <Text style={styles.monthName}>{monthNames[currentMonth]} {currentYear}</Text>
            <TouchableOpacity onPress={handleNextMonth}><Feather name="chevron-right" size={24} color={Colors.text} /></TouchableOpacity>
          </View>
          <View style={styles.weekdaysRow}>
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => <Text key={day} style={styles.weekdayText}>{day}</Text>)}
          </View>
          <FlatList
            data={getCalendarDays()}
            renderItem={renderDayItem}
            keyExtractor={item => item.id}
            numColumns={7}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>Agenda {selectedDate}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => handleQuickAdd(selectedDate)}>
                <Feather name="plus-circle" size={24} color={Colors.primary} />
            </TouchableOpacity>
        </View>
        {selectedEvents.length > 0 ? selectedEvents.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <View style={[styles.eventIcon, { backgroundColor: event.type === 'debt' ? Colors.danger + '20' : Colors.secondary + '20' }]}>
                <Feather name={event.type === 'debt' ? 'arrow-up-right' : 'arrow-down-left'} size={20} color={event.type === 'debt' ? Colors.danger : Colors.secondary} />
              </View>
              <View style={{ flex: 1 }}><Text style={styles.eventTitle}>{event.title}</Text><Text style={styles.eventSubtitle}>{event.type === 'debt' ? 'Keluar' : 'Masuk'}</Text></View>
              <View style={styles.eventActionArea}>
                <Text style={[styles.eventAmount, { color: event.type === 'debt' ? Colors.danger : Colors.secondary }]}>{formatCurrency(event.amount)}</Text>
                <TouchableOpacity onPress={() => handleDeleteEvent(selectedDate, event.id)} style={styles.trashBtn}>
                    <Feather name="trash-2" size={18} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
        )) : (
          <View style={styles.emptyContainer}><Text style={styles.emptyText}>Tidak ada jadwal.</Text></View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  scrollContent: { padding: 24, paddingTop: 10 },
  calendarCard: { backgroundColor: Colors.card, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 32 },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  monthName: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  weekdaysRow: { flexDirection: 'row', marginBottom: 16 },
  weekdayText: { flex: 1, textAlign: 'center', fontSize: 12, color: Colors.textMuted, fontWeight: 'bold' },
  dayCell: { flex: 1, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  selectedDayCell: { backgroundColor: Colors.primary },
  dayText: { fontSize: 16, color: Colors.text },
  selectedDayText: { color: Colors.text, fontWeight: 'bold' },
  dotRow: { flexDirection: 'row', gap: 2, marginTop: 4 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  detailsTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  addBtn: { padding: 4 },
  eventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, padding: 18, borderRadius: 24, marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  eventIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  eventSubtitle: { fontSize: 12, color: Colors.textMuted },
  eventActionArea: { alignItems: 'flex-end', gap: 4 },
  eventAmount: { fontSize: 16, fontWeight: 'bold' },
  trashBtn: { padding: 4, marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 48, opacity: 0.5 },
  emptyText: { color: Colors.text, fontSize: 16 },
});
