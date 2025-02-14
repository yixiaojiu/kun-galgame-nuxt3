<script setup lang="ts">
const props = defineProps<{
  uid: number
  tid: number
  rid: number
  dislikes: number[]
  toUid: number
}>()

const { moemoeAccessToken } = useKUNGalgameUserStore()
const isDisliked = ref(props.dislikes.includes(props.uid))
const dislikesCount = ref(props.dislikes.length)

watch(
  () => props.dislikes,
  (newLikes) => {
    isDisliked.value = newLikes.includes(props.uid)
    dislikesCount.value = newLikes.length
  }
)

const throttleCallback = () => {
  useMessage(
    'You can only perform one operation within 1007 milliseconds',
    '您在 1007 毫秒内只能进行一次操作',
    'warn'
  )
}

const dislikeOperation = async (
  tid: number,
  rid: number,
  toUid: number,
  isPush: boolean
) => {
  const isMasterTopic = rid === 0
  if (isMasterTopic) {
    const queryData = {
      isPush: isPush,
      to_uid: toUid,
    }
    const { data } = await useFetch(`/api/topic/${tid}/dislike`, {
      method: 'PUT',
      query: queryData,
      watch: false,
      ...kungalgameResponseHandler,
    })
    return data
  } else {
    const queryData = {
      isPush: isPush,
      rid: props.rid,
      to_uid: toUid,
    }
    const { data } = await useFetch(`/api/topic/${tid}/reply/dislike`, {
      method: 'PUT',
      query: queryData,
      watch: false,
      ...kungalgameResponseHandler,
    })
    return data
  }
}

const toggleDislike = async () => {
  if (props.uid === props.toUid) {
    useMessage('You cannot dislike yourself', '您不可以给自己点踩', 'warn')
    return
  }

  const { tid, rid, toUid } = props
  const isPush = !isDisliked.value

  const data = await dislikeOperation(tid, rid, toUid, isPush)

  if (data.value) {
    isDisliked.value = isPush
    dislikesCount.value += isPush ? 1 : -1

    if (isPush) {
      useMessage('Dislike successfully!', '点踩成功！', 'success')
    } else {
      useMessage('Cancel dislike successfully!', '取消点踩成功！', 'success')
    }
  }
}

const handleClickDislikeThrottled = throttle(
  toggleDislike,
  1007,
  throttleCallback
)

const handleClickDislike = () => {
  if (!moemoeAccessToken) {
    useMessage('You need to login to dislike', '您需要登录以点踩', 'warn', 5000)
    return
  }
  handleClickDislikeThrottled()
}
</script>

<template>
  <li>
    <span
      class="dislike"
      :class="isDisliked ? 'active' : ''"
      @click="handleClickDislike"
    >
      <Icon class="icon" name="line-md:thumbs-down-twotone" />
    </span>
    {{ dislikesCount }}
  </li>
</template>

<style lang="scss" scoped>
li {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  margin: 17px;
  margin-right: 0;

  span {
    display: flex;
    margin-right: 3px;
  }
}

.dislike {
  font-size: 24px;
  color: var(--kungalgame-font-color-2);
  cursor: pointer;
}

.active .icon {
  color: var(--kungalgame-blue-5);
}
</style>
