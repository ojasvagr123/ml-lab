import numpy as np
import pandas as pd
import librosa

def extract_audio_features_from_bytes(file_bytes: bytes, target_sr: int = 22050):
    import soundfile as sf
    from io import BytesIO

    audio_buffer = BytesIO(file_bytes)
    y, sr = sf.read(audio_buffer)

    if len(y.shape) > 1:
        y = np.mean(y, axis=1)

    if sr != target_sr:
        y = librosa.resample(y.astype(np.float32), orig_sr=sr, target_sr=target_sr)
        sr = target_sr

    y = y.astype(np.float32)

    features = {}

    # basic signal stats
    features["signal_mean"] = float(np.mean(y))
    features["signal_std"] = float(np.std(y))
    features["signal_max"] = float(np.max(y))
    features["signal_min"] = float(np.min(y))
    features["signal_rms"] = float(np.sqrt(np.mean(y ** 2)))
    features["zero_crossing_rate"] = float(np.mean(librosa.feature.zero_crossing_rate(y)))

    # chroma
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    for i in range(chroma.shape[0]):
        features[f"chroma_mean_{i+1}"] = float(np.mean(chroma[i]))
        features[f"chroma_std_{i+1}"] = float(np.std(chroma[i]))

    # intervals between strongest chroma bins
    chroma_avg = np.mean(chroma, axis=1)
    top_indices = np.argsort(chroma_avg)[::-1][:6]
    top_indices_sorted = np.sort(top_indices)

    for i in range(len(top_indices_sorted) - 1):
        interval = int((top_indices_sorted[i + 1] - top_indices_sorted[i]) % 12)
        features[f"interval_{i+1}"] = interval

    for i in range(len(top_indices) - 1):
        interval = int((top_indices[i] - top_indices[i + 1]) % 12)
        features[f"interval_{i+1}_1"] = interval

    # mfcc
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    for i in range(mfcc.shape[0]):
        features[f"mfcc_mean_{i+1}"] = float(np.mean(mfcc[i]))
        features[f"mfcc_std_{i+1}"] = float(np.std(mfcc[i]))

    # spectral contrast
    spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    for i in range(spectral_contrast.shape[0]):
        features[f"spectral_contrast_mean_{i+1}"] = float(np.mean(spectral_contrast[i]))
        features[f"spectral_contrast_std_{i+1}"] = float(np.std(spectral_contrast[i]))

    # tonnetz
    y_harmonic = librosa.effects.harmonic(y)
    tonnetz = librosa.feature.tonnetz(y=y_harmonic, sr=sr)
    for i in range(tonnetz.shape[0]):
        features[f"tonnetz_mean_{i+1}"] = float(np.mean(tonnetz[i]))
        features[f"tonnetz_std_{i+1}"] = float(np.std(tonnetz[i]))

    # spectral centroid and bandwidth
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    features["spectral_centroid_mean"] = float(np.mean(spectral_centroid))
    features["spectral_centroid_std"] = float(np.std(spectral_centroid))
    features["spectral_bandwidth_mean"] = float(np.mean(spectral_bandwidth))
    features["spectral_bandwidth_std"] = float(np.std(spectral_bandwidth))

    # rolloff
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    features["rolloff_mean"] = float(np.mean(rolloff))
    features["rolloff_std"] = float(np.std(rolloff))

    # rms via librosa
    rms = librosa.feature.rms(y=y)
    features["rms_mean"] = float(np.mean(rms))
    features["rms_std"] = float(np.std(rms))

    return features

def make_audio_feature_df(features: dict, final_feature_columns: list[str]) -> pd.DataFrame:
    row = {}
    for col in final_feature_columns:
        row[col] = features.get(col, 0.0)
    return pd.DataFrame([row], columns=final_feature_columns)