<template>
  <UCard>
    <template #header>
      <h2 class="font-semibold text-xl">App Settings</h2>
    </template>
    <div class="space-y-4">
      <p>This is the application settings page.</p>
      <p>Manage your preferences and configurations here.</p>
      <div class="flex items-center space-x-4">
        <label for="dark-mode">Dark Mode</label>
        <UToggle id="dark-mode" />
      </div>
    </div>
  </UCard>
</template>
