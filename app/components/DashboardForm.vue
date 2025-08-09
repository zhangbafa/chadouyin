<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  ids: z.string().min(1, 'Please enter at least one ID')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  ids: ''
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-semibold text-xl">Dashboard</h2>
    </template>
    
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="作品ID" name="ids">
        <UTextarea v-model="state.ids" placeholder="Enter IDs, one per line..." class="custom-textarea" :rows="5" />
      </UFormField>

      <UButton type="submit">
        Submit
      </UButton>
    </UForm>
  </UCard>
</template>

<style>
.custom-textarea {
  width: 100%;
  max-width: 700px;
}
</style>
