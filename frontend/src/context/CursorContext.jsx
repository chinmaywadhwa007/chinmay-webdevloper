import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

/**
 * Cursor Context & State Manager
 * Provides centralized cursor types ('default', 'text', 'project', 'video', 'drag', 'link', 'cta', etc.)
 * with smooth label and size transitions.
 */
const CursorContext = createContext({
  cursorType: 'default',
  cursorText: '',
  setCursor: () => {},
  resetCursor: () => {},
});

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default');
  const [cursorText, setCursorText] = useState('');
  const timeoutRef = useRef(null);

  const setCursor = useCallback((type = 'default', text = '') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCursorType(type);
    setCursorText(text);
  }, []);

  const resetCursor = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCursorType('default');
      setCursorText('');
    }, 40);
  }, []);

  return (
    <CursorContext.Provider value={{ cursorType, cursorText, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within CursorProvider');
  }
  return context;
};

export default CursorContext;
