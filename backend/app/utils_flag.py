import numpy as np
from PIL import Image
from io import BytesIO
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

def preprocess_flag_image(file_bytes: bytes):
    img = Image.open(BytesIO(file_bytes)).convert("RGB")
    img = img.resize((128, 128))
    arr = np.array(img, dtype=np.float32)
    arr = preprocess_input(arr)
    arr = np.expand_dims(arr, axis=0)
    return arr

def decode_top_k(preds, class_names, k=3):
    scores = preds[0]
    top_indices = np.argsort(scores)[::-1][:k]
    results = []
    for idx in top_indices:
        results.append({
            "class_name": class_names[idx],
            "confidence": float(scores[idx])
        })
    return results