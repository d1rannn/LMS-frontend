import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import "../style/style.css";

function TestPage() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);
    const state = useSelector(state => state);
    console.log('Redux state:', state);
    const [test, setTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.id) {
            setError('Please log in to access the test');
            setLoading(false);
            navigate('/login');
            return;
        }

        const savedProgress = localStorage.getItem(`test_${testId}_progress`);
        if (savedProgress) {
            const { currentQuestionIndex, answers } = JSON.parse(savedProgress);
            setCurrentQuestionIndex(currentQuestionIndex);
            setAnswers(answers);
        }

        fetch(`http://localhost:8080/api/tests/${testId}`, {
            headers: { 'User-Id': user.id.toString() }
        })
            .then(res => {
                if (!res.ok) throw new Error(res.status === 403 ? "Access denied or test already taken" : "Failed to load test");
                return res.json();
            })
            .then(data => {
                setTest(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [testId, user, navigate]);

    useEffect(() => {
        if (test && !result) {
            localStorage.setItem(`test_${testId}_progress`, JSON.stringify({
                currentQuestionIndex,
                answers
            }));
        }
    }, [currentQuestionIndex, answers, testId, test, result]);

    const handleAnswerSelect = (questionId, optionIndex) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (!user || !user.id) {
            setError('Please log in to submit the test');
            navigate('/login');
            return;
        }

        fetch(`http://localhost:8080/api/tests/${testId}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Id': user.id.toString()
            },
            body: JSON.stringify({ answers })
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to submit test");
                return res.json();
            })
            .then(data => {
                setResult(data);
                localStorage.removeItem(`test_${testId}_progress`);
            })
            .catch(err => setError(err.message));
    };

    if (loading) return <div className="text-center p-6">Loading test...</div>;
    if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
    if (!test) return <div className="text-center p-6 text-red-500">Test not found</div>;

    if (result) {
        return (
            <div className="page-layout">
                <Navbar />
                <div className="page-content max-w-4xl mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-4">Результаты теста: {test.title}</h1>
                    <p className="text-lg mb-4">
                        Ваш результат: {result.score} из {result.totalQuestions} ({Math.round((result.score / result.totalQuestions) * 100)}%)
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Ответы:</h2>
                    {test.questions.map((q, index) => (
                        <div key={q.id} className="mb-4 p-4 border rounded">
                            <p className="font-medium">Вопрос {index + 1}: {q.text}</p>
                            <p>Ваш ответ: {q.options[result.studentAnswers[q.id]]}</p>
                            <p className={result.studentAnswers[q.id] === result.correctAnswers[q.id] ? "text-green-600" : "text-red-600"}>
                                Правильный ответ: {result.options[q.id]}
                            </p>
                        </div>
                    ))}
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
                        onClick={() => navigate(`/courses/${test.module.course.id}/modules/${test.module.id}`)}
                    >
                        Назад к модулю
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
                <p className="mb-4">Вопрос {currentQuestionIndex + 1} из {test.questions.length}</p>
                <div className="mb-6 p-4 border rounded">
                    <p className="text-lg font-medium mb-2">{currentQuestion.text}</p>
                    {currentQuestion.options.map((option, index) => (
                        <label key={index} className="block mb-2">
                            <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                checked={answers[currentQuestion.id] === index}
                                onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
                <button
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                    onClick={handleNextQuestion}
                    disabled={answers[currentQuestion.id] == null}
                >
                    {currentQuestionIndex === test.questions.length - 1 ? "Отправить" : "Следующий"}
                </button>
            </div>
        </div>
    );
}

export default TestPage;