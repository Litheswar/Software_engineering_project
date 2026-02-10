import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaCheck, FaTimes, FaEye, FaFilter } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useActivityStore from '../store/activityStore';
import ConfirmModal from './ConfirmModal';

const MyListings = () => {
  const { userListings, updateListingStatus, deleteListing } = useActivityStore();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, listingId: null });
  const [selectedListing, setSelectedListing] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SOLD': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <FaCheck className="text-green-600" />;
      case 'PENDING': return <FaEye className="text-yellow-600" />;
      case 'SOLD': return <FaCheck className="text-gray-600" />;
      default: return <FaEye className="text-gray-600" />;
    }
  };

  const filteredListings = statusFilter === 'ALL' 
    ? userListings 
    : userListings.filter(listing => listing.status === statusFilter);

  const handleMarkAsSold = (listingId) => {
    updateListingStatus(listingId, 'SOLD');
    toast.success('Item marked as sold!');
  };

  const handleDelete = (listingId) => {
    deleteListing(listingId);
    setDeleteModal({ isOpen: false, listingId: null });
    toast.success('Item deleted successfully!');
  };

  const openDeleteModal = (listingId) => {
    setDeleteModal({ isOpen: true, listingId });
  };

  if (userListings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No listings yet</h3>
        <p className="text-gray-600 mb-6">You haven't posted anything</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Post Your First Item
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">My Listings</h3>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(listing.status)}`}>
                {getStatusIcon(listing.status)}
                {listing.status}
              </div>
              <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                <FaEye className="inline mr-1" />
                {listing.views}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{listing.title}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-blue-600">₹{listing.price}</span>
                <span className="text-sm text-gray-500">{listing.condition}</span>
              </div>

              <div className="flex gap-2">
                {listing.status !== 'SOLD' && (
                  <>
                    <button className="flex-1 py-2 px-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <FaEdit className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleMarkAsSold(listing.id)}
                      className="flex-1 py-2 px-3 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <FaCheck className="inline mr-1" />
                      Mark Sold
                    </button>
                  </>
                )}
                <button
                  onClick={() => openDeleteModal(listing.id)}
                  className="py-2 px-3 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FaTimes className="inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State for Filtered Results */}
      {filteredListings.length === 0 && statusFilter !== 'ALL' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No items found</h3>
          <p className="text-gray-600">No items match your filter criteria</p>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, listingId: null })}
        onConfirm={() => handleDelete(deleteModal.listingId)}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default MyListings;