import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

console.log("FootnoteView 1");
export const FootnoteView = function({ node, editor: outerEditor, getPos }) {
  const dom = document.createElement("footnote");

  let innerView = null;
  let editor = null;

  const open = function() {
    const tooltip = dom.appendChild(document.createElement("div"));
    tooltip.className = "footnote-tooltip";

    editor = new Editor({
      element: tooltip,
      extensions: [
        StarterKit.configure({
          gapcursor: false,
          dropcursor: false,
        }),
      ],
      onUpdate: function({ editor }) {
        // update outer editor state with new content
      },
      onBlur: function() {
        console.log("onBlur");
        close();
        return false;
      },
      onFocus: function() {
        console.log("onFocus");
        return false;
      },
      onCreate: function({ editor }) {
        editor.commands.setContent(node.content.toJSON());
      },
    });
    innerView = editor.view;
  };
  const close = function() {
    if (!innerView) {
      return;
    }
    innerView.destroy();
    innerView = null;
    dom.textContent = "";
  };
  return {
    selectNode: function() {
      console.log("selectNode");
      dom.classList.add("ProseMirror-selectednode");
      if (!innerView) {
        open();
      }
    },
    deselectNode: function() {
      console.log("try deselectNode", innerView);
      if (!innerView || (innerView && !innerView.hasFocus())) {
        console.log("deselectNode");
        close();
      }
    },
    destroy: function() {
      if (innerView) {
        close();
      }
    },
    stopEvent: function(event) {
      return Boolean(innerView && innerView.dom.contains(event.target));
    },
    ignoreMutation: function() {
      return true;
    },
    dom,
    domContent: innerView ? innerView.dom : undefined,
  };
};
