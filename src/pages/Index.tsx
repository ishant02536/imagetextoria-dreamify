
import React from "react";
import Header from "@/components/Header";
import ImageGenerator from "@/components/ImageGenerator";

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="flex-1 flex flex-col">
        <ImageGenerator />
      </main>
    </div>
  );
};

export default Index;
