<script setup lang="ts">
import { topicCategory } from './utils/category'
import type { Category } from './utils/category'

// TODO:
const localePath = useLocalePath()
const { locale } = useI18n()
const alertInfo =
  locale.value === 'en-us'
    ? 'ATTENTION: If you are publishing game resources, it is prohibited to use links from other websites without authorization.'
    : '注意：如果发布游戏资源，禁止盗用其他网站的链接'

const { category: rewriteCategory, isTopicRewriting } =
  storeToRefs(useTempEditStore())
const { category: editCategory } = storeToRefs(useKUNGalgameEditStore())
const { clearTopic } = storeToRefs(useTempEditStore())

const selectedCategories = ref<string[]>([])

if (isTopicRewriting.value) {
  selectedCategories.value = rewriteCategory.value
} else {
  selectedCategories.value = editCategory.value
}

const handleClickCategory = (kun: Category) => {
  if (kun.index === 1 && selectedCategories.value.includes('Others')) {
    return
  }
  if (kun.index === 3 && selectedCategories.value.includes('Galgame')) {
    return
  }

  const index = selectedCategories.value.indexOf(kun.name)
  if (index !== -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(kun.name)
  }

  if (isTopicRewriting.value) {
    rewriteCategory.value = selectedCategories.value
    return
  }

  editCategory.value = selectedCategories.value
}

watch(
  () => clearTopic.value,
  () => {
    selectedCategories.value = []
  }
)
</script>

<template>
  <div class="topic-group">
    <span class="link" @click="navigateTo(localePath('/topic/280'))">
      {{ alertInfo }}
    </span>
    <br />
    <br />
    <div>{{ $t('edit.categories') }}</div>
    <div class="group-btn">
      <span
        class="btn"
        v-for="kun in topicCategory"
        :key="kun.index"
        @click="handleClickCategory(kun)"
        :class="{ active: selectedCategories.includes(kun.name) }"
      >
        {{ $t(`edit.${kun.name}`) }}
      </span>
    </div>
  </div>

  <EditButton />
</template>

<style lang="scss" scoped>
.link {
  color: var(--kungalgame-blue-5);
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px solid var(--kungalgame-trans-white-9);

  &:hover {
    border-bottom: 2px solid var(--kungalgame-blue-5);
  }
}
.topic-group {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 10px;
}

.group-btn {
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.btn {
  height: 30px;
  width: 177px;
  font-size: 17px;
  cursor: pointer;
  border: 1px solid var(--kungalgame-blue-5);
  border-radius: 15px;
  background-color: var(--kungalgame-trans-white-9);
  color: var(--kungalgame-blue-5);
  display: flex;
  justify-content: center;
  align-items: center;

  &:nth-child(2) {
    margin: 0 10px;
  }
}

.active {
  background-color: var(--kungalgame-blue-5);
  color: var(--kungalgame-white);
}
</style>
