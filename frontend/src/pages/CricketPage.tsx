import { useMemo, useState } from "react";
import FormField from "../components/FormField";
import ResultBox from "../components/ResultBox";
import Loader from "../components/Loader";
import api from "../services/api";

type ToolType = "wicket" | "win-probability" | "batter-cluster";

const TEAM_OPTIONS = [
  "Australia",
  "India",
  "England",
  "Pakistan",
  "South Africa",
  "New Zealand",
  "Sri Lanka",
  "Bangladesh",
  "Afghanistan",
  "West Indies",
];

const WICKET_INITIAL = {
  innings: "",
  over: "",
  ball_in_over: "",
  batting_team: "",
  bowling_team: "",
  striker: "",
  bowler: "",
  cum_runs: "",
  cum_wickets: "",
  balls_bowled_in_innings: "",
  balls_left: "",
  wickets_left: "",
  current_run_rate: "",
  last_6_ball_runs: "",
  last_6_ball_wickets: "",
};

const WIN_INITIAL = {
  over: "",
  ball_in_over: "",
  batting_team: "",
  bowling_team: "",
  cum_runs_2nd: "",
  cum_wickets_2nd: "",
  balls_bowled_2nd: "",
  balls_left: "",
  wickets_left: "",
  target: "",
  runs_required: "",
  current_run_rate: "",
  required_run_rate: "",
  rrr_minus_crr: "",
  last_6_runs: "",
  last_6_wickets: "",
};

const CLUSTER_INITIAL = {
  total_runs: "",
  balls_faced: "",
  strike_rate: "",
  boundary_pct: "",
  avg_runs_per_ball: "",
};

const wicketFieldMeta: Record<
  keyof typeof WICKET_INITIAL,
  { label: string; type?: string; placeholder?: string; options?: string[] }
> = {
  innings: { label: "Innings", type: "number", placeholder: "1 or 2" },
  over: { label: "Over", type: "number", placeholder: "e.g. 12" },
  ball_in_over: { label: "Ball in Over", type: "number", placeholder: "0 to 5" },
  batting_team: { label: "Batting Team", options: TEAM_OPTIONS },
  bowling_team: { label: "Bowling Team", options: TEAM_OPTIONS },
  striker: { label: "Striker", placeholder: "Batter name" },
  bowler: { label: "Bowler", placeholder: "Bowler name" },
  cum_runs: { label: "Current Score", type: "number", placeholder: "Total runs" },
  cum_wickets: { label: "Wickets Down", type: "number", placeholder: "0 to 10" },
  balls_bowled_in_innings: {
    label: "Balls Bowled",
    type: "number",
    placeholder: "Balls bowled so far",
  },
  balls_left: { label: "Balls Left", type: "number", placeholder: "Remaining balls" },
  wickets_left: { label: "Wickets Left", type: "number", placeholder: "Remaining wickets" },
  current_run_rate: {
    label: "Current Run Rate",
    type: "number",
    placeholder: "e.g. 8.25",
  },
  last_6_ball_runs: {
    label: "Runs in Last 6 Balls",
    type: "number",
    placeholder: "Recent runs",
  },
  last_6_ball_wickets: {
    label: "Wickets in Last 6 Balls",
    type: "number",
    placeholder: "Recent wickets",
  },
};

const winFieldMeta: Record<
  keyof typeof WIN_INITIAL,
  { label: string; type?: string; placeholder?: string; options?: string[] }
> = {
  over: { label: "Over", type: "number", placeholder: "e.g. 14" },
  ball_in_over: { label: "Ball in Over", type: "number", placeholder: "0 to 5" },
  batting_team: { label: "Batting Team", options: TEAM_OPTIONS },
  bowling_team: { label: "Bowling Team", options: TEAM_OPTIONS },
  cum_runs_2nd: { label: "Current Score", type: "number", placeholder: "Runs in chase" },
  cum_wickets_2nd: { label: "Wickets Down", type: "number", placeholder: "0 to 10" },
  balls_bowled_2nd: { label: "Balls Bowled", type: "number", placeholder: "Balls bowled" },
  balls_left: { label: "Balls Left", type: "number", placeholder: "Remaining balls" },
  wickets_left: { label: "Wickets Left", type: "number", placeholder: "Remaining wickets" },
  target: { label: "Target", type: "number", placeholder: "Target score" },
  runs_required: { label: "Runs Required", type: "number", placeholder: "Runs left" },
  current_run_rate: {
    label: "Current Run Rate",
    type: "number",
    placeholder: "e.g. 7.85",
  },
  required_run_rate: {
    label: "Required Run Rate",
    type: "number",
    placeholder: "e.g. 9.50",
  },
  rrr_minus_crr: {
    label: "RRR - CRR",
    type: "number",
    placeholder: "Difference value",
  },
  last_6_runs: { label: "Runs in Last 6 Balls", type: "number", placeholder: "Recent runs" },
  last_6_wickets: {
    label: "Wickets in Last 6 Balls",
    type: "number",
    placeholder: "Recent wickets",
  },
};

const clusterFieldMeta: Record<
  keyof typeof CLUSTER_INITIAL,
  { label: string; type?: string; placeholder?: string }
> = {
  total_runs: { label: "Total Runs", type: "number", placeholder: "Career or match runs" },
  balls_faced: { label: "Balls Faced", type: "number", placeholder: "Total balls faced" },
  strike_rate: { label: "Strike Rate", type: "number", placeholder: "e.g. 135.40" },
  boundary_pct: { label: "Boundary %", type: "number", placeholder: "e.g. 24.5" },
  avg_runs_per_ball: {
    label: "Average Runs per Ball",
    type: "number",
    placeholder: "e.g. 1.28",
  },
};

export default function CricketPage() {
  const [tool, setTool] = useState<ToolType>("wicket");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [wicketForm, setWicketForm] = useState(WICKET_INITIAL);
  const [winForm, setWinForm] = useState(WIN_INITIAL);
  const [clusterForm, setClusterForm] = useState(CLUSTER_INITIAL);

  const pageCopy = useMemo(() => {
    if (tool === "wicket") {
      return {
        title: "Wicket Prediction",
        subtitle:
          "Estimate whether the current match situation is likely to produce a wicket on the next ball.",
        panelTitle: "Current Ball State",
        panelSubtitle:
          "Fill the current innings context, recent form, and player information.",
        buttonText: "Predict Wicket",
      };
    }

    if (tool === "win-probability") {
      return {
        title: "Win Probability",
        subtitle:
          "Estimate the chasing side’s win chances using the live match situation.",
        panelTitle: "Live Chase Situation",
        panelSubtitle:
          "Enter target, current score, remaining balls, and recent over momentum.",
        buttonText: "Predict Win Probability",
      };
    }

    return {
      title: "Batter Cluster",
      subtitle:
        "Group a batter into a performance cluster based on scoring and intent features.",
      panelTitle: "Batter Performance Profile",
      panelSubtitle:
        "Enter the batter statistics used by the clustering model.",
      buttonText: "Find Batter Cluster",
    };
  }, [tool]);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setter((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    };

  const handleReset = () => {
    if (tool === "wicket") {
      setWicketForm(WICKET_INITIAL);
    } else if (tool === "win-probability") {
      setWinForm(WIN_INITIAL);
    } else {
      setClusterForm(CLUSTER_INITIAL);
    }
    setResult(null);
  };

  const fillSample = () => {
    if (tool === "wicket") {
      setWicketForm({
        innings: "2",
        over: "15",
        ball_in_over: "2",
        batting_team: "India",
        bowling_team: "Australia",
        striker: "Virat Kohli",
        bowler: "Mitchell Starc",
        cum_runs: "132",
        cum_wickets: "4",
        balls_bowled_in_innings: "92",
        balls_left: "28",
        wickets_left: "6",
        current_run_rate: "8.61",
        last_6_ball_runs: "10",
        last_6_ball_wickets: "1",
      });
    } else if (tool === "win-probability") {
      setWinForm({
        over: "16",
        ball_in_over: "4",
        batting_team: "India",
        bowling_team: "Australia",
        cum_runs_2nd: "145",
        cum_wickets_2nd: "4",
        balls_bowled_2nd: "100",
        balls_left: "20",
        wickets_left: "6",
        target: "181",
        runs_required: "36",
        current_run_rate: "8.70",
        required_run_rate: "10.80",
        rrr_minus_crr: "2.10",
        last_6_runs: "12",
        last_6_wickets: "0",
      });
    } else {
      setClusterForm({
        total_runs: "480",
        balls_faced: "320",
        strike_rate: "150",
        boundary_pct: "22",
        avg_runs_per_ball: "1.50",
      });
    }
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setResult(null);

      let response;
      if (tool === "wicket") {
        response = await api.post("/predict/cricket/wicket", wicketForm);
      } else if (tool === "win-probability") {
        response = await api.post("/predict/cricket/win-probability", winForm);
      } else {
        response = await api.post("/predict/cricket/batter-cluster", clusterForm);
      }

      setResult(response.data);
    } catch (error: any) {
      setResult({
        error: error?.response?.data || "Prediction failed. Please check the inputs.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderWicketForm = () =>
    (Object.keys(wicketForm) as Array<keyof typeof wicketForm>).map((key) => {
      const meta = wicketFieldMeta[key];
      return (
        <FormField
          key={key}
          label={meta.label}
          name={key}
          value={wicketForm[key]}
          onChange={handleChange(setWicketForm)}
          type={meta.type || "text"}
          placeholder={meta.placeholder}
          options={meta.options}
        />
      );
    });

  const renderWinForm = () =>
    (Object.keys(winForm) as Array<keyof typeof winForm>).map((key) => {
      const meta = winFieldMeta[key];
      return (
        <FormField
          key={key}
          label={meta.label}
          name={key}
          value={winForm[key]}
          onChange={handleChange(setWinForm)}
          type={meta.type || "text"}
          placeholder={meta.placeholder}
          options={meta.options}
        />
      );
    });

  const renderClusterForm = () =>
    (Object.keys(clusterForm) as Array<keyof typeof clusterForm>).map((key) => {
      const meta = clusterFieldMeta[key];
      return (
        <FormField
          key={key}
          label={meta.label}
          name={key}
          value={clusterForm[key]}
          onChange={handleChange(setClusterForm)}
          type={meta.type || "text"}
          placeholder={meta.placeholder}
        />
      );
    });

  return (
    <div className="page">
      <section className="hero">
        <h1 className="page-title">Cricket Analytics Studio</h1>
        <p className="page-subtitle">
          Explore three cricket ML tools from one polished dashboard: wicket prediction,
          live win probability, and batter clustering.
        </p>
      </section>

      <div className="tag-row">
        <button
          type="button"
          className={tool === "wicket" ? "tab-btn active-tab" : "tab-btn"}
          onClick={() => {
            setTool("wicket");
            setResult(null);
          }}
        >
          Wicket Prediction
        </button>

        <button
          type="button"
          className={tool === "win-probability" ? "tab-btn active-tab" : "tab-btn"}
          onClick={() => {
            setTool("win-probability");
            setResult(null);
          }}
        >
          Win Probability
        </button>

        <button
          type="button"
          className={tool === "batter-cluster" ? "tab-btn active-tab" : "tab-btn"}
          onClick={() => {
            setTool("batter-cluster");
            setResult(null);
          }}
        >
          Batter Cluster
        </button>
      </div>

      <div className="section-shell">
        <div className="glass-panel">
          <h2 className="panel-title">{pageCopy.title}</h2>
          <p className="panel-subtitle">{pageCopy.subtitle}</p>

          <div
            style={{
              marginBottom: "18px",
              padding: "14px 16px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: "6px" }}>{pageCopy.panelTitle}</div>
            <div style={{ color: "#cbd5e1", lineHeight: 1.55 }}>{pageCopy.panelSubtitle}</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {tool === "wicket" && renderWicketForm()}
              {tool === "win-probability" && renderWinForm()}
              {tool === "batter-cluster" && renderClusterForm()}
            </div>

            <div className="form-actions">
              <button className="primary-btn" type="submit" disabled={loading}>
                {pageCopy.buttonText}
              </button>
              <button
                className="secondary-btn"
                type="button"
                onClick={fillSample}
                disabled={loading}
              >
                Fill Sample
              </button>
              <button
                className="secondary-btn"
                type="button"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </form>

          {loading && (
            <div style={{ marginTop: "18px" }}>
              <Loader />
            </div>
          )}
        </div>

        <ResultBox title="Prediction Output" result={result} />
      </div>
    </div>
  );
}