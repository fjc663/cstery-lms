import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserInfoStore = defineStore('userInfo', () => {
    const token = ref<string>('');
    const username = ref<string>('');
    const avatarUrl = ref<string>('');

    function setToken(newToken: string) {
        token.value = newToken;
    }

    function setUsername(newUsername: string) {
        username.value = newUsername;
    }

    function setAvatar(newAvatarUrl: string) {
        avatarUrl.value = newAvatarUrl;
    }

    function removeTokenAndUsername() {
        token.value = '';
        username.value = '';
        avatarUrl.value = '';
    }

    return { token, username, avatarUrl, setToken, setUsername, setAvatar, removeTokenAndUsername }

},
    {
        persist: true
    }
)