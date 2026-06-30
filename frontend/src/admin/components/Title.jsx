import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-4">
      <h1 className="text-2xl sm:text-3xl font-polysans tracking-tight text-text/70">
        {text1}{' '}
        <span className="font-semibold text-text">
          {text2}
        </span>
      </h1>
    </div>
  );
};

export default Title;