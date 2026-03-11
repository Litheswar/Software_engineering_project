import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, CheckCircle, AlertCircle, ChevronDown, Info
} from 'lucide-react';
import { mockCategories, mockConditions } from '../../data/mockData';
import { formatPrice } from '../../utils/helpers';

const PRICE_SUGGESTIONS = {
  Books: '₹100 – ₹500 is the typical range for used books.',
  Electronics: '₹500 – ₹3000 is common for used electronics.',
  Stationery: '₹50 – ₹300 for most stationery items.',
  Tools: '₹300 – ₹1500 for lab tools.',
  Notes: '₹50 – ₹200 for handwritten notes.',
  Others: 'Set a fair price for your item.',
};

const STEPS = ['Item Info', 'Pricing', 'Images', 'Review'];

const PostItem = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '',
    category: '',
    condition: '',
    price: '',
    description: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.title.trim()) e.title = 'Title is required';
      else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters';
      if (!form.category) e.category = 'Please select a category';
      if (!form.condition) e.condition = 'Please select condition';
    } else if (step === 1) {
      if (!form.price) e.price = 'Price is required';
      else if (Number(form.price) < 1) e.price = 'Price must be at least ₹1';
      if (!form.description.trim()) e.description = 'Description is required';
      else if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters';
    }
    return e;
  };

  const handleNext = () => {
    const v = validateStep();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-container pt-16 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-white rounded-3xl p-12 shadow-card text-center max-w-sm w-full mx-4"
        >
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-secondary" />
          </div>
          <h2 className="font-heading font-bold text-xl text-textDark mb-2">Item Submitted!</h2>
          <p className="text-textMuted text-sm mb-6">
            Your item has been submitted for admin approval. It will appear on the marketplace once approved.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-6 flex items-start gap-2">
            <Info size={16} className="flex-shrink-0 mt-0.5" />
            Approval usually takes within 24 hours.
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setForm({ title: '', category: '', condition: '', price: '', description: '', image: null });
            }}
            className="btn-outline w-full"
          >
            Post Another Item
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-h2 text-textDark">Post an Item</h1>
          <p className="text-textMuted mt-1">List your item for campus students to discover</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i < step
                    ? 'bg-secondary text-white'
                    : i === step
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-gray-100 text-textMuted'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${i === step ? 'text-primary' : 'text-textMuted'}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors duration-300 ${i < step ? 'bg-secondary' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 border border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >

              {/* Step 0: Item Info */}
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="font-heading font-semibold text-lg text-textDark mb-4">Item Information</h2>

                  <div>
                    <label htmlFor="post-title" className="block text-sm font-medium text-textDark mb-1.5">
                      Item Title <span className="text-danger">*</span>
                    </label>
                    <input
                      id="post-title"
                      type="text"
                      placeholder="e.g. Engineering Maths Book 3rd Edition"
                      value={form.title}
                      onChange={handleChange('title')}
                      className={`input-field ${errors.title ? 'border-danger ring-2 ring-danger/20' : ''}`}
                    />
                    {errors.title && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.title}</p>}
                  </div>

                  <div>
                    <label htmlFor="post-category" className="block text-sm font-medium text-textDark mb-1.5">
                      Category <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="post-category"
                        value={form.category}
                        onChange={handleChange('category')}
                        className={`input-field appearance-none pr-10 ${errors.category ? 'border-danger ring-2 ring-danger/20' : ''}`}
                      >
                        <option value="">Select a category</option>
                        {mockCategories.filter((c) => c.id !== 'all').map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                    </div>
                    {errors.category && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textDark mb-2">
                      Condition <span className="text-danger">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {mockConditions.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setForm({ ...form, condition: c }); setErrors({ ...errors, condition: '' }); }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                            form.condition === c
                              ? 'bg-primary text-white border-primary shadow-md'
                              : 'border-gray-200 text-textDark hover:border-primary hover:text-primary'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    {errors.condition && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.condition}</p>}
                  </div>
                </div>
              )}

              {/* Step 1: Pricing */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-heading font-semibold text-lg text-textDark mb-4">Pricing &amp; Description</h2>

                  <div>
                    <label htmlFor="post-price" className="block text-sm font-medium text-textDark mb-1.5">
                      Price (₹) <span className="text-danger">*</span>
                    </label>
                    <input
                      id="post-price"
                      type="number"
                      placeholder="e.g. 350"
                      min={1}
                      value={form.price}
                      onChange={handleChange('price')}
                      className={`input-field ${errors.price ? 'border-danger ring-2 ring-danger/20' : ''}`}
                    />
                    {form.price && (
                      <p className="text-sm text-secondary font-medium mt-1">
                        Listed at: {formatPrice(form.price)}
                      </p>
                    )}
                    {errors.price && <p className="text-danger text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} />{errors.price}</p>}

                    {form.category && PRICE_SUGGESTIONS[form.category] && (
                      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-primary flex items-center gap-2">
                        <Info size={13} />
                        {PRICE_SUGGESTIONS[form.category]}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="post-description" className="block text-sm font-medium text-textDark mb-1.5">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="post-description"
                      rows={5}
                      placeholder="Describe your item — condition details, edition, any missing parts, reason for selling..."
                      value={form.description}
                      onChange={handleChange('description')}
                      className={`input-field resize-none ${errors.description ? 'border-danger ring-2 ring-danger/20' : ''}`}
                    />
                    <p className="text-xs text-textMuted mt-1 text-right">{form.description.length} chars</p>
                    {errors.description && <p className="text-danger text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.description}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Images */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-heading font-semibold text-lg text-textDark mb-4">Add Images</h2>
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload size={24} className="text-primary" />
                    </div>
                    <p className="font-medium text-textDark">Upload Photos</p>
                    <p className="text-sm text-textMuted text-center">Drag &amp; drop or click to select (JPEG, PNG, up to 5MB)</p>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                    />
                  </div>
                  {form.image && (
                    <p className="text-sm text-secondary flex items-center gap-2">
                      <CheckCircle size={16} />
                      {form.image.name} selected
                    </p>
                  )}
                  <p className="text-xs text-textMuted bg-gray-50 rounded-lg px-4 py-3">
                    📸 Items with photos get <strong>3x more responses</strong>. Add at least one clear photo.
                  </p>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-heading font-semibold text-lg text-textDark mb-4">Review &amp; Submit</h2>
                  <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                    {[
                      { label: 'Title', value: form.title },
                      { label: 'Category', value: form.category },
                      { label: 'Condition', value: form.condition },
                      { label: 'Price', value: formatPrice(form.price) },
                      { label: 'Image', value: form.image ? form.image.name : 'None (category icon will be used)' },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between gap-4">
                        <span className="text-textMuted font-medium">{row.label}</span>
                        <span className="text-textDark font-semibold text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-textMuted">
                    {form.description}
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-start gap-2">
                    <Info size={14} className="flex-shrink-0 mt-0.5" />
                    Your item will be reviewed by admins before going live. This typically takes less than 24 hours.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="btn-primary"
              >
                Next →
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="btn-secondary flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
                ) : (
                  <><CheckCircle size={16} />Submit Item</>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
