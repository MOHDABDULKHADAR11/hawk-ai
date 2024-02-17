"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("e3410048-921a-4e06-b3fc-923925b0bb3b");
  }, []);

  return null;
};
