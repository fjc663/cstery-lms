import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserInfoStore = defineStore('userInfo', () => {
    const token = ref<string>('');
    const teachername = ref<string>('');
    const avatar = ref<string>('');

    function setToken(newToken: string) {
        token.value = newToken;
    }

    function setTeachername(newUsername: string) {
        teachername.value = newUsername;
    }

    function setAvatar(newAvatar: string) {
        avatar.value = newAvatar;
    }

    function remove() {
        token.value = '';
        teachername.value = '';
        avatar.value = '';
    }

    return { token, teachername, avatar, setToken, setTeachername, setAvatar, remove }

},
    {
        persist: true
    }
)