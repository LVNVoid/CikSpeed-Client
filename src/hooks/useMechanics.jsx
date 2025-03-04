import api from "@/services/api";
import { useEffect, useState } from "react";

const useMechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMechanics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/mechanics");
      setMechanics(response.data);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat mengambil data mekanik"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  return { mechanics, loading, error, fetchMechanics, setMechanics };
};

export default useMechanics;
