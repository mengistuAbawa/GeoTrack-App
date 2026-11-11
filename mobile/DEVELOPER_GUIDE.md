# GeoTrack Mobile - Developer Guide

## Quick Navigation

### To Add a New Screen

1. Create file: `src/screens/[feature]/[ScreenName].tsx`
2. Implement with hooks:
   ```tsx
   import React from 'react';
   import { SafeAreaView } from 'react-native';
   import { useTheme } from '@/context/ThemeContext';
   
   const MyScreen: React.FC = () => {
     const { colors } = useTheme();
     return (
       <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
         {/* Content */}
       </SafeAreaView>
     );
   };
   
   export default MyScreen;
   ```
3. Add to navigation in `src/navigation/AppNavigator.tsx`

### To Add an API Service

1. Create: `src/services/[serviceName]Service.ts`
2. Use Axios client from `src/config/api.ts`
3. Example:
   ```ts
   import api from '@/config/api';
   
   export const myService = {
     getData: async () => {
       const response = await api.get('/endpoint');
       return response.data;
     },
   };
   ```

### To Add a Component

1. Create: `src/components/[ComponentName].tsx`
2. Accept theme from `useTheme()` hook
3. Use spacing and colors from theme
4. Example:
   ```tsx
   import { useTheme } from '@/context/ThemeContext';
   import { spacing } from '@/theme/typography';
   
   export const MyComponent: React.FC<Props> = ({ title }) => {
     const { colors } = useTheme();
     return (
       <View style={{ padding: spacing[16], backgroundColor: colors.white }}>
         {/* Content */}
       </View>
     );
   };
   ```

### To Add a Context

1. Create: `src/context/[Name]Context.tsx`
2. Create context with `createContext`
3. Create provider component
4. Export `use[Name]` hook
5. Wrap app in `app.tsx`

### To Handle State

Use React Hooks:
- `useState` - Simple state
- `useReducer` - Complex state
- `useContext` - Share state across components
- Custom hooks - Reusable logic

### To Make API Calls

Recommended patterns:

**Simple async:**
```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      const result = await myService.getData();
      setData(result);
    } catch (error) {
      showToast('Error loading data', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);
```

**Using useApi hook:**
```tsx
const { data, loading, error, execute } = useApi(
  () => myService.getData(),
  {
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => showToast(error.message, ToastType.ERROR),
  }
);
```

### To Handle Forms

Use simple state management:

```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
});
const [errors, setErrors] = useState({});

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

const handleSubmit = async () => {
  // Validate
  const newErrors = {};
  if (!formData.name) newErrors.name = 'Name required';
  if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
  
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;
  
  // Submit
  try {
    await myService.updateProfile(formData);
    showToast('Profile updated', ToastType.SUCCESS);
  } catch (error) {
    showToast('Failed to update', ToastType.ERROR);
  }
};
```

### To Use Theme

```tsx
import { useTheme } from '@/context/ThemeContext';
import { colors, typography, spacing, borderRadius } from '@/theme';

const MyComponent = () => {
  const { colors: themeColors, isDark } = useTheme();
  
  return (
    <View style={{
      backgroundColor: themeColors.background,
      padding: spacing[16],
      borderRadius: borderRadius.md,
    }}>
      <Text style={typography.h4}>Title</Text>
      <Text style={typography.body2}>Content</Text>
    </View>
  );
};
```

### To Show Notifications

```tsx
import { useNotification, ToastType } from '@/context/NotificationContext';

const MyComponent = () => {
  const { showToast } = useNotification();
  
  const handleAction = () => {
    try {
      // Do something
      showToast('Success!', ToastType.SUCCESS, 3000);
    } catch (error) {
      showToast('Error occurred', ToastType.ERROR);
    }
  };
};
```

### To Access Auth

```tsx
import { useAuth, AuthState } from '@/context/AuthContext';

const MyComponent = () => {
  const { user, state, logout, requestOtp, verifyOtp } = useAuth();
  
  if (state === AuthState.LOADING) {
    return <Loading />;
  }
  
  if (state !== AuthState.AUTHENTICATED) {
    return <Redirect to="Welcome" />;
  }
  
  return (
    <View>
      <Text>Welcome {user?.fullName}</Text>
    </View>
  );
};
```

