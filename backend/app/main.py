import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    HouseInput,
    WicketInput,
    WinProbabilityInput,
    BatterClusterInput,
)
from .config import (
    HOUSE_FEATURE_COLUMNS,
    WICKET_FEATURE_COLUMNS,
    WIN_PROB_FEATURE_COLUMNS,
    BATTER_CLUSTER_FEATURE_COLUMNS,
)
from .model_loader import (
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
from .utils_tabular import build_house_features, make_single_row_df, safe_predict_proba
from .utils_flag import preprocess_flag_image, decode_top_k
from .utils_audio import extract_audio_features_from_bytes, make_audio_feature_df

app = FastAPI(title="Multi-Model Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict/house")
def predict_house(payload: HouseInput):
    try:
        model = load_house_model()
        data = payload.model_dump()
        df = build_house_features(data)
        pred = model.predict(df)[0]

        return {
            "task": "house_price_prediction",
            "predicted_log_price": float(pred),
            "predicted_price": float(np.expm1(pred))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"House prediction failed: {str(e)}")

@app.post("/predict/cricket/wicket")
def predict_wicket(payload: WicketInput):
    try:
        model = load_wicket_model()
        df = make_single_row_df(payload.model_dump(), WICKET_FEATURE_COLUMNS)

        pred = model.predict(df)[0]
        probs = safe_predict_proba(model, df)

        response = {
            "task": "wicket_prediction",
            "prediction": int(pred),
            "label": "Wicket" if int(pred) == 1 else "No Wicket",
        }

        if probs is not None:
            response["probabilities"] = {
                "no_wicket": float(probs[0][0]),
                "wicket": float(probs[0][1]),
            }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Wicket prediction failed: {str(e)}")

@app.post("/predict/cricket/win-probability")
def predict_win_probability(payload: WinProbabilityInput):
    try:
        model = load_win_prob_model()
        df = make_single_row_df(payload.model_dump(), WIN_PROB_FEATURE_COLUMNS)

        pred = model.predict(df)[0]
        probs = safe_predict_proba(model, df)

        response = {
            "task": "win_probability",
            "prediction": int(pred),
            "label": "Win" if int(pred) == 1 else "Lose"
        }

        if probs is not None:
            response["probabilities"] = {
                "lose": float(probs[0][0]),
                "win": float(probs[0][1]),
                "win_percentage": round(float(probs[0][1]) * 100, 2)
            }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Win probability prediction failed: {str(e)}")

@app.post("/predict/cricket/batter-cluster")
def predict_batter_cluster(payload: BatterClusterInput):
    try:
        scaler = load_batter_scaler()
        model = load_batter_cluster_model()

        df = make_single_row_df(payload.model_dump(), BATTER_CLUSTER_FEATURE_COLUMNS)
        scaled = scaler.transform(df)
        pred = model.predict(scaled)[0]

        return {
            "task": "batter_cluster",
            "cluster": int(pred)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batter cluster prediction failed: {str(e)}")

@app.post("/predict/flag")
async def predict_flag(file: UploadFile = File(...)):
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Please upload a valid image file")

        model = load_flag_model()
        class_names = load_flag_class_names()

        file_bytes = await file.read()
        img = preprocess_flag_image(file_bytes)
        preds = model.predict(img, verbose=0)

        top_predictions = decode_top_k(preds, class_names, k=3)
        best = top_predictions[0]

        return {
            "task": "flag_prediction",
            "predicted_class": best["class_name"],
            "confidence": best["confidence"],
            "top_3_predictions": top_predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flag prediction failed: {str(e)}")

@app.post("/predict/audio")
async def predict_audio(file: UploadFile = File(...)):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")

        file_bytes = await file.read()

        model = load_audio_model()
        final_feature_columns = load_audio_feature_columns()

        features = extract_audio_features_from_bytes(file_bytes)
        df = make_audio_feature_df(features, final_feature_columns)

        pred = model.predict(df)[0]

        label_map = {
            0: "major",
            1: "minor",
            "major": "major",
            "minor": "minor",
        }

        probs = safe_predict_proba(model, df)

        response = {
            "task": "audio_chord_prediction",
            "raw_prediction": str(pred),
            "predicted_class": label_map.get(pred, str(pred))
        }

        if probs is not None and len(probs[0]) == 2:
            response["probabilities"] = {
                "class_0": float(probs[0][0]),
                "class_1": float(probs[0][1])
            }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio prediction failed: {str(e)}")