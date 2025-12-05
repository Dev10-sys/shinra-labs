import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import DatasetCard from "../components/DatasetCard";
import DatasetPreviewModal from "../components/DatasetPreviewModal";   // ⬅ IMPORTANT
import { getStoredUser } from "../authUtils";

function DatasetMarketplace() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [authUser, setAuthUser] = useState(null);
  const [previewDataset, setPreviewDataset] = useState(null); // ⬅ MODAL STATE

  // GET REAL SUPABASE USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setAuthUser(data?.user || null);
    };
    getUser();
  }, []);

  // FETCH DATASETS
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const { data, error: dsError } = await supabase
          .from("datasets")
          .select("*")
          .order("created_at", { ascending: false });

        if (dsError) throw dsError;

        setDatasets(data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load datasets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // BUY HANDLER
  const handleBuy = async (dataset) => {
    if (!authUser) {
      alert("Please sign in first.");
      return;
    }

    try {
      const { error: insertError } = await supabase.from("purchases").insert([
        {
          buyer_id: authUser.id,
          dataset_id: dataset.id,
          amount_paid: dataset.price,
        },
      ]);

      if (insertError) throw insertError;

      alert("Purchase successful. The dataset has been added to your library.");
    } catch (err) {
      console.error(err);
      alert("We could not complete this purchase. Please try again.");
    }
  };

  return (
    <section className="pt-12 space-y-5">

      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
            Dataset marketplace
          </div>
          <h2 className="text-xl font-semibold mt-1">
            Ready-made labeled datasets
          </h2>
        </div>

        <p className="max-w-md text-[11px] text-gray-400">
          Browse India-focused datasets for NLP, computer vision and analytics.
          Licensing a dataset gives your team immediate access to production-ready
          training data.
        </p>
      </div>

      {/* ================= ERROR ================= */}
      {error && <p className="text-[11px] text-red-400">{error}</p>}

      {/* ================= LOADING / EMPTY / DATA ================= */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading datasets…</p>
      ) : datasets.length === 0 ? (
        <p className="text-sm text-gray-400">
          No datasets listed yet. As creators publish work, it will appear here.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              onBuy={handleBuy}
              onPreview={() => setPreviewDataset(dataset)} // ⬅ OPEN MODAL
            />
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {previewDataset && (
        <DatasetPreviewModal
          dataset={previewDataset}
          onClose={() => setPreviewDataset(null)}
        />
      )}
    </section>
  );
}

export default DatasetMarketplace;
