"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EcommerceSection from "../components/EcommerceSection";
import PrototypingSection from "../components/PrototypingSection";
import PrintingSection from "../components/PrintingSection";
import { Store, Compass, Box } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("ecommerce");

  const tabs = [
    {
      id: "ecommerce",
      name: "E-commerce",
      icon: Store,
      component: EcommerceSection
    },
    {
      id: "prototyping",
      name: "Prototyping Services",
      icon: Compass,
      component: PrototypingSection
    },
    {
      id: "printing",
      name: "3D Printing",
      icon: Box,
      component: PrintingSection
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || EcommerceSection;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="inline-block mr-2 h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="animate-slide-in">
          <ActiveComponent />
        </div>
      </main>

      <Footer />
    </div>
  );
}