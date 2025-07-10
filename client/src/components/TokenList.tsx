interface TokenListProps {
  tokens: any[];
  onCancelToken: (id: string) => void;
  onMoveToken: (id: string, direction: "up" | "down") => void;
  deleteToken: (id: string) => void;
}

function TokenList({ tokens, onCancelToken, onMoveToken, deleteToken}: TokenListProps) {
  return (
    <>
      <h5>Tokens:</h5>
      <ul>
        {tokens.map((token, i) => (
          <li key={token._id}>
            Token #{token.number} — {token.status}
            {token.status === "waiting" && (
              <>
                <button onClick={() => onCancelToken(token._id)}>Cancel</button>
                <button onClick={() => onMoveToken(token._id, "up")} disabled={i === 0}>
                  ⬆️
                </button>
                <button
                  onClick={() => onMoveToken(token._id, "down")}
                  disabled={i === tokens.length - 1}
                >
                  ⬇️
                </button>
                <button onClick={() => deleteToken(token._id)} style={{ backgroundColor: "red", color: "white", marginLeft: "8px" }}>  🗑 Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default TokenList;
