import {
  Mark,
} from "@tiptap/core";

const SmallCaps = Mark.create({
  name: "smallcaps",

  addOptions() {
    return {
      HTMLAttributes: {
        class: {
          default: "smallcaps",
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (node) => node.classList.contains("smallcaps") && null,
      },
    ];
  },

  renderHTML() {
    return [
      "span",
      this.options.HTMLAttributes,
      0,
    ];
  },

  addCommands() {
    return {
      setSmallcaps:
        () =>
          ({ commands }) => {
            return commands.setMark(this.name);
          },
      toggleSmallcaps:
        () =>
          ({ commands }) => {
            return commands.toggleMark(this.name);
          },
      unsetSmallcaps:
        () =>
          ({ commands }) => {
            return commands.unsetMark(this.name);
          },
    };
  },
});
export default SmallCaps;
