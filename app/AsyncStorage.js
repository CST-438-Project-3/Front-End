import AsyncStorage from '@react-native-async-storage/async-storage';

const saveUserToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

const getUserToken = async () => {
    try {
        return await AsyncStorage.getItem('userToken');
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};
