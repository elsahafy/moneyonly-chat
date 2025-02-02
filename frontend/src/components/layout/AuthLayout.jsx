import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-gray-900 dark:text-gray-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
