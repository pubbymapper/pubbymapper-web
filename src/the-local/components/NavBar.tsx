import { type ChangeEvent, type FC, useEffect, useMemo, useState } from "react";
import type { BoroughOption } from "../types/borough";

interface NavBarProps {
  limit: number | null;
  onLimitChange: (value: number | null) => void;
  boroughOptions: BoroughOption[];
  selectedBoroughIds: string[];
  onSelectedBoroughIdsChange: (ids: string[]) => void;
  boroughLoading: boolean;
  boroughError: string | null;
}

const NavBar: FC<NavBarProps> = ({
  limit,
  onLimitChange,
  boroughOptions,
  selectedBoroughIds,
  onSelectedBoroughIdsChange,
  boroughLoading,
  boroughError,
}) => {
  const [open, setOpen] = useState(false);
  const [limitInput, setLimitInput] = useState(limit === null ? "" : String(limit));
  const [limitInputError, setLimitInputError] = useState<string | null>(null);
  const [boroughSearch, setBoroughSearch] = useState("");
  const selectedSet = useMemo(() => new Set(selectedBoroughIds), [selectedBoroughIds]);

  const filteredBoroughOptions = useMemo(() => {
    const q = boroughSearch.trim().toLowerCase();
    if (!q) return boroughOptions;
    return boroughOptions.filter((b) => b.name.toLowerCase().includes(q));
  }, [boroughOptions, boroughSearch]);

  useEffect(() => {
    setLimitInput(limit === null ? "" : String(limit));
  }, [limit]);

  const handleLimitInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    setLimitInput(raw);
    const trimmed = raw.trim();

    if (trimmed === "") {
      setLimitInputError(null);
      onLimitChange(null);
      return;
    }

    if (!/^\d+$/.test(trimmed)) {
      setLimitInputError("Enter a positive whole number");
      return;
    }

    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed < 1) {
      setLimitInputError("Limit must be at least 1");
      return;
    }

    setLimitInputError(null);
    onLimitChange(parsed);
  };

  const handleLimitBlur = () => {
    if (limitInputError) {
      setLimitInput(limit === null ? "" : String(limit));
      setLimitInputError(null);
    }
  };

  const toggleBorough = (boroughId: string) => {
    if (selectedSet.has(boroughId)) {
      onSelectedBoroughIdsChange(selectedBoroughIds.filter((id) => id !== boroughId));
      return;
    }
    onSelectedBoroughIdsChange([...selectedBoroughIds, boroughId]);
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        padding: "0 20px",
        background: "#0d9488",
        color: "#fff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        zIndex: 1000,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>
          🍺 The Local
        </span>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          style={{
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: 8,
            background: "rgba(255,255,255,0.14)",
            color: "#fff",
            padding: "6px 10px",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Filters {open ? "▲" : "▼"}
        </button>
      </div>

      <span style={{ fontSize: 13, opacity: 0.85 }}>
        Pubbymapper QA Tool
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 64,
            width: 300,
            background: "#fff",
            color: "#1f2937",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
            padding: 14,
            zIndex: 1300,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            Query controls
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>
            Pub query limit (leave blank for no limit)
          </div>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={limitInput}
            onChange={handleLimitInputChange}
            onBlur={handleLimitBlur}
            placeholder="e.g. 200"
            style={{
              width: "100%",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              padding: "6px 8px",
              fontSize: 13,
              marginBottom: 6,
              boxSizing: "border-box",
            }}
          />
          {limitInputError && (
            <div style={{ color: "#b91c1c", fontSize: 12, marginBottom: 8 }}>
              {limitInputError}
            </div>
          )}

          <hr style={{ margin: "10px 0", borderColor: "#e5e7eb" }} />

          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Borough boundaries
          </div>
          {boroughLoading && (
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>
              Loading borough boundaries...
            </div>
          )}
          {boroughError && (
            <div style={{ fontSize: 12, color: "#b91c1c", marginBottom: 8 }}>
              {boroughError}
            </div>
          )}

          <input
            type="text"
            value={boroughSearch}
            onChange={(e) => setBoroughSearch(e.target.value)}
            placeholder="Search boroughs..."
            style={{
              width: "100%",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              padding: "6px 8px",
              fontSize: 13,
              marginBottom: 8,
              boxSizing: "border-box",
            }}
          />
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>
            Select boroughs to show boundaries and filter pubs. Selected: {selectedBoroughIds.length}
          </div>
          <div
            style={{
              maxHeight: 240,
              overflowY: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: 8,
              display: "grid",
              gap: 6,
            }}
          >
            {filteredBoroughOptions.map((borough) => (
              <label
                key={borough.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSet.has(borough.id)}
                  onChange={() => toggleBorough(borough.id)}
                />
                <span>{borough.name}</span>
              </label>
            ))}
            {!boroughLoading && boroughOptions.length === 0 && (
              <span style={{ fontSize: 12, color: "#475569" }}>
                No borough options available.
              </span>
            )}
            {!boroughLoading && boroughOptions.length > 0 && filteredBoroughOptions.length === 0 && (
              <span style={{ fontSize: 12, color: "#475569" }}>
                No boroughs match &quot;{boroughSearch.trim()}&quot;
              </span>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
