<script setup lang="ts">
const props = defineProps<{
  info: {
    tid: number
    rid: number
    views: number
    likes: number[]
    dislikes: number[]
    upvotes: number[]
  }
  content: {
    title: string
    content: string
    tags: string[]
    category: string[]
  }
  toUser: {
    uid: number
    name: string
  }
  toFloor: number
}>()

const info = computed(() => props.info)
const content = computed(() => props.content)
const toUser = computed(() => props.toUser)

/**
 * For simplicity, we don't display the "rewrite" option here.
 * In reality, if users modify the information saved in local storage,
 * this validation will become ineffective, but the validation logic is on the backend.
 */
// Current user's UID
const currUserUid = useKUNGalgameUserStore().uid

// Share
const handleClickShare = () => {
  const shareLink = `${props.content.title}: https://www.kungal.com/topic/${props.info.tid}`

  navigator.clipboard
    .writeText(shareLink)
    .then(() => {
      useMessage(
        'Share Link copied successfully!',
        '分享链接复制成功',
        'success'
      )
    })
    .catch((err) => {
      useMessage('Share Link copied failed!', '分享链接复制失败!', 'error')
    })
}
</script>

<template>
  <div class="footer">
    <div class="left">
      <ul>
        <TopicFooterUpvote
          :uid="currUserUid"
          :tid="info.tid"
          :rid="info.rid"
          :upvotes="info.upvotes"
          :to-uid="toUser.uid"
          v-tooltip="{
            message: { en: 'Upvote', zh: '推话题' },
            position: 'bottom',
          }"
        />

        <li
          v-if="info.views > 0"
          v-tooltip="{
            message: { en: 'Views', zh: '浏览数' },
            position: 'bottom',
          }"
        >
          <span class="icon"><Icon name="ic:outline-remove-red-eye" /></span>
          {{ info.views }}
        </li>

        <!-- Like -->
        <TopicFooterLike
          :uid="currUserUid"
          :tid="info.tid"
          :rid="info.rid"
          :likes="info.likes"
          :to-uid="toUser.uid"
          v-tooltip="{
            message: { en: 'Like', zh: '点赞' },
            position: 'bottom',
          }"
        />

        <!-- Dislike -->
        <TopicFooterDislike
          :uid="currUserUid"
          :tid="info.tid"
          :rid="info.rid"
          :dislikes="info.dislikes"
          :to-uid="toUser.uid"
          v-tooltip="{
            message: { en: 'Dislike', zh: '点踩' },
            position: 'bottom',
          }"
        />
      </ul>
    </div>

    <!-- Right part of the bottom (reply, comment, view only, edit) -->
    <div class="right">
      <TopicFooterReply
        :tid="info.tid"
        :to-user-name="toUser.name"
        :to-uid="toUser.uid"
        :to-floor="toFloor"
      />

      <!-- Share -->
      <span
        @click="handleClickShare"
        class="icon"
        v-tooltip="{
          message: { en: 'Share', zh: '分享' },
          position: 'bottom',
        }"
      >
        <Icon name="majesticons:share-line" />
      </span>

      <!-- View Only (TODO) -->
      <!-- <span class="icon"><Icon icon="ph:user-focus-duotone" /></span> -->

      <!-- Edit -->
      <TopicFooterRewrite
        :tid="info.tid"
        :rid="info.rid"
        :uid="currUserUid"
        :title="content.title"
        :content="content.content"
        :tags="content.tags"
        :category="content.category"
        :to-uid="toUser.uid"
        v-tooltip="{
          message: { en: 'Rewrite', zh: 'Rewrite' },
          position: 'bottom',
        }"
      />

      <!-- Comment slot -->
      <slot name="comment"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  padding: 7px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left ul {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--kungalgame-font-color-3);

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

    &:nth-child(1) span {
      color: var(--kungalgame-red-4);
    }
  }
}

.icon {
  font-size: 24px;
  color: var(--kungalgame-font-color-2);
  cursor: pointer;
}

.right {
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    display: flex;
    margin-right: 17px;
  }
}

.active {
  color: var(--kungalgame-blue-5);
}

@media (max-width: 700px) {
  .footer {
    flex-direction: column;
  }
  .reply {
    margin-right: 0;
  }
}
</style>
