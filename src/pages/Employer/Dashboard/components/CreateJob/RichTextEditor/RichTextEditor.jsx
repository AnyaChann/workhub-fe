import React, { useState, useRef } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef(null);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const insertList = (listType) => {
    formatText(listType === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList');
  };

  return (
    <div className={`rich-text-editor ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
      <div className="editor-toolbar">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => formatText('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => formatText('italic')}
          title="Italic"
        >
          <em>I</em>
        </button>
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => formatText('underline')}
          title="Underline"
        >
          <u>U</u>
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => insertList('unordered')}
          title="Bullet List"
        >
          ≡
        </button>
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => insertList('ordered')}
          title="Numbered List"
        >
          #
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => formatText('justifyLeft')}
          title="Align Left"
        >
          ⫷
        </button>
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => formatText('justifyCenter')}
          title="Align Center"
        >
          ≡
        </button>
      </div>
      
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleEditorChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
      
      <div className="editor-footer">
        <span className="character-count">Minimum 300 characters</span>
      </div>
    </div>
  );
};

export default RichTextEditor;