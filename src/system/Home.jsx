import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearLoginFlag } from '../store/actions/authActions';
import Navbar from '../common/Navbar';
import { useNavigate } from 'react-router-dom';
import "../style/style.css";

function Home() {
    const justLoggedIn = useSelector(state => state.justLoggedIn);
    const dispatch = useDispatch();
    const [toast, setToast] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const navigate = useNavigate();
    const user = useSelector(state => state?.user);

    const [news, setNews] = useState([
        {
            id: 1,
            title: "📢 New Course Management Features Launched",
            description: "Admins can now edit and delete courses with full confirmation support."
        },
        {
            id: 2,
            title: "🚀 Improved Module Editor",
            description: "Module editing now supports video links and file uploads."
        },
        {
            id: 3,
            title: "🎓 Teacher Dashboard Update",
            description: "Teachers can track module progress and manage course materials more easily."
        }
    ]);

    useEffect(() => {
        if (justLoggedIn) {
            setToast({ message: "Login successful!", type: "success" });
            setTimeout(() => setToast(null), 3000);
            dispatch(clearLoginFlag());
        }

        if (user) {
            fetchUserStatus(user.id);
        }
    }, [justLoggedIn, dispatch, user]);

    const fetchUserStatus = (userId) => {
        fetch(`http://localhost:8080/api/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.banned) {
                    setUserStatus('banned');
                    setToast({ message: "Oops, it seems you are banned. You don't have access to the platform.", type: "error" });
                    localStorage.removeItem('user');

                    setTimeout(() => {
                        navigate('/banned');
                        setTimeout(() => {
                            navigate('/login');
                        }, 3000);
                    }, 3000);
                } else {
                    setUserStatus('active');
                }
            })
            .catch(err => {
                console.error('Error fetching user status:', err);
            });
    };

    return (
        <div className="wrapper">
            {toast && toast.message && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            <Navbar />
            <div className="main-content">
                <div className="welcome-card">
                    <h1 className="display-4">Welcome to Our Platform</h1>
                    <p className="lead">Your journey to learning starts here.</p>

                    {user ? (
                        userStatus === 'banned' ? (
                            <h4>{toast ? toast.message : "You are banned. You can't access the platform."}</h4>
                        ) : (
                            <h4>Hello, {user.name}. You have logged in as {user.role}</h4>
                        )
                    ) : (
                        <h4>Please log in to see your details.</h4>
                    )}
                </div>

                <div>
                    {user && (
                        <div className="news-section mt-6">
                            <h2 className="text-xl font-semibold mb-4">📌 Latest News</h2>
                            <div className="news-card">
                                <div className="news-card-container">
                                    {news.map(item => (
                                        <div key={item.id} className="news-item">
                                            <h3 className="news-title">{item.title}</h3>
                                            <p className="news-description">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;