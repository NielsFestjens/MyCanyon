import React, { useState } from "react";
import './Autocomplete.css'

interface AutocompleteProps {
    suggestions: any[];
    mapName: (item: any) => string;
    mapKey: (item: any) => string | number;
    updateChosenValue?: (item: any) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ suggestions, mapName, mapKey, updateChosenValue }) => {
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [filteredSuggestions, setFilteredSuggestions] = useState(Array<string>());
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userInput, setUserInput] = useState('');

    const onChange = (input: string) => {
        const lowercaseInput = input.toLowerCase();

        const filteredSuggestions = suggestions.filter(
            suggestion => mapName(suggestion).toLowerCase().indexOf(lowercaseInput) > -1
        );

        setActiveSuggestion(0);
        setFilteredSuggestions(filteredSuggestions);
        setShowSuggestions(true);
        setUserInput(input);
    };

    const onClick = (suggestion: any) => {
        setActiveSuggestion(0);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setUserInput(mapName(suggestion));
        updateChosenValue && updateChosenValue(suggestion);
    };

    const onKeyDown = (e: any) => {
        if (e.keyCode === 13) {
            setActiveSuggestion(0);
            setShowSuggestions(false);
            setUserInput(mapName(filteredSuggestions[activeSuggestion]));
            updateChosenValue && updateChosenValue(filteredSuggestions[activeSuggestion]);
        } else if (e.keyCode === 38) {
            if (activeSuggestion === 0)
                return;

            setActiveSuggestion(activeSuggestion - 1);
        }
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length)
                return;

            setActiveSuggestion(activeSuggestion + 1);
        }
    };

    return (
        <>
            <input onChange={e => onChange(e.currentTarget.value)} onKeyDown={onKeyDown} value={userInput} />
            {showSuggestions && userInput && (
                <>
                    {filteredSuggestions.length === 0 && <div className="no-suggestions"><em>No suggestions available.</em></div>}

                    {filteredSuggestions.length > 0 &&
                        <ul className="suggestions">
                            {filteredSuggestions.map((suggestion, index) => {
                                return (
                                    <li className={index === activeSuggestion ? 'suggestion-active' : ''} key={mapKey(suggestion)} onClick={() => onClick(suggestion)}>
                                        {mapName(suggestion)}
                                    </li>
                                );
                            })}
                        </ul>
                    }
                </>
            )}
        </>
    );
}

export default Autocomplete;