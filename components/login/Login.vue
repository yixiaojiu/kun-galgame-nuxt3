<script setup lang="ts">
import { checkLoginForm } from './utils/checkLogin'

const localePath = useLocalePath()

const info = useTempMessageStore()
const { isShowCapture, isCaptureSuccessful } = storeToRefs(
  useTempMessageStore()
)

const loginForm = reactive({
  name: '',
  password: '',
})

const handleLogin = async () => {
  const checkLogin = checkLoginForm.asyncData(useNuxtApp().$pinia)
  const result = checkLogin(loginForm.name, loginForm.password)
  if (!result) {
    return
  }

  if (!isCaptureSuccessful.value) {
    isShowCapture.value = true
    return
  }
}

watch(
  () => isCaptureSuccessful.value,
  async () => {
    if (!isCaptureSuccessful.value) {
      return
    }

    const { data } = await useFetch('/api/user/login', {
      method: 'POST',
      body: loginForm,
      watch: false,
      ...kungalgameResponseHandler,
    })
    if (data.value) {
      info.info('AlertInfo.login.success')
      useKUNGalgameUserStore().setUserInfo(data.value)
      navigateTo(localePath('/'))
    }
  }
)

const handleClickForgotPassword = () => {
  navigateTo(localePath('/forgot'))
}
</script>

<template>
  <div class="login">
    <LoginSettings />

    <form class="form" @submit.prevent>
      <h2 class="title">{{ $t('login.login.loginTitle') }}</h2>
      <input
        v-model="loginForm.name"
        autocomplete="username"
        type="text"
        :placeholder="`${$t('login.login.loginUsername')}`"
        class="input"
      />
      <input
        v-model="loginForm.password"
        autocomplete="current-password"
        type="password"
        :placeholder="`${$t('login.login.loginPassword')}`"
        class="input"
      />

      <span @click="handleClickForgotPassword" class="forget">
        {{ $t('login.login.forget') }}
      </span>

      <button @click="handleLogin" class="btn" type="submit">
        {{ $t('login.login.loginTitle') }}
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  z-index: 2;
  transition: all 0.6s ease-in-out;
}

.form {
  background-color: var(--kungalgame-white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

.title {
  font-weight: 300;
  font-weight: bold;
  margin: 20px;
  color: var(--kungalgame-font-color-2);
}

.input {
  border: none;
  outline: none;
  border-bottom: 1.5px solid var(--kungalgame-blue-0);
  padding: 15px;
  margin: 7px 0;
  width: 100%;
  background-color: var(--kungalgame-white);
  color: var(--kungalgame-font-color-3);

  &:focus {
    border-bottom: 1.5px solid var(--kungalgame-blue-5);
    transition: 0.2s linear;
  }
}

.forget {
  cursor: pointer;
  text-decoration: none;
  font-size: small;
  color: var(--kungalgame-blue-5);
  margin: 20px 0;
}

.btn {
  width: 150px;
  position: absolute;
  bottom: 10%;
  border-radius: 50px;
  background-color: var(--kungalgame-trans-white-5);
  border: 1px solid var(--kungalgame-blue-5);
  color: var(--kungalgame-blue-5);
  cursor: pointer;
  font-size: 15px;
  letter-spacing: 2px;
  padding: 7px 0px;
  text-transform: uppercase;
  transition: all 0.2s;
  overflow: hidden;
  white-space: nowrap;

  &:hover {
    background-color: var(--kungalgame-blue-5);
    color: var(--kungalgame-white);
  }

  &:active {
    transform: scale(0.95);
  }
}

@media (max-width: 700px) {
  .login {
    width: 90%;
    transition: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 7px;
    box-shadow:
      0 15px 27px var(--kungalgame-blue-0),
      0 10px 10px var(--kungalgame-blue-0);
  }

  .form {
    border-radius: 5px;
  }
}
</style>
