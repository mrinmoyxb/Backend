"use client";
import React, { useState } from 'react';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

  let mime = "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const filename = e.target.files[0];
    const mime = filename.type.split("/")[1];
    console.log("file: ", filename);
    console.log("extension: ", mime);
    setFormData({ ...formData, 
      image: e.target.files[0]
    });

    const response = await fetch("http://localhost:3200/api/get-presigned-url", {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        filename,
        mime
      })
    })

    if(!response){
      console.log("Error fetching presigned URL");
      return;
    }

    const data = await response.json()
    console.log("Data from S3: ", data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product Data:', formData);
    // Add your submission logic here
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100 text-black">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Premium Wireless Headphones"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the key features..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          ></textarea>
        </div>

        {/* Price & Category Grid */}
        <div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition cursor-pointer">
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center py-1">
                <span className="text-xs text-gray-500">
                  {formData.image ? formData.image.name : "Click to upload"}
                </span>
              </div>
            </div>
          </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg transform active:scale-[0.98]"
        >
          Publish Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;