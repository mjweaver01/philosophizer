import { useEffect, useState } from 'react';
import { Select } from './ui/Select';
import type { ModelsResponse } from '../../utils/providers';

interface ModelSelectorProps {
  selectedModel: string | null;
  onSelectModel: (modelId: string | null) => void;
  disabled?: boolean;
  openUpward?: boolean;
}

export function ModelSelector({
  selectedModel,
  onSelectModel,
  disabled = false,
  openUpward = false,
}: ModelSelectorProps) {
  const [modelsData, setModelsData] = useState<ModelsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/models?available=true');
        if (response.ok) {
          const data = await response.json();
          setModelsData(data);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Format models with cost info in the name
  const formattedModels =
    modelsData?.models.map(model => ({
      id: model.id,
      name: model.costPerToken
        ? `${model.name} ($${model.costPerToken.prompt}/$${model.costPerToken.completion} per 1M)`
        : model.name,
    })) || [];

  return (
    <div>
      <label className="block text-sm font-medium text-text mb-2">
        AI Model
      </label>
      <p className="text-xs text-text-muted mb-3">
        Choose the AI model to use for responses. "Default Model" uses your
        configured LLM (LMStudio/Ollama).
      </p>
      <Select
        options={formattedModels}
        selected={selectedModel}
        onChange={onSelectModel}
        emptyText="Default Model"
        emptyValue={null}
        openUpward={openUpward}
        disabled={disabled || loading}
      />
    </div>
  );
}
