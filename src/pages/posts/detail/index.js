import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChevronRight, FaEye, FaPhone, FaUserAlt } from 'react-icons/fa';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PostService } from '../../../services/apiService';

const PostDetailPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  const isQuotation = location.pathname.includes('bao-gia');
  const postType = isQuotation ? 'bao-gia' : 'tin-tuc';
  const categoryName = isQuotation ? 'Bảng Báo Giá VLXD' : 'Tin Tức Nội Bộ';
  const categoryLink = isQuotation ? '/bao-gia' : '/tin-tuc';

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch current post
        const data = await PostService.getPostBySlug(slug);
        setPost(data);

        // Fetch recent post for the sidebar
        const recentData = await PostService.getPosts({ post_type: postType });
        // filter out the current post
        setRecentPosts(recentData.filter(p => p.slug !== slug).slice(0, 5));
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Không tìm thấy bài viết hoặc có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
    // Scroll to top when slug changes
    window.scrollTo(0, 0);
  }, [slug, postType]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-20 min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Lỗi</h2>
        <p className="text-gray-600">{error || 'Không tìm thấy bài viết'}</p>
        <Link to={categoryLink} className="inline-block mt-6 text-blue-600 hover:text-blue-800 underline">
          Quay lại {categoryName}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex text-[13px] text-gray-500 mb-5 items-center gap-2">
          <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <FaChevronRight className="text-[10px]" />
          <Link to={categoryLink} className="hover:text-blue-600 transition-colors">{categoryName}</Link>
          <FaChevronRight className="text-[10px]" />
          <span className="text-gray-800 font-medium truncate max-w-[150px] sm:max-w-xs">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main Content Area */}
          <article className="bg-white p-5 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a3a8f] mb-3 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4 mb-6 text-[13px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-gray-400" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaEye className="text-gray-400" />
                <span>{post.view_count || 0} lượt xem</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaUserAlt className="text-gray-400" />
                <span>Admin</span>
              </div>
            </div>

            {/* Content Formatting */}
            <div
              className="prose prose-sm md:prose-base max-w-none text-gray-700
                prose-headings:text-gray-800 prose-headings:font-bold
                prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2
                prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-sm prose-img:max-h-96 prose-img:object-cover prose-img:w-full
                prose-ul:list-disc prose-ul:pl-5
                prose-ol:list-decimal prose-ol:pl-5
                prose-table:border-collapse prose-th:border prose-th:bg-gray-50 prose-th:p-2 prose-th:text-xs prose-td:border prose-td:p-2 prose-td:text-sm"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 border-b-2 border-yellow-400 pb-2 mb-4 inline-block uppercase">
                Bài viết mới
              </h3>
              {recentPosts.length > 0 ? (
                <ul className="space-y-4">
                  {recentPosts.map(rp => (
                    <li key={rp.id} className="flex gap-3 group items-start">
                      <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={rp.thumbnail || 'https://via.placeholder.com/150'}
                          alt={rp.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/${postType}/${rp.slug}`}
                          className="text-[13px] font-semibold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {rp.title}
                        </Link>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {formatDate(rp.created_at)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">Chưa có bài viết nào liên quan.</p>
              )}
            </div>

            {/* Banner/Ad Placeholder */}
            <div className="bg-gradient-to-br from-[#1a3a8f] to-[#1d4ed8] rounded-xl shadow-sm p-5 text-white text-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaPhone className="text-yellow-400 text-lg" />
              </div>
              <h4 className="font-bold text-lg mb-2">Liên Hệ Đặt Hàng</h4>
              <p className="text-xs text-blue-100 mb-4 leading-relaxed">Cần tư vấn vật liệu xây dựng? Gọi ngay để có báo giá đại lý tốt nhất.</p>
              <a href="tel:0889541507" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-[#1a3a8f] font-bold py-2 px-5 rounded-full text-sm transition-colors w-full shadow-sm">
                0889 541 507
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
