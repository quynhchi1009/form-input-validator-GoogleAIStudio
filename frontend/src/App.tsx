import React, { useState, useRef } from 'react';

// Define types for the API response
interface ValidationResponse {
  valid: boolean;
  reasons: string[];
  wordCount: number;
  letterCount: number;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use relative URL by default. 
  // In Dev: Vite proxy forwards '/api' -> 'http://localhost:3000/api'
  // In Prod: Express serves frontend and handles '/api' directly.
  const API_URL = (import.meta as any).env.VITE_API_URL || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: ValidationResponse = await response.json();
      setResult(data);

      if (!data.valid) {
        // Clear input and focus if invalid (UX requirement)
        setInputValue('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert('An error occurred while validating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Input Validator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="text-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter text
            </label>
            <input
              ref={inputRef}
              type="text"
              id="text-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Type something..."
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputValue}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all 
              ${
                isLoading || !inputValue
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Checking...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        {result && (
          <div
            className={`mt-6 p-4 rounded-lg border ${
              result.valid
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {result.valid ? (
              <div className="flex items-center justify-center font-semibold">
                <span className="text-xl mr-2">✅</span> Valid input!
              </div>
            ) : (
              <div>
                <div className="flex items-center font-bold mb-1">
                  <span className="text-xl mr-2">❌</span> Invalid
                </div>
                <p className="text-sm">
                  Must be &gt; 8 characters and include at least one number.
                </p>
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-gray-300/50 space-y-1">
              <p className="text-sm font-medium">Words: {result.wordCount}</p>
              <p className="text-sm font-medium">Letters: {result.letterCount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;