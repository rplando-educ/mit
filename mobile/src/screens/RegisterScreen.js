import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleRegister() {
    if (form.password !== form.confirmPassword) {
      Alert.alert('Passwords do not match', 'Please confirm your password again.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Join the RAMP community and contribute accessibility information.</Text>
      <View style={styles.form}>
        <FormInput label="First Name" value={form.firstName} onChangeText={(value) => update('firstName', value)} />
        <FormInput label="Last Name" value={form.lastName} onChangeText={(value) => update('lastName', value)} />
        <FormInput label="Email" value={form.email} onChangeText={(value) => update('email', value)} autoCapitalize="none" keyboardType="email-address" />
        <FormInput label="Password" value={form.password} onChangeText={(value) => update('password', value)} secureTextEntry />
        <FormInput label="Confirm Password" value={form.confirmPassword} onChangeText={(value) => update('confirmPassword', value)} secureTextEntry />
        <AppButton
          title="Register"
          onPress={handleRegister}
          loading={loading}
          disabled={!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword}
        />
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already registered? Login</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
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
