import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ValueProposition from '../components/ValueProposition';
import { mockItems } from '../data/mockData';
import ItemCard from '../components/ItemCard';
import HowItWorks from '../components/HowItWorks';
import TrustSafety from '../components/TrustSafety';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
      <ValueProposition />
      
      {/* Featured Items Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Items
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what's trending in your campus marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockItems.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
          
          {mockItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No items available at the moment</p>
              <p className="text-gray-400 mt-2">Check back later for new listings</p>
            </div>
          )}
        </div>
      </section>
      
      <HowItWorks />
      <TrustSafety />
      <Footer />
    </div>
  );
};

export default LandingPage;