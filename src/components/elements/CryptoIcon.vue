<script setup lang="ts">
import BtcIcon from "@/components/icons/cryptos/icon-btc.vue"
import NimIcon from "@/components/icons/cryptos/icon-nim.vue"
import EthIcon from "@/components/icons/cryptos/icon-eth.vue"
import LtcIcon from "@/components/icons/cryptos/icon-ltc.vue"
import XlmIcon from "@/components/icons/cryptos/icon-xlm.vue"
import DashIcon from "@/components/icons/cryptos/icon-dash.vue"
import XrpIcon from "@/components/icons/cryptos/icon-xrp.vue"

const props = defineProps({
	crypto: {
		type: String,
		required: true,
	},
})
const crypto = props.crypto.toLocaleLowerCase() 
</script>

<template>
	<NimIcon v-if="crypto === 'nim'" />
	<BtcIcon v-else-if="crypto === 'btc'" />
	<LtcIcon v-else-if="crypto === 'ltc'" />
	<EthIcon v-else-if="crypto === 'eth'" class="bg-white border rounded-full border-[#3B4B68]/10" />
	<XrpIcon v-else-if="crypto === 'xrp'" class="bg-white border rounded-full border-[#3B4B68]/10" />
	<DashIcon v-else-if="crypto === 'dash'" />
	<XlmIcon v-else-if="crypto === 'xlm'" class="bg-white border rounded-full border-[#3B4B68]/10" />
</template>
