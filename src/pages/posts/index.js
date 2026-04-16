import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PostService } from '../../services/apiService';
import { FaCalendarAlt, FaEye } from 'react-icons/fa';

const PostsPage = () => {
  const location = useLocation();
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 22;

  // Determine post type based on the path
  const isQuotation = location.pathname.includes('bao-gia');
  const postType = isQuotation ? 'bao-gia' : 'tin-tuc';
  const pageTitle = isQuotation ? 'Bảng Báo Giá VLXD' : 'Tin Tức Nội Bộ';

  // Reset page when switching between category
  useEffect(() => {
    setPage(1);
  }, [postType]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        // Fetch all to do client-side pagination (consistent with products page)
        const response = await PostService.getPosts({ 
          post_type: postType,
          skip: 0,
          limit: 1000
        });
        setAllPosts(response);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [postType]);

  // Derived state for pagination
  const totalPages = Math.ceil(allPosts.length / ITEMS_PER_PAGE);
  const currentItems = allPosts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#1a3a8f] uppercase tracking-tight flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-400 rounded-full inline-block"></span>
            {pageTitle}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 min-h-[50vh]">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : allPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            Chưa có bài viết nào trong chuyên mục này.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {currentItems.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col group"
                >
                  <Link to={`/${postType}/${post.slug}`} className="block relative overflow-hidden aspect-[16/10] bg-gray-100">
                    <img 
                      src={post.thumbnail || 'https://via.placeholder.com/600x400?text=No+Image'} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {post.created_at && (
                      <div className="absolute top-3 left-3 bg-[#1a3a8f] text-white px-2 py-1 rounded shadow-sm flex items-center justify-center">
                        <div className="text-center leading-none">
                          <div className="text-sm font-bold">{new Date(post.created_at).getDate()}</div>
                          <div className="text-[10px] uppercase">Th {new Date(post.created_at).getMonth() + 1}</div>
                        </div>
                      </div>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col flex-grow">
                    <Link to={`/${postType}/${post.slug}`} className="block mb-2">
                      <h2 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaEye />
                        <span>{post.view_count || 0} lượt xem</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <nav className="inline-flex items-center p-1.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    disabled={page === 1} 
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="flex items-center px-1 space-x-1 border-x border-gray-100 mx-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setPage(i + 1)} 
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-300 ${
                          page === i + 1 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                    disabled={page === totalPages} 
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
