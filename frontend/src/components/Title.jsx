import React from 'react';

/**
 * Section title used across pages.
 * Renders: [text1] [text2 in accent colour] with a decorative rule.
 */
const Title = ({ text1, text2 }) => (
  <div className="mb-8">
    <h2 className="text-3xl sm:text-4xl font-light tracking-tight"
        style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: '#2A1506' }}>
      {text1}{' '}
      <span className="font-semibold" style={{ color: '#4F200D' }}>{text2}</span>
    </h2>
    <div className="flex items-center gap-3 mt-3">
      <div className="h-px w-8" style={{ background: '#AF8255' }} />
      <div className="h-px w-4" style={{ background: 'rgba(175,130,85,0.4)' }} />
    </div>
  </div>
);

export default Title;
