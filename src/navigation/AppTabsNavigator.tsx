import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {AppTabParamList} from './types';
import {HomeScreen} from '../features/home/screens/HomeScreen';
import {ActivityScreen} from '../features/activity/screens/ActivityScreen';
import {BeneficiariesScreen} from '../features/beneficiaries/screens/BeneficiariesScreen';
import {SupportScreen} from '../features/support/screens/SupportScreen';
import {ProfileScreen} from '../features/profile/screens/ProfileScreen';
import {AppTabBar} from '../components/navigation/AppTabBar';
import {useTheme} from '../theme/ThemeProvider';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabsNavigator() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      tabBar={props => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.colors.background,
          paddingBottom: 88,
        },
      }}>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ActivityTab" component={ActivityScreen} />
      <Tab.Screen name="BeneficiariesTab" component={BeneficiariesScreen} />
      <Tab.Screen name="SupportTab" component={SupportScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