### To Access Location

```tsx
import { useLocation } from '@/context/LocationContext';

const MyComponent = () => {
  const { isRecording, startRecording, stopRecording, getHistory } = useLocation();
  
  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };
};
```

### To Handle Permissions

```tsx
import * as Location from 'expo-location';

const requestPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === Location.PermissionStatus.GRANTED) {
    // Proceed
  } else {
    // Handle denial
    Alert.alert('Permission Required', 'Location access is needed');
  }
};
```

## Architecture Patterns

### API Error Handling

```tsx
try {
  const response = await api.post('/endpoint', data);
  return response.data;
} catch (error: any) {
  const message = error?.response?.data?.message || 
                  error?.message || 
                  'An error occurred';
  logger.error(TAG, 'Request failed', error);
  throw error;
}
```

### Loading States

```tsx
const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

// In UI:
{state === 'loading' && <Loading />}
{state === 'error' && <ErrorMessage />}
{state === 'success' && <Content />}
```

### Navigation

```tsx
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'ScreenName'>;

const MyScreen: React.FC<Props> = ({ navigation, route }) => {
  // Navigate to another screen
  navigation.navigate('OtherScreen', { param: 'value' });
  
  // Go back
  navigation.goBack();
  
  // Access route params
  const param = route.params?.param;
};
```

## Testing Guidelines

### Component Test

```tsx
import { render, screen } from '@testing-library/react-native';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeTruthy();
  });
});
```

### Service Test

```tsx
import { authService } from '@/services/authService';

describe('authService', () => {
  it('validates phone format', async () => {
    // Mock API
    jest.mock('@/config/api');
    
    // Test
    await expect(authService.requestOtp('+2519123456789')).resolves.toBeDefined();
  });
});
```

## Performance Tips

1. **Use FlatList for long lists** - Not ScrollView + map
2. **Memoize expensive computations** - useMemo, useCallback
3. **Lazy load images** - Use FastImage or optimize size
4. **Code splitting** - Use dynamic imports for large screens
5. **Profile app** - Use Expo DevTools and React DevTools

## Security Best Practices

1. **Never store tokens in AsyncStorage** - Use expo-secure-store
2. **Validate inputs on client AND server** - Defense in depth
3. **Use HTTPS for all API calls** - Already configured
4. **Handle 401 responses** - Logout and redirect to login
5. **Don't log sensitive data** - Careful with logger
6. **Validate location data** - Check coordinates are valid
7. **Request permissions explicitly** - Never silently track

## Debugging

### View Logs

```bash
# Expo logs
npm start -- --verbose

# Device logs
xcrun simctl spawn booted log stream --predicate "eventMessage contains[c] 'GeoTrack'" # iOS
adb logcat | grep GeoTrack # Android
```

### Use React DevTools

```bash
# From Expo menu (press 'j' during development)
- View React DevTools
- Inspect components
- Debug state
```

### Use Redux DevTools (if added)

```bash
# Monitor state changes
- Time travel debugging
- Action history
- Dispatch actions manually
```

## Common Issues & Solutions

### "Cannot find module X"

Check import path uses `@/` prefix or is correct relative path.

### "API returning 401"

Token is expired or invalid. AuthContext handles logout automatically.

### "Location permission denied"

User denied permission. Show helpful UI and request again.

### "Build failing"

Clear cache: `rm -rf node_modules package-lock.json && npm install`

### "Slow app startup"

Profile with React DevTools, check for unnecessary re-renders.

## Code Style

- **Files**: camelCase (fileName.tsx)
- **Exports**: default or named, be consistent
- **Constants**: UPPER_SNAKE_CASE
- **Variables**: camelCase
- **Types/Interfaces**: PascalCase
- **Strings**: Double quotes
- **Semicolons**: Always use
- **Indentation**: 2 spaces

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add src/
git commit -m "feat: add new feature"

# Push
git push origin feature/my-feature

# Create pull request on GitHub
```

## Useful Commands

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Test
npm run test

# Clear cache
npm start -- --clear

# Open debugger
npm start
# Press 'd' in terminal

# Reset native modules
npm run prebuild -- --clean
```

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Axios Docs](https://axios-http.com)

---

Happy coding! 🚀
