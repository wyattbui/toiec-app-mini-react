// app/test/parts-debug/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Select, Card, Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export default function PartsDebugPage() {
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // Mock data
  const MOCK_PARTS = [
    { id: '1', name: 'Part 1: Photo Description', description: 'Mô tả hình ảnh', totalQuestions: 6 },
    { id: '2', name: 'Part 2: Question-Response', description: 'Hỏi - Đáp', totalQuestions: 25 },
    { id: '3', name: 'Part 3: Conversations', description: 'Đối thoại', totalQuestions: 39 },
    { id: '4', name: 'Part 4: Talks', description: 'Bài nói chuyện', totalQuestions: 30 },
    { id: '5', name: 'Part 5: Incomplete Sentences', description: 'Hoàn thành câu', totalQuestions: 30 },
    { id: '6', name: 'Part 6: Text Completion', description: 'Hoàn thành đoạn văn', totalQuestions: 16 },
    { id: '7', name: 'Part 7: Reading Comprehension', description: 'Đọc hiểu', totalQuestions: 54 }
  ];

  const loadParts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading parts...');
      
      // Try API first
      const response = await fetch('/api/parts');
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API data:', data);
      
      const partsArray = Array.isArray(data) ? data : (data.parts || data.data || []);
      
      if (partsArray.length > 0) {
        setParts(partsArray);
        console.log('Using API data:', partsArray);
      } else {
        setParts(MOCK_PARTS);
        console.log('Using mock data:', MOCK_PARTS);
      }
    } catch (err) {
      console.error('API failed, using mock data:', err);
      setParts(MOCK_PARTS);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParts();
  }, []);

  console.log('Current state:', { parts, loading, error, selectedPart });

  return (
    <div className="page-content min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <Card title="🔧 Parts Debug Test" className="shadow-lg">
          <div className="space-y-4">
            <div>
              <strong>Parts count:</strong> {parts.length}
              <br />
              <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
              <br />
              <strong>Error:</strong> {error || 'None'}
              <br />
              <strong>Selected:</strong> {selectedPart || 'None'}
            </div>
            
            <Button icon={<ReloadOutlined />} onClick={loadParts} loading={loading}>
              Reload Parts
            </Button>
          </div>
        </Card>

        {error && (
          <Alert
            message="API Error (using mock data)"
            description={error}
            type="warning"
            showIcon
          />
        )}

        <Card title="📋 Parts Dropdown" className="shadow-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chọn Part:</label>
              <Select
                placeholder="Chọn Part để test"
                style={{ width: '100%' }}
                size="large"
                loading={loading}
                value={selectedPart}
                onChange={setSelectedPart}
                options={parts.map(part => ({
                  value: part.id,
                  label: `${part.name} (${part.totalQuestions} câu)`
                }))}
              />
            </div>
            
            {selectedPart && (
              <Alert
                message={`Selected Part: ${selectedPart}`}
                description={`Part name: ${parts.find(p => p.id === selectedPart)?.name}`}
                type="success"
                showIcon
              />
            )}
          </div>
        </Card>

        <Card title="📝 Raw Parts Data" className="shadow-lg">
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(parts, null, 2)}
          </pre>
        </Card>

      </div>
    </div>
  );
}
