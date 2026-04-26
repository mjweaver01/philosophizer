interface AdminStats {
  rag: {
    totalChunks: number;
    byPhilosopher: Record<string, number>;
    bySource: Record<string, number>;
  };
  database: {
    users: number;
    conversations: number;
    sizes: {
      total_size: string;
      chunks_table_size: string;
      conversations_table_size: string;
      users_table_size: string;
    };
  };
  timestamp: string;
}

interface DatabaseStatsProps {
  stats: AdminStats | null;
  refreshing: boolean;
  loading: boolean;
}

function formatSize(size: string): string {
  if (!size) return size;

  const match = size.match(/^([\d.]+)\s*(kb|mb|gb|tb|bytes?)\s*$/i);
  if (!match || !match[1] || !match[2]) {
    return size
      .replace(/\bkb\b/gi, 'KB')
      .replace(/\bmb\b/gi, 'MB')
      .replace(/\bgb\b/gi, 'GB')
      .replace(/\btb\b/gi, 'TB')
      .replace(/\bbytes?\b/gi, 'Bytes');
  }

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  let bytes = 0;
  switch (unit) {
    case 'tb':
      bytes = value * 1024 * 1024 * 1024 * 1024;
      break;
    case 'gb':
      bytes = value * 1024 * 1024 * 1024;
      break;
    case 'mb':
      bytes = value * 1024 * 1024;
      break;
    case 'kb':
      bytes = value * 1024;
      break;
    case 'byte':
    case 'bytes':
      bytes = value;
      break;
  }

  const formatValue = (val: number) => {
    const formatted = val.toFixed(2);
    return formatted.replace(/\.?0+$/, '');
  };

  if (bytes >= 1024 * 1024 * 1024 * 1024) {
    return formatValue(bytes / (1024 * 1024 * 1024 * 1024)) + ' TB';
  } else if (bytes >= 1024 * 1024 * 1024) {
    return formatValue(bytes / (1024 * 1024 * 1024)) + ' GB';
  } else if (bytes >= 1024 * 1024) {
    return formatValue(bytes / (1024 * 1024)) + ' MB';
  } else if (bytes >= 1024) {
    return formatValue(bytes / 1024) + ' KB';
  } else {
    return bytes.toFixed(0) + ' Bytes';
  }
}

export function DatabaseStats({
  stats,
  refreshing,
  loading,
}: DatabaseStatsProps) {
  if (!stats && !loading) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text mb-4">
          Database Statistics
        </h2>
        <div className="text-text-muted text-sm">
          Failed to load statistics. Try refreshing.
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-text mb-4">
        Database Statistics
      </h2>
      <div
        className={`relative ${refreshing ? 'opacity-60' : ''} transition-opacity`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-text-muted text-sm">Total RAG Chunks</div>
            <div className="text-3xl font-bold text-text mt-1">
              {stats.rag.totalChunks.toLocaleString()}
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-text-muted text-sm">Philosophers</div>
            <div className="text-3xl font-bold text-text mt-1">
              {Object.keys(stats.rag.byPhilosopher).length}
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-text-muted text-sm">Users</div>
            <div className="text-3xl font-bold text-text mt-1">
              {stats.database.users}
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-text-muted text-sm">Conversations</div>
            <div className="text-3xl font-bold text-text mt-1">
              {stats.database.conversations}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-4 bg-surface border border-border rounded-lg p-4 ${refreshing ? 'opacity-60' : ''} transition-opacity`}
      >
        <h3 className="text-md font-semibold text-text mb-3">Database Sizes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-text-muted">Total Database</div>
            <div className="text-text font-medium">
              {formatSize(stats.database.sizes.total_size)}
            </div>
          </div>
          <div>
            <div className="text-text-muted">RAG Chunks Table</div>
            <div className="text-text font-medium">
              {formatSize(stats.database.sizes.chunks_table_size)}
            </div>
          </div>
          <div>
            <div className="text-text-muted">Conversations Table</div>
            <div className="text-text font-medium">
              {formatSize(stats.database.sizes.conversations_table_size)}
            </div>
          </div>
          <div>
            <div className="text-text-muted">Users Table</div>
            <div className="text-text font-medium">
              {formatSize(stats.database.sizes.users_table_size)}
            </div>
          </div>
        </div>
      </div>

      {Object.keys(stats.rag.byPhilosopher).length > 0 && (
        <div
          className={`mt-4 bg-surface border border-border rounded-lg p-4 ${refreshing ? 'opacity-60' : ''} transition-opacity`}
        >
          <h3 className="text-md font-semibold text-text mb-3">
            Chunks by Philosopher
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
            {Object.entries(stats.rag.byPhilosopher)
              .sort(([, a], [, b]) => b - a)
              .map(([name, count]) => (
                <div key={name} className="flex justify-between">
                  <span className="text-text-muted">{name}</span>
                  <span className="text-text font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
