<script>
/**
 * ac ui component a.k.a. workspace
 * @requires VueBootstrap
 * @requires vuedraggable
 * @requires dragValidate - mixin with drop validation
*/
import draggable from 'vuedraggable'
import dragValidate from '../mixins/drag-validate'

export default {
  name: 'ac-ui',

  components: {
    draggable,
  },

  mixins: [dragValidate],

  props: {
    /**
     * @param {string} group_name - Group name of draggable group. Must be same as
     * toolbar and property editor group name
     */
    group_name: {
      type: String,
      required: true,
    },

    pageJson: {
      type: Array
    },
  },

  data() {
    return {
      list: [],
      h: null,
      editing_item: null,
    }
  },

  created() {
    this.h = this.$createElement;
    this.list = this.pageJson;
  },

  render(h) {
    const children = this.list.map(item => this.render_children(item, this.list))

    const dragWrap = h('draggable', {
      class: {
        'ac-builder': true,
        border: true,
      },
      props: {
        list: this.list,
        disabled: true,
        options: {
          group: this.group_name,
          animation: 250,
          handle: '.handle_item',
        },
        move: this.on_item_move,
      },
      on: {
        change: this.handleChange,
      },
      ref: 'draggable_builder_wrapper',
    }, [...children])

    return dragWrap
  },

  methods: {
    /**
     * @function render_children - recursively render data elements
     * @private
     */
    render_children(item, parent) {
      let sub_child = null

      if (typeof item.children === 'object' && item.children.length) {
        sub_child = item.children.map(child => this.render_children(child, item.children))
      }

      const item_toolbar = this.render_item_toolbar(item, parent)

      const empty_drag = this.h('draggable', {
        props: {
          list: item.children,
          disabled: true,
          sortable: false,
          options: {
            group: this.group_name,
            animation: 250,
            handle: '.handle_item',
          },
          move: this.on_item_move,
        },
        on: {
          change: this.handleChange,
        },
        class: {
          'h-100': true,
          'w-100': true,
          'draggable-item': true,
        },
      }, [sub_child])

      let element = this.h(
        item.item.tag,
        this.get_children_props(item),
        [item.item.droppable ? empty_drag : sub_child],
      )

      if (!item.item.no_wrapper) {
        element = this.h('div', {
          class: {
            'draggable-item': true,
          },
        }, [
          element,
          item_toolbar,
        ])
      }

      return element
    },

    /**
     * @function render_item_toolbar - Renders toolbar with edit, delete, drag buttons
     * @private
     */
    render_item_toolbar(item, parent) {
      return this.h('div', {
        class: {
          'draggable-toolbar': true,
        },
      },
      [
        this.h('b-button', {
          class: {
            handle_item: true,
            'mr-2': true,
          },
          props: {
            size: 'sm',
          },
        }, 'Drag'),

        this.h('b-button', {
          props: {
            size: 'sm',
            variant: 'primary',
          },
          on: {
            click: () => {
              this.editing_item = item
              this.$emit('edit', item)
            },
          },
        }, 'Edit'),

        this.h('b-button', {
          props: {
            size: 'sm',
            variant: 'danger',
          },
          class: {
            'ml-2': true,
          },
          on: {
            click: () => {
              this.remove_child(item, parent)
              this.editing_item = null
              this.$emit('edit', {})
            },
          },
        }, 'Remove'),
      ])
    },

    /**
     * @function handleChange - calls on user drag.
     */
    handleChange() {
      this.$emit('change', this.list)
    },

    /**
     * @function change_current_item_props - change current selected item property.
     * @param {object} new_props - new properties
     * Must be called on property editor save
     */
    change_current_item_props(new_props) {
      Object.keys(new_props).forEach((key) => {
        this.editing_item.item.props[key] = new_props[key]
      })
    },

    /**
     * @function get_children_props - create props for each child of form.
     */
    get_children_props(item) {
      return {
        attrs: {
          ...item.item.props,
          contenteditable: item.item.editable || false,
        },
        domProps: item.item.type === 'element'
          ? { ...item.item.props }
          : {},
        on: {
          click: (e) => {
            if (!item.item.no_wrapper) {
              e.stopPropagation()
              this.$emit('click', item)
            }
          },
          mouseover: (e) => {
            if (!item.item.no_wrapper) {
              e.stopPropagation()
              this.$emit('hover', item)
            }
          },
          blur: (e) => {
            if (item.item.editable) {
              const new_item = { ...item }
              new_item.item.props.innerHTML = e.target.innerText
              item = new_item
              this.editing_item = item
              this.$emit('input', new_item)
            }
          },
        },
      }
    },

    /**
     * @function get_html - Get current template of ui
     * @returns {string} - current teplate string
     */
    get_html() {
      return this.getTemplateString(this.list)
    },

    getTemplateString(arr) {
      let result = ''

      arr.forEach((el) => {
        const current_el_start = `<${el.item.tag}>`
        const current_el_finish = `</${el.item.tag}>`
        let child = ''

        if (el.children && el.children.length) {
          child = this.getTemplateString(el.children)
        }

        result += current_el_start + child + current_el_finish
      })

      return result
    },

    /**
     * @function get_json - Get current json
     * @returns {array} - current json
     */
    get_json() {
      return JSON.parse(JSON.stringify(this.list))
    },

    /**
     * @function set_json - Set current json
     * @param {array} new_data - data to be used
     */
    set_json(new_data) {
      this.list = JSON.parse(JSON.stringify(new_data))
      this.handleChange()
    },

    /**
     * @function remove_child - Removes child from parent
     * @param {object} item - item to delete
     * @param {array} parent - array which conains item to delete
     */
    remove_child(item, parent) {
      const index = parent.indexOf(item)

      if (index > -1) {
        parent.splice(index, 1)
      }

      this.handleChange()
    },
  },
}
</script>

<style>
  .ac-draggable {
    min-height: 500px;
  }

  .ac-builder {
    padding: 5px 20px;
    min-height: 500px;
  }

  .placeholder {
    min-height: 50px;
    background-color: #eee;
  }

  /* Styles for demo purposes */

  .ac-builder .card-body {
    padding-top: 40px;
  }

  .ac-builder .row {
    background-color: #F5F5F5;
    padding: 25px 14px 0;
    position: relative;
    box-shadow: inset 0 1px 13px rgba(0, 0, 0, 0.1);
    border: 1px solid #DDDDDD;
  }

  .ac-builder .row::before {
    background-color: #F5F5F5;
    border: 1px solid #DDDDDD;
    border-radius: 4px 0 4px 0;
    color: #9DA0A4;
    content: "Row";
    font-size: 12px;
    font-weight: bold;
    left: -1px;
    line-height: 2;
    padding: 3px 7px;
    position: absolute;
    top: -1px;
  }

  .ac-builder div[class^="col-"] {
    min-height: 200px;
    position: relative;
    margin: 15px 0;
    background-color: #FFFFFF;
    border: 1px solid #DDDDDD;
    padding: 39px 19px 24px;
  }

  .ac-builder div[class^="col-"]::after {
    background-color: #F5F5F5;
    border: 1px solid #DDDDDD;
    border-radius: 4px 0 4px 0;
    color: #9DA0A4;
    content: "Column";
    font-size: 12px;
    font-weight: bold;
    left: -1px;
    padding: 3px 7px;
    position: absolute;
    top: -1px;
  }

  .draggable-item {
    position: relative;
    z-index: 1;
    min-height: 50px;
  }

  .draggable-toolbar {
    position: absolute;
    top: 5px;
    right: 0;
    z-index: 9999999;
    opacity: .3;
    transition: opacity .3s ease;
  }

  .draggable-item:hover > .draggable-toolbar {
    opacity: 1;
  }
</style>
