import { redo, undo } from '@tiptap/pm/history'
import { keymap } from '@tiptap/pm/keymap'
import { EditorState } from '@tiptap/pm/state'
import { StepMap } from '@tiptap/pm/transform'
import { EditorView } from '@tiptap/pm/view'

export const FootnoteView = function ({ node, view, getPos }) {
  const dom = document.createElement('span')
  dom.classList.add('footnote');

  let innerView
  const open = function () {
    const tooltip = dom.appendChild(document.createElement('div'))
    tooltip.className = 'footnote-tooltip'
    innerView = new EditorView(tooltip, {
      state: EditorState.create({
        doc: node,
        plugins: [
          keymap({
            // eslint-disable-next-line @typescript-eslint/unbound-method
            'Mod-z': function () {
              return undo(view.state, view.dispatch)
            },
            // eslint-disable-next-line @typescript-eslint/unbound-method
            'Mod-y': function () {
              return redo(view.state, view.dispatch)
            }
          })
        ]
      }),
      dispatchTransaction: function (tr) {
        const _a = this.state.applyTransaction(tr),
          state = _a.state,
          transactions = _a.transactions
        this.updateState(state)
        if (!tr.getMeta('fromOutside')) {
          const outerTr_1 = view.state.tr
          const offsetMap_1 = StepMap.offset(getPos() + 1)
          transactions.forEach(function (transaction) {
            transaction.steps.forEach(function (step) {
              const newStep = step.map(offsetMap_1)
              if (newStep) {
                outerTr_1.step(newStep)
              }
            })
          })
          if (outerTr_1.docChanged) {
            view.dispatch(outerTr_1)
          }
        }
      },
      handleDOMEvents: {
        mousedown: function (view) {
          if (innerView && view.hasFocus()) {
            innerView.focus()
          }

          return false
        },
        blur: function () {
          close()
          return false
        }
      }
    })
    innerView.focus()
  }
  const close = function () {
    if (innerView) {
      innerView.destroy()
      innerView = null
    }
    dom.textContent = ''
  }
  return {
    maybeEscape(unit, dir) {
      let { state } = this.cm,
        { main } = state.selection
      if (!main.empty) return false
      if (unit == 'line') main = state.doc.lineAt(main.head)
      if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false
      let targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize)
      let selection = Selection.near(this.view.state.doc.resolve(targetPos), dir)
      let tr = this.view.state.tr.setSelection(selection).scrollIntoView()
      this.view.dispatch(tr)
      this.view.focus()
    },
    selectNode: function () {
      dom.classList.add('ProseMirror-selectednode')
      if (!innerView) {
        open()
      }
    },
    deselectNode: function () {
      if (innerView && !innerView.hasFocus()) {
        dom.classList.remove('ProseMirror-selectednode')
        close()
      }
    },
    update: function (newNode) {
      if (!newNode.sameMarkup(node)) {
        return false
      }
      node = newNode
      if (innerView) {
        const state = innerView.state
        const start = node.content.findDiffStart(state.doc.content)
        if (start != null) {
          // @ts-ignore
          let _a = node.content.findDiffEnd(state.doc.content),
            endA = _a.a,
            endB = _a.b
          const overlap = start - Math.min(endA, endB)
          if (overlap > 0) {
            endA += overlap
            endB += overlap
          }
          innerView.dispatch(
            state.tr.replace(start, endB, node.slice(start, endA)).setMeta('fromOutside', true)
          )
        }
      }
      return true
    },
    destroy: function () {
      if (innerView) {
        close()
      }
    },
    stopEvent: function (event) {
      return Boolean(innerView && innerView.dom.contains(event.target))
    },
    ignoreMutation: function () {
      return true
    },
    dom
  }
}
