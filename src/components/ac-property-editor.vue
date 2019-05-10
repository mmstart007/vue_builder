<script>
/**
 * ac propety editor component
 * @requires VueBootstrap
 */

export default {
  name: 'ac-property-editor',

  props: {
    /**
      * @param {object} item - Item which property will be edited
      */
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      h: null,
      inputs_data: [],
    }
  },

  watch: {
    /**
      * Whenever item changes update form
      */
    item() {
      this.inputs_data = this.create_form_json_from_item()
      console.log('inputs_data', this.inputs_data)
    },
  },

  created() {
    this.h = this.$createElement
    this.inputs_data = this.create_form_json_from_item()
  },

  render(h) {
    if (!this.item.item) {
      return h('div', 'Select item to edit')
    }
    const title = h('h3', { class: { 'mb-2': true, 'text-center': true } }, this.item.name)

    const form = this.inputs_data ? h('ac-form', {
      props: {
        data: this.inputs_data,
        fetch_url: '',
        post_url: '',
        save_submit_route: '',
        loading_image: '',
        validate: false,
        props: {},
      },
      ref: 'ac-props-form',
    },
    [
      this.h('template', {
        slot: 'default',
      }, [
        h('b-button', {
          props: {
            block: true,
          },
          on: {
            click: () => { this.on_save_form(this.$refs['ac-props-form'].get_json()) },
          },
        }, 'Save'),
      ]),
    ]) : null

    return h('div', [title, form])
  },

  methods: {
    /**
     * @function create_form_json_from_item - creates form from properties of current item
     * @private
     */
    create_form_json_from_item() {
      const { item } = this.item
      const data = []
      if (!item) return []

      Object.keys(item.props).forEach((key) => {
        const simple_types = ['Number', 'String']
        const type = item['props-config'][key]

        // simple types handle: String, Number
        if (simple_types.indexOf(type) > -1) {
          data.push({
            tag: this.get_input_tag(item['props-config'][key]),
            value: item.props[key],
            multi: false,
            label: key,
          })
        } else if (type === 'Boolean') {
          data.push({
            tag: this.get_input_tag(item['props-config'][key]),
            checked: item.props[key],
            inner_text: key,
            multi: false,
            label: key,
          })
        } else if (type === 'Array') {
          data.push(this.generate_array_inputs(item, key))
        } else if (type === 'Object') {
          data.push(this.generate_object_inputs(item, key))
        }
      })

      return data
    },

    /**
     * @function generate_array_inputs - creates form from properties of array
     * @param {object} item - item for cteating inputs
     * @param {string} key - key of property
     * @private
     */
    generate_array_inputs(item, key) {
      return {
        multi: true,
        label: key,
        ac_type: 'Array',
        children: item.props[key].map(prop => ({
          tag: 'ac-input',
          value: prop.value,
          label: prop.text || 'no label',
        })),
      }
    },

    /**
     * @function generate_object_inputs - creates form from properties of object
     * @param {object} item - item for cteating inputs
     * @param {string} key - key of property
     * @private
     */
    generate_object_inputs(item, key) {
      const keys = Object.keys(item.props[key])

      const obj = {
        multi: true,
        label: key,
        ac_type: 'Object',
        children: {},
      }

      keys.forEach((option) => {
        const type = typeof item.props[key][option]

        obj.children[option] = {
          tag: this.get_input_tag(type),
          label: option,
          value: item.props[key][option],
        }
      })

      return obj
    },

    /**
     * @function on_save_form - fires on save button click
     * @param {object} form_data - data of form
     * @event save - emits saved item data
     * @private
     */
    on_save_form(form_data) {
      const data = JSON.parse(JSON.stringify(form_data))

      const new_props = data.reduce(
        (acc, value) => {
          if (!value.multi) {
            return {
              ...acc,
              [value.label]: value.value === undefined
                ? value.checked
                : value.value,
            }
          }

          if (value.ac_type === 'Array') {
            const children = value.children.map(child => ({
              text: child.label,
              value: child.value,
            }))

            return { ...acc, [value.label]: children }
          }

          if (value.ac_type === 'Object') {
            const keys = Object.keys(value.children)
            const obj = {}
            keys.forEach((key) => {
              obj[key] = value.children[key].value
            })

            return { ...acc, [value.label]: obj }
          }

          return acc
        }, {},
      )
      this.$emit('save', new_props)
    },

    /**
     * @function get_input_tag - get input tag depending on data type
     * @param {string} type - data type
     * @returns {string} input tag
     * @private
     */
    get_input_tag(type) {
      let tag = ''

      switch (type) {
        case 'Boolean':
          tag = 'ac-checkbox'
          break
        default:
          tag = 'ac-input'
      }

      return tag
    },
  },
}
</script>
