import { Node, mergeAttributes } from "@tiptap/core";
import { FootnoteView } from "./nodeView";

const footnoteNode = Node.create({
  name: "footnote",
  group: "inline",
  content: "inline*",
  inline: true,
  atom: true,
  addAttributes() {
    return {
      content: {
        default: "",
      },
      href: {
        default: "#nowhere",
      },
    };
  },
  renderHTML: function ({ node, HTMLAttributes }) {
    let nodeContent = "";
    if (node.content.content.length > 0) {
      nodeContent = node.content.content[0].text;
    }
    return [
      "a",
      mergeAttributes(HTMLAttributes, {
        class: "footnote",
        content: nodeContent,
      }),
      "",
    ];
  },
  parseHTML: [
    {
      tag: "a",
      getAttrs: function (dom) {
        // check if element has class "footnote"
        if (dom.getAttribute("content"))
          dom.innerText = dom.getAttribute("content");
        return dom.classList.contains("footnote") ? {} : false;
      },
    },
  ],
  addNodeView() {
    return ({ editor, node, getPos }) => {
      return new FootnoteView({ view: editor.view, node, getPos });
    };
  },
});

export default footnoteNode;
