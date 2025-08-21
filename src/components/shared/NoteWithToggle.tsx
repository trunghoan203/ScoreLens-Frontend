
import React, { useState } from "react";
import { ChevronDown, ChevronUp, StickyNote } from "lucide-react";

export function NoteWithToggle({ note }: { note: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = note.length > 100;

  return (
    <div className="relative w-full">
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-gray-100">
          <StickyNote size={18} className="text-slate-600 flex-shrink-0" />
          <span className="font-semibold text-slate-800 text-sm tracking-wide">
            GHI CHÚ
          </span>
        </div>

        <div className="relative px-4 py-3">
          <div
            className={`text-sm text-gray-700 leading-relaxed break-words hyphens-auto transition-all duration-300 ${
              isLong && !expanded 
                ? "line-clamp-3" 
                : ""
            }`}
            style={{ 
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {note}
            {isLong && !expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent pointer-events-none rounded-b-lg" />
            )}
          </div>

          {isLong && (
            <div className="flex justify-center mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="group flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-lime-700 
                           bg-lime-100 hover:bg-lime-200 rounded-full border border-lime-300
                           transition-all duration-200 hover:shadow-sm"
              >
                <span>
                  {expanded ? "Thu gọn" : "Xem thêm"}
                </span>
                {expanded ? (
                  <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}