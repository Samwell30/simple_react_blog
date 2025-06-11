import React, { useState, useEffect } from 'react';
import './App.css';
import Message from './components/Message';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import ArticleDetail from './components/ArticleDetail';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

function App() {
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleAuthor, setNewArticleAuthor] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    try {
      // Use environment variables for config
      const firebaseConfig = process.env.REACT_APP_FIREBASE_CONFIG ? JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG) : {};
      if (!firebaseConfig.apiKey) {
        console.error("Firebase config is missing API key. Please check __firebase_config.");
        setMessage("Error: Firebase configuration is incomplete. Cannot connect to database.");
        setLoading(false);
        return;
      }
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);

      setDb(firestore);

      const signIn = async () => {
        if (process.env.REACT_APP_INITIAL_AUTH_TOKEN) {
          try {
            await signInWithCustomToken(authInstance, process.env.REACT_APP_INITIAL_AUTH_TOKEN);
            console.log("Signed in with custom token.");
          } catch (error) {
            console.error("Error signing in with custom token:", error);
            setMessage("Error during authentication. Please try again.");
            await signInAnonymously(authInstance);
          }
        } else {
          await signInAnonymously(authInstance);
          console.log("Signed in anonymously.");
        }
      };

      signIn();

      const unsubscribeAuth = onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setUserId(user.uid);
          console.log("Auth state changed, user ID:", user.uid);
        } else {
          setUserId(null);
          console.log("Auth state changed, no user.");
        }
        setLoading(false);
      });

      return () => unsubscribeAuth();
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      setMessage("Error initializing Firebase. Please check your setup.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (db && userId) {
      const articlesCollectionRef = collection(db, 'articles');

      const unsubscribe = onSnapshot(articlesCollectionRef, (snapshot) => {
        const fetchedArticles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        fetchedArticles.sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(b.date) - new Date(a.date);
        });
        setArticles(fetchedArticles);
        console.log("Articles fetched and updated.");
      }, (error) => {
        console.error("Error fetching articles:", error);
        setMessage("Failed to load articles.");
      });

      return () => unsubscribe();
    }
  }, [db, userId]);

  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!newArticleTitle || !newArticleContent || !newArticleAuthor) {
      setMessage("Please fill in all fields to add an article.");
      return;
    }
    if (!db) {
      setMessage("Database not initialized. Please wait or refresh.");
      return;
    }
    try {
      const articlesCollectionRef = collection(db, `artifacts/${userId}/public/data/articles`);
      await addDoc(articlesCollectionRef, {
        title: newArticleTitle,
        author: newArticleAuthor,
        content: newArticleContent,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      });
      setMessage("Article added successfully!");
      setNewArticleTitle('');
      setNewArticleAuthor('');
      setNewArticleContent('');
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding article:", error);
      setMessage(`Error adding article: ${error.message}`);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!db || !articleId) return;
    try {
      const articleDocRef = doc(db, `artifacts/${userId}/public/data/articles/${articleId}`);
      await deleteDoc(articleDocRef);
      setMessage('Article deleted successfully!');
      setSelectedArticleId(null);
    } catch (error) {
      setMessage('Error deleting article: ' + error.message);
    }
  };

  const selectedArticle = articles.find(article => article.id === selectedArticleId);

  const handleArticleClick = (id) => {
    setSelectedArticleId(id);
    setMessage('');
  };

  const handleBackToList = () => {
    setSelectedArticleId(null);
  };

  if (loading) {
    return (
      <div className="blog-container">
        <div className="loading-text">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <Message message={message} />
      <div className="blog-card">
        <h1 className="blog-title">Simple React Blog</h1>
        <p className='blog-para'> Hello. This is a shared blog app created with React and Firebase. Feel free to add an article!</p>
        {userId && <p className="user-id-display">Your User ID: {userId}</p>}
        {selectedArticleId === null ? (
          <>
            <ArticleList
              articles={articles}
              onArticleClick={handleArticleClick}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              loading={loading}
              db={db}
            >
              {showAddForm && (
                <ArticleForm
                  onSubmit={handleAddArticle}
                  newArticleTitle={newArticleTitle}
                  setNewArticleTitle={setNewArticleTitle}
                  newArticleAuthor={newArticleAuthor}
                  setNewArticleAuthor={setNewArticleAuthor}
                  newArticleContent={newArticleContent}
                  setNewArticleContent={setNewArticleContent}
                  loading={loading}
                  db={db}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
            </ArticleList>
          </>
        ) : (
          <ArticleDetail
            article={selectedArticle}
            onDelete={handleDeleteArticle}
            userId={userId}
            adminUid={"xpODpmRnWBZ2ELnvxHzYeq5BtKy2"}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
}

export default App;
