import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import AddLocationScreen from '../screens/AddLocationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import LocationDetailsScreen from '../screens/LocationDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator color={colors.brand} size="large" />
    </View>
  );
}

export default function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { color: colors.ink, fontWeight: '900' },
        headerTintColor: colors.brand,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
        headerRight: currentUser && route.name !== 'Home'
          ? () => (
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('Home')}
                style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1, paddingHorizontal: 6, paddingVertical: 4 })}
              >
                <Text style={{ color: colors.brand, fontWeight: '900' }}>Home</Text>
              </Pressable>
            )
          : undefined,
      })}
    >
      {currentUser ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'RAMP' }} />
          <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Accessibility Map' }} />
          <Stack.Screen name="AddLocation" component={AddLocationScreen} options={{ title: 'Add Location' }} />
          <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} options={{ title: 'Location Details' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
