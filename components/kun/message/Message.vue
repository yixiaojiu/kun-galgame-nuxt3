<script setup lang="ts">
import dayjs from 'dayjs'
import { getMessageZH, getMessageI18n } from './getMessageI18n'
import type { Message } from '~/types/api/message'

const props = defineProps<{
  message: Message[]
  refresh: () => {}
}>()

const { locale } = useI18n()

const activeMessage = ref<number[]>([])
const messageMap = reactive(new Map<number, string | null>())

const isShowMoreOperation = (mid: number) => {
  return activeMessage.value.includes(mid)
}

const handelClickShowMoreOperation = async (mid: number) => {
  if (!isShowMoreOperation(mid)) {
    activeMessage.value.push(mid)

    if (messageMap.get(mid)) {
      return
    }
    const { data } = await useFetch(`/api/message`, {
      method: 'GET',
      query: { mid },
      watch: false,
      ...kungalgameResponseHandler,
    })
    messageMap.set(mid, data.value)
  } else {
    activeMessage.value = activeMessage.value.filter((item) => item !== mid)
  }
}

const handleGetMessageDetail = (message: Message) => {
  return computed(() => {
    const messageContent = markdownToText(messageMap.get(message.mid) ?? '')
    return `${message.senderName} ${getMessageZH(
      locale.value,
      message.type
    )}: ${messageContent}`
  }).value
}

const handleMarkAsRead = async (mid: number) => {
  const { data } = await useFetch(`/api/message/read`, {
    method: 'PUT',
    query: { mid },
    watch: false,
    ...kungalgameResponseHandler,
  })

  if (data.value) {
    props.refresh()
    useMessage('Mark as read successfully!', '标记为已读成功', 'success')
  }
}

const handleDeleteMessage = async (mid: number) => {
  const { data } = await useFetch(`/api/message/delete`, {
    method: 'DELETE',
    query: { mid },
    watch: false,
    ...kungalgameResponseHandler,
  })

  if (data.value) {
    props.refresh()
    useMessage('Delete message successfully!', '删除消息成功', 'success')
  }
}
</script>

<template>
  <div class="container">
    <div
      class="message"
      :class="msg.status === 'read' ? 'message-read' : ''"
      v-for="(msg, index) in props.message"
      :key="index"
    >
      <div class="top">
        <div class="status">
          <span class="unread" v-if="msg.status === 'unread'">
            <Icon name="line-md:alert-circle" />
          </span>
          <span class="read" v-if="msg.status === 'read'">
            <Icon name="line-md:confirm-circle" />
          </span>
        </div>

        <span class="time">
          {{ dayjs(msg.time).format('MM-D-YYYY - h:mm:ss') }}
        </span>
      </div>

      <div class="content" v-html="getMessageI18n(locale, msg)"></div>

      <div class="bottom">
        <NuxtLinkLocale v-if="msg.tid" class="link" :to="`/topic/${msg.tid}`">
          {{ $t('header.message.link') }}
        </NuxtLinkLocale>
        <span
          class="more-btn"
          :class="isShowMoreOperation(msg.mid) ? 'more-btn-active' : ''"
          @click="handelClickShowMoreOperation(msg.mid)"
        >
          <Icon name="line-md:chevron-small-right" />
        </span>
      </div>

      <div
        class="more"
        v-if="isShowMoreOperation(msg.mid) && activeMessage.includes(msg.mid)"
      >
        <div class="detail">
          {{ handleGetMessageDetail(msg) }}
        </div>

        <span @click="navigateTo(`/kungalgamer/${msg.senderUid}/info`)">
          {{ `${$t('header.message.goto')} ${msg.senderName}` }}
        </span>
        <span v-if="msg.status === 'unread'" @click="handleMarkAsRead(msg.mid)">
          {{ $t('header.message.read') }}
        </span>
        <span @click="handleDeleteMessage(msg.mid)">
          {{ $t('header.message.delete') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: calc(100vh - 63px + 200px);
  padding: 10px;
  overflow-y: scroll;
}

.message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid var(--kungalgame-pink-4);

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status {
      .unread {
        color: var(--kungalgame-pink-4);
      }

      .read {
        color: var(--kungalgame-blue-5);
      }
    }

    .time {
      font-size: 13px;
    }
  }

  .content {
    margin-top: 10px;
    margin-bottom: 10px;
    word-break: break-all;

    :deep(a) {
      color: var(--kungalgame-blue-5);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
  }
}

.link {
  cursor: pointer;
  color: var(--kungalgame-pink-4);
  border-bottom: 2px solid var(--kungalgame-trans-white-9);

  &:hover {
    border-bottom: 2px solid var(--kungalgame-pink-4);
  }
}

.more-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    color: var(--kungalgame-blue-5);
  }
}

.more {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
    font-size: 15px;

    &:hover {
      background-color: var(--kungalgame-trans-blue-1);
    }
  }
}

.detail {
  padding: 5px;
  border-left: 4px solid var(--kungalgame-blue-5);
  word-break: break-word;
}

.more-btn-active {
  transform: rotate(90deg);
  transition: transform 0.2s;
}

.message-read {
  border: 1px solid var(--kungalgame-trans-blue-4);

  .link {
    color: var(--kungalgame-blue-5);

    &:hover {
      border-bottom: 2px solid var(--kungalgame-blue-5);
    }
  }
}

@media (max-width: 700px) {
  .container {
    height: calc(100vh - 63px + 100px);
  }
}
</style>
