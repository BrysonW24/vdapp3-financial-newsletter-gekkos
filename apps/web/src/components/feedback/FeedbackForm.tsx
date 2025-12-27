'use client'

import { useState } from 'react'

interface FeedbackData {
  name: string
  email: string
  category: 'bug' | 'feature' | 'improvement' | 'other'
  message: string
}

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackData>({
    name: '',
    email: '',
    category: 'improvement',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        category: 'improvement',
        message: '',
      })

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {submitted && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-green-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <strong>Thank you for your feedback!</strong>
              <p className="text-sm mt-1">
                We appreciate your input and will use it to improve Gekkos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Form */}
      {!submitted && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
            />

            {/* Category */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none col-span-1 md:col-span-1"
            >
              <option value="bug">🐛 Bug Report</option>
              <option value="feature">✨ Feature Request</option>
              <option value="improvement">💡 Improvement Suggestion</option>
              <option value="other">📝 Other</option>
            </select>
          </div>

          {/* Message */}
          <textarea
            name="message"
            placeholder="Your feedback or suggestion..."
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-gecko-500 focus:outline-none"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gecko-500 hover:bg-gecko-600 disabled:bg-gecko-300 text-white font-bold rounded-lg transition-colors duration-200"
          >
            {loading ? '📤 Sending...' : '📤 Submit Feedback'}
          </button>
        </form>
      )}
    </div>
  )
}
