import { useState } from 'react';

interface StyleTagFilterProps {
  styles: string[];
  selectedStyles: string[];
  onToggleStyle: (style: string) => void;
  onClearStyles: () => void;
}

export function StyleTagFilter({
  styles,
  selectedStyles,
  onToggleStyle,
  onClearStyles,
}: StyleTagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredStyles = styles.filter((style) =>
    style.toLowerCase().includes(search.toLowerCase())
  );

  const hasSelectedStyles = selectedStyles.length > 0;

  return (
    <div className="relative">
      {/* Selected tags and dropdown trigger */}
      <div
        className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm cursor-pointer flex flex-wrap gap-2 items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasSelectedStyles ? (
          <>
            {selectedStyles.map((style) => (
              <span
                key={style}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {style}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStyle(style);
                  }}
                  className="hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearStyles();
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs"
            >
              Clear all
            </button>
          </>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">All Styles</span>
        )}
        <svg
          className={`w-4 h-4 ml-auto text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown panel */}
          <div className="absolute z-20 mt-1 w-72 max-h-80 overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg">
            {/* Search input */}
            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="Search styles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Style list */}
            <div className="max-h-60 overflow-y-auto p-2">
              {filteredStyles.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                  No styles found
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredStyles.map((style) => {
                    const isSelected = selectedStyles.includes(style);
                    return (
                      <button
                        key={style}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStyle(style);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          isSelected
                            ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          {style}
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-amber-600 dark:text-amber-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
