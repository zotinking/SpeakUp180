(() => {
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtbm1lZG94cWhpeXp3bXZ5aGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDE3NjQsImV4cCI6MjA5NTU3Nzc2NH0.AmhG2WKv3PDqoft95Oojz32adZAt0nbDa4wEu9aHiWw";
  if (typeof headers === "function") {
    headers = (extra = {}) => ({
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...extra
    });
  }
  if (typeof supabase === "function") {
    supabase = async (path, options = {}) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        ...options,
        headers: headers(options.headers || {})
      });
      if (!res.ok) throw new Error((await res.text()) || `Supabase ${res.status}`);
      if (res.status === 204) return null;
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    };
  }
})();
