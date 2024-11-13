import React, { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import clsx from "clsx";
import Tools from "./Tools";
import '../../index.css';

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      HTMLAttributes: {
        class: "tiptap-ul",
      },
    },
    orderedList: {
      keepMarks: true,
      HTMLAttributes: {
        class: "tiptap-ol",
      },
    },
  }),
];

const RichEditor = ({
  editable = true,
  value = "",
  placeholder = "Write about book...",
  isInvalid,
  errorMessage,
  className,
  onChange,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const editor = useEditor({
    extensions: [
      ...extensions,
      Placeholder.configure({ placeholder })
    ],
    content: value || "", 
    editable: editable,
    onUpdate({ editor }) {
      if (onChange) onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (isLoaded && editable) return;

    if (editor) {
      editor.setEditable(editable);

      if (value) {
        editor.commands.setContent(value);
      } else {
        editor.commands.clearContent(); 
      }
      setIsLoaded(true);
    }
  }, [editor, value, editable, isLoaded]);

  useEffect(() => {
    return () => {
      setIsLoaded(false);
    };
  }, []);

  return (
    <div className={clsx(isInvalid && "ring-2 ring-red-400 p-2 rounded-medium")}>
      <Tools editor={editor} visible={editable} />
      <EditorContent editor={editor} className={className} />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default RichEditor;
