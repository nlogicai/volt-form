<script>
import Vue from 'vue';
import VoltForm from '@/volt-form.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VoltForm
  },
  data() {
    return {
      schema: {
        properties: {
          surname_0: {
            label: "Фамилия",
            type: "string",
            rules: ["size:2,5"],
          },
          name_0: {
            label: "Name",
            type: "string",
            rules: ["size:2"],
          },
        },
        required: [
          "surname_0",
          "name_0",
        ],
      },
      uiSchema: [
        {
          component: "input",
          model: "surname_0",
          fieldOptions: {
            props: {
              label: "Фамилия",
              horizontal: true,
              mask: null,
              placeholder: null,
              class: ["is-validated"],
              id: "surname_0",
              focusEvent: "scroll_to_box",
              enableIsFocused: true,
            },
            need_check: false,
          },
        },
        {
          component: "input",
          model: "name_0",
          fieldOptions: {
            props: {
              label: "Name",
              horizontal: true,
              mask: null,
              placeholder: null,
              class: ["is-validated"],
              id: "name_0",
              focusEvent: "scroll_to_box",
              enableIsFocused: true,
            },
            need_check: false,
          },
        },
      ],
      model: {
        surname_0: "Vasya",
      },
      components: {}
    }
  }
});
</script>

<template>
  <div id="app">
    <volt-form
        v-model="model"
        :schema="schema"
        :ui-schema="uiSchema"

        class="form"
        immediate-validation
    />
  </div>
</template>
