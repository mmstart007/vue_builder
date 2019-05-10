<template>
  <div id="settings_form" class="bg-white">
    <ac-form @submit="handleSubmit" :data="form" :validate="true">
      <b-button block type="submit" variant="primary">Save</b-button>
    </ac-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: [
        {
          tag: "ac-input",
          type: "text",
          label: "Page name",
          name: "NAME"
        },
        {
          tag: "ac-input",
          type: "text",
          label: "Page URL",
          name: "URL"
        }
        /* CATEGORY_ID
        IS_CACHE */
      ]
    };
  },
  methods: {
    handleSubmit(form) {
      let form_data = {};
      for (let i = 0; i < form.length; i++) {
        form_data[form[i].name] = form[i].value;
      }
      this.$emit("save", form_data);
    }
  },
  created() {}
};
</script>
<style>
#settings_form {
  position: fixed;
  margin: 0 auto;
  z-index: 1080;
}
</style>

