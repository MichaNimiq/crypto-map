<script setup lang="ts">
import { Provider } from 'types'
import NimiqIcon from './nimiq.vue'
import BluecodeIcon from './bluecode.vue'
import CryptopaymentLinkIcon from './cryptopayment-link.vue'
import DefaultAtmIcon from './default-atm.vue'
import EdeniaIcon from './edenia.vue'
import GoCryptoIcon from './gocrypto.vue'
import NakaIcon from './naka.vue'
import KurantIcon from './kurant.vue'

defineProps({
  provider: {
    type: String as () => Provider,
    required: true,
  },
})
</script>

<template>
  <div
    class="grid w-8 h-8 bg-white rounded-full children:w-5 children:h-5 place-content-center"
    :class="{
      '!bg-[#1F2348]': provider === Provider.NimiqPay,
      '!bg-[#b7ff00]': provider === Provider.NAKA,
    }"
  >
    <NimiqIcon v-if="provider === Provider.NimiqPay" />
    <BluecodeIcon v-else-if="provider === Provider.Bluecode" />
    <CryptopaymentLinkIcon v-else-if="provider === Provider.CryptopaymentLink" class="-ml-px" />
    <DefaultAtmIcon v-else-if="provider === Provider.DefaultAtm" />
    <EdeniaIcon v-else-if="provider === Provider.Edenia" class="[&_path]:!fill-[#22afad] [&_path]:!opacity-100" />
    <GoCryptoIcon v-else-if="provider === Provider.GoCrypto" class="[&_path]:!fill-space" />
    <NakaIcon v-else-if="provider === Provider.NAKA" />
    <KurantIcon v-else-if="provider === Provider.Kurant" class="[&_path]:!fill-[#b22516] [&_path]:!opacity-100" />
  </div>
</template>
