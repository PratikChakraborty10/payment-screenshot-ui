import { Session } from '@supabase/supabase-js';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const syncUserWithBackend = async (session: Session) => {
    if (!API_URL) {
        console.warn('⚠️ EXPO_PUBLIC_API_URL is not set. Skipping backend sync.');
        return;
    }

    try {
        const { user, access_token } = session;

        console.log('🔄 Syncing user with backend:', user.email);

        const response = await fetch(`${API_URL}/api/users/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`, // Send Supabase token for verification
            },
            body: JSON.stringify({
                supabase_uid: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name,
                avatar_url: user.user_metadata?.avatar_url,
                provider: user.app_metadata?.provider || 'google',
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend sync failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ User synced with backend:', data);
        return data;
    } catch (error) {
        console.error('🔴 Error syncing user with backend:', error);
        // Optional: Rethrow if you want to block the UI, but usually better to log and proceed
    }
};
