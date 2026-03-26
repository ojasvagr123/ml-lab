import json
import joblib
import tensorflow as tf
from functools import lru_cache

from .config import (
    HOUSE_MODEL_PATH,
    WICKET_MODEL_PATH,
    WIN_PROB_MODEL_PATH,
    BATTER_SCALER_PATH,
    BATTER_CLUSTER_MODEL_PATH,
    FLAG_MODEL_PATH,
    FLAG_CLASS_NAMES_PATH,
    AUDIO_MODEL_PATH,
    AUDIO_FEATURE_COLUMNS_PATH,
)


@lru_cache
def load_house_model():
    return joblib.load(HOUSE_MODEL_PATH)


@lru_cache
def load_wicket_model():
    return joblib.load(WICKET_MODEL_PATH)


@lru_cache
def load_win_prob_model():
    return joblib.load(WIN_PROB_MODEL_PATH)


@lru_cache
def load_batter_scaler():
    return joblib.load(BATTER_SCALER_PATH)


@lru_cache
def load_batter_cluster_model():
    return joblib.load(BATTER_CLUSTER_MODEL_PATH)


@lru_cache
def load_flag_model():
    return tf.keras.models.load_model(FLAG_MODEL_PATH)


@lru_cache
def load_flag_class_names():
    with open(FLAG_CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@lru_cache
def load_audio_model():
    return joblib.load(AUDIO_MODEL_PATH)


@lru_cache
def load_audio_feature_columns():
    return joblib.load(AUDIO_FEATURE_COLUMNS_PATH)