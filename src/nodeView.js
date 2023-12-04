import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

// const nodeToJSON = (node) => {
//   const obj = {
//     type: node.type.name,
//     attrs: { ...node.attrs },
//   };
//   if (node.content.size) {
//     obj.content = node.content.toJSON();
//   }
//   return obj;
// }
export const FootnoteView = function ({ node, editor: outerEditor, getPos }) {
  const dom = document.createElement("footnote");

  let innerView = null;
  let editor = null;

  const open = function () {
    const tooltip = dom.appendChild(document.createElement("div"));
    tooltip.className = "footnote-tooltip";

    editor = new Editor({
      element: tooltip,
      extensions: [StarterKit],
      onUpdate: function ({ editor }) {
        // dispatch a transaction to update node from outer editor, with content of inner editor

        if (editor) {
          let { a: endA, b: endB } = node.content.findDiffEnd(
            editor.doc.content
          );
          console.log("endA", endA, "endB", endB);
          console.log("node pos", getPos());
        }
        const endPos = getPos() + node.nodeSize;
        outerEditor.view.dispatch(
          outerEditor.view.state.tr.replaceRangeWith(
            getPos(),
            endPos,
            outerEditor.schema.nodeFromJSON({
              type: node.type.name,
              attrs: { ...node.attrs },
              content: editor.getJSON().content,
            })
          )
        );

        // outerEditor.view.dispatch(
        //   outerEditor.view.state.tr.setNodeContent(
        //     getPos(),
        //     editor.getJSON().content,
        //     node.attrs
        //   )
        // );
        // outerEditor
        //   .chain()
        //   .setNodeSelection(getPos())
        //   .command(({ tr }) => {
        //     const newNode = outerEditor.schema.nodeFromJSON({
        //       type: node.type.name,
        //       attrs: { ...node.attrs },
        //       content: editor.getJSON().content,
        //     });
        //     tr.replaceSelectionWith(newNode);
        //     return true;
        //   })
        //   .run();
      },
      onBlur: function () {
        console.log("onBlur");
        close();
        return false;
      },
      onFocus: function () {
        console.log("onFocus");
        return false;
      },
      onCreate: function ({ editor }) {
        editor.commands.setContent(node.content.toJSON());
      },
    });
    innerView = editor.view;
  };
  const close = function () {
    innerView.destroy();
    innerView = null;
    dom.textContent = "";
  };
  return {
    selectNode: function () {
      console.log("selectNode");
      dom.classList.add("ProseMirror-selectednode");
      if (!innerView) {
        open();
      }
    },
    deselectNode: function () {
      console.log("try deselectNode", innerView);
      if (!innerView || (innerView && !innerView.hasFocus())) {
        console.log("deselectNode");
        close();
      }
    },
    destroy: function () {
      if (innerView) {
        close();
      }
    },
    stopEvent: function (event) {
      return Boolean(innerView && innerView.dom.contains(event.target));
    },
    ignoreMutation: function () {
      return true;
    },
    dom,
    domContent: innerView ? innerView.dom : undefined,
  };
};
