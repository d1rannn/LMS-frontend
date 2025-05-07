import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import "../style/style.css";

function TestCreator() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(state => state.user);

    const query = new URLSearchParams(location.search);
    const moduleId = query.get('moduleId');

    const [test, setTest] = useState({
        title: '',
        questions: [{ text: '', option1: '', option2: '', option3: '', option4: '', correctOption: 0 }]
    });
    const [error, setError] = useState(null);

    const handleAddQuestion = () => {
        setTest(prev => ({
            ...prev,
            questions: [...prev.questions, { text: '', option1: '', option2: '', option3: '', option4: '', correctOption: 0 }]
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...test.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setTest(prev => ({ ...prev, questions: updatedQuestions }));
    };

    const validateForm = () => {
        if (!test.title.trim()) {
            setError("Test title is required");
            return false;
        }

        for (let i = 0; i < test.questions.length; i++) {
            const q = test.questions[i];
            if (!q.text.trim()) {
                setError(`Question ${i + 1}: Text is required`);
                return false;
            }
            if (!q.option1.trim()) {
                setError(`Question ${i + 1}: Option 1 is required`);
                return false;
            }
            if (!q.option2.trim()) {
                setError(`Question ${i + 1}: Option 2 is required`);
                return false;
            }
            if (!q.option3.trim()) {
                setError(`Question ${i + 1}: Option 3 is required`);
                return false;
            }
            if (!q.option4.trim()) {
                setError(`Question ${i + 1}: Option 4 is required`);
                return false;
            }
        }

        setError(null);
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const testData = {
            title: test.title,
            moduleId: parseInt(moduleId),
            questions: test.questions.map(q => ({
                text: q.text,
                option1: q.option1,
                option2: q.option2,
                option3: q.option3,
                option4: q.option4,
                correctOption: q.correctOption
            }))
        };

        fetch('http://localhost:8080/api/tests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Id': user.id.toString()
            },
            body: JSON.stringify(testData)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.message || "Failed to create test"); });
                }
                return res.json();
            })
            .then(() => {
                setError(null);
                navigate(`/courses/${moduleId}/modules/${moduleId}`);
            })
            .catch(err => {
                setError(err.message);
            });
    };

    return (
        <div className="page-layout">
            <Navbar />
            <div className="page-content max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Создать тест для модуля</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <label className="block mb-2">Название теста</label>
                <input
                    type="text"
                    value={test.title}
                    onChange={(e) => setTest(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                />

                {test.questions.map((q, index) => (
                    <div key={index} className="mb-6 p-4 border rounded">
                        <label className="block mb-2">Вопрос {index + 1}</label>
                        <input
                            type="text"
                            value={q.text}
                            onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                            placeholder="Текст вопроса"
                        />
                        {['option1', 'option2', 'option3', 'option4'].map((opt, optIndex) => (
                            <div key={opt} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={q[opt]}
                                    onChange={(e) => handleQuestionChange(index, opt, e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 mr-2"
                                    placeholder={`Вариант ${optIndex + 1}`}
                                />
                                <input
                                    type="radio"
                                    name={`correct-${index}`}
                                    checked={q.correctOption === optIndex}
                                    onChange={() => handleQuestionChange(index, 'correctOption', optIndex)}
                                />
                            </div>
                        ))}
                    </div>
                ))}

                <button
                    className="bg-green-600 text-white px-4 py-2 rounded mb-4"
                    onClick={handleAddQuestion}
                >
                    Добавить вопрос
                </button>

                <div className="text-center">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded mr-4"
                        onClick={handleSubmit}
                    >
                        Сохранить тест
                    </button>
                    <button
                        className="bg-gray-400 text-white px-6 py-2 rounded"
                        onClick={() => navigate(`/courses/${moduleId}/modules/${moduleId}`)}
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TestCreator;