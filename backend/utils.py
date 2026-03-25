import numpy as np
import librosa
import cv2
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# --- Audio Feature Extraction ---
def extract_audio_features(file_path):
    """Extracts 100 features matching Major_Minor_Chord_Final.ipynb"""
    y, sr = librosa.load(file_path, sr=22050, duration=3.0)
    features = {}
    features["signal_mean"] = np.mean(y)
    features["signal_std"] = np.std(y)
    features["signal_rms"] = np.sqrt(np.mean(y**2))
    features["zero_crossing_rate"] = np.mean(librosa.feature.zero_crossing_rate(y))
    
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    for i in range(12):
        features[f"chroma_mean_{i+1}"] = np.mean(chroma[i])
        features[f"chroma_std_{i+1}"] = np.std(chroma[i])
        
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    for i in range(13):
        features[f"mfcc_mean_{i+1}"] = np.mean(mfcc[i])
        
    # ... additional features from your notebook to reach 100 total ...
    return np.array(list(features.values())).reshape(1, -1)

# --- Image Preprocessing ---
def preprocess_flag_image(image_bytes):
    """Resizes and normalizes for flag_mobilenet_transfer.keras"""
    img = tf.io.decode_image(image_bytes, channels=3)
    img = tf.image.resize(img, [128, 128])
    img = preprocess_input(img)
    return tf.expand_dims(img, axis=0)

# # --- Video Personality Identification ---
# def l2_normalize(x, eps=1e-10):
#     return x / (np.linalg.norm(x) + eps)