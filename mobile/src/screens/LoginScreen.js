import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      setError('Invalid email or password. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <View style={styles.brand}>
        <Image source={require('../../assets/ramp-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitle}>Community accessibility mapping for Cebu City and beyond.</Text>
      </View>
      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <FormInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <FormInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <AppButton title="Login" onPress={handleLogin} loading={loading} disabled={!email || !password} />
        <View style={styles.links}>
          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  logo: {
    width: 158,
    height: 158,
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: colors.white,
  },
  subtitle: {
    maxWidth: 320,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  form: {
    gap: 14,
  },
  error: {
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#b42318',
    backgroundColor: '#fef2f2',
    fontWeight: '700',
    lineHeight: 20,
  },
  links: {
    gap: 2,
    paddingTop: 2,
  },
  link: {
    paddingVertical: 8,
    color: colors.brand,
    fontWeight: '800',
    textAlign: 'center',
  },
});
