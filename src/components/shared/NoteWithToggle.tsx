
import React, { useState } from "react";
import { ChevronDown, ChevronUp, StickyNote } from "lucide-react";
import { useI18n } from '@/lib/i18n/provider';

export function NoteWithToggle({ note }: { note: string }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const isLong = note.length > 100;

  const noteLabel = t('shared.noteWithToggle.note');
  const expandLabel = t('shared.noteWithToggle.expand');
  const collapseLabel = t('shared.noteWithToggle.collapse');

  return (
    <div className="relative w-full">
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-gray-100">
          <StickyNote size={16} className="sm:w-[18px] sm:h-[18px] text-slate-600 flex-shrink-0" />
          <span className="font-semibold text-slate-800 text-xs sm:text-sm tracking-wide">
            {noteLabel}
          </span>
        </div>

        <div className="relative px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3">
          <div
            className={`text-xs sm:text-sm text-gray-700 leading-relaxed break-words hyphens-auto transition-all duration-300 ${isLong && !expanded
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
            <div className="flex justify-center mt-2 sm:mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-lime-700 
                           bg-lime-100 hover:bg-lime-200 rounded-full border border-lime-300
                           transition-all duration-200 hover:shadow-sm touch-manipulation"
              >
                <span>
                  {expanded ? collapseLabel : expandLabel}
                </span>
                {expanded ? (
                  <ChevronUp size={12} className="sm:w-[14px] sm:h-[14px] group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown size={12} className="sm:w-[14px] sm:h-[14px] group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}