import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';

export const useGoogleAuth = () => {
    const router = useRouter();

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '701122319569-omh9k29vunkggp05ddd3bugqvucvaauc.apps.googleusercontent.com',
        iosClientId: '698834273975-sf9t82034o2l5sgci68je6nikd3el92b.apps.googleusercontent.com',
        redirectUri: 'http://localhost:8080/login/oauth2/code/google',
    });

    const handleGoogleSignIn = async () => {
        try {
            const result = await promptAsync();
            if (result?.type === 'success') {
                // Send the token to the backend
                const response = await fetch('http://localhost:8080/api/auth/oauth2-success', {
                    method: 'GET',
                    credentials: 'include', // Include cookies/session
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.redirectTo) {
                        // Redirect to the appropriate page
                        router.push(data.redirectTo);
                    } else {
                        alert('Redirect URL not provided!');
                    }
                } else {
                    alert('OAuth2 login failed.');
                }
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            alert('Google sign-in failed. Please try again.');
        }
    };

    return { request, response, handleGoogleSignIn };
};
