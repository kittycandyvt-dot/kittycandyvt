import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VoiceActing() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/spicy", { replace: true });
  }, [navigate]);
  return null;
}