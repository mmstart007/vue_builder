export default {
  methods: {
    on_item_move(e) {
      const drag_classes = e.draggedContext.element.item['draggable-class']
      // if no draggable-class key found inside item, then disable drop
      if (!drag_classes) {
        return false
      }

      const target_classes = Array.from(e.to.parentElement.classList).join('')

      // check target element for items from draggable-class array
      // if match found - allow drop
      for (let index = 0; index < drag_classes.length; index += 1) {
        if (target_classes.indexOf(drag_classes[index]) + 1) {
          return true
        }
      }

      // if no match found - disable drop
      return false
    },
  },
}
