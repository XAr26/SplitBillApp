import { Redirect } from 'expo-router';

// For now, redirect to the login page.
// Later we will check if the user is authenticated and redirect to (app) or (auth).
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
