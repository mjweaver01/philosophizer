import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';

interface TextSourceWithStatus {
  id: string;
  title: string;
  url: string;
  format: string;
  description?: string;
  indexedChunks: number;
  isIndexed: boolean;
}

interface PhilosopherSummary {
  id: string;
  name: string;
  era: string;
  tradition: string;
  description: string;
  notableWorks: string[];
  textSourceCount: number;
  indexedChunks: number;
}

interface PhilosopherDetail extends PhilosopherSummary {
  keyTeachings: string[];
  famousQuotes: string[];
  areasOfExpertise: string[];
  textSources: TextSourceWithStatus[];
}

interface PhilosophersData {
  totalPhilosophers: number;
  totalIndexedChunks: number;
  totalIndexedTexts: number;
  byTradition: Record<string, PhilosopherSummary[]>;
  philosophers: PhilosopherSummary[];
}

function PhilosopherCard({
  philosopher,
  isExpanded,
  onToggle,
}: {
  philosopher: PhilosopherSummary;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [detail, setDetail] = useState<PhilosopherDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isExpanded && !detail) {
      setLoading(true);
      fetch(`/api/philosophers/${philosopher.id}`)
        .then(res => res.json())
        .then(data => {
          setDetail(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isExpanded, detail, philosopher.id]);

  return (
    <div
      className={`bg-surface border rounded-lg transition-all ${
        isExpanded
          ? 'border-primary col-span-full'
          : 'border-border hover:border-border-hover'
      }`}
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full p-5 text-left focus:outline-none"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text text-lg">
                {philosopher.name}
              </h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div className="text-sm text-text-muted">{philosopher.era}</div>
          </div>
          {philosopher.indexedChunks > 0 && (
            <span className="px-2 py-1 bg-success-bg text-success-text text-xs rounded-full border border-success-border">
              Indexed
            </span>
          )}
        </div>

        <div className="text-xs text-primary mb-3">{philosopher.tradition}</div>

        <p className="text-sm text-text-secondary line-clamp-2">
          {philosopher.description}
        </p>

        <div className="flex items-center justify-between text-xs text-text-muted pt-3 mt-3 border-t border-border">
          <span>{philosopher.textSourceCount} primary texts</span>
          {philosopher.indexedChunks > 0 && (
            <span>{philosopher.indexedChunks.toLocaleString()} chunks</span>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-border">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : detail ? (
            <div className="pt-4 space-y-6">
              {/* Text Sources */}
              <div>
                <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  Indexed Texts ({detail.textSources.length})
                </h4>
                <div className="grid gap-2">
                  {detail.textSources.map(source => (
                    <div
                      key={source.id}
                      className={`p-3 rounded-lg border ${
                        source.isIndexed
                          ? 'bg-success-bg/50 border-success-border'
                          : 'bg-surface-secondary border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-text text-sm">
                            {source.title}
                          </div>
                          {source.description && (
                            <div className="text-xs text-text-muted mt-1">
                              {source.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          {source.isIndexed ? (
                            <span className="text-xs text-success-text">
                              {source.indexedChunks.toLocaleString()} chunks
                            </span>
                          ) : (
                            <span className="text-xs text-text-muted">
                              Not indexed
                            </span>
                          )}
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-text-muted hover:text-primary transition-colors"
                            title="View source"
                            onClick={e => e.stopPropagation()}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Teachings */}
              {detail.keyTeachings.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Key Teachings
                  </h4>
                  <ul className="space-y-2">
                    {detail.keyTeachings.slice(0, 5).map((teaching, i) => (
                      <li
                        key={i}
                        className="text-sm text-text-secondary flex items-start gap-2"
                      >
                        <span className="text-primary mt-1">•</span>
                        {teaching}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Famous Quotes */}
              {detail.famousQuotes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" />
                    </svg>
                    Famous Quotes
                  </h4>
                  <div className="space-y-3">
                    {detail.famousQuotes.slice(0, 3).map((quote, i) => (
                      <blockquote
                        key={i}
                        className="text-sm text-text-secondary italic border-l-2 border-primary pl-3"
                      >
                        "{quote}"
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* Areas of Expertise */}
              {detail.areasOfExpertise.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text mb-3">
                    Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {detail.areasOfExpertise.map(area => (
                      <span
                        key={area}
                        className="px-2 py-1 bg-surface-secondary text-text-secondary text-xs rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function AboutPage() {
  const [data, setData] = useState<PhilosophersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTradition, setSelectedTradition] = useState<string | null>(
    null
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/philosophers');
        if (!response.ok) throw new Error('Failed to fetch philosophers');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredPhilosophers = data?.philosophers.filter(p => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notableWorks.some(w =>
        w.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesTradition =
      !selectedTradition || p.tradition === selectedTradition;
    return matchesSearch && matchesTradition;
  });

  const traditions = data ? Object.keys(data.byTradition).sort() : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center justify-center p-2 bg-surface border border-border hover:bg-surface-secondary text-text-muted hover:text-text rounded-lg transition-all"
              title="Back to chat"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </a>
            <h1 className="text-lg font-semibold text-text">
              Philosophers & Theologians
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-error">{error}</div>
        ) : data ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">
                  {data.totalPhilosophers}
                </div>
                <div className="text-sm text-text-muted">
                  Philosophers & Theologians
                </div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">
                  {traditions.length}
                </div>
                <div className="text-sm text-text-muted">Traditions</div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">
                  {data.totalIndexedTexts ||
                    data.philosophers.reduce(
                      (sum, p) => sum + p.textSourceCount,
                      0
                    )}
                </div>
                <div className="text-sm text-text-muted">Primary Texts</div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">
                  {data.totalIndexedChunks.toLocaleString()}
                </div>
                <div className="text-sm text-text-muted">Indexed Chunks</div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search philosophers, works, or descriptions..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={selectedTradition || ''}
                onChange={e => setSelectedTradition(e.target.value || null)}
                className="px-4 py-2 bg-surface-secondary border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Traditions</option>
                {traditions.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <div className="text-sm text-text-muted mb-4">
              Showing {filteredPhilosophers?.length || 0} of{' '}
              {data.totalPhilosophers} philosophers
              {expandedIds.size > 0 && (
                <span className="ml-2">
                  •{' '}
                  <button
                    onClick={() => setExpandedIds(new Set())}
                    className="text-primary hover:underline"
                  >
                    Collapse all
                  </button>
                </span>
              )}
            </div>

            {/* Philosopher Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPhilosophers?.map(philosopher => (
                <PhilosopherCard
                  key={philosopher.id}
                  philosopher={philosopher}
                  isExpanded={expandedIds.has(philosopher.id)}
                  onToggle={() => {
                    setExpandedIds(prev => {
                      const next = new Set(prev);
                      if (next.has(philosopher.id)) {
                        next.delete(philosopher.id);
                      } else {
                        next.add(philosopher.id);
                      }
                      return next;
                    });
                  }}
                />
              ))}
            </div>

            {filteredPhilosophers?.length === 0 && (
              <div className="text-center py-12 text-text-muted">
                No philosophers found matching your search.
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
