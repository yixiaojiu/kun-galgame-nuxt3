<script setup lang="ts">
const { title: rewriteTitle, isTopicRewriting } =
  storeToRefs(useTempEditStore())
const { title: editTitle } = storeToRefs(useKUNGalgameEditStore())
const { clearTopic } = storeToRefs(useTempEditStore())

const topicTitle = ref('')
const maxInputLength = 40

if (isTopicRewriting.value) {
  topicTitle.value = rewriteTitle.value
} else {
  topicTitle.value = editTitle.value
}

const handleInput = () => {
  if (topicTitle.value.length > maxInputLength) {
    topicTitle.value = topicTitle.value.slice(0, maxInputLength)
  }

  if (topicTitle.value.trim() === '') {
    rewriteTitle.value = ''
    editTitle.value = ''
    return
  }

  debounce(() => {
    if (isTopicRewriting.value) {
      rewriteTitle.value = topicTitle.value
    } else {
      editTitle.value = topicTitle.value
    }
  }, 1007)()
}

watch(
  () => clearTopic.value,
  () => {
    topicTitle.value = ''
  }
)
</script>

<template>
  <div class="title">
    <input
      type="text"
      :placeholder="`${$t('edit.title')}`"
      v-model="topicTitle"
      @input="handleInput"
      :maxlength="maxInputLength"
    />
  </div>
</template>

<style lang="scss" scoped>
.title {
  padding: 10px;
  width: 100%;

  input {
    background-color: var(--kungalgame-white-9);
    color: var(--kungalgame-font-color-2);
    padding: 7px;
    width: 100%;
    font-size: 40px;
    border: none;
  }
}
</style>
