import { useState } from "react";

type Match = { id: number; letter: string; status: string };
type JoinResponse = { match_id: number; player_id: number; player_name: string };

export default function App() {
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState("");

  // Player 1
  const [p1Name, setP1Name] = useState("");
  const [p1, setP1] = useState<JoinResponse | null>(null);

  async function handleStartMatch() {
    setError("");
    setP1(null);
    setP1Name("");

    try {
      const res = await fetch("/matches/start", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Failed to start match");
      setMatch(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleJoinPlayer1() {
    if (!match) return;
    setError("");

    try {
      const res = await fetch(`/matches/${match.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: p1Name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Failed to join match");
      setP1(data);
      setP1Name("");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 720 }}>
      <button onClick={handleStartMatch} style={{ padding: "10px 14px" }}>
        Start Match
      </button>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {match && (
        <div style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <div>
            <strong>Match ID:</strong> {match.id}
          </div>
          <div>
            <strong>Letter:</strong> {match.letter}
          </div>
          <div>
            <strong>Status:</strong> {match.status}
          </div>

          <hr style={{ margin: "16px 0" }} />

          <h3 style={{ marginTop: 0 }}>Player 1</h3>

          {!p1 ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Enter name"
                style={{ flex: 1, padding: 10 }}
                disabled={!match || match.status !== "active"}
              />
              <button
                onClick={handleJoinPlayer1}
                disabled={!match || match.status !== "active" || !p1Name.trim()}
                style={{ padding: "10px 14px" }}
              >
                Join
              </button>
            </div>
          ) : (
            <div>
              Joined as <strong>{p1.player_name}</strong> (player_id: {p1.player_id})
            </div>
          )}
        </div>
      )}
    </div>
  );
}