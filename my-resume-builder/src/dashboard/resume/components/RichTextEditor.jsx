import React, { useState, useEffect } from 'react';
import {
  Editor,
  EditorProvider,
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  HtmlButton,
  Separator,
  Toolbar,
} from 'react-simple-wysiwyg';

// Props:
// value: The current content for the editor (from parent state)
// name: The name of the field this editor belongs to (e.g., 'workSummary')
// index: The index of the experience item it belongs to (for multiple experiences)
// onRichTextEditorChange: Callback function to send changes back to the parent
export default function RichTextEditor({ value, name, index, onRichTextEditorChange }) {
  // Use internal state for the editor's value, initialized from the prop
  const [editorValue, setEditorValue] = useState(value || '');

  // Update internal state when the parent's 'value' prop changes (e.g., when AI generates content)
  useEffect(() => {
    setEditorValue(value || '');
  }, [value]);

  // Handle changes within the editor and pass them up to the parent component
  const handleChange = (e) => {
    const newValue = e.target.value;
    setEditorValue(newValue); // Update internal state
    if (onRichTextEditorChange) {
      // Call the parent's callback with the new value, field name, and index
      onRichTextEditorChange(newValue, name, index);
    }
  };

  return (
    <EditorProvider>
      <Editor value={editorValue} onChange={handleChange}>
        <Toolbar>
          <BtnUndo />
          <BtnRedo />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnStrikeThrough />
          <Separator />
          <BtnNumberedList />
          <BtnBulletList />
          <BtnLink />
          <BtnClearFormatting />
          <HtmlButton />
          <Separator />
          <BtnStyles />
        </Toolbar>
      </Editor>
    </EditorProvider>
  );
}