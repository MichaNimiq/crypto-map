<!-- <script setup lang="ts">
import "@/assets/scss/form-layout.scss"
</script>

<template>
	<div class="form-container">
		<div class="form-wrapper">
			<h1>
				{{ $t("infoWindows.reportIssue.title") }}
			</h1>

			<form action="">
				<SelectBoxMultiple
					:label="$t('labels.select-issue')"
					:placeholder="$t('labels.select-issue')"
					:entries="issueTypes"
					prefix="issue"
				/>

				<div class="input-wrap">
					<label>{{ $t("labels.select-issue") }}</label>
					<select>
						<option value="0" selected disabled>{{ $t("labels.select-issue") }}</option>
						<option value="issueType" v-for="issueType in issueTypes" :key="issueType">
							{{ $t(`selectEntries.issue.${issueType}`) }}
						</option>
					</select>
				</div>

				<div class="input-wrap">
					<label>{{ $t("labels.describe-issue") }}</label>
					<textarea
						class="textarea"
						required
						width="100%"
						:placeholder="$t('placeholders.describe-issue')"
					/>
				</div>

				<button type="submit" class="button primary">
					{{ $t("labels.report-issue") }}
				</button>
			</form>
		</div>
	</div>
</template> -->
