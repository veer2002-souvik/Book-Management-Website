import React, { useState, useEffect } from 'react';

const ResponseSizeMonitor = () => {
  const [metrics, setMetrics] = useState({
    lastResponseSize: 0,
    totalResponses: 0,
    averageResponseSize: 0,
    largestResponse: 0,
    networkSpeed: 0
  });

  useEffect(() => {
    // Intercept fetch requests to monitor response sizes
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const response = await originalFetch(...args);
      
      // Clone response to read body without consuming it
      const clonedResponse = response.clone();
      const text = await clonedResponse.text();
      const responseSize = text.length;
      const duration = Date.now() - startTime;
      
      setMetrics(prev => {
        const newTotal = prev.totalResponses + 1;
        const newTotalSize = prev.averageResponseSize * prev.totalResponses + responseSize;
        const newAverage = newTotalSize / newTotal;
        
        return {
          lastResponseSize: responseSize,
          totalResponses: newTotal,
          averageResponseSize: newAverage,
          largestResponse: Math.max(prev.largestResponse, responseSize),
          networkSpeed: responseSize / (duration / 1000) // bytes per second
        };
      });
      
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond) => {
    return formatBytes(bytesPerSecond) + '/s';
  };

  return (
    <div className="fixed top-4 right-4 bg-blue-900 bg-opacity-90 text-white p-4 rounded-lg text-sm max-w-xs">
      <div className="font-bold mb-3 text-center">Network Monitor</div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Last Response:</span>
          <span className="font-mono">{formatBytes(metrics.lastResponseSize)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Total Requests:</span>
          <span className="font-mono">{metrics.totalResponses}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Avg Response:</span>
          <span className="font-mono">{formatBytes(Math.round(metrics.averageResponseSize))}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Largest:</span>
          <span className="font-mono">{formatBytes(metrics.largestResponse)}</span>
        </div>
        
        {metrics.networkSpeed > 0 && (
          <div className="flex justify-between">
            <span>Speed:</span>
            <span className="font-mono">{formatSpeed(metrics.networkSpeed)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-blue-700">
        <div className="text-xs text-blue-300">
          Monitoring API responses in real-time
        </div>
      </div>
    </div>
  );
};

export default ResponseSizeMonitor; 