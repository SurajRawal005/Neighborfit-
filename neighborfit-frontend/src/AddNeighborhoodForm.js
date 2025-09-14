import React, { useState } from 'react';

const AddNeighborhoodForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (inputTag.trim() && !tags.includes(inputTag.trim())) {
      setTags([...tags, inputTag.trim()]);
      setInputTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !city) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    const newNeighborhood = {
      name,
      city,
      lifestyleTags: tags,
      avgRent: 15000, // Example default
      crimeRate: 0.1  // Example default
    };

    try {
      const response = await fetch('http://localhost:5000/api/neighborhoods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNeighborhood),
      });

      if (!response.ok) throw new Error('Failed to add neighborhood');

      const addedHood = await response.json();
      onAdd(addedHood);

      setName('');
      setCity('');
      setTags([]);
      setMessage({ type: 'success', text: 'Neighborhood added successfully!' });

    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 max-w-xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-4 rounded-t-xl shadow-lg">
        <h2 className="text-2xl font-bold">Add a New Neighborhood</h2>
        <p className="text-sm opacity-90">Fill out the details below</p>
      </div>

      <div className="bg-white p-6 rounded-b-xl shadow-lg">
        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                !name && message?.type === 'error' ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">City *</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                !city && message?.type === 'error' ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Lifestyle Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. quiet, nightlife"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading ? 'Adding...' : 'Add Neighborhood'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNeighborhoodForm;
