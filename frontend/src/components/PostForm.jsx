import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import StepIndicator from './StepIndicator';
import ImageUploader from './ImageUploader';
import PriceGuide from './PriceGuide';
import PreviewCard from './PreviewCard';
import { profanityWords, safetyTips } from '../data/postItemData';

// Validation schemas for each step
const stepSchemas = [
  // Step 1: Basic Details
  yup.object({
    title: yup
      .string()
      .min(5, 'Title must be at least 5 characters')
      .required('Title is required')
      .test('no-profanity', 'Please use appropriate language', (value) => {
        if (!value) return true;
        const lowerValue = value.toLowerCase();
        return !profanityWords.some(word => lowerValue.includes(word));
      }),
    category: yup
      .string()
      .required('Category is required'),
    condition: yup
      .string()
      .required('Condition is required'),
    description: yup
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters')
      .required('Description is required')
      .test('no-phone', 'Please do not include phone numbers', (value) => {
        if (!value) return true;
        return !/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(value);
      })
      .test('no-profanity', 'Please use appropriate language', (value) => {
        if (!value) return true;
        const lowerValue = value.toLowerCase();
        return !profanityWords.some(word => lowerValue.includes(word));
      })
  }),
  
  // Step 2: Price
  yup.object({
    price: yup
      .number()
      .min(1, 'Price must be greater than 0')
      .required('Price is required')
      .typeError('Price must be a number')
  }),
  
  // Step 3: Images
  yup.object({
    // Images validation handled separately
  }),
  
  // Step 4: Review
  yup.object({
    // Final validation
  })
];

const PostForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  
  const steps = ['Details', 'Price', 'Images', 'Review'];
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(stepSchemas[currentStep - 1]),
    mode: 'onChange'
  });
  
  // Watch form values
  const formData = watch();
  
  // Auto-save to session storage
  useEffect(() => {
    const savedData = {
      formData,
      images: images.map(img => ({ id: img.id, name: img.name })),
      step: currentStep
    };
    sessionStorage.setItem('postItemDraft', JSON.stringify(savedData));
  }, [formData, images, currentStep]);
  
  // Load draft on mount
  useEffect(() => {
    const savedDraft = sessionStorage.getItem('postItemDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // Restore form data and step
        Object.keys(draft.formData).forEach(key => {
          setValue(key, draft.formData[key]);
        });
        setCurrentStep(draft.step || 1);
        // Note: Images can't be restored due to file security restrictions
      } catch (e) {
        console.log('Could not restore draft');
      }
    }
  }, [setValue]);
  
  // Check for duplicate titles
  useEffect(() => {
    if (formData.title && formData.title.length > 3) {
      // Simulate API check for similar titles
      const similarTitles = [
        'Calculus Textbook',
        'MacBook Air',
        'Winter Jacket',
        'Study Desk Lamp'
      ];
      
      const isSimilar = similarTitles.some(title => 
        formData.title.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(formData.title.toLowerCase())
      );
      
      setShowDuplicateWarning(isSimilar);
    } else {
      setShowDuplicateWarning(false);
    }
  }, [formData.title]);
  
  const nextStep = async () => {
    if (currentStep < 4) {
      const isValid = await trigger();
      if (isValid) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handlePriceSuggestion = (suggestedPrice) => {
    setValue('price', suggestedPrice);
    trigger('price');
  };
  
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      toast.success('Item sent for admin approval!', {
        icon: <FaCheck className="text-green-500" />
      });
      
      // Clear draft
      sessionStorage.removeItem('postItemDraft');
      
      // Navigate to activity page
      setTimeout(() => {
        navigate('/activity');
      }, 1500);
      
    } catch (error) {
      toast.error('Failed to submit item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Item Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Title *
              </label>
              <input
                {...register('title')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter item title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FaExclamationTriangle className="mr-1" size={14} /> {errors.title.message}
                </p>
              )}
              {showDuplicateWarning && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700 flex items-center">
                    <FaExclamationTriangle className="mr-2" /> A similar item may already be posted
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  <option value="Textbooks">Textbooks</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Lab">Lab Equipment</option>
                  <option value="Hostel">Hostel Items</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  {...register('condition')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.condition ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Describe your item in detail..."
              />
              <div className="flex justify-between mt-1">
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="mr-1" size={14} /> {errors.description.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 text-right">
                  {formData.description?.length || 0}/500 characters
                </p>
              </div>
            </div>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Set Price</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('price')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-bold ${
                      errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="1"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FaExclamationTriangle className="mr-1" size={14} /> {errors.price.message}
                    </p>
                  )}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    💡 Most items in this category sell between ₹200–₹350
                  </p>
                </div>
              </div>
              
              <div>
                <PriceGuide 
                  category={formData.category || 'Textbooks'}
                  price={formData.price || 0}
                  onPriceSuggestion={handlePriceSuggestion}
                />
              </div>
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Add Images</h2>
            <p className="text-gray-600">Upload clear photos of your item (max 3 images, 200KB each)</p>
            
            <ImageUploader 
              images={images} 
              onImagesChange={setImages}
              maxImages={3}
            />
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-gray-800">Review & Submit</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Item Preview</h3>
                  <PreviewCard formData={formData} images={images} />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Item Details</h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-medium">Title:</span> {formData.title}</div>
                    <div><span className="font-medium">Category:</span> {formData.category}</div>
                    <div><span className="font-medium">Condition:</span> {formData.condition}</div>
                    <div><span className="font-medium">Price:</span> ₹{formData.price}</div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="mt-1 text-gray-600">{formData.description}</p>
                    </div>
                    <div><span className="font-medium">Images:</span> {images.length} uploaded</div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                    <FaExclamationTriangle className="mr-2" /> Safety Reminders
                  </h3>
                  <ul className="space-y-2 text-yellow-700 text-sm">
                    {safetyTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-3xl font-bold">Post New Item</h1>
            <p className="text-blue-100 mt-2">List your item in under 60 seconds</p>
          </div>
          
          {/* Step Indicator */}
          <div className="p-6 border-b border-gray-200">
            <StepIndicator 
              currentStep={currentStep} 
              steps={steps}
              onStepClick={setCurrentStep}
            />
          </div>
          
          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaArrowLeft className="mr-2" /> Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || images.length === 0}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    isSubmitting || images.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" /> Submit for Review
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;