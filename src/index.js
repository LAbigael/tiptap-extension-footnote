import { Node } from '@tiptap/core'
import { FootnoteView } from './nodeView'

const footnoteNode = Node.create({
  name: 'footnote',
  group: 'inline',
  content: 'inline*',
  inline: true,
  atom: true,
  renderHTML: function () {
    return ['footnote', 0]
  },
  parseHTML: [{ tag: 'footnote' }],
  addNodeView() {
    return ({ editor, node, getPos }) => {
      return new FootnoteView({ view: editor.view, node, getPos })
    }
  }
})

export default footnoteNode
