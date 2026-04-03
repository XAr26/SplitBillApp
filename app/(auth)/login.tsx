import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchApi } from '@/utils/api';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert('Eror', 'Mohon lengkapi semua data');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        // Register API Call
        const data = await fetchApi('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });
        await setAuth(data.user, data.token);
        Alert.alert('Sukses', 'Akun berhasil dibuat!', [{ text: 'OK', onPress: () => router.replace('/(app)/(tabs)') }]);
      } else {
        // Login API Call
        const data = await fetchApi('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        await setAuth(data.user, data.token);
        router.replace('/(app)/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Split Bill Cerdas</Text>
        <Text style={styles.subtitle}>{isRegister ? 'Mulai perjalanan finansial Anda' : 'Selamat datang kembali!'}</Text>
      </View>

      <View style={styles.formContainer}>
        {isRegister && (
          <View style={styles.inputGroup}>
            <Feather name="user" color={Colors.textMuted} size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nama Lengkap"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Feather name="mail" color={Colors.textMuted} size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Feather name="lock" color={Colors.textMuted} size={20} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <>
              <Text style={styles.buttonText}>{isRegister ? 'Daftar Sekarang' : 'Masuk'}</Text>
              <Feather name={isRegister ? 'user-plus' : 'log-in'} color={Colors.text} size={20} />
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkButton} onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.linkText}>
            {isRegister ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
