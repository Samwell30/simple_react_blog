import React from 'react';
import ArticlePreview from './ArticlePreview';

function ArticleList({
    articles,
    onArticleClick,
    showAddForm,
    setShowAddForm,
    loading,
    db,
    children
}) {
    return (
        <div className="article-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="section-title" style={{ marginBottom: '0' }}>All Articles</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="add-article-button"
                    style={{ marginLeft: '1rem' }}
                    disabled={loading || !db}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="back-button-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {showAddForm ? 'Hide Form' : 'Add New Article'}
                </button>
            </div>
            {children}
            {articles.length > 0 ? (
                articles.map(article => (
                    <ArticlePreview key={article.id} article={article} onClick={onArticleClick} />
                ))
            ) : (
                <p className='blog-para'>No articles yet. Add one above!</p>
            )}
        </div>
    );
}

export default ArticleList;
