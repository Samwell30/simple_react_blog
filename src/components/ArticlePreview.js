import React from 'react';

function ArticlePreview({ article, onClick }) {
    return (
        <div className="article-preview" onClick={() => onClick(article.id)}>
            <h3 className="article-preview-title">{article.title}</h3>
            <p className="article-preview-meta">
                By {article.author} on {article.date}
            </p>
        </div>
    );
}

export default ArticlePreview;
