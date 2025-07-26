import React, { useState, useEffect } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    memory: 0,
    renderTime: 0,
    apiCalls: 0,
    lastApiTime: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      if (performance.memory) {
        setMetrics(prev => ({
          ...prev,
          memory: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
        }));
      }
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded text-xs">
      <div className="font-bold mb-2">Performance Monitor</div>
      <div>Memory: {metrics.memory}MB</div>
      <div>API Calls: {metrics.apiCalls}</div>
      {metrics.lastApiTime > 0 && (
        <div>Last API: {metrics.lastApiTime}ms</div>
      )}
    </div>
  );
};

export default PerformanceMonitor; 