import streamlit as st
import pandas as pd
import numpy as np

from app.config import (
    HOUSE_FEATURE_COLUMNS,
    WICKET_FEATURE_COLUMNS,
    WIN_PROB_FEATURE_COLUMNS,
    BATTER_CLUSTER_FEATURE_COLUMNS,
)
from app.model_loader import (
    load_house_model,
    load_wicket_model,
    load_win_prob_model,
    load_batter_scaler,
    load_batter_cluster_model,
    load_flag_model,
    load_flag_class_names,
    load_audio_model,
    load_audio_feature_columns,
)
from app.utils_tabular import build_house_features, make_single_row_df, safe_predict_proba
from app.utils_flag import preprocess_flag_image, decode_top_k
from app.utils_audio import extract_audio_features_from_bytes, make_audio_feature_df


st.set_page_config(page_title="Multi-Model Predictor", layout="wide")
st.title("Multi-Model Prediction System")
st.write("Select a model from the sidebar and run predictions.")


with st.sidebar:
    st.header("Choose Prediction Task")
    task = st.radio(
        "Task",
        [
            "House Price Prediction",
            "Cricket Wicket Prediction",
            "Cricket Win Probability",
            "Batter Cluster Prediction",
            "Flag Classification",
            "Audio Chord Classification",
        ],
    )


def show_probabilities(probs: dict):
    if not probs:
        return
    st.subheader("Probabilities")
    prob_df = pd.DataFrame(
        {"Class": list(probs.keys()), "Probability": list(probs.values())}
    )
    st.dataframe(prob_df, use_container_width=True)


if task == "House Price Prediction":
    st.header("House Price Prediction")

    col1, col2, col3 = st.columns(3)

    with col1:
        suburb = st.text_input("Suburb", "Melbourne")
        property_type = st.selectbox("Type", ["h", "u", "t"])
        method = st.text_input("Method", "S")
        sellerg = st.text_input("SellerG", "Jellis")
        council_area = st.text_input("CouncilArea", "Melbourne")
        regionname = st.text_input("Regionname", "Northern Metropolitan")
        rooms = st.number_input("Rooms", min_value=0.0, value=3.0)
        distance = st.number_input("Distance", min_value=0.0, value=10.0)

    with col2:
        postcode = st.number_input("Postcode", min_value=0.0, value=3000.0)
        bedroom2 = st.number_input("Bedroom2", min_value=0.0, value=3.0)
        bathroom = st.number_input("Bathroom", min_value=0.0, value=2.0)
        car = st.number_input("Car", min_value=0.0, value=1.0)
        landsize = st.number_input("Landsize", min_value=0.0, value=150.0)
        lattitude = st.number_input("Lattitude", value=-37.8136, format="%.6f")
        longtitude = st.number_input("Longtitude", value=144.9631, format="%.6f")
        propertycount = st.number_input("Propertycount", min_value=0.0, value=5000.0)

    with col3:
        sale_year = st.number_input("SaleYear", min_value=2000.0, value=2018.0)
        sale_month = st.number_input("SaleMonth", min_value=1.0, max_value=12.0, value=6.0)

    if st.button("Predict House Price"):
        try:
            payload = {
                "Suburb": suburb,
                "Type": property_type,
                "Method": method,
                "SellerG": sellerg,
                "CouncilArea": council_area,
                "Regionname": regionname,
                "Rooms": rooms,
                "Distance": distance,
                "Postcode": postcode,
                "Bedroom2": bedroom2,
                "Bathroom": bathroom,
                "Car": car,
                "Landsize": landsize,
                "Lattitude": lattitude,
                "Longtitude": longtitude,
                "Propertycount": propertycount,
                "SaleYear": sale_year,
                "SaleMonth": sale_month,
            }

            model = load_house_model()
            df = build_house_features(payload)
            pred_log = model.predict(df)[0]
            pred_price = float(np.expm1(pred_log))

            st.success("Prediction completed")
            st.metric("Predicted Price", f"{pred_price:,.2f}")
            st.write("Predicted Log Price:", float(pred_log))
            st.subheader("Input Data")
            st.dataframe(df, use_container_width=True)

        except Exception as e:
            st.error(f"House prediction failed: {e}")


elif task == "Cricket Wicket Prediction":
    st.header("Cricket Wicket Prediction")

    col1, col2, col3 = st.columns(3)

    with col1:
        innings = st.number_input("innings", min_value=1.0, value=1.0)
        over = st.number_input("over", min_value=0.0, value=10.0)
        ball_in_over = st.number_input("ball_in_over", min_value=0.0, max_value=5.0, value=2.0)
        batting_team = st.text_input("batting_team", "India")
        bowling_team = st.text_input("bowling_team", "Australia")

    with col2:
        striker = st.text_input("striker", "Player A")
        bowler = st.text_input("bowler", "Bowler X")
        cum_runs = st.number_input("cum_runs", min_value=0.0, value=75.0)
        cum_wickets = st.number_input("cum_wickets", min_value=0.0, value=2.0)
        balls_bowled_in_innings = st.number_input("balls_bowled_in_innings", min_value=0.0, value=62.0)

    with col3:
        balls_left = st.number_input("balls_left", min_value=0.0, value=58.0)
        wickets_left = st.number_input("wickets_left", min_value=0.0, value=8.0)
        current_run_rate = st.number_input("current_run_rate", min_value=0.0, value=7.26)
        last_6_ball_runs = st.number_input("last_6_ball_runs", min_value=0.0, value=8.0)
        last_6_ball_wickets = st.number_input("last_6_ball_wickets", min_value=0.0, value=0.0)

    if st.button("Predict Wicket"):
        try:
            payload = {
                "innings": innings,
                "over": over,
                "ball_in_over": ball_in_over,
                "batting_team": batting_team,
                "bowling_team": bowling_team,
                "striker": striker,
                "bowler": bowler,
                "cum_runs": cum_runs,
                "cum_wickets": cum_wickets,
                "balls_bowled_in_innings": balls_bowled_in_innings,
                "balls_left": balls_left,
                "wickets_left": wickets_left,
                "current_run_rate": current_run_rate,
                "last_6_ball_runs": last_6_ball_runs,
                "last_6_ball_wickets": last_6_ball_wickets,
            }

            model = load_wicket_model()
            df = make_single_row_df(payload, WICKET_FEATURE_COLUMNS)
            pred = int(model.predict(df)[0])
            probs = safe_predict_proba(model, df)

            label = "Wicket" if pred == 1 else "No Wicket"

            st.success("Prediction completed")
            st.metric("Prediction", label)

            if probs is not None:
                prob_dict = {
                    "No Wicket": float(probs[0][0]),
                    "Wicket": float(probs[0][1]),
                }
                show_probabilities(prob_dict)

            st.subheader("Input Data")
            st.dataframe(df, use_container_width=True)

        except Exception as e:
            st.error(f"Wicket prediction failed: {e}")


elif task == "Cricket Win Probability":
    st.header("Cricket Win Probability")

    col1, col2, col3 = st.columns(3)

    with col1:
        over = st.number_input("over", min_value=0.0, value=15.0, key="wp_over")
        ball_in_over = st.number_input("ball_in_over", min_value=0.0, max_value=5.0, value=3.0, key="wp_ball")
        batting_team = st.text_input("batting_team", "India", key="wp_bat")
        bowling_team = st.text_input("bowling_team", "Australia", key="wp_bowl")
        cum_runs_2nd = st.number_input("cum_runs_2nd", min_value=0.0, value=120.0)
        cum_wickets_2nd = st.number_input("cum_wickets_2nd", min_value=0.0, value=3.0)

    with col2:
        balls_bowled_2nd = st.number_input("balls_bowled_2nd", min_value=0.0, value=93.0)
        balls_left = st.number_input("balls_left", min_value=0.0, value=27.0, key="wp_left")
        wickets_left = st.number_input("wickets_left", min_value=0.0, value=7.0, key="wp_wkts")
        target = st.number_input("target", min_value=0.0, value=180.0)
        runs_required = st.number_input("runs_required", min_value=0.0, value=60.0)
        current_run_rate = st.number_input("current_run_rate", min_value=0.0, value=7.74, key="wp_crr")

    with col3:
        required_run_rate = st.number_input("required_run_rate", min_value=0.0, value=13.33)
        rrr_minus_crr = st.number_input("rrr_minus_crr", value=5.59)
        last_6_runs = st.number_input("last_6_runs", min_value=0.0, value=9.0)
        last_6_wickets = st.number_input("last_6_wickets", min_value=0.0, value=0.0)

    if st.button("Predict Win Probability"):
        try:
            payload = {
                "over": over,
                "ball_in_over": ball_in_over,
                "batting_team": batting_team,
                "bowling_team": bowling_team,
                "cum_runs_2nd": cum_runs_2nd,
                "cum_wickets_2nd": cum_wickets_2nd,
                "balls_bowled_2nd": balls_bowled_2nd,
                "balls_left": balls_left,
                "wickets_left": wickets_left,
                "target": target,
                "runs_required": runs_required,
                "current_run_rate": current_run_rate,
                "required_run_rate": required_run_rate,
                "rrr_minus_crr": rrr_minus_crr,
                "last_6_runs": last_6_runs,
                "last_6_wickets": last_6_wickets,
            }

            model = load_win_prob_model()
            df = make_single_row_df(payload, WIN_PROB_FEATURE_COLUMNS)
            pred = int(model.predict(df)[0])
            probs = safe_predict_proba(model, df)

            label = "Win" if pred == 1 else "Lose"

            st.success("Prediction completed")
            st.metric("Prediction", label)

            if probs is not None:
                win_pct = round(float(probs[0][1]) * 100, 2)
                st.metric("Win Percentage", f"{win_pct}%")

                prob_dict = {
                    "Lose": float(probs[0][0]),
                    "Win": float(probs[0][1]),
                }
                show_probabilities(prob_dict)

            st.subheader("Input Data")
            st.dataframe(df, use_container_width=True)

        except Exception as e:
            st.error(f"Win probability prediction failed: {e}")


elif task == "Batter Cluster Prediction":
    st.header("Batter Cluster Prediction")

    col1, col2, col3 = st.columns(3)

    with col1:
        total_runs = st.number_input("total_runs", min_value=0.0, value=1500.0)

    with col2:
        balls_faced = st.number_input("balls_faced", min_value=0.0, value=1100.0)

    with col3:
        strike_rate = st.number_input("strike_rate", min_value=0.0, value=136.36)
        boundary_pct = st.number_input("boundary_pct", min_value=0.0, value=18.0)
        avg_runs_per_ball = st.number_input("avg_runs_per_ball", min_value=0.0, value=1.36)

    if st.button("Predict Batter Cluster"):
        try:
            payload = {
                "total_runs": total_runs,
                "balls_faced": balls_faced,
                "strike_rate": strike_rate,
                "boundary_pct": boundary_pct,
                "avg_runs_per_ball": avg_runs_per_ball,
            }

            scaler = load_batter_scaler()
            model = load_batter_cluster_model()

            df = make_single_row_df(payload, BATTER_CLUSTER_FEATURE_COLUMNS)
            scaled = scaler.transform(df)
            pred = int(model.predict(scaled)[0])

            st.success("Prediction completed")
            st.metric("Predicted Cluster", pred)
            st.subheader("Input Data")
            st.dataframe(df, use_container_width=True)

        except Exception as e:
            st.error(f"Batter cluster prediction failed: {e}")


elif task == "Flag Classification":
    st.header("Flag Classification")

    uploaded_image = st.file_uploader(
        "Upload a flag image",
        type=["png", "jpg", "jpeg", "webp"]
    )

    if uploaded_image is not None:
        st.image(uploaded_image, caption="Uploaded Image", use_container_width=True)

        if st.button("Predict Flag"):
            try:
                model = load_flag_model()
                class_names = load_flag_class_names()

                file_bytes = uploaded_image.read()
                img = preprocess_flag_image(file_bytes)
                preds = model.predict(img, verbose=0)

                top_predictions = decode_top_k(preds, class_names, k=3)
                best = top_predictions[0]

                st.success("Prediction completed")
                st.metric("Predicted Flag", best["class_name"])
                st.metric("Confidence", f"{best['confidence']:.4f}")

                st.subheader("Top 3 Predictions")
                top3_df = pd.DataFrame(top_predictions)
                st.dataframe(top3_df, use_container_width=True)

            except Exception as e:
                st.error(f"Flag prediction failed: {e}")


elif task == "Audio Chord Classification":
    st.header("Audio Chord Classification")

    uploaded_audio = st.file_uploader(
        "Upload an audio file",
        type=["wav", "mp3", "ogg", "flac"]
    )

    if uploaded_audio is not None:
        st.audio(uploaded_audio)

        if st.button("Predict Audio Chord"):
            try:
                file_bytes = uploaded_audio.read()

                model = load_audio_model()
                final_feature_columns = load_audio_feature_columns()

                features = extract_audio_features_from_bytes(file_bytes)
                df = make_audio_feature_df(features, final_feature_columns)
                pred = model.predict(df)[0]
                probs = safe_predict_proba(model, df)

                label_map = {
                    0: "major",
                    1: "minor",
                    "major": "major",
                    "minor": "minor",
                }
                predicted_class = label_map.get(pred, str(pred))

                st.success("Prediction completed")
                st.metric("Predicted Class", predicted_class)

                if probs is not None and len(probs[0]) == 2:
                    prob_dict = {
                        "class_0": float(probs[0][0]),
                        "class_1": float(probs[0][1]),
                    }
                    show_probabilities(prob_dict)

                st.subheader("Extracted Features")
                st.dataframe(df, use_container_width=True)

            except Exception as e:
                st.error(f"Audio prediction failed: {e}")