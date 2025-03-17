import React from "react";
import { Suggestion } from "../../types/types";
import "./Suggestions.css"; // Importing the CSS file

interface SuggestionsProps {
  suggestions: Suggestion[];
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions }) => {
  return (
    <div className="suggestions-container">
      <h2 className="suggestions-title">Suggestions</h2>
      {suggestions.length === 0 ? (
        <p className="no-suggestions-text">No suggestions yet.</p>
      ) : (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="suggestion-item">
              <div className="suggestion-message">
                <p>{suggestion.message}</p>
                <span className="suggestion-type">Type: {suggestion.type}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Suggestions;
