import React from 'react';

function ArticleForm({
    onSubmit,
    newArticleTitle,
    setNewArticleTitle,
    newArticleAuthor,
    setNewArticleAuthor,
    newArticleContent,
    setNewArticleContent,
    loading,
    db,
    onCancel
}) {
    return (
        <form onSubmit={onSubmit} className="add-article-form">
            <div>
                <label htmlFor="articleTitle" className="form-label">Article Title</label>
                <input
                    type="text"
                    id="articleTitle"
                    className="form-input"
                    value={newArticleTitle}
                    onChange={e => setNewArticleTitle(e.target.value)}
                    placeholder="Enter article title"
                    required
                    disabled={loading || !db}
                />
            </div>
            <div>
                <label htmlFor="articleAuthor" className="form-label">Author Name</label>
                <input
                    type="text"
                    id="articleAuthor"
                    className="form-input"
                    value={newArticleAuthor}
                    onChange={e => setNewArticleAuthor(e.target.value)}
                    placeholder="Enter author name"
                    required
                    disabled={loading || !db}
                />
            </div>
            <div>
                <label htmlFor="articleContent" className="form-label">Content</label>
                <textarea
                    id="articleContent"
                    className="form-textarea"
                    value={newArticleContent}
                    onChange={e => setNewArticleContent(e.target.value)}
                    placeholder="Write your article content here..."
                    required
                    disabled={loading || !db}
                ></textarea>
            </div>
            <div className="form-buttons">
                <button type="submit" className="submit-article-button" disabled={loading || !db}>
                    Add Article
                </button>
                <button type="button" onClick={onCancel} className="cancel-button">
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ArticleForm;
