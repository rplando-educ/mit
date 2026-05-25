import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    try {
      await forgotPassword(email);
      Alert.alert('Reset link sent', 'Check your email for password reset instructions.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Unable to send reset link', 'Please enter a valid registered email address.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <Text style={styles.title}>Reset password</Text>
      <Text style={styles.subtitle}>Enter your account email and we will send a password reset link.</Text>
      <View style={styles.form}>
        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <AppButton title="Send Reset Link" onPress={handleReset} loading={loading} disabled={!email} />
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Back to Login</Text>
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
