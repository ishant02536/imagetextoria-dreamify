
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-8 border-b bg-secondary/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
                <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-medium tracking-tight">Visora AI</h1>
            <p className="text-sm text-muted-foreground">
              Transform text into beautiful imagery
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
