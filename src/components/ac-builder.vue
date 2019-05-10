<template>
  <b-row>
    <b-col cols="2">
      <ac-toolbar :data="toolbar_data" />
    </b-col>

    <b-col cols="8">
      <div>
        <ac-ui
          ref="ac_builder_ui"
          group_name="ac-drag"
          @edit="itemToEdit = $event"
          @input="itemToEdit = $event"
          @change="onDragChange"
          :page-json="pageJson"
        />
      </div>
    </b-col>

    <b-col cols="2">
      <ac-property-editor
        :item="itemToEdit"
        @save="$refs.ac_builder_ui.change_current_item_props($event)"
      />
    </b-col>
  </b-row>
</template>

<script>
import acToolbar from './ac-toolbar.vue'
import acPropertyEditor from './ac-property-editor.vue'
import acUi from './ac-ui.vue'

export default {
  name: 'ac-builder',

  components: {
    acToolbar,
    acUi,
    acPropertyEditor,
  },

  data() {
    return {
      itemToEdit: {},
      toolbar_data: [
        {
          name: 'Card',
          icon: '',
          category: 'Component',
          help: 'Card component',
          item: {
            tag: 'b-card',
            type: 'component',
            droppable: true,
            'draggable-class': [
              'col-',
              'card-body',
            ],
            'props-config': {
              'img-top': 'Boolean',
              'img-bottom': 'Boolean',
              'img-src': 'String',
              style: 'String',
            },
            props: {
              'img-top': true,
              'img-bottom': false,
              'img-src': '',
              style: '',
            },
          },
        },
        {
          name: 'H1',
          category: 'Element',
          icon: 'fas fa-text-height',
          help: 'Header',
          item: {
            type: 'element',
            editable: true,
            tag: 'h1',
            'draggable-class': [
              'col-',
              'card-body',
            ],
            'props-config': {
              innerHTML: 'String',
              style: 'String',
            },
            props: {
              innerHTML: 'Text',
              style: '',
            },
          },
        },
        {
          name: 'P',
          category: 'Element',
          icon: 'fas fa-font',
          help: 'Text',
          item: {
            type: 'element',
            tag: 'p',
            editable: true, // Enable contenteditable on element
            'draggable-class': [
              'col-',
              'card-body',
            ],
            'props-config': {
              innerHTML: 'String',
              style: 'String',
            },
            props: {
              innerHTML: 'Text',
              style: '',
            },
          },
        },
      ],
    }
  },

  props: {
    pageJson: Array,
  },

  methods: {
    onDragChange(e) {
      console.log('ui-change', e);
      this.$emit("input", e);
    },
  },
}
</script>
