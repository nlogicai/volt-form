<template>
  <div class="volt-form-input-error">{{ errorLabel }}</div>
</template>

<script>
import errorLabels from "../../dictonaries/errorsLabels";

export default {
  name: "voltFormInputError",
  props: {
    errorCode: {
      type: String,
    },
  },
  computed: {
    errorLabel() {
      return errorLabels[this.errorCode];
    },
  },
}
</script>

<style lang="scss" src="./voltFormInputError.scss"></style>
