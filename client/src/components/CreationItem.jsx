import React, { useState } from 'react';
import Markdown from 'react-markdown';

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-[#1c1c2e] text-white border border-gray-700 rounded-lg cursor-pointer transition hover:bg-[#2a2a3a]"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-medium text-white">{item.prompt}</h2>
          <p className="text-gray-400">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <button className="bg-[#2e2e40] border border-purple-600 text-purple-400 px-4 py-1 rounded-full text-xs">
          {item.type}
        </button>
      </div>

      {expanded && (
        <div className="mt-3">
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt="creation"
              className="mt-3 w-full max-w-md rounded-md"
            />
          ) : (
            <div className="mt-3 max-h-[300px] overflow-y-auto text-sm text-gray-200">
              <div className="reset-tw prose prose-invert prose-sm max-w-none">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
