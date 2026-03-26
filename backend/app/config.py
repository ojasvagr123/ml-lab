from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

HOUSE_MODEL_PATH = MODELS_DIR / "melbourne_best_model.pkl"
WICKET_MODEL_PATH = MODELS_DIR / "wicket_prediction_model.pkl"
WIN_PROB_MODEL_PATH = MODELS_DIR / "win_probability_model.pkl"
BATTER_SCALER_PATH = MODELS_DIR / "batter_cluster_scaler.pkl"
BATTER_CLUSTER_MODEL_PATH = MODELS_DIR / "batter_cluster_model.pkl"
FLAG_MODEL_PATH = MODELS_DIR / "flag_mobilenet_transfer.keras"
FLAG_CLASS_NAMES_PATH = MODELS_DIR / "class_names.json"
AUDIO_MODEL_PATH = MODELS_DIR / "extra_trees_chord_model.pkl"
AUDIO_FEATURE_COLUMNS_PATH = MODELS_DIR / "final_feature_columns.pkl"

HOUSE_FEATURE_COLUMNS = [
    "Suburb",
    "Type",
    "Method",
    "SellerG",
    "CouncilArea",
    "Regionname",
    "Rooms",
    "Distance",
    "Postcode",
    "Bedroom2",
    "Bathroom",
    "Car",
    "Landsize",
    "Lattitude",
    "Longtitude",
    "Propertycount",
    "SaleYear",
    "SaleMonth",
    "PricePerRoomProxy",
    "BathPerRoom",
    "CarPerRoom",
    "PropertyAge",
    "LogLandsize",
]

WICKET_FEATURE_COLUMNS = [
    "innings",
    "over",
    "ball_in_over",
    "batting_team",
    "bowling_team",
    "striker",
    "bowler",
    "cum_runs",
    "cum_wickets",
    "balls_bowled_in_innings",
    "balls_left",
    "wickets_left",
    "current_run_rate",
    "last_6_ball_runs",
    "last_6_ball_wickets",
]

WIN_PROB_FEATURE_COLUMNS = [
    "over",
    "ball_in_over",
    "batting_team",
    "bowling_team",
    "cum_runs_2nd",
    "cum_wickets_2nd",
    "balls_bowled_2nd",
    "balls_left",
    "wickets_left",
    "target",
    "runs_required",
    "current_run_rate",
    "required_run_rate",
    "rrr_minus_crr",
    "last_6_runs",
    "last_6_wickets",
]

BATTER_CLUSTER_FEATURE_COLUMNS = [
    "total_runs",
    "balls_faced",
    "strike_rate",
    "boundary_pct",
    "avg_runs_per_ball",
]