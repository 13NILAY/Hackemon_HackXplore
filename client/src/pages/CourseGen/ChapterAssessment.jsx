import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import ExamCardItem from "../../components/assessment/ExamCardItem";
import QuestionNavigation from "../../components/assessment/QuestionNavigation";
import ResultScreen from "../../components/assessment/ResultScreen";
import axios from "axios";

const ChapterAssessment = () => {
    const { courseId, chapterId } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    
    const [quiz, setQuiz] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [examId, setExamId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const generateChapterAssessment = async () => {
            try {
                setLoading(true);
                console.log(courseId, chapterId);
                const res = await axios.post(
                    `http://localhost:8000/api/assessment/${courseId}/chapters/${chapterId}/assessment`,
                    { userId: user._id },
                    {
                        headers: { Authorization: `Bearer ${user.token}` }
                    }
                );
                setQuiz(res.data.questions);
                setExamId(res.data._id);
                setError(null);
            } catch (error) {
                console.error("Error generating chapter assessment:", error);
                setError("Failed to generate assessment. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        generateChapterAssessment();
    }, [courseId, chapterId, user._id, user.token]);

    const handleAnswer = (selectedOption) => {
        setUserAnswers({
            ...userAnswers,
            [currentQuestion]: selectedOption,
        });
    };

    const navigateToQuestion = (questionIndex) => {
        setCurrentQuestion(questionIndex);
    };

    const handleNext = () => {
        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateScore = () => {
        let totalScore = 0;
        quiz.forEach((q, index) => {
            if (userAnswers[index] === q.answer) {
                totalScore += 1;
            }
        });
        setScore(totalScore);
        return totalScore * 20; // 5 questions * 20 = 100 max score
    };

    const handleSubmit = async () => {
        const finalScore = calculateScore();
        setShowResults(true);
        
        try {
            // Update assessment score
            await axios.patch(`http://localhost:8000/api/assessment/${examId}`, {
                score: finalScore,
            });

            // If passed (score >= 70%), mark chapter as completed and fetch next chapter
            if (finalScore >= 70) {
                await axios.patch(
                    `http://localhost:8000/api/courses/${courseId}/chapters/${chapterId}/complete`,
                    {},
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );

                // Fetch course to get next chapter
                const courseResponse = await axios.get(
                    `http://localhost:8000/api/courses/${courseId}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );

                const chapters = courseResponse.data.chapters;
                const currentIndex = chapters.findIndex(ch => ch._id === chapterId);
                const nextChapter = chapters[currentIndex + 1];

                // After 3 seconds, navigate to next chapter or course details
                setTimeout(() => {
                    if (nextChapter) {
                        navigate(`/teacher/course/${courseId}/chapter/${nextChapter._id}`);
                    } else {
                        navigate(`/teacher/course/${courseId}`);
                    }
                }, 3000);
            }
        } catch (error) {
            console.error("Error updating assessment:", error);
            setError("Failed to submit assessment. Please try again.");
        }
    };

    const restartQuiz = () => {
        setUserAnswers({});
        setCurrentQuestion(0);
        setShowResults(false);
        setScore(0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-indigo-600 font-medium">Generating chapter assessment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => navigate(`/teacher/course/${courseId}/chapter/${chapterId}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Return to Chapter
                    </button>
                </div>
            </div>
        );
    }

    if (showResults) {
        return (
            <ResultScreen
                score={score}
                totalQuestions={quiz.length}
                onRestart={restartQuiz}
                userAnswers={userAnswers}
                quiz={quiz}
                passingScore={70}
                onReturn={() => navigate(`/teacher/course/${courseId}/chapter/${chapterId}`)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-center font-bold text-4xl tracking-tight text-indigo-800 mb-2">
                    Chapter Assessment
                </h1>
                <p className="text-center text-indigo-600 mb-10">
                    Complete this assessment to unlock the next chapter
                </p>

                <div className="flex justify-center items-start gap-8">
                    {/* Main quiz area */}
                    <div className="flex-grow bg-white rounded-2xl shadow-xl p-6 max-w-4xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                                    {currentQuestion + 1}
                                </span>
                                <div className="ml-4">
                                    <h2 className="font-bold text-lg text-gray-700">Question {currentQuestion + 1}</h2>
                                    <p className="text-sm text-gray-500">of {quiz.length} questions</p>
                                </div>
                            </div>
                        </div>

                        <ExamCardItem
                            quiz={quiz[currentQuestion]}
                            userSelectedOption={handleAnswer}
                            selectedOption={userAnswers[currentQuestion] || null}
                        />

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                    currentQuestion === 0
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-indigo-600 border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
                                }`}
                            >
                                Previous
                            </button>

                            {currentQuestion === quiz.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                                >
                                    Submit Assessment
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Question navigation sidebar */}
                    <div className="w-64 bg-gray-900 rounded-2xl shadow-xl p-6 sticky top-6">
                        <h3 className="font-bold text-lg mb-4 text-white">Questions</h3>
                        <QuestionNavigation
                            totalQuestions={quiz.length}
                            currentQuestion={currentQuestion}
                            answeredQuestions={userAnswers}
                            onQuestionClick={navigateToQuestion}
                        />
                        <div className="mt-6 pt-5 border-t border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-300">Progress</span>
                                <span className="text-sm font-medium text-indigo-400">
                                    {Object.keys(userAnswers).length} / {quiz.length}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full">
                                <div
                                    className="h-full bg-indigo-500 rounded-full transition-all"
                                    style={{ width: `${(Object.keys(userAnswers).length / quiz.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterAssessment;
