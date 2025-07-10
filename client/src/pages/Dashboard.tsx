import { useEffect, useState } from "react";
import api from "../api/api";
import Header from "../components/Header";
import QueueCard from "../components/QueueCard";

function Dashboard() {
  const [queues, setQueues] = useState<any[]>([]);
  const [newQueueName, setNewQueueName] = useState("");
  const [tokensByQueue, setTokensByQueue] = useState<{ [key: string]: any[] }>({});
  const [analytics, setAnalytics] = useState<{ [key: string]: any }>({});

  const fetchQueues = async () => {
    const res = await api.get("/queue");
    setQueues(res.data);

    const tokenData: any = {};
    const analyticsData: any = {};

    for (const queue of res.data) {
      const tokens = await api.get(`/token/queue/${queue._id}`);
      tokenData[queue._id] = tokens.data;

      const analyticsRes = await api.get(`/queue/analytics/${queue._id}`);
      analyticsData[queue._id] = analyticsRes.data;
    }

    setTokensByQueue(tokenData);
    setAnalytics(analyticsData);
  };

  const createQueue = async () => {
    if (!newQueueName) return;
    await api.post("/queue/create", { name: newQueueName });
    setNewQueueName("");
    fetchQueues();
  };

  const addToken = async (queueId: string) => {
    await api.post("/token/add", { queueId });
    fetchQueues();
  };

  const assignTopToken = async (queueId: string) => {
    await api.patch(`/token/assign/${queueId}`);
    fetchQueues();
  };

  const cancelToken = async (tokenId: string) => {
    await api.delete(`/token/${tokenId}`);
    fetchQueues();
  };

  const moveToken = async (tokenId: string, direction: "up" | "down") => {
    try {
      await api.patch(`/token/move/${tokenId}`, { direction });
      fetchQueues();
    } catch (err) {
      alert("Can't move token");
    }
  };
  const deleteToken = async (tokenId: string) => {
    const confirm = window.confirm(`Are you sure you want to delete this token?`);
    if (!confirm) return;

    await api.delete(`/token/${tokenId}`);
    fetchQueues();
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  return (
    <>
      <Header />
      <div style={{ padding: "20px" }} className="container">
        <h2>Dashboard</h2>

        <div style={{ marginBottom: "20px" }}>
          <input
            placeholder="New Queue Name"
            value={newQueueName}
            onChange={(e) => setNewQueueName(e.target.value)}
          />
          <button onClick={createQueue} style={{ marginLeft: "10px" }}>
            Create Queue
          </button>
        </div>

        <h3>Your Queues</h3>
        {queues.map((queue) => (
          <QueueCard
            key={queue._id}
            queue={queue}
            tokens={tokensByQueue[queue._id] || []}
            analytics={analytics[queue._id]}
            onAddToken={() => addToken(queue._id)}
            onAssignTopToken={() => assignTopToken(queue._id)}
            onCancelToken={cancelToken}
            onMoveToken={moveToken}
            deleteToken={deleteToken}
          />
        ))}
      </div>
    </>
  );
}

export default Dashboard;
