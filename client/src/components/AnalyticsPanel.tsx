interface AnalyticsPanelProps {
  analytics: any;
}

function AnalyticsPanel({ analytics }: AnalyticsPanelProps) {
  return (
    <>
      <h5>Analytics:</h5>
      <ul>
        <li>Waiting: {analytics?.currentQueueLength}</li>
        <li>Assigned: {analytics?.assignedCount}</li>
        <li>Avg Wait Time: {analytics?.averageWaitTimeMins} min</li>
      </ul>
    </>
  );
}

export default AnalyticsPanel;
