<script setup lang="ts">
import { Banner, Provider } from 'types'
import NimiqPayIcon from './nimiq-pay.vue'
import BluecodeIcon from './bluecode.vue'
import CryptopaymentLinkIcon from './cryptopayment-link.vue'
import DefaultAtmIcon from './default-atm.vue'
import EdeniaIcon from './edenia.vue'
import NakaIcon from './naka.vue'
import KurantIcon from './kurant.vue'

defineProps({
  banner: {
    type: String as () => Banner,
    required: true,
  },
})
</script>

<template>
  <NimiqPayIcon v-if="banner === 'Nimiq-Pay'" />
  <BluecodeIcon v-else-if="banner === Provider.Bluecode" />
  <CryptopaymentLinkIcon v-else-if="banner === Provider.CryptopaymentLink" />
  <DefaultAtmIcon v-else-if="banner === Provider.DefaultAtm" />
  <EdeniaIcon v-else-if="banner === Provider.Edenia" />
  <NakaIcon v-else-if="banner === Provider.NAKA" />
  <KurantIcon v-else-if="banner === Provider.Kurant" />
</template>
