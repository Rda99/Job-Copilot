import React, { useState } from 'react';
import { useLLM } from '@/context/LLMContext';
import { LLM_MODELS } from '@/lib/constants';
import { InterviewQuestionAnswer } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';

const InterviewPrep: React.FC = () => {
  const { settings } = useLLM();
  const { toast } = useToast();
  
  const [selectedJob, setSelectedJob] = useState<string>('Acme Technology - Senior Frontend Developer');
  const [notes, setNotes] = useState<string>('Research company values and recent projects. Remember to ask about team structure and development process.');
  
  const [questions, setQuestions] = useState<InterviewQuestionAnswer[]>([
    {
      id: nanoid(),
      question: "Can you walk me through your experience with React and how you've used it in previous projects?",
      answer: "In my current role at TechSolutions, I've been working extensively with React for the past 3 years. I led the development of a component library that's now used across all our products, which reduced development time by 40% and ensured consistency in our UI. I've implemented complex state management using Redux and Context API, set up performance optimization with memo and useCallback, and implemented code-splitting to improve load times. I'm particularly proud of a data visualization dashboard I built that processes real-time data updates while maintaining smooth performance."
    },
    {
      id: nanoid(),
      question: "How do you approach optimizing the performance of a React application?",
      answer: "I follow a systematic approach to performance optimization. First, I measure using tools like Lighthouse and React Profiler to identify bottlenecks. Then I implement improvements like code splitting, lazy loading, and memoization of expensive calculations. I also use React.memo and useCallback/useMemo hooks to prevent unnecessary re-renders. For large lists, I implement virtualization with libraries like react-window. Finally, I validate improvements with metrics and ensure we don't sacrifice code readability or maintainability."
    },
    {
      id: nanoid(),
      question: "Describe a challenging bug you've encountered and how you resolved it.",
      answer: ""
    },
    {
      id: nanoid(),
      question: "How do you stay updated with the latest frontend technologies and best practices?",
      answer: ""
    },
    {
      id: nanoid(),
      question: "Can you explain your experience with TypeScript and how it has improved your development process?",
      answer: ""
    }
  ]);
  
  const jobs = [
    'Acme Technology - Senior Frontend Developer',
    'InnovateTech - Product Designer',
    'DataFlow - Data Engineer',
    'WebSphere Solutions - Full Stack Developer'
  ];
  
  const generateQuestions = () => {
    toast({
      title: "Generating Questions",
      description: "AI is creating interview questions based on job description...",
    });
    
    // In a real app, this would call the API
    setTimeout(() => {
      const newQuestions = [
        ...questions,
        {
          id: nanoid(),
          question: "How would you implement a design system that can be used across multiple projects?",
          answer: ""
        },
        {
          id: nanoid(),
          question: "What strategies do you use to ensure accessibility in your web applications?",
          answer: ""
        }
      ];
      
      setQuestions(newQuestions);
      
      toast({
        title: "Questions Generated",
        description: "New interview questions have been added.",
      });
    }, 1500);
  };
  
  const generateAnswers = () => {
    toast({
      title: "Generating Answers",
      description: "AI is creating suggested answers...",
    });
    
    // In a real app, this would call the API
    setTimeout(() => {
      const updatedQuestions = questions.map(q => {
        if (!q.answer) {
          return {
            ...q,
            answer: "I would approach this by first analyzing the requirements and then implementing a solution that balances performance and maintainability..."
          };
        }
        return q;
      });
      
      setQuestions(updatedQuestions);
      
      toast({
        title: "Answers Generated",
        description: "AI-suggested answers are now available.",
      });
    }, 1500);
  };
  
  const updateAnswer = (id: string, answer: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, answer } : q
    ));
  };
  
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: nanoid(),
        question: '',
        answer: ''
      }
    ]);
  };
  
  const updateQuestion = (id: string, question: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, question } : q
    ));
  };
  
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  const modelInfo = LLM_MODELS[settings.provider].find(m => m.id === settings.model);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Interview Preparation</h1>
        <p className="text-gray-600 dark:text-gray-300">Practice answering questions and prepare for your job interviews</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Interview settings */}
        <div className="p-5 bg-white rounded-lg shadow-sm dark:bg-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Setup</h2>
            <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-primary dark:bg-blue-900/30">
              <i className="mr-1 bx bx-chip"></i>
              <span>{`${settings.provider.charAt(0).toUpperCase() + settings.provider.slice(1)} • ${modelInfo?.name || settings.model}`}</span>
            </span>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Job Position</label>
            <select 
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {jobs.map((job) => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Prep Notes</label>
            <textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your interview preparation notes here..."
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={generateQuestions}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-600"
            >
              <i className="mr-2 bx bx-bulb"></i>
              Generate Questions
            </button>
            
            <button
              onClick={generateAnswers}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md dark:text-white dark:bg-neutral-700 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-600"
            >
              <i className="mr-2 bx bx-wand-2"></i>
              Suggest Answers
            </button>
          </div>
        </div>
        
        {/* Questions and answers */}
        <div className="p-5 bg-white rounded-lg shadow-sm dark:bg-neutral-800 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Questions</h2>
            <button
              onClick={addQuestion}
              className="flex items-center text-sm text-primary"
            >
              <i className="mr-1 bx bx-plus-circle"></i>
              Add Question
            </button>
          </div>
          
          <div className="space-y-6">
            {questions.map((qa) => (
              <div key={qa.id} className="p-4 border border-gray-200 rounded-lg dark:border-neutral-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      value={qa.question}
                      onChange={(e) => updateQuestion(qa.id, e.target.value)}
                      placeholder="Enter interview question..."
                      className="w-full px-3 py-2 text-base font-medium bg-gray-50 border border-gray-200 rounded-md dark:bg-neutral-700/50 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    ></textarea>
                  </div>
                  <button
                    onClick={() => removeQuestion(qa.id)}
                    className="p-1 ml-2 text-gray-400 rounded hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Your Answer</label>
                  <textarea
                    rows={4}
                    value={qa.answer}
                    onChange={(e) => updateAnswer(qa.id, e.target.value)}
                    placeholder="Prepare your answer or generate with AI..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      toast({
                        title: "Generating Answer",
                        description: "AI is creating a suggested answer...",
                      });
                      
                      setTimeout(() => {
                        updateAnswer(qa.id, "I would approach this question by starting with my relevant experience and then explaining my thought process...");
                        
                        toast({
                          title: "Answer Generated",
                          description: "AI suggestion is now available.",
                        });
                      }, 1000);
                    }}
                    className="flex items-center text-xs text-primary"
                  >
                    <i className="mr-1 bx bx-wand-2"></i>
                    Suggest Answer
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-600">
              Save Interview Prep
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
