import { Link } from "react-router-dom";
import PageCard from "../components/PageCard";

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1 className="page-title">Multi-Model Prediction Studio</h1>
        <p className="page-subtitle">
          A clean and interactive interface to test your machine learning models
          for house price prediction, cricket analytics, flag classification,
          and audio chord classification.
        </p>
      </section>

      <div className="card-grid">
        <PageCard
          title="House Price Prediction"
          description="Enter Melbourne housing features and get a polished prediction output."
        >
          <Link className="primary-btn" to="/house">Open Module</Link>
        </PageCard>

        <PageCard
          title="Cricket Analytics"
          description="Run wicket prediction, win probability, and batter cluster analysis."
        >
          <Link className="primary-btn" to="/cricket">Open Module</Link>
        </PageCard>

        <PageCard
          title="Flag Prediction"
          description="Upload a flag image and get the predicted country with top-3 scores."
        >
          <Link className="primary-btn" to="/flag">Open Module</Link>
        </PageCard>

        <PageCard
          title="Audio Chord Prediction"
          description="Upload an audio file and classify the chord as major or minor."
        >
          <Link className="primary-btn" to="/audio">Open Module</Link>
        </PageCard>
      </div>
    </div>
  );
}