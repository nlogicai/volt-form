<template>
  <div class="volt-form-input">
    <template v-if="item.children && item.children.length">
      <component
          :is="componentName"
          v-bind="item.fieldOptions.props"
          class="n-form-generator-input-multiple"
      >
        <voltFormInput
            v-for="(child, index) in item.children"
            :item="child"
            :key="index"
            :components="components"
            :value="value"
            :errors="errors"
        />
      </component>
    </template>
    <template v-else>
      <component
          :is="componentName"
          class="n-form-generator-input-single"
          :class="[classList, { 'is-invalid': hasErrors }]"
          :value="inputValue"
          v-bind="{ ...item.fieldOptions.props }"
          @input="onInput($event)"
          @blur="onBlur($event)"
          @click="onClick($event)"
      >
        <slot name="default">
          {{ defaultSlot }}
        </slot>
        <template v-if="selectOptions.length && !isVueComponent">
          <option :value="null" selected disabled>Выберите</option>
          <option
              :value="option.value"
              v-for="(option, k) in selectOptions"
              :key="k"
          >
            {{ option.label }}
          </option>
        </template>
        <template #errors v-if="isVueComponent">
          <div class="errors" v-if="hasErrors">
            <form-generator-input-error
                v-for="(error, i) in Object.keys(errorsList)"
                :key="i"
                :error-code="error"
            />
          </div>
        </template>
      </component>
      <template v-if="!isVueComponent">
        <div class="errors" v-if="hasErrors">
          <form-generator-input-error
              v-for="(error, i) in Object.keys(errorsList)"
              :key="i"
              :error-code="error"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import formGeneratorEmitter from "@/services/emitter";
import FormGeneratorInputError from "@/components/voltFormInputError/voltFormInputError.vue";

export default {
  name: "voltFormInput",
  components: { FormGeneratorInputError },
  props: {
    components: {
      type: Object,
      default: () => {},
    },
    item: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Object,
      default: () => {},
    },
    errors: {
      type: Object,
    },
  },
  data() {
    return {
      isShowErrors: false,
    };
  },
  methods: {
    onInput(event) {
      this.isShowErrors = true;
      const value = event.target?.value ?? event;
      formGeneratorEmitter.emit("input", {
        model: this.item.model,
        value,
      });
      if (this.item.fieldOptions?.on?.input) {
        this.item.fieldOptions.on.input(value);
      }
    },
    onBlur(model, event = null) {
      this.isShowErrors = true;
      const value = event?.target?.value ?? event;
      formGeneratorEmitter.emit("blur");
      if (this.item.fieldOptions?.on?.blur) {
        this.item.fieldOptions.on.blur(value);
      }
    },
    onSubmit() {
      formGeneratorEmitter.emit("submit");
    },
    onClick(event) {
      if (this.item.fieldOptions?.on?.click) {
        this.item.fieldOptions.on.click(event);
      }
    },
  },
  computed: {
    hasErrors() {
      return Object.values(this.errorsList).some((el) => el === true);
    },
    classList() {
      return this.item.fieldOptions.props.class ?? [];
    },
    componentName() {
      const found = Object.keys(this.components ?? {}).find(
          (e) => e === this.item.component
      );
      if (found) {
        return this.components[found];
      } else return this.item.component;
    },
    inputValue() {
      if (this.item.model) {
        return this.value[this.item.model];
      } else return this.item?.fieldOptions?.props?.value;
    },
    defaultSlot() {
      return this.item.fieldOptions.props.innerHTML ?? "";
    },
    selectOptions() {
      return this.item.fieldOptions.props.options ?? [];
    },
    isVueComponent() {
      const found = Object.keys(this.components ?? {}).find(
          (e) => e === this.item.component
      );
      return !!found;
    },
    errorsList() {
      if (!this.errors[this.item.model]) return {};
      return this.errors[this.item.model];
    },
  },
}
</script>

<style lang="scss" src="./voltFormInput.scss"></style>
