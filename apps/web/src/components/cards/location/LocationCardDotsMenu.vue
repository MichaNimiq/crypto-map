<script setup lang="ts">
import { useShare, useClipboard } from '@vueuse/core'
import { DropdownMenu } from 'radix-vue/namespaced'
import type { PropType } from 'vue'
import { CopyIcon } from '@nimiq/vue3-components'
import type { Location } from 'types'
import IconFlag from '@/components/icons/icon-flag.vue'
import IconShare from '@/components/icons/icon-share.vue'
import IconThreeDots from '@/components/icons/icon-three-dots.vue'
import { i18n } from '@/i18n/i18n-setup'

const props = defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
})

const { share, isSupported: shareIsSupported } = useShare()
const { copy, isSupported: copyIsSupported } = useClipboard()

const url = () => `${window.location.origin}${window.location.pathname}?uuid=${props.location.uuid}`
</script>

<template>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger v-bind="$attrs">
      <IconThreeDots class="w-5 h-5 transition-colors" :class="{
        'text-space/30 hover:text-space/50': !location.isAtm || location.isLight,
        'text-white/60 hover:text-white/80': location.isAtm && location.isDark,
      }" />
    </DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content
        class="outline-none bg-gradient-space rounded-sm p-1 will-change-[colors] shadow absolute -top-6 -right-2 min-w-max animate-slideLeftAndFade"
        :side-offset="0">
        <DropdownMenu.Item v-if="shareIsSupported"
          class="flex px-4 py-2 text-white transition-colors outline-none cursor-pointer select-none hover:text-white/80"
          @click="share({
            title: props.location.name,
            text: i18n.t('Check out {locationName} on Nimiq\'s Crypto Map', { locationName: props.location.name }),
            url: url(),
          })">
          <IconShare class="w-4 h-4 mr-3" />
          <span class="text-base font-semibold leading-4">{{ $t('Share') }}</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item v-if="copyIsSupported" @click="copy(url())"
          class="flex px-4 py-2 text-white transition-colors outline-none cursor-pointer select-none hover:text-white/80">
          <CopyIcon class="w-4 h-4 mr-3" />
          <span class="text-base font-semibold leading-4">{{ $t('Copy URL') }}</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item as="a" :href="`/location/report?uuid=${location.uuid}`"
          class="flex px-4 py-2 transition-colors outline-none cursor-pointer select-none text-salmon hover:text-salmon/80">
          <IconFlag class="w-4 h-4 mr-3" />
          <span class="text-base font-semibold leading-4">{{ $t('Report') }}</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
</template>
