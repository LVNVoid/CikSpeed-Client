import { useState, useEffect } from "react";
import api from "@/services/api";

export const useSymptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterServiceType, setFilterServiceType] = useState("all");

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState(null);

  // New symptom form state
  const [newSymptomName, setNewSymptomName] = useState("");
  const [newSymptomServiceType, setNewSymptomServiceType] = useState("regular");

  const fetchSymptoms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/symptoms");
      setSymptoms(response.data.data);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat mengambil data gejala"
      );
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = async () => {
    try {
      const response = await api.post("/symptoms", {
        name: newSymptomName,
        serviceType: newSymptomServiceType,
      });

      // Add new symptom to list
      setSymptoms([...symptoms, response.data]);

      // Reset form
      setNewSymptomName("");
      setAddModalOpen(false);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat menambahkan gejala"
      );
      return false;
    }
  };

  const editSymptom = async () => {
    if (!currentSymptom) return false;

    try {
      const response = await api.put(`/symptoms/${currentSymptom.id}`, {
        name: currentSymptom.name,
        serviceType: currentSymptom.serviceType,
      });

      // Update symptoms list
      setSymptoms(
        symptoms.map((symptom) =>
          symptom.id === currentSymptom.id ? response.data : symptom
        )
      );

      // Reset edit state
      setCurrentSymptom(null);
      setEditModalOpen(false);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.error || "Terjadi kesalahan saat mengubah gejala"
      );
      return false;
    }
  };

  const deleteSymptom = async (id) => {
    try {
      await api.delete(`/symptoms/${id}`);

      // Remove symptom from list
      setSymptoms(symptoms.filter((symptom) => symptom.id !== id));
      return true;
    } catch (error) {
      setError(
        error.response?.data?.error || "Terjadi kesalahan saat menghapus gejala"
      );
      return false;
    }
  };

  const filteredSymptoms = symptoms.filter((symptom) => {
    const matchesSearch = symptom.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesServiceType =
      filterServiceType === "all" || symptom.serviceType === filterServiceType;

    return matchesSearch && matchesServiceType;
  });

  // Initialize data
  useEffect(() => {
    fetchSymptoms();
  }, []);

  const resetError = () => setError(null);

  return {
    // Data and state
    symptoms,
    filteredSymptoms,
    loading,
    error,
    searchQuery,
    filterServiceType,
    addModalOpen,
    editModalOpen,
    currentSymptom,
    newSymptomName,
    newSymptomServiceType,

    // Setters
    setSearchQuery,
    setFilterServiceType,
    setAddModalOpen,
    setEditModalOpen,
    setCurrentSymptom,
    setNewSymptomName,
    setNewSymptomServiceType,

    // Actions
    fetchSymptoms,
    addSymptom,
    editSymptom,
    deleteSymptom,
    resetError,
  };
};
