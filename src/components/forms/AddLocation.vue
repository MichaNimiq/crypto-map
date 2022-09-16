<script setup lang="ts">
import "@/assets/scss/form-layout.scss";

import IconSvg from "@/components/elements/IconSvg.vue";
import InputSearchGooglePlaces from "@/components/elements/InputSearchGooglePlaces.vue";
import { cryptoCurrencies } from "@/globals";
</script>

<template>
	<div class="form-container">
		<div class="form-wrapper">
			<div class="context">
				<h1>
					{{ $t("infoWindows.addLocation.title") }}
				</h1>
				<p class="subline">
					{{ $t("infoWindows.addLocation.text") }}
				</p>
				<a
					:href="$t('infoWindows.addLocation.url')"
					:title="$t('infoWindows.addLocation.urlText')"
					target="_blank"
					class="blue arrow"
				>
					{{ $t("infoWindows.addLocation.urlText") }}
					<IconSvg iconIndex="icon-link-out" />
				</a>
			</div>

			<form action="">
				<div class="modal-row form-row">
					<InputSearchGooglePlaces placeholder="placeholders.find-anywhere" />
				</div>

				<div class="input-wrap">
					<label>{{ $t("labels.select-crypto") }}</label>
					<select multiple>
						<option value="0" selected disabled>{{ $t("labels.select-issue") }}</option>
						<option value="crypto" v-for="crypto in cryptoCurrencies" :key="crypto.symbol">
							{{ crypto.name }}
						</option>
					</select>
				</div>

				<button type="submit" class="button primary">
					{{ $t("labels.report-issue") }}
				</button>
			</form>
		</div>
	</div>
</template>