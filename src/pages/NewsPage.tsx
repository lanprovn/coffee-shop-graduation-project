import { useState } from 'react';
import { newsArticles } from '@/data/news';
import { NewsArticle } from '@/types';
import Title1 from '@/components/shared/typo/Title1';
import Title3 from '@/components/shared/typo/Title3';
import ButtonFilled from '@/components/shared/button/ButtonFilled';
import BannerSlider from '@/components/shared/BannerSlider';
import { bannerSlides } from '@/data/bannerSlides';

/**
 * Trang tin tức và khuyến mãi với banner slider
 * Hiển thị danh sách bài viết với phân loại và tìm kiếm
 */
export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const categories = [
    { id: 'all', name: 'Tất cả', count: newsArticles.length },
    { id: 'news', name: 'Tin tức', count: newsArticles.filter(a => a.category === 'news').length },
    { id: 'promotion', name: 'Khuyến mãi', count: newsArticles.filter(a => a.category === 'promotion').length },
    { id: 'event', name: 'Sự kiện', count: newsArticles.filter(a => a.category === 'event').length },
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
    case 'news': return '📰';
    case 'promotion': return '🎉';
    case 'event': return '🎪';
    default: return '📄';
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4 mt-20">
      {/* Banner Slider */}
      <div className="mb-8">
        <BannerSlider slides={bannerSlides} />
      </div>

      {/* Page Header */}
      <div className="text-center mb-8">
        <Title1 className="text-gray-800 mb-2">Tin tức & Khuyến mãi</Title1>
        <p className="text-gray-600">
          Cập nhật những thông tin mới nhất về sản phẩm, khuyến mãi và sự kiện
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Featured Articles */}
      {selectedCategory === 'all' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Bài viết nổi bật</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {newsArticles.filter(article => article.isFeatured).map((article) => (
              <div
                key={article.id}
                className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="aspect-video bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                  <div className="text-6xl">{getCategoryIcon(article.category)}</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {article.category === 'news' ? 'Tin tức' : 
                        article.category === 'promotion' ? 'Khuyến mãi' : 'Sự kiện'}
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Nổi bật
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>📅 {formatDate(article.publishedAt)}</span>
                    <span>✍️ {article.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {selectedCategory === 'all' ? 'Tất cả bài viết' : 
            selectedCategory === 'news' ? 'Tin tức' :
              selectedCategory === 'promotion' ? 'Khuyến mãi' : 'Sự kiện'}
        </h3>
        
        <div className="grid gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{getCategoryIcon(article.category)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {article.category === 'news' ? 'Tin tức' : 
                        article.category === 'promotion' ? 'Khuyến mãi' : 'Sự kiện'}
                    </span>
                    {article.isFeatured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Nổi bật
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📅 {formatDate(article.publishedAt)}</span>
                      <span>✍️ {article.author}</span>
                    </div>
                    <ButtonFilled onClick={() => setSelectedArticle(article)}>
                      Đọc thêm
                    </ButtonFilled>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{getCategoryIcon(selectedArticle.category)}</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {selectedArticle.category === 'news' ? 'Tin tức' : 
                    selectedArticle.category === 'promotion' ? 'Khuyến mãi' : 'Sự kiện'}
                </span>
                {selectedArticle.isFeatured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    Nổi bật
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedArticle.title}
              </h1>
              
              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <span>📅 {formatDate(selectedArticle.publishedAt)}</span>
                <span>✍️ {selectedArticle.author}</span>
              </div>
              
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
              
              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}