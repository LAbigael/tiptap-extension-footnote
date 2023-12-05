import { Node, mergeAttributes } from "@tiptap/core";
import { FootnoteView } from "./nodeView";
import SmallCaps from "./extension-smallcaps";
import { uid } from "uid";

const footnoteNode = Node.create({
  name: "footnote",
  group: "inline",
  content: "inline*",
  inline: true,
  atom: true,
  addAttributes() {
    return {
      uid: {
        default: uid(),
      },
    };
  },
  renderHTML: ({ node, HTMLAttributes }) => [
    "footnote",
    mergeAttributes(HTMLAttributes, {
      uid: node.attrs.uid,
    }),
    0,
  ],
  parseHTML: [
    {
      tag: "footnote",
      getAttrs: (dom) => {
        dom.getAttribute("uid");
      },
    },
  ],
  addNodeView() {
    return ({ editor, node, getPos }) => {
      return new FootnoteView({ editor, node, getPos });
    };
  },
});

export default footnoteNode;

export { SmallCaps };
