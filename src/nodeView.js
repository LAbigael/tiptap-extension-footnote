import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import FontVariant from "./tiptap-extension-font-variant";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";

const createButton = (parent, textContent, dataTypeButton) => {
  const button = parent.appendChild(document.createElement("button"));
  button.attributes["data-type"] = dataTypeButton;
  button.textContent = textContent;
  return button;
};

export const FootnoteView = function ({ node, editor: outerEditor, getPos }) {
  const dom = document.createElement("footnote");

  let innerView = null;
  let editor = null;

  const open = function () {
    const tooltip = dom.appendChild(document.createElement("div"));
    tooltip.className = "footnote-tooltip";

    const toolbar = tooltip.appendChild(document.createElement("div"));
    toolbar.className = "footnote-toolbar";

    const italicButton = createButton(toolbar, "i", "italic");
    const smallCapsButton = createButton(toolbar, "A", "smallcaps");

    editor = new Editor({
      element: tooltip,
      extensions: [
        StarterKit.configure({
          gapcursor: false,
          dropcursor: false,
        }),
        FontVariant,
        TextStyle,
        TextAlign,
      ],
      onCreate: function ({ editor }) {
        editor.commands.setContent(node.content.toJSON());
      },
      onSelectionUpdate: function ({ editor }) {
        setButtonActive(italicButton, "italic");
        setButtonActive(smallCapsButton, "textStyle", {
          fontVariant: "small-caps",
        });
      },
    });

    const setButtonActive = (button, mark, option) => {
      if (editor.isActive(mark)) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    };

    italicButton.addEventListener("click", () => {
      editor.chain().focus().toggleItalic().run();
      setButtonActive(italicButton, "italic");
    });

    smallCapsButton.addEventListener("click", () => {
      editor.chain().focus().toggleSmallCaps().run();
      setButtonActive(smallCapsButton, "textStyle", {
        fontVariant: "small-caps",
      });
    });

    // tooltip.lastChild.addEventListener("click", () => {
    //   editor.chain().focus().toggleItalic().run();
    // });
    // tooltip.appendChild(document.createElement("button"));
    // tooltip.lastChild.textContent = "smallcaps";
    // tooltip.lastChild.addEventListener("click", () => {
    //   // if (editor.isActive("fontVariant", { fontVariant: "small-caps" })) {
    //   //   editor.chain().focus().unsetFontVariant().run();
    //   // } else {
    //   editor.chain().focus().toggleSmallCaps().run();
    //   // }
    // });

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

  const close = function () {
    if (!innerView) {
      return;
    }
    innerView.destroy();
    innerView = null;
    editor.destroy();
    dom.textContent = "";
  };
  return {
    selectNode: function () {
      dom.classList.add("ProseMirror-selectednode");
      if (!innerView) {
        open();
      }
    },
    deselectNode: function () {
      if (!innerView || (innerView && !innerView.hasFocus())) {
        dom.classList.remove("ProseMirror-selectednode");
        setContent(editor);
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
