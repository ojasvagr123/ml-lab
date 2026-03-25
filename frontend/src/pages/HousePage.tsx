import { useState } from "react";
import FormField from "../components/FormField";
import ResultBox from "../components/ResultBox";
import Loader from "../components/Loader";
import api from "../services/api";

export default function HousePage() {
  const [form, setForm] = useState({
    Rooms: "",
    Distance: "",
    Postcode: "",
    Bedroom2: "",
    Bathroom: "",
    Car: "",
    Landsize: "",
    Lattitude: "",
    Longtitude: "",
    Propertycount: "",
    SaleYear: "",
    SaleMonth: "",
    Suburb: "",
    Type: "",
    Method: "",
    SellerG: "",
    CouncilArea: "",
    Regionname: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    setForm({
      Rooms: "",
      Distance: "",
      Postcode: "",
      Bedroom2: "",
      Bathroom: "",
      Car: "",
      Landsize: "",
      Lattitude: "",
      Longtitude: "",
      Propertycount: "",
      SaleYear: "",
      SaleMonth: "",
      Suburb: "",
      Type: "",
      Method: "",
      SellerG: "",
      CouncilArea: "",
      Regionname: "",
    });
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/predict/house", form);
      setResult(response.data);
    } catch (error: any) {
      setResult({ error: error?.response?.data || "Prediction failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <h1 className="page-title">House Price Prediction</h1>
        <p className="page-subtitle">
          Fill in the property details below and get a clean price estimate from your trained model.
        </p>
      </section>

      <div className="section-shell">
        <div className="glass-panel">
          <h2 className="panel-title">Property Details</h2>
          <p className="panel-subtitle">
            Add the property and location information to generate the prediction.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormField label="Suburb" name="Suburb" value={form.Suburb} onChange={handleChange} />
              <FormField label="Type" name="Type" value={form.Type} onChange={handleChange} />
              <FormField label="Method" name="Method" value={form.Method} onChange={handleChange} />
              <FormField label="SellerG" name="SellerG" value={form.SellerG} onChange={handleChange} />
              <FormField label="Council Area" name="CouncilArea" value={form.CouncilArea} onChange={handleChange} />
              <FormField label="Region Name" name="Regionname" value={form.Regionname} onChange={handleChange} />

              <FormField label="Rooms" name="Rooms" type="number" value={form.Rooms} onChange={handleChange} />
              <FormField label="Distance" name="Distance" type="number" value={form.Distance} onChange={handleChange} />
              <FormField label="Postcode" name="Postcode" type="number" value={form.Postcode} onChange={handleChange} />
              <FormField label="Bedroom2" name="Bedroom2" type="number" value={form.Bedroom2} onChange={handleChange} />
              <FormField label="Bathroom" name="Bathroom" type="number" value={form.Bathroom} onChange={handleChange} />
              <FormField label="Car" name="Car" type="number" value={form.Car} onChange={handleChange} />
              <FormField label="Landsize" name="Landsize" type="number" value={form.Landsize} onChange={handleChange} />
              <FormField label="Latitude" name="Lattitude" type="number" value={form.Lattitude} onChange={handleChange} />
              <FormField label="Longitude" name="Longtitude" type="number" value={form.Longtitude} onChange={handleChange} />
              <FormField label="Property Count" name="Propertycount" type="number" value={form.Propertycount} onChange={handleChange} />
              <FormField label="Sale Year" name="SaleYear" type="number" value={form.SaleYear} onChange={handleChange} />
              <FormField label="Sale Month" name="SaleMonth" type="number" value={form.SaleMonth} onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button className="primary-btn" type="submit">Predict Price</button>
              <button className="secondary-btn" type="button" onClick={handleReset}>Reset</button>
            </div>
          </form>

          {loading && <div style={{ marginTop: "18px" }}><Loader /></div>}
        </div>

        <ResultBox title="Prediction Output" result={result} />
      </div>
    </div>
  );
}