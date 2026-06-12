'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string | undefined) => void;
  language: string;
}

export default function CodeEditor({ code, onChange, language }: CodeEditorProps) {
  // Map our language keys to Monaco supported keys
  const getMonacoLanguage = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'cpp':
        return 'cpp';
      case 'java':
        return 'java';
      case 'python':
        return 'python';
      case 'javascript':
      case 'js':
        return 'javascript';
      default:
        return 'javascript';
    }
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          tabSize: 4,
          lineHeight: 22,
          fontFamily: "'Geist Mono', Consolas, monospace",
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
      />
    </div>
  );
}
