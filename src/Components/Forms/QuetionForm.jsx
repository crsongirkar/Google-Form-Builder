

import React, { useState, useEffect } from 'react';
import { StyleContainer, StyleBox, StyledQuestionField } from '../../Styled/QuestionFormStyles';
import AnswerBox from './AnswerBox';
import ButtonsGroup from '../Common/ButtonsGroup';
import OptionDropdown from './OptionDropdown';
import { useLocation } from "react-router-dom";

const QuestionForm = ({ onDelete, onCopy, section, formIndex, formData, onChange ,onAddNewForm ,onMoveUp ,onMoveDown}) => {
  const [selectedOption, setSelectedOption] = useState(formData.selectedOption);
  const [question, setQuestion] = useState(formData.question);
  const [answerData, setAnswerData] = useState(formData.answerData);
  const location = useLocation();

  const isUserFormPage = location.pathname === "/user-form";
  
  useEffect(() => {
    onChange({ question, selectedOption, answerData });
  }, [question, selectedOption, answerData]);

  const handleOptionSelect = (option) => {
    
    setSelectedOption(option);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleAnswerChange = (newAnswerData) => {
    setAnswerData(newAnswerData);
  };

  return (
    <StyleContainer>
      <StyleBox>
      
        <div style={{ textAlign: 'end' }}>
          <ButtonsGroup onDelete={onDelete} section={section} onCopy={onCopy} onAddNewForm={onAddNewForm} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
          <OptionDropdown selectedOption={selectedOption} onSelectOption={handleOptionSelect} />
        </div>
        
        <StyledQuestionField
          fullWidth
          placeholder="Enter your question..."
          value={question}
          onChange={handleQuestionChange}
          InputProps={{
            disableUnderline: true,
          }}
        />
        {selectedOption && (
          <AnswerBox
            selectedOption={selectedOption}
            answerData={answerData}
            onAnswerChange={handleAnswerChange}
          />
        )}
      </StyleBox>
    </StyleContainer>
  );
};

export default QuestionForm;

// import React, { useState, useEffect } from 'react';
// import { StyleContainer, StyleBox, StyledQuestionField } from '../../Styled/QuestionFormStyles';
// import AnswerBox from './AnswerBox';
// import ButtonsGroup from '../Common/ButtonsGroup';
// import OptionDropdown from './OptionDropdown';

// const QuestionForm = ({ onDelete, section, formIndex, onCopy, onChange, onMoveUp, onMoveDown, formData }) => {
//   const [selectedOption, setSelectedOption] = useState(() => {
//     const savedOption = localStorage.getItem(`selectedOption-${formIndex}`);
//     return savedOption ? JSON.parse(savedOption) : 'option1';
//   });

//   const [question, setQuestion] = useState(() => {
//     const savedQuestion = localStorage.getItem(`question-${formIndex}`);
//     return savedQuestion ? savedQuestion : '';
//   });

//   useEffect(() => {
//     localStorage.setItem(`selectedOption-${formIndex}`, JSON.stringify(selectedOption));
//   }, [selectedOption, formIndex]);

//   useEffect(() => {
//     localStorage.setItem(`question-${formIndex}`, question);
//   }, [question, formIndex]);

//   const handleOptionSelect = (option) => {
//     setSelectedOption(option);
//   };

//   const handleQuestionChange = (event) => {
//     setQuestion(event.target.value);
//   };

//   return (
//     <StyleContainer>
//       <StyleBox>
//         <div style={{ textAlign: 'end' }}>
//           <ButtonsGroup onDelete={onDelete} section={section} onCopy={onCopy} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
//           <OptionDropdown onSelectOption={handleOptionSelect} />
//         </div>
//         <StyledQuestionField
//           fullWidth
//           placeholder="Enter your question..."
//           value={question}
//           onChange={handleQuestionChange}
//           InputProps={{
//             disableUnderline: true,
//           }}
//         />
//         {selectedOption && <AnswerBox selectedOption={selectedOption} />}
//       </StyleBox>
//     </StyleContainer>
//   );
// };

// export default QuestionForm;