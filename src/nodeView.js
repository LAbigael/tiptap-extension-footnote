import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { StepMap } from "@tiptap/pm/transform";
import SmallCaps from "./extension-smallcaps";

export const FootnoteView = function({ node, editor: outerEditor, getPos }) {
  const dom = document.createElement("footnote");

  let innerView = null;
  let editor = null;

  const open = function() {
    const tooltip = dom.appendChild(document.createElement("div"));
    tooltip.className = "footnote-tooltip";
    tooltip.appendChild(document.createElement("button"));
    tooltip.lastChild.textContent = "italic";
    tooltip.lastChild.addEventListener("click", () => {
      editor.chain().focus().toggleItalic().run();
    });
    tooltip.appendChild(document.createElement("button"));
    tooltip.lastChild.textContent = "smallcaps";
    tooltip.lastChild.addEventListener("click", () => {
      editor.chain().focus().toggleSmallcaps().run();
    });

    editor = new Editor({
      element: tooltip,
      extensions: [
        StarterKit.configure({
          gapcursor: false,
          dropcursor: false,
        }),
        SmallCaps,
      ],
      onCreate: function({ editor }) {
        editor.commands.setContent(node.content.toJSON());
      },
    });

    innerView = editor.view;
  };
  const setContent = (editor) => {
    outerEditor
      .chain()
      .setNodeSelection(getPos())
      .command(({ tr }) => {
        const newNode = outerEditor.schema.nodeFromJSON({
          type: node.type.name,
          attrs: { ...node.attrs },
          content: editor.getJSON().content[0].content,
        });
        tr.replaceSelectionWith(newNode);
        return true;
      })
      .run();
  };

  const close = function() {
    if (!innerView) {
      return;
    }
    innerView.destroy();
    innerView = null;
    editor.destroy();
    dom.textContent = "";
  };
  return {
    selectNode: function() {
      dom.classList.add("ProseMirror-selectednode");
      if (!innerView) {
        open();
      }
    },
    deselectNode: function() {
      if (!innerView || (innerView && !innerView.hasFocus())) {
        dom.classList.remove("ProseMirror-selectednode");
        setContent(editor);
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
