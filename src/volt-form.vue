<template>
  <form class="n-form-generator" @submit="onSubmit($event)">
    <volt-form-input
      v-for="(item, idx) in uiSchema"
      :item="item"
      :key="idx"
      :components="components"
      :value="value"
      :errors="errors"
    />
  </form>
</template>

<script>
import voltFormInput from "@/components/voltFormInput/voltFormInput.vue";
import emitter from "@/services/emitter";
import * as s from "superstruct";
import { rules } from "@/dictonaries/rules";
import { requiredValidator } from "@/services/validatorsList";


export default /*#__PURE__*/{
  name: 'VoltForm',
  components: { voltFormInput },
  props: {
    components: {
      type: Object,
      default: () => {},
    },
    schema: {
      type: Object,
      default: () => {},
    },
    uiSchema: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => {},
    },
    immediateValidation: {
      type: Boolean,
      default: false,
    },
    customRules: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      errors: {},
    };
  },
  methods: {
    onValidate() {
      this.$emit("validated", !this.hasErrors());
    },
    doValidate(init = true) {
      const rulesList = { ...rules, ...this.customRules };
      const fields = Object.entries(this.schema.properties);
      this.errors = {};
      fields.forEach(([key, params]) => {
        const validations = [];
        const isRequired = this.schema.required.some((f) => f === key);
        const fieldRules = params.rules ?? [];
        if (isRequired) {
          try {
            const value = this.value[key];
            requiredValidator(value, params.type);
            if (init) {
              this.onValidate();
              return;
            }
          } catch (e) {
            this.errorCatcher(e, key);
          }
        }

        fieldRules.forEach((rule) => {
          const ruleName = rule.split(":")[0];
          const ruleArguments = rule.split(":")?.[1]?.split(",") ?? null;
          if (ruleArguments) {
            validations.push(rulesList[ruleName](ruleArguments));
          } else {
            validations.push(rulesList[ruleName]);
          }
        });
        if (!validations.length) return;
        try {
          s.assert(
              this.value,
              s.type({
                [key]: s.intersection([...validations]),
              })
          );
        } catch (e) {
          this.errorCatcher(e, key);
        }
      });
      this.onValidate();
    },
    onSubmit(event) {
      event.preventDefault();
      this.$emit("submit");
    },
    errorCatcher(e, key) {
      if (e instanceof s.StructError) {
        const errors = e?.failures() ?? [];

        errors.forEach((error) => {
          this.errors[key] = {};
          if (!error.refinement) {
            this.errors[key].nonempty = true
          } this.errors[key][error.refinement] = true;
        });
      } else {
        return new Error(e);
      }
    },
    hasErrors() {
      const errors = Object.keys(this.errors);
      return errors.length > 0;
    },
  },
  mounted() {
    if (this.immediateValidation) {
      this.doValidate();
    }
    emitter.on("input", async (val) => {
      await this.$emit("input", {
        ...this.value,
        [val.model]: val.value,
      });
      await this.doValidate(false);
    });
    emitter.on("blur", async () => {
      await this.doValidate(false);
    });
  },
  beforeDestroy() {
    emitter.off("input");
    emitter.off("blur");
    emitter.off("submit");
  },
};
</script>
