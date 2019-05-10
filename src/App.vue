<template>
  <div id="app">
    <div class="container-fluid">
      <ac-navbar @settings-open="open_settings_form" @save="save_page"/>
      <ac-settings v-if="show_settings_form" @save="set_page_meta"/>
    </div>

    <div class="container-fluid" id="builder_wrapper">
      <ac-builder :page-json="pageJson" @input="$emit('input', $event)"/>
    </div>
  </div>
</template>

<script>
import AcBuilder from "./components";
import acNavbar from "./components/ac-navbar.vue";
import acSettings from "./components/ac-settings.vue";
import axios from "axios";
const queryString = require('query-string');

export default {
  name: "app",
  components: {
    AcBuilder,
    acNavbar,
    acSettings
  },
  data() {
    return {
      show_settings_form: false,
      builderJson: {},
      pageJson: []
    };
  },
  props: {
    config: Object,
  
  },
  methods: {
    open_settings_form() {
      this.show_settings_form = !this.show_settings_form;
    },
    set_page_meta(meta) {
      this.builderJson.meta = meta;
      // Close panel
      this.show_settings_form = false;
    },
    save_page() {
      // Save to db

      let requestBody = {
        NAME: this.builderJson.meta.NAME,
        URL: this.builderJson.meta.URL,
        APPLICATION_ID: "" + this.config.APPLICATION_ID,
        BUILDER_JSON: JSON.stringify(this.pageJson),
        IS_CACHE: false,
        IS_SECURE: 0,
        IS_WRITABLE: 1,
        TEMPLATE: "",
        JS_CODE: "",
        CSS_CODE: "",
        JSON: ""
      };

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };

      axios
        .post("/appdb/_db/PAGES", queryString.stringify(requestBody), config)
        .then(result => {
          // Do somthing
          alert("done");
        })
        .catch(err => {
          // Do somthing
        });

    }
  }
};
</script>

<style>
#builder_wrapper {
  margin-top: 4rem;
}
</style>
