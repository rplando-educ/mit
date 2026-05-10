import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <View style={styles.brand}>
        <Image source={require('../../assets/ramp-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>RAMP</Text>
        <Text style={styles.subtitle}>Community accessibility mapping for Cebu City and beyond.</Text>
      </View>
      <View style={styles.form}>
        <FormInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <FormInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <AppButton title="Login" onPress={handleLogin} loading={loading} disabled={!email || !password} />
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Create a community account</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  brand: {
    gap: 10,
    marginBottom: 28,
  },
  logo: {
    width: 96,
    height: 96,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    maxWidth: 320,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: 14,
  },
  link: {
    paddingVertical: 10,
    color: colors.brand,
    fontWeight: '800',
    textAlign: 'center',
  },
});
