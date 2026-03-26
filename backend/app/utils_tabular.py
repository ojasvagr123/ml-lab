import math
import pandas as pd


def make_single_row_df(payload: dict, columns: list[str]) -> pd.DataFrame:
    row = {col: payload.get(col) for col in columns}
    return pd.DataFrame([row], columns=columns)


def safe_predict_proba(model, df):
    if hasattr(model, "predict_proba"):
        return model.predict_proba(df)
    return None


def build_house_features(payload: dict) -> pd.DataFrame:
    payload = payload.copy()

    rooms = float(payload["Rooms"])
    bathroom = float(payload["Bathroom"])
    car = float(payload["Car"])
    landsize = float(payload["Landsize"])
    sale_year = float(payload["SaleYear"])

    payload["PricePerRoomProxy"] = landsize / (rooms + 1)
    payload["BathPerRoom"] = bathroom / (rooms + 1)
    payload["CarPerRoom"] = car / (rooms + 1)
    payload["PropertyAge"] = sale_year - 2016
    payload["LogLandsize"] = math.log1p(landsize)

    ordered = {
        "Suburb": payload["Suburb"],
        "Type": payload["Type"],
        "Method": payload["Method"],
        "SellerG": payload["SellerG"],
        "CouncilArea": payload["CouncilArea"],
        "Regionname": payload["Regionname"],
        "Rooms": payload["Rooms"],
        "Distance": payload["Distance"],
        "Postcode": payload["Postcode"],
        "Bedroom2": payload["Bedroom2"],
        "Bathroom": payload["Bathroom"],
        "Car": payload["Car"],
        "Landsize": payload["Landsize"],
        "Lattitude": payload["Lattitude"],
        "Longtitude": payload["Longtitude"],
        "Propertycount": payload["Propertycount"],
        "SaleYear": payload["SaleYear"],
        "SaleMonth": payload["SaleMonth"],
        "PricePerRoomProxy": payload["PricePerRoomProxy"],
        "BathPerRoom": payload["BathPerRoom"],
        "CarPerRoom": payload["CarPerRoom"],
        "PropertyAge": payload["PropertyAge"],
        "LogLandsize": payload["LogLandsize"],
    }

    return pd.DataFrame([ordered])