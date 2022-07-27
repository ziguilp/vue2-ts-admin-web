<template>
  <div
    class="el-input array-input el-input__inner"
    :class="`el-input--${size} ${disabled || readonly ? 'is-disabled' : ''}`"
  >
    <template v-if="value.length > 0">
      <span
        class="array-input-val-item"
        v-for="(v, i) in value"
        @click="onDelete(i)"
        :key="`custom-input-array-${v}`"
        >{{ v }} <i class="el-icon-close delete-icon"></i
      ></span>
    </template>
    <template v-else>
      <span class="array-input-val-item" style="width: 0; padding: 0"></span>
    </template>
    <input
      v-if="!readonly && !disabled"
      type="text"
      class="array-input-input"
      v-model="input"
      @keyup="onKeyup"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({
  name: "InputArray",
})
export default class extends Vue {
  @Prop({
    type: Boolean,
    default: false,
  })
  private disabled!: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  private readonly!: boolean;

  @Prop({
    type: String,
    default: "small",
  })
  private size!: string;

  @Prop({
    type: Array,
    default: () => [],
  })
  private value!: string[];

  private input: string = "";

  private onKeyup(e: any) {
    if (this.disabled || this.readonly) return;
    if (e.keyCode === 13 && this.input != "") {
      this.$emit("input", [...this.value, this.input]);
      this.input = "";
    }
  }

  private onDelete(index: number) {
    if (this.disabled || this.readonly) return;
    let vals = [...this.value];
    vals.splice(index, 1);
    this.$emit("input", vals);
  }
}
</script>

<style lang="scss" scoped>
.array-input {
  display: inline-flex;
  flex-wrap: wrap;
  padding: 5px 5px;
  height: auto;

  &-val-item {
    display: inline-flex;
    min-height: 20px;
    line-height: 1.8;
    align-items: center;
    padding: 2px 6px;
    border-radius: 4px;
    background: #e5e5e5a3;
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    .delete-icon{
        background: #C0C4CC;
        color: #5d5d5dcc;
        border-radius: 50%;
        font-size: 8px;
        padding: 2px;
        transform: scale(0.8);
    }

    &:hover {
      .delete-icon {
        color: #FFF;
        background: #5d5d5dcc;
      }
    }
  }

  &-input {
    flex: 1;
    border-top: 0;
    border-right: 0;
    border-left: 0;
    border-color: #dcdfe6;
    height: 26px;
    padding: 4px 6px;
  }
}
.is-disabled {
  background-color: #f5f7fa;
  border-color: #dfe4ed;
  cursor: not-allowed;
  .array-input-val-item {
    cursor: default;
  }
  .delete-icon {
    display: none;
  }
}
</style>