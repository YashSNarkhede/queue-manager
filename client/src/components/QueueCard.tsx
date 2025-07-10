import TokenList from "./TokenList";
import AnalyticsPanel from "./AnalyticsPanel";

interface QueueCardProps {
  queue: any;
  tokens: any[];
  analytics: any;
  onAddToken: () => void;
  onAssignTopToken: () => void;
  onCancelToken: (id: string) => void;
  onMoveToken: (id: string, direction: "up" | "down") => void;
  deleteToken: (tokenId: string) => Promise<void>;
}

function QueueCard({
  queue,
  tokens,
  analytics,
  onAddToken,
  onAssignTopToken,
  onCancelToken,
  onMoveToken,
  deleteToken,
}: QueueCardProps) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", marginBottom: "20px" }} className="queue-card">
      <h4>{queue.name}</h4>
      <button onClick={onAddToken}>Add Token</button>
      <button onClick={onAssignTopToken} style={{ marginLeft: "10px" }}>
        Assign Top Token
      </button>

      <TokenList
        tokens={tokens}
        onCancelToken={onCancelToken}
        onMoveToken={onMoveToken}
        deleteToken={deleteToken}
      />

      <AnalyticsPanel analytics={analytics} />
    </div>
  );
}

export default QueueCard;
