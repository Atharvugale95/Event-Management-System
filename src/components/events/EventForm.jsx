import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .form-root {
    min-height: 100vh;
    background: #f8f7f4;
    font-family: 'DM Sans', sans-serif;
    padding: 2rem 1rem;
  }

  .form-wrapper {
    max-width: 580px;
    margin: 0 auto;
  }

  .form-header {
    margin-bottom: 1.75rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid #e5e2db;
  }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    color: #1a1a1a;
    margin: 0 0 4px 0;
    letter-spacing: -0.3px;
  }

  .form-subtitle {
    font-size: 13px;
    color: #999;
    margin: 0;
  }

  .form-card {
    background: #fff;
    border: 1px solid #e8e4dd;
    border-radius: 14px;
    padding: 2rem;
  }

  .field-group {
    margin-bottom: 1.25rem;
  }

  .field-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 6px;
  }

  .field-input {
    width: 100%;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    border: 1.5px solid #e5e2db;
    border-radius: 9px;
    background: #fff;
    color: #1a1a1a;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .field-input:focus { border-color: #c8a97e; }
  .field-input::placeholder { color: #bbb; }

  .field-textarea {
    width: 100%;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    border: 1.5px solid #e5e2db;
    border-radius: 9px;
    background: #fff;
    color: #1a1a1a;
    outline: none;
    box-sizing: border-box;
    resize: vertical;
    min-height: 90px;
    transition: border-color 0.2s;
  }
  .field-textarea:focus { border-color: #c8a97e; }
  .field-textarea::placeholder { color: #bbb; }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .divider {
    border: none;
    border-top: 1px solid #e8e4dd;
    margin: 1.5rem 0;
  }

  .poster-label {
    font-size: 12.5px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    display: block;
    margin-bottom: 0.75rem;
  }

  .mode-toggle {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .mode-btn {
    padding: 7px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    border-radius: 7px;
    border: 1.5px solid #e5e2db;
    cursor: pointer;
    transition: all 0.18s;
    background: #fff;
    color: #888;
  }
  .mode-btn.active {
    background: #1a1a1a;
    color: #fff;
    border-color: #1a1a1a;
  }

  .upload-zone {
    border: 2px dashed #e0dbd3;
    border-radius: 10px;
    padding: 2rem 1rem;
    text-align: center;
    background: #faf9f7;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .upload-zone:hover { border-color: #c8a97e; }

  .upload-text {
    font-size: 14px;
    color: #888;
    margin: 0 0 4px 0;
  }

  .upload-hint {
    font-size: 12px;
    color: #bbb;
    margin: 0;
  }

  .preview-wrap {
    margin-top: 1rem;
    position: relative;
  }

  .preview-label {
    font-size: 12px;
    color: #aaa;
    margin-bottom: 6px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .preview-box {
    width: 100%;
    height: 200px;
    background: #f5f5f5;
    border-radius: 10px;
    border: 1px solid #e8e4dd;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .remove-btn {
    position: absolute;
    top: 26px;
    right: 8px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #e24b4a;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-msg {
    background: #fff0f0;
    border: 1px solid #f5c6c6;
    color: #c0392b;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-top: 1rem;
  }

  .btn-row {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn-primary {
    flex: 1;
    padding: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-primary:hover { background: #333; }
  .btn-primary:disabled { background: #ccc; cursor: not-allowed; }

  .btn-cancel {
    flex: 1;
    padding: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    background: none;
    color: #888;
    border: 1.5px solid #e5e2db;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.18s;
  }
  .btn-cancel:hover { background: #f5f3ef; }
`;

function EventForm() {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", description: "", venue: "",
    date_time: "", entry_fee: 0,
    max_participants: 100, poster_url: ""
  });

  const [posterPreview, setPosterPreview] = useState("");
  const [posterMode, setPosterMode]       = useState("url");
  const [uploading, setUploading]         = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");

  const token   = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:8000/events/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setFormData({
            name:             data.name,
            description:      data.description || "",
            venue:            data.venue,
            date_time:        data.date_time,
            entry_fee:        data.entry_fee,
            max_participants: data.max_participants,
            poster_url:       data.poster_url || ""
          });
          if (data.poster_url) setPosterPreview(data.poster_url);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, poster_url: url });
    setPosterPreview(url);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPosterPreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("http://localhost:8000/upload-poster", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Upload failed");
        setPosterPreview("");
        return;
      }

      setFormData((prev) => ({ ...prev, poster_url: data.poster_url }));
      setPosterPreview(data.poster_url);

    } catch {
      setError("Cannot upload image.");
      setPosterPreview("");
    } finally {
      setUploading(false);
    }
  };

  const removePoster = () => {
    setFormData({ ...formData, poster_url: "" });
    setPosterPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url    = isEdit ? `http://localhost:8000/events/${id}` : "http://localhost:8000/events";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...formData,
          entry_fee:        parseFloat(formData.entry_fee),
          max_participants: parseInt(formData.max_participants),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Something went wrong");
        return;
      }

      alert(isEdit ? "Event updated!" : "Event created!");
      navigate(-1); // go back to wherever they came from

    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="form-root">
        <div className="form-wrapper">

          <div className="form-header">
            <h2 className="form-title">
              {isEdit ? "Edit Event" : "Create Event"}
            </h2>
            <p className="form-subtitle">
              {isEdit ? "Update your event details below" : "Fill in the details to create a new event"}
            </p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit}>

              <div className="field-group">
                <label className="field-label">Event Name *</label>
                <input
                  className="field-input"
                  name="name" value={formData.name}
                  placeholder="e.g. Sports Festival 2026"
                  onChange={handleChange} required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Description</label>
                <textarea
                  className="field-textarea"
                  name="description" value={formData.description}
                  placeholder="Describe the event..."
                  onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label className="field-label">Venue / Location *</label>
                <input
                  className="field-input"
                  name="venue" value={formData.venue}
                  placeholder="e.g. DKTE Sports Ground, Kolhapur"
                  onChange={handleChange} required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Date & Time *</label>
                <input
                  className="field-input"
                  type="datetime-local"
                  name="date_time" value={formData.date_time}
                  onChange={handleChange} required
                />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Entry Fee (INR)</label>
                  <input
                    className="field-input"
                    type="number" name="entry_fee"
                    value={formData.entry_fee} min="0" step="0.01"
                    onChange={handleChange}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Max Participants</label>
                  <input
                    className="field-input"
                    type="number" name="max_participants"
                    value={formData.max_participants} min="1"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr className="divider" />

              <span className="poster-label">Event Poster</span>

              <div className="mode-toggle">
                {["url", "upload"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`mode-btn ${posterMode === mode ? "active" : ""}`}
                    onClick={() => setPosterMode(mode)}
                  >
                    {mode === "url" ? "🔗 Paste URL" : "📁 Upload File"}
                  </button>
                ))}
              </div>

              {posterMode === "url" && (
                <div className="field-group">
                  <input
                    className="field-input"
                    type="url"
                    placeholder="https://example.com/poster.jpg"
                    value={formData.poster_url}
                    onChange={handleUrlChange}
                  />
                </div>
              )}

              {posterMode === "upload" && (
                <div className="upload-zone">
                  <input
                    type="file" accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    id="poster-upload"
                  />
                  <label htmlFor="poster-upload" style={{ cursor: "pointer" }}>
                    <p className="upload-text">
                      {uploading ? "⏳ Uploading..." : "📁 Click to choose image"}
                    </p>
                    <p className="upload-hint">JPG, PNG, WEBP or GIF supported</p>
                  </label>
                </div>
              )}

              {posterPreview && (
                <div className="preview-wrap">
                  <span className="preview-label">Preview</span>
                  <div className="preview-box">
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      onError={() => setPosterPreview("")}
                    />
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={removePoster}
                  >✕</button>
                </div>
              )}

              {error && <div className="error-msg">⚠️ {error}</div>}

              <div className="btn-row">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || uploading}
                >
                  {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventForm;