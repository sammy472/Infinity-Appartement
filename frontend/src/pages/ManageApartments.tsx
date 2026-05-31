import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface Apartment {
  id: string;
  title: string;
  slug: string;
  price: number | string;
  roomCount: number;
  bathrooms: number;
  squareFootage?: number;
  available: boolean;
  featured: boolean;
  images?: { id?: string; url: string; isPrimary?: boolean; order?: number }[];
}

const ManageApartments = () => {
  const { theme } = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const apartmentsQuery = useQuery({
    queryKey: ['apartments', 'all'],
    queryFn: () => api.request('/apartments', {}, token),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.request(`/apartments/${id}`, { method: 'DELETE' }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartments', 'all'] });
    },
  });

  const apartments = apartmentsQuery.data?.data?.items || [];
  const loading = apartmentsQuery.isLoading;
  const error = apartmentsQuery.error?.message || null;
  const deletingId = deleteMutation.isPending ? deleteMutation.variables : null;

  const deleteApartment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this apartment?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete apartment');
    }
  };

  if (loading) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-amber-400 text-2xl">Loading apartments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-red-400 text-2xl">{error}</div>
      </div>
    );
  }

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <Helmet>
        <title>Manage Apartments - Infinity Appartements</title>
      </Helmet>
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <p className="text-amber-400 tracking-[0.2em] mb-2 uppercase text-sm">Admin Dashboard</p>
              <h1 className="text-4xl font-bold">Manage Apartments</h1>
            </div>
            <div className="flex gap-4">
              <Link to="/dashboard" className={`px-5 py-2.5 border hover:border-amber-500/50 rounded-sm transition-all ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}>Back to Dashboard</Link>
              <button onClick={() => navigate('/admin/apartments/create')} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all">
                Add New Apartment
              </button>
            </div>
          </div>
        </FadeIn>

        {apartments.length === 0 ? (
          <div className={`text-center py-20 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No apartments yet. Create your first one!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt: Apartment, i: number) => (
              <FadeIn key={apt.id} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }} className={`backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{apt.title}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {apt.roomCount} Bed{apt.roomCount > 1 ? 's' : ''} · {apt.bathrooms} Bath{apt.bathrooms > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-sm text-xs font-bold ${
                      apt.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {apt.available ? 'Available' : 'Rented'}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-amber-400 mb-4">
                    ${typeof apt.price === 'string' ? parseFloat(apt.price).toLocaleString() : apt.price.toLocaleString()}/mo
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/admin/apartments/edit/${apt.id}`} className={`flex-1 px-4 py-2 text-center border hover:border-amber-500/50 rounded-sm text-sm transition-all ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}>
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteApartment(apt.id)}
                      disabled={deletingId === apt.id}
                      className="px-4 py-2 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-sm text-sm transition-all disabled:opacity-50"
                    >
                      {deletingId === apt.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const CreateEditApartment = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const { theme } = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    roomCount: '',
    bathrooms: '',
    squareFootage: '',
    furnished: false,
    available: true,
    featured: false,
    location: '',
  });
  // For existing images, we store their URL and a flag
  const [existingImages, setExistingImages] = useState<{ id?: string; url: string }[]>([]);
  // For new image files selected but not yet uploaded
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  // For previewing new images
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const hasLoadedData = useRef(false);

  const apartmentQuery = useQuery({
    queryKey: ['apartment', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/apartments/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch apartment');
      return response.json();
    },
    enabled: isEdit && !!id && !!token,
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${API_BASE}/apartments${isEdit ? `/${id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Request failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartments', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['apartment', id] });
      navigate('/admin/apartments');
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : 'Failed to save apartment');
    },
  });

  // Load apartment data when in edit mode and data is available (only once)
  useEffect(() => {
    if (isEdit && apartmentQuery.data?.data && !hasLoadedData.current) {
      const apt = apartmentQuery.data.data;
      setFormData({
        title: apt.title || '',
        slug: apt.slug || '',
        description: apt.description || '',
        price: apt.price?.toString() || '',
        roomCount: apt.roomCount?.toString() || '',
        bathrooms: apt.bathrooms?.toString() || '',
        squareFootage: apt.squareFootage?.toString() || '',
        furnished: apt.furnished || false,
        available: apt.available || true,
        featured: apt.featured || false,
        location: apt.location || '',
      });
      setExistingImages(apt.images || []);
      hasLoadedData.current = true;
    }
  }, [isEdit, apartmentQuery.data?.data]);

  const handleNewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImageFiles.length + files.length;
    if (totalImages > 5) {
      alert('You can only have a maximum of 5 images');
      return;
    }
    // Add new files
    const newFiles = [...newImageFiles, ...files];
    setNewImageFiles(newFiles);
    // Create preview URLs
    const previews = [...newImagePreviews];
    files.forEach(file => {
      previews.push(URL.createObjectURL(file));
    });
    setNewImagePreviews(previews);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        formDataToSend.append(key, value.toString());
      } else if (value !== undefined && value !== null) {
        formDataToSend.append(key, value.toString());
      }
    });

    // Add existing images' URLs as a field
    existingImages.forEach((img) => {
      formDataToSend.append('existingImages', img.url);
    });

    // Add new image files
    newImageFiles.forEach(file => {
      formDataToSend.append('images', file);
    });

    await mutation.mutateAsync(formDataToSend);
  };

  const loading = mutation.isPending;
  const fetchLoading = apartmentQuery.isLoading;

  if (fetchLoading) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-amber-400 text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <p className="text-amber-400 tracking-[0.2em] mb-2 uppercase text-sm">Admin Dashboard</p>
              <h1 className="text-4xl font-bold">{isEdit ? 'Edit Apartment' : 'Create Apartment'}</h1>
            </div>
            <Link to="/admin/apartments" className={`px-5 py-2.5 border hover:border-amber-500/50 rounded-sm transition-all ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}>Back to List</Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className={`backdrop-blur-sm rounded-xl p-8 border max-w-3xl mx-auto transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
          }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className={`w-full px-4 py-3 border rounded-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className={`w-full px-4 py-3 border rounded-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Price ($/mo)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Bedrooms</label>
                  <input
                    type="number"
                    value={formData.roomCount}
                    onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })}
                    required
                    min="0"
                    className={`w-full px-4 py-3 border rounded-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    required
                    min="0"
                    step="0.5"
                    className={`w-full px-4 py-3 border rounded-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Square Footage</label>
                  <input
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Images (Max 5)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {/* Existing images */}
                    {existingImages.map((img, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={img.url}
                          alt={`Existing image ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {/* New image previews */}
                    {newImagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative">
                        <img
                          src={preview}
                          alt={`New image ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewImageSelect}
                    disabled={loading || existingImages.length + newImageFiles.length >= 5}
                    className={`w-full px-4 py-3 border rounded-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.furnished}
                      onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                      className="w-4 h-4 text-amber-500"
                    />
                    <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Furnished</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="w-4 h-4 text-amber-500"
                    />
                    <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Available</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-amber-500"
                    />
                    <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/apartments')}
                  className={`px-6 py-3 border hover:border-amber-500/50 rounded-sm transition-all ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all disabled:opacity-50"
                >
                  {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Apartment')}
                </button>
              </div>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export { ManageApartments, CreateEditApartment };
