# TiptapExtensionFootnote

A tiptap extension to add footnotes to you editor.
This is based on the example provided by Prosemirror on their website. See more : https://prosemirror.net/examples/footnote/

## Installation

```bash
npm install tiptap-extension-footnote
```
## Usage

```
<template>
  <button @click="editor.chain().focus().insertContent({ type: 'footnote' }).run()">
    insert footnote
  </button>

  <editor-content class="content" :editor="editor" />
</template>

<script lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Footnote from 'tiptap-extension-footnote'

export default {
  components: {
    EditorContent
  },

  setup() {
    const editor = useEditor({
      content: '<p>I’m running <footnote></footnote>Tiptap with Vue.js. 🎉</p>',
      extensions: [StarterKit, Footnote]
    })

    return { editor }
  }
}
</script>

<style>
.ProseMirror {
  font-size: large;
  counter-reset: footnote;
}

footnote {
  display: inline-block;
  position: relative;
  cursor: pointer;
}

footnote::after {
  content: counter(footnote);
  vertical-align: super;
  font-size: 75%;
  counter-increment: footnote;
}
.ProseMirror-hideselection .footnote-tooltip *::selection {
  background-color: transparent;
}
.ProseMirror-hideselection .footnote-tooltip *::-moz-selection {
  background-color: transparent;
}
.footnote-tooltip {
  color: #333;
  cursor: auto;
  position: absolute;
  left: -30px;
  top: calc(100% + 10px);
  background: silver;
  padding: 3px;
  border-radius: 2px;
  width: 500px;
}
.footnote-tooltip::before {
  border: 5px solid silver;
  border-top-width: 0px;
  border-left-color: transparent;
  border-right-color: transparent;
  position: absolute;
  top: -5px;
  left: 27px;
  content: ' ';
  height: 0;
  width: 0;
}
</style>
```
