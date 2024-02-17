import Navbar from "@/components/navbar";
import React from "react";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimit = await getApiLimitCount();
  return (
    <div className="h-full relative">
      <div
        className="hidden h-full md:flex md:w-72
            md:flex-col md:fixed md:inset-y-0 bg-gray-900"
      >
        <Sidebar apiLimitCount={apiLimit} />
      </div>
      <main className="md:pl-72">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
