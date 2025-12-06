import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

const TextEditor = ({ onChange }) => {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link,
      Image
    ],
    content: "<p>Write your blog content here...</p>",
    onUpdate({ editor }) {
      onChange(editor.getHTML()); 
    }
  });

  if (!editor) return null;

  const addImage = () => {
    const url = prompt("Enter Image URL:");
    if(url) editor.chain().focus().setImage({ src:url }).run();
  };

  return (
    <div className="bg-dark text-white p-3 rounded mb-3">

      {/* Toolbar */}
      <div className="mb-2 d-flex flex-wrap gap-2">

        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>

        <button type="button" onClick={addImage}>
          Image
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Code
        </button>

        <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          Clear
        </button>

      </div>

      {/* Editor */}
      <EditorContent 
        editor={editor} 
        style={{
          minHeight: "280px",
          background: "#111",
          padding: "12px",
          borderRadius: "6px",
          border: "1px solid #333"
        }} 
      />

    </div>
  );
};

export default TextEditor;
