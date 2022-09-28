<script setup lang="ts">
import BtcIcon from "@/components/icons/cryptos/icon-btc.vue"
import NimIcon from "@/components/icons/cryptos/icon-nim.vue"
import EthIcon from "@/components/icons/cryptos/icon-eth.vue"
import LtcIcon from "@/components/icons/cryptos/icon-ltc.vue"
import XlmIcon from "@/components/icons/cryptos/icon-xlm.vue"
import DashIcon from "@/components/icons/cryptos/icon-dash.vue"
import XrpIcon from "@/components/icons/cryptos/icon-xrp.vue"
import type { ShortCurrency } from "@/stores/api"

defineProps({
	crypto: {
		type: String as () => ShortCurrency,
		required: true,
	},
})
</script>

<template>
	<NimIcon v-if="crypto === 'NIM'" />
	<BtcIcon v-else-if="crypto === 'BTC'" />
	<LtcIcon v-else-if="crypto === 'LTC'" />
	<EthIcon v-else-if="crypto === 'ETH'" class="bg-white border rounded-full border-[#3B4B68]/10" />
	<XrpIcon v-else-if="crypto === 'XRP'" class="bg-white border rounded-full border-[#3B4B68]/10" />
	<DashIcon v-else-if="crypto === 'DASH'" />
	<XlmIcon v-else-if="crypto === 'XLM'" class="bg-white border rounded-full border-[#3B4B68]/10" />
</template>
