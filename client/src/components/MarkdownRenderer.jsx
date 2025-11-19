import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        components={{
          // Custom styling for markdown elements
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-gray-900 mt-5 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-base font-bold text-gray-900 mt-3 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="text-gray-800 mb-4 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="text-gray-800" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-gray-800" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;