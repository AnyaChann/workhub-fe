import React, { useMemo, useCallback, useState } from 'react';
import { createEditor, Transforms, Editor, Text, Node } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import './RichTextEditor.css';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const RichTextEditor = ({ value, onChange, placeholder, error }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [slateValue, setSlateValue] = useState(
    Array.isArray(value) && value.length ? value : initialValue
  );

  // Character count
  const plainText = slateValue
    ? slateValue.map(n => Node.string(n)).join('\n')
    : '';
  const characterCount = plainText.length;
  const minChars = 300;
  const isUnderMinimum = characterCount < minChars;

  // Toolbar actions
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const handleChange = (newValue) => {
    setSlateValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`rich-text-editor-wrapper${error ? ' error' : ''}`}>
      <Slate
        editor={editor}
        initialValue={Array.isArray(value) && value.length ? value : initialValue}
        onChange={handleChange}
      >
        <Toolbar />
        <div className="editor-content">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            autoFocus={false}
          />
        </div>
      </Slate>
      <div className="editor-footer">
        <span className={`character-count ${isUnderMinimum ? 'warning' : 'success'}`}>
          {/* {characterCount}/ */}
          {minChars} characters
          {isUnderMinimum && (
            <span className="count-message"> (minimum)</span>
          )}
        </span>
      </div>
    </div>
  );
};

// Toolbar Component - Đã bỏ nút Clear
const Toolbar = () => {

  return (
    <div className="editor-toolbar">
      <MarkButton format="bold" icon={<strong>B</strong>} />
      <MarkButton format="italic" icon={<em>I</em>} />
      <MarkButton format="underline" icon={<u>U</u>} />
      <MarkButton format="code" icon={<span style={{ fontFamily: 'monospace' }}>{"</>"}</span>} />
      
      <div className="toolbar-divider"></div>
      
      <BlockButton format="heading-one" icon="H1" />
      <BlockButton format="heading-two" icon="H2" />
      <BlockButton format="block-quote" icon="❝" />
      
      <div className="toolbar-divider"></div>
      
      <BlockButton format="numbered-list" icon="1." />
      <BlockButton format="bulleted-list" icon="•" />
    </div>
  );
};

// Mark (inline style) button
const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      type="button"
      className={`toolbar-btn${isMarkActive(editor, format) ? ' active' : ''}`}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      title={format}
    >
      {icon}
    </button>
  );
};

// Block (block style) button
const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      type="button"
      className={`toolbar-btn${isBlockActive(editor, format) ? ' active' : ''}`}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      title={format}
    >
      {icon}
    </button>
  );
};

// Helpers for Slate
const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  });
  return !!match;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true,
  });

  let newType;
  if (isActive) {
    newType = 'paragraph';
  } else if (isList) {
    newType = format;
  } else {
    newType = format;
  }

  Transforms.setNodes(editor, { type: newType });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// Renderers
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.code) children = <code>{children}</code>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
};

export default RichTextEditor;