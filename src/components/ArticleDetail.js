import React from 'react';

function ArticleDetail({ article, onDelete, userId, adminUid }) {
    if (!article) {
        return null;
    }
    return (
        <div className="single-article-view">
            <h2 className="article-title-detail">{article.title}</h2>
            <p className="article-meta-detail">By {article.author} on {article.date}</p>
            <div className="article-content">
                {article.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="article-paragraph">{paragraph}</p>
                ))}
            </div>
            {userId === adminUid && (
                <button onClick={() => onDelete(article.id)} className="cancel-button" style={{ marginTop: '1rem', alignSelf: 'flex-end' }}>
                    Delete Article
                </button>
            )}
        </div>
    );
}

export default ArticleDetail;
