import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none">
      <ReactMarkdown
        components={{
          // Custom styling for markdown elements
          h1: ({ node, ...props }) => <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4 sm:mt-6 mb-3 sm:mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-3 sm:mt-5 mb-2 sm:mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-3 sm:mt-4 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-sm sm:text-base font-bold text-gray-900 mt-2 sm:mt-3 mb-1 sm:mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="text-gray-800 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 sm:mb-4 space-y-1 text-sm sm:text-base" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 sm:mb-4 space-y-1 text-sm sm:text-base" {...props} />,
          li: ({ node, ...props }) => <li className="text-gray-800 text-sm sm:text-base" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-gray-900 text-sm sm:text-base" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-gray-800 text-sm sm:text-base" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;