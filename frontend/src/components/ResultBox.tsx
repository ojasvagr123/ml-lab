type Props = {
  title?: string;
  result: any;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

export default function ResultBox({ title = "Prediction Result", result }: Props) {
  if (!result) {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <div className="empty-state">Run the model to see the prediction here.</div>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <div className="error-box">
          {typeof result.error === "string"
            ? result.error
            : JSON.stringify(result.error, null, 2)}
        </div>
      </div>
    );
  }

  if (result.task === "flag_prediction") {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <div className="result-highlight">{result.predicted_class}</div>
        <div className="result-muted">
          Most likely country predicted from the uploaded flag image.
        </div>

        <div className="metric-grid">
          <div className="metric-box">
            <div className="metric-label">Top Confidence</div>
            <div className="metric-value">{formatPercent(result.confidence)}</div>
          </div>
        </div>

        {result.top_3_predictions && (
          <ul className="prediction-list">
            {result.top_3_predictions.map((item: any, idx: number) => (
              <li key={idx}>
                <span>{item.class_name}</span>
                <strong>{formatPercent(item.confidence)}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (result.task === "house_price_prediction") {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <div className="result-highlight">
          {result.predicted_price ? formatCurrency(result.predicted_price) : "Prediction Ready"}
        </div>
        <div className="result-muted">
          Estimated property price based on the values you entered.
        </div>
      </div>
    );
  }

  if (result.task === "wicket_prediction") {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <div className="result-highlight">{result.label}</div>
        <div className="result-muted">Predicted outcome for the current ball state.</div>

        {result.probabilities && (
          <div className="metric-grid">
            <div className="metric-box">
              <div className="metric-label">No Wicket</div>
              <div className="metric-value">{formatPercent(result.probabilities.no_wicket)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Wicket</div>
              <div className="metric-value">{formatPercent(result.probabilities.wicket)}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (result.task === "win_probability") {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <div className="result-highlight">
          {result.probabilities?.win_percentage ?? "--"}%
        </div>
        <div className="result-muted">
          Estimated win probability for the chasing side.
        </div>

        {result.probabilities && (
          <div className="metric-grid">
            <div className="metric-box">
              <div className="metric-label">Win</div>
              <div className="metric-value">{formatPercent(result.probabilities.win)}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Lose</div>
              <div className="metric-value">{formatPercent(result.probabilities.lose)}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (result.task === "batter_cluster") {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <div className="result-highlight">Cluster {result.cluster}</div>
        <div className="result-muted">
          Player grouped into a batting style cluster by the model.
        </div>
      </div>
    );
  }

  if (result.task === "audio_chord_prediction") {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <div className="result-highlight">{result.predicted_class}</div>
        <div className="result-muted">
          Predicted chord class from the uploaded audio sample.
        </div>
      </div>
    );
  }

  return (
    <div className="result-card">
      <h3>{title}</h3>
      <div className="empty-state">Result received, but no custom renderer matched this response.</div>
    </div>
  );
}