// suggestionsUtils.js

export const updateSuggestions = (text, items, setName, setSuggestions, setIsDropdownOpen) => {
    setName(text);
    if (text === '') {
      setSuggestions([]);
      setIsDropdownOpen(false);
    } else {
      const newSuggestions = items
        .filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
  
      setIsDropdownOpen(newSuggestions.length > 0);
      setSuggestions(newSuggestions);
    }
  };
  
  export const onSuggestionPress = (suggestion, setName, setIsDropdownOpen, setSuggestions, id=null, name=null) => {
    if (id && name) {
      if (name === 'course') {
        setCourseId(id);
        console.log('setting course id', id);
      } else if (name === 'instructor') {
        setInstructorId(id);
        console.log('setting instructor id', id);
      }
    }

    setName(suggestion);
    setIsDropdownOpen(false);
    setSuggestions([]);
  };
  