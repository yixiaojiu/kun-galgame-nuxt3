<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('seo.login.title'),
  meta: [
    {
      name: 'description',
      content: t('seo.login.description'),
    },
  ],
})

const isShowPanel = ref('')

const handleClickSignIn = () => {
  isShowPanel.value = ''
}

const handleClickRegister = () => {
  isShowPanel.value = 'active'
}
</script>

<template>
  <div class="root">
    <div
      class="container"
      :class="isShowPanel"
      :style="{ backgroundImage: `url(/login.webp)` }"
    >
      <div class="switch">
        <div @click="handleClickSignIn">{{ $t('login.overlay.login') }}</div>
        <div @click="handleClickRegister">
          {{ $t('login.overlay.register') }}
        </div>
      </div>

      <Login class="login" />

      <LoginRegister class="register" />

      <div class="container-overlay">
        <div class="overlay">
          <div class="panel left">
            <h2>
              {{ $t('login.overlay.title') }}<br /><br />——
              {{ $t('login.overlay.world') }}
              <span>{{ $t('login.overlay.moe') }}</span>
              {{ $t('login.overlay.forum') }}
            </h2>
            <br />
            <button class="btn" @click="handleClickSignIn">
              {{ $t('login.overlay.login') }}
            </button>
          </div>
          <div class="panel right">
            <h2>
              {{ $t('login.overlay.home') }}
              <br />
              <br />
              {{ $t('login.overlay.kun') }}
              <br />
              {{ $t('login.overlay.hug') }}
            </h2>
            <button class="btn" @click="handleClickRegister">
              {{ $t('login.overlay.register') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <KunFooter class="footer" />
  </div>
</template>

<style lang="scss" scoped>
.root {
  align-items: center;
  display: grid;
  height: calc(100vh - 75px);
  place-items: center;
  min-height: 500px;
  min-width: 800px;
  position: relative;
}

.container {
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.95;
  overflow: hidden;
  border-radius: 5px;
  box-shadow:
    0 15px 27px var(--kungalgame-blue-0),
    0 10px 10px var(--kungalgame-blue-0);
  height: 490px;
  max-width: 700px;
  position: relative;
  width: 100%;
}

.switch {
  width: 90%;
  top: 4%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 40px;
  position: absolute;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: var(--kungalgame-white);
  background-color: var(--kungalgame-blue-5);
  border-radius: 5px 5px 0 0;
  display: none;

  div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &:nth-child(1) {
      border-right: 1px solid var(--kungalgame-white);
    }
  }
}

.container.active {
  .login {
    transform: translateX(100%);
  }
  .register {
    animation: show 0.6s;
    opacity: 1;
    transform: translateX(100%);
    z-index: 5;
  }
  .container-overlay {
    transform: translateX(-100%);
  }
  .overlay {
    transform: translateX(50%);
  }
  .left {
    transform: translateX(0);
  }
  .right {
    transform: translateX(20%);
  }
}

.container-overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay {
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;

  h2 {
    margin-top: 150px;
    font-size: medium;
    color: var(--kungalgame-font-color-2);
  }

  h2 span {
    color: var(--kungalgame-red-4);
    padding: 0 5px;
    font-size: 20px;
  }

  .left {
    transform: translateX(-20%);
  }

  .right {
    right: 0;
    transform: translateX(0);
  }
}

.panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
  background-color: var(--kungalgame-trans-white-5);
}

.btn {
  width: 150px;
  position: absolute;
  border-radius: 50px;
  cursor: pointer;
  font-size: 15px;
  letter-spacing: 2px;
  padding: 7px 0px;
  text-transform: uppercase;
  transition: all 0.2s;
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
  bottom: 10%;
  background-color: var(--kungalgame-red-0);
  border: 1px solid var(--kungalgame-red-4);
  color: var(--kungalgame-red-4);

  &:hover {
    background-color: var(--kungalgame-red-4);
    color: var(--kungalgame-white);
  }

  &:active {
    transform: scale(0.95);
  }
}

.footer {
  position: absolute;
  bottom: 2%;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

@media (max-width: 700px) {
  .switch {
    display: flex;
  }

  .root {
    min-width: 0;
    width: 100%;
  }

  .container {
    background-image: none !important;
    display: flex;
    box-shadow: none;
    overflow: visible;
  }

  .container-overlay {
    display: none;
  }

  .container.active {
    .login {
      display: none;
      transform: translateX(0);
    }

    .register {
      animation: none;
      transform: translateX(0);
    }
  }

  .footer {
    position: relative;
  }
}
</style>
