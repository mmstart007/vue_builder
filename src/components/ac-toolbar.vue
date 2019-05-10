<script>
import draggable from 'vuedraggable'
import dragValidate from '../mixins/drag-validate'

/**
 * ac Toolbar component
 * @requires VueBootstrap
 * @requires vuedraggable
 * @requires dragValidate - mixin with drop validation
*/

export default {
  name: 'ac-toolbar',

  props: {
    /**
     * @param {array} data - Array of objects. Each object will be rendered as item in toolbar
     */
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  mixins: [dragValidate],

  components: {
    draggable,
  },

  data() {
    return {
      base: [],
      components: [],
      is_shadow_hidden: false,
      h: null,
      /**
       * List of gdid inputs
       */
      grid_inputs: [
        {
          placeholder: 'Custom input',
          value: '',
          is_valid: false,
          data: {
            type: 'grid',
            name: 'Row',
            children: null,
            item: {
              tag: 'b-row',
              props: {},
            },
          },
        },

        {
          placeholder: 'Custom input',
          value: '4 4 4',
          is_valid: false,
          data: {
            type: 'grid',
            name: 'Row',
            children: false,
            item: {
              tag: 'b-row',
              props: {},
            },
          },
        },

        {
          placeholder: 'Custom input',
          value: '6 6',
          is_valid: false,
          data: {
            type: 'grid',
            name: 'Row',
            children: false,
            item: {
              tag: 'b-row',
              props: {},
            },
          },
        },
      ],
    }
  },

  created() {
    /**
     * Divide toolbar data into base and custom components
     */
    this.base = this.data.filter((item => item.item.type === 'element'))
    this.components = this.data.filter((item => item.item.type === 'component'))
    this.h = this.$createElement
  },

  mounted() {
    /**
     * Prepare and validate grid inputs
     */
    this.grid_inputs = this.grid_inputs.map((el) => {
      if (el.value) {
        const arr = el.value.split(' ')
        const num = arr.reduce((acc, value) => acc + parseInt(value, 10), 0)

        if (num && num === 12) {
          el.is_valid = true
          el.data.children = this.prepare_grid_data(arr)
        }
      }

      return el
    })
  },

  render(h) {
    const accordion_items = [
      {
        label: 'Grid',
        key: 'grid',
      },
      {
        label: 'Base components',
        key: 'base',
      },
      {
        label: 'Custom Components',
        key: 'components',
      },
    ]
    const menu = accordion_items.map(el => h('div', {
      class: {
        'mb-2': true,
      },
    },
    [
      h('b-button', {
        props: {
          block: true,
        },
        on: {
          click: () => { this.$refs[`accordion_${el.key}`].toggle() },
        },
      },
      el.label),
      h('b-collapse', {
        attrs: {
          id: `accordion_${el.key}`,
        },
        ref: `accordion_${el.key}`,
      },
      [
        this[`render_${el.key}_items`](),
      ]),
    ]))

    return h('div', {
      class: {
        'ac-toolbar': true,
        'shadow-hidden': this.is_shadow_hidden,
        'h-100': true,
      },
    }, [...menu])
  },

  methods: {
    /**
     * @function render_grid_items - renders grid inputs
     * @private
     */
    render_grid_items() {
      const menu_items = this.grid_inputs.map(el => this.h('div', {
        class: {
          'my-2': true,
          'd-flex': true,
          'align-items-center': true,
          'justify-content-between': true,
        },
      },
      [
        this.h('b-input', {
          class: {
            'ac-menu-input': true,
          },
          props: {
            value: el.value,
            type: 'text',
          },
          on: {
            // validate toolbar grid input
            input: (val) => {
              el.value = val
              const arr = val.split(' ')
              const num = arr.reduce((acc, value) => acc + parseInt(value, 10), 0)

              if (num && num === 12) {
                el.is_valid = true
                el.data.children = this.prepare_grid_data(arr)
                return
              }

              el.data.children = null
              el.is_valid = false
            },
          },
        }),
        el.is_valid ? this.h('b-button', {
          class: { handle_item: true },
          props: {
            variant: 'secondary',
            size: 'sm',
          },
        }, 'Drag') : null,
      ]))

      return this.h('draggable', {
        props: {
          list: this.grid_inputs,
          options: {
            sort: false,
            handle: '.handle_item',
            group: {
              name: 'ac-drag',
              pull: 'clone',
              put: false,
            },
          },
          clone: (e) => {
            let my_e = {}

            if (e.data) {
              my_e = {
                ...e.data,
                id: new Date().getTime(),
              }
            } else {
              my_e = {
                ...e,
                id: new Date().getTime(),
              }
            }

            // remove reactivity recursively
            return JSON.parse(JSON.stringify(my_e))
          },
        },
      },
      [...menu_items])
    },

    /**
     * @function render_base_items - Renders base inputs
     * @private
     */
    render_base_items() {
      const menu_items = this.base.map(el => this.h('div', {
        class: {
          'my-2': true,
          'd-flex': true,
          'align-items-center': true,
          'justify-content-between': true,
        },
        attrs: { title: el.help },
      },
      [
        this.h('div', {}, [
          this.h('i', {
            class: { [el.icon]: true, 'mr-1': true },
          }),
          el.name,
        ]),
        this.h('b-button', {
          class: { handle_item: true },
          props: {
            variant: 'secondary',
            size: 'sm',
          },
        }, 'Drag'),
      ]))

      return this.h('draggable', {
        props: {
          list: this.base,
          options: {
            sort: false,
            handle: '.handle_item',
            group: {
              name: 'ac-drag',
              pull: 'clone',
              put: false,
            },
          },
          clone: (e) => {
            e = {
              ...e,
              children: e.children || [],
              id: new Date().getTime(),
            }

            return JSON.parse(JSON.stringify(e))
          },
          move: this.on_item_move,
        },
      },
      [...menu_items])
    },

    /**
     * @function render_components_items - Renders custom compontns
     * @private
     */
    render_components_items() {
      const menu_items = this.components.map(el => this.h('div', {
        class: {
          'my-2': true,
          'd-flex': true,
          'align-items-center': true,
          'justify-content-between': true,
        },
        attrs: { title: el.help },
      },
      [
        this.h('div', {}, [
          this.h('i', { class: { [el.icon]: true, 'mr-1': true } }),
          el.name,
        ]),
        this.h('b-button', {
          class: { handle_item: true },
          props: {
            variant: 'secondary',
            size: 'sm',
          },
        }, 'Drag'),
      ]))

      return this.h('draggable', {
        props: {
          list: this.components,
          options: {
            sort: false,
            handle: '.handle_item',
            group: {
              name: 'ac-drag',
              pull: 'clone',
              put: false,
            },
          },
          clone: (e) => {
            e = {
              ...e,
              children: e.children || [],
              id: new Date().getTime(),
            }

            return JSON.parse(JSON.stringify(e))
          },
          move: this.on_item_move,
        },
      },
      [...menu_items])
    },

    /**
     * @function prepare_grid_data - Formats grid components for workspace
     * @param {array} arr - array of grid inputs
     * @returns {array} - formatted data
     * @private
     */
    prepare_grid_data(arr) {
      return arr.map(el => ({
        name: 'Column',
        children: [],
        item: {
          type: 'grid',
          tag: 'b-col',
          no_wrapper: true,
          droppable: true,
          'props-config': {
            cols: 'String',
          },
          props: {
            cols: el,
          },
        },
      }))
    },
  },
}
</script>

<style scoped>
  .ac-toolbar .handle_item {
    cursor: pointer;
  }

  .ac-toolbar  .ac-menu-input {
    width: 65%;
  }

  .ac-toolbar.shadow-hidden .sortable-ghost {
    display: none!important;
  }
</style>
