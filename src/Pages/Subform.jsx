import React, { useState, useEffect , useCallback} from 'react';
import TitleBox from '../Components/Forms/TitleBox';
import QuestionForm from '../Components/Forms/QuetionForm';
import { AddSectionButton } from '../Styled/SelectedOptionStyles';
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const Subform = () => {
  const [sections, setSections] = useState(() => {
    const savedSections = localStorage.getItem("sections");
    return savedSections ? JSON.parse(savedSections) : [{ id: 0, questionForms: [] }];
  });

  const location = useLocation();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const [refresh, setRefresh] = useState(false);
  const [key, setKey] = useState(0);

  const forceUpdate = useCallback(() => {
    setKey(prevKey => prevKey + 1);
  }, []);

  useEffect(() => {
    localStorage.setItem("sections", JSON.stringify(sections));
    
  }, [sections]);

  const handleNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const addNewSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      { id: prevSections.length, questionForms: [] },
    ]);
  };

  const addNewQuestionForm = (sectionIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex].questionForms.push({ question: '', selectedOption: 'option1', answerData: {} });
      return updatedSections;
    });
  };

  const deleteSection = (sectionIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections.splice(sectionIndex, 1);
      return updatedSections;
    });
  };

  const deleteQuestionForm = (sectionIndex, formIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex].questionForms = updatedSections[sectionIndex].questionForms.filter((_, i) => i !== formIndex);
      return updatedSections;
    });
  };

  const copyQuestionForm = (sectionIndex, formIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const copiedForm = { ...updatedSections[sectionIndex].questionForms[formIndex] };
      updatedSections[sectionIndex].questionForms.push(copiedForm);
      return updatedSections;
    });
  };

  const moveQuestionUp = (sectionIndex, formIndex) => {
    if (formIndex > 0) {
      setSections((prevSections) => {
        const updatedSections = [...prevSections];
        // Swap elements using array destructuring
        [updatedSections[sectionIndex].questionForms[formIndex - 1], updatedSections[sectionIndex].questionForms[formIndex]] =
          [updatedSections[sectionIndex].questionForms[formIndex], updatedSections[sectionIndex].questionForms[formIndex - 1]];
        return updatedSections;
      });
      forceUpdate();
    }
  };

  const moveQuestionDown = (sectionIndex, formIndex) => {
    if (formIndex < sections[sectionIndex].questionForms.length - 1) {
      setSections((prevSections) => {
        const updatedSections = [...prevSections];
        [updatedSections[sectionIndex].questionForms[formIndex + 1], updatedSections[sectionIndex].questionForms[formIndex]] =
          [updatedSections[sectionIndex].questionForms[formIndex], updatedSections[sectionIndex].questionForms[formIndex + 1]];
        return updatedSections;
      });
      forceUpdate();
    }
  };
  

  const handleQuestionFormChange = (sectionIndex, formIndex, newFormData) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex].questionForms[formIndex] = newFormData;
      return updatedSections;
    });
  };

  if (!sections || sections.length === 0) {
    return null;
  }

  const currentSection = sections[currentSectionIndex];
  const isUserFormPage = location.pathname === "/user-form";

  return (
    <>
      <div style={{paddingTop:"70px"}}>
        {isUserFormPage && (
          <>
            {sections.map((section, sectionIndex) => (
              <React.Fragment key={`${key}-${section.id}`}>
                {sectionIndex > 0 && <hr />}
                <h3 style={{ color: "#673ab7" }}>Page {sectionIndex + 1}</h3>
                <TitleBox onAddNewForm={() => addNewQuestionForm(sectionIndex)} />
                {section.questionForms.map((formData, formIndex) => (
                  <QuestionForm
                    key={`${section.id}-${formIndex}`} // Ensure unique key
                    formIndex={`${sectionIndex}-${formIndex}`}
                    formData={formData}
                    onDelete={() => deleteQuestionForm(sectionIndex, formIndex)}
                    onCopy={() => copyQuestionForm(sectionIndex, formIndex)}
                    onMoveUp={() => moveQuestionUp(sectionIndex, formIndex)}
                    onMoveDown={() => moveQuestionDown(sectionIndex, formIndex)}
                    onChange={(newFormData) => handleQuestionFormChange(sectionIndex, formIndex, newFormData)}
                    onAddNewForm={() => addNewQuestionForm(sectionIndex)}
                    section={addNewSection}
                  />
                ))}
                {sectionIndex > 0 && (
                  <AddSectionButton onClick={() => deleteSection(sectionIndex)}>
                    Remove Section
                  </AddSectionButton>
                )}
              </React.Fragment>
            ))}
          </>
        )}
        {!isUserFormPage && (
          <>
            <h3 style={{ color: "#673ab7" }}>Page {currentSectionIndex + 1}</h3>
            <TitleBox onAddNewForm={() => addNewQuestionForm(currentSectionIndex)} />

            {currentSection.questionForms.map((formData, formIndex) => (
              <QuestionForm
                key={`${currentSection.id}-${formIndex}`} // Ensure unique key
                formIndex={`${currentSectionIndex}-${formIndex}`}
                formData={formData}
                onDelete={() => deleteQuestionForm(currentSectionIndex, formIndex)}
                onMoveUp={() => moveQuestionUp(currentSectionIndex, formIndex)}
                onMoveDown={() => moveQuestionDown(currentSectionIndex, formIndex)}
                onChange={(newFormData) => handleQuestionFormChange(currentSectionIndex, formIndex, newFormData)}
                
              />
            ))}
          </>
        )}
        {!isUserFormPage && (
          
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePreviousSection}
              disabled={currentSectionIndex === 0}
              style={{ marginRight: '10px' }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextSection}
              disabled={currentSectionIndex === sections.length - 1}
            >
              Next
            </Button>
          </div>
          
        )}
      </div>
    </>
  );
};

export default Subform;

// import React, { useState, useEffect } from 'react';
// import TitleBox from '../Components/Forms/TitleBox';
// import QuestionForm from '../Components/Forms/QuetionForm';
// import { AddSectionButton } from '../Styled/SelectedOptionStyles';
// import { Button } from "@mui/material";
// import { useLocation } from "react-router-dom";

// const Subform = () => {
//   const [sections, setSections] = useState(() => {
//     const savedSections = localStorage.getItem("sections");
//     return savedSections ? JSON.parse(savedSections) : [{ id: 0, questionForms: [] }];
//   });

//   const location = useLocation();
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

//   useEffect(() => {
//     localStorage.setItem("sections", JSON.stringify(sections));
//   }, [sections]);

//   const handleNextSection = () => {
//     if (currentSectionIndex < sections.length - 1) {
//       setCurrentSectionIndex(currentSectionIndex + 1);
//     }
//   };

//   const handlePreviousSection = () => {
//     if (currentSectionIndex > 0) {
//       setCurrentSectionIndex(currentSectionIndex - 1);
//     }
//   };

//   const addNewSection = () => {
//     setSections((prevSections) => [
//       ...prevSections,
//       { id: prevSections.length, questionForms: [] },
//     ]);
//   };

//   const addNewQuestionForm = (sectionIndex) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       updatedSections[sectionIndex].questionForms.push({ question: '', selectedOption: 'option1', answerData: {} });
//       return updatedSections;
//     });
//   };

//   const deleteSection = (sectionIndex) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       updatedSections.splice(sectionIndex, 1);
//       return updatedSections;
//     });
//   };

//   const deleteQuestionForm = (sectionIndex, formIndex) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       updatedSections[sectionIndex].questionForms = updatedSections[sectionIndex].questionForms.filter((_, i) => i !== formIndex);
//       return updatedSections;
//     });
//   };

//   const copyQuestionForm = (sectionIndex, formIndex) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       const copiedForm = { ...updatedSections[sectionIndex].questionForms[formIndex] };
//       updatedSections[sectionIndex].questionForms.push(copiedForm);
//       return updatedSections;
//     });
//   };

//   const moveQuestionUp = (sectionIndex, formIndex) => {
//     if (formIndex > 0) {
//       setSections((prevSections) => {
//         const updatedSections = [...prevSections];
//         const temp = updatedSections[sectionIndex].questionForms[formIndex - 1];
//         updatedSections[sectionIndex].questionForms[formIndex - 1] = updatedSections[sectionIndex].questionForms[formIndex];
//         updatedSections[sectionIndex].questionForms[formIndex] = temp;
//         return updatedSections;
//       });
//     }
//   };

//   const moveQuestionDown = (sectionIndex, formIndex) => {
//     if (formIndex < sections[sectionIndex].questionForms.length - 1) {
//       setSections((prevSections) => {
//         const updatedSections = [...prevSections];
//         const temp = updatedSections[sectionIndex].questionForms[formIndex + 1];
//         updatedSections[sectionIndex].questionForms[formIndex + 1] = updatedSections[sectionIndex].questionForms[formIndex];
//         updatedSections[sectionIndex].questionForms[formIndex] = temp;
//         return updatedSections;
//       });
//     }
//   };

//   const handleQuestionFormChange = (sectionIndex, formIndex, newFormData) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       updatedSections[sectionIndex].questionForms[formIndex] = newFormData;
//       return updatedSections;
//     });
//   };

//   if (!sections || sections.length === 0) {
//     return null;
//   }

//   const currentSection = sections[currentSectionIndex];
//   const isUserFormPage = location.pathname === "/user-form";

//   return (
//     <>
//       <div>
//         {isUserFormPage && (
//           <>
//             {sections.map((section, sectionIndex) => (
//               <React.Fragment key={section.id}>
//                 {sectionIndex > 0 && <hr />}
//                 <h3 style={{ color: "#673ab7" }}>Page {sectionIndex + 1}</h3>
//                 <TitleBox onAddNewForm={() => addNewQuestionForm(sectionIndex)} />
//                 {section.questionForms.map((formData, formIndex) => (
//                   <QuestionForm
//                     key={`${section.id}-${formIndex}`} // Ensure unique key
//                     formIndex={`${sectionIndex}-${formIndex}`}
//                     formData={formData}
//                     onDelete={() => deleteQuestionForm(sectionIndex, formIndex)}
//                     onCopy={() => copyQuestionForm(sectionIndex, formIndex)}
//                     onMoveUp={() => moveQuestionUp(sectionIndex, formIndex)}
//                     onMoveDown={() => moveQuestionDown(sectionIndex, formIndex)}
//                     onChange={(newFormData) => handleQuestionFormChange(sectionIndex, formIndex, newFormData)}
//                     onAddNewForm={() => addNewQuestionForm(sectionIndex)}
//                   />
//                 ))}
//                 {sectionIndex > 0 && (
//                   <AddSectionButton onClick={() => deleteSection(sectionIndex)}>
//                     Remove Section
//                   </AddSectionButton>
//                 )}
//               </React.Fragment>
//             ))}
//           </>
//         )}
//         {!isUserFormPage && (
//           <>
//             <h3 style={{ color: "#673ab7" }}>Page {currentSectionIndex + 1}</h3>
//             {currentSection.questionForms.map((formData, formIndex) => (
//               <QuestionForm
//                 key={`${currentSection.id}-${formIndex}`} // Ensure unique key
//                 formIndex={`${currentSectionIndex}-${formIndex}`}
//                 formData={formData}
//                 onDelete={() => deleteQuestionForm(currentSectionIndex, formIndex)}
//                 onMoveUp={() => moveQuestionUp(currentSectionIndex, formIndex)}
//                 onMoveDown={() => moveQuestionDown(currentSectionIndex, formIndex)}
//                 onChange={(newFormData) => handleQuestionFormChange(currentSectionIndex, formIndex, newFormData)}
//               />
//             ))}
//           </>
//         )}
//         {!isUserFormPage && (
//           <div>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handlePreviousSection}
//               disabled={currentSectionIndex === 0}
//               style={{ marginRight: '10px' }}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleNextSection}
//               disabled={currentSectionIndex === sections.length - 1}
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Subform;



// import React, { useState, useEffect } from 'react';
// import TitleBox from '../Components/Forms/TitleBox';
// import QuestionForm from '../Components/Forms/QuetionForm';
// import { AddSectionButton } from '../Styled/SelectedOptionStyles';
// import { Button } from "@mui/material";
// import { useLocation } from "react-router-dom";

// const Subform = () => {
//   const [sections, setSections] = useState(() => {
//     const savedSections = localStorage.getItem("sections");
//     return savedSections ? JSON.parse(savedSections) : [{ id: 0, questionForms: [] }];
//   });

//   const location = useLocation();
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

//   useEffect(() => {
//     localStorage.setItem("sections", JSON.stringify(sections));
//   }, [sections]);

//   const handleNextSection = () => {
//     if (currentSectionIndex < sections.length - 1) {
//       setCurrentSectionIndex(currentSectionIndex + 1);
//     }
//   };

//   const handlePreviousSection = () => {
//     if (currentSectionIndex > 0) {
//       setCurrentSectionIndex(currentSectionIndex - 1);
//     }
//   };

//   const addNewSection = () => {
//     setSections((prevSections) => [
//       ...prevSections,
//       { id: prevSections.length, questionForms: [] },
//     ]);
//   };

//   const addNewQuestionForm = (sectionIndex) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       updatedSections[sectionIndex].questionForms.push({ question: '', selectedOption: 'option1', answerData: {} });
//       return updatedSections;
//     });
//   };

//   const deleteSection = (sectionIndex) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       updatedSections.splice(sectionIndex, 1);
//       return updatedSections;
//     });
//   };

//   const deleteQuestionForm = (sectionIndex, formIndex) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       updatedSections[sectionIndex].questionForms = updatedSections[sectionIndex].questionForms.filter((_, i) => i !== formIndex);
//       return updatedSections;
//     });
//   };

//   const copyQuestionForm = (sectionIndex, formIndex) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       const copiedForm = { ...updatedSections[sectionIndex].questionForms[formIndex] };
//       updatedSections[sectionIndex].questionForms.push(copiedForm);
//       return updatedSections;
//     });
//   };

//   const handleQuestionFormChange = (sectionIndex, formIndex, newFormData) => {
//     setSections((prevSections) => {
//       const updatedSections = [...prevSections];
//       updatedSections[sectionIndex].questionForms[formIndex] = newFormData;
//       return updatedSections;
//     });
//   };

//   if (!sections || sections.length === 0) {
//     return null;
//   }

//   const currentSection = sections[currentSectionIndex];
//   const isUserFormPage = location.pathname === "/user-form";

//   return (
//     <>
//       <div>
//         {isUserFormPage && (
//           <>
//             {sections.map((section, sectionIndex) => (
//               <React.Fragment key={section.id}>
//                 {sectionIndex > 0 && <hr />}
//                 <h3 style={{ color: "#673ab7" }}>Page {sectionIndex + 1}</h3>
//                 <TitleBox onAddNewForm={() => addNewQuestionForm(sectionIndex)} />
//                 {section.questionForms.map((formData, formIndex) => (
//                   <QuestionForm
//                     key={formIndex}
//                     formIndex={`${sectionIndex}-${formIndex}`}
//                     formData={formData}
//                     onDelete={() => deleteQuestionForm(sectionIndex, formIndex)}
//                     onCopy={() => copyQuestionForm(sectionIndex, formIndex)}
//                     section={addNewSection}
//                     onChange={(newFormData) => handleQuestionFormChange(sectionIndex, formIndex, newFormData)}
//                     onAddNewForm={()=>  addNewQuestionForm(sectionIndex)}
//                   />
//                 ))}
//                 {sectionIndex > 0 && <AddSectionButton onClick={() => deleteSection(sectionIndex)}>
//                   Remove Section
//                 </AddSectionButton>}
//               </React.Fragment>
//             ))}
//           </>
//         )}
//         {!isUserFormPage && (
//           <>
//             <h3 style={{ color: "#673ab7" }}>Page {currentSectionIndex + 1}</h3>
//             {currentSection.questionForms.map((formData, formIndex) => (
//               <QuestionForm
//                 key={formIndex}
//                 formIndex={`${currentSectionIndex}-${formIndex}`}
//                 formData={formData}
//                 onDelete={() => deleteQuestionForm(currentSectionIndex, formIndex)}
//                 section={addNewSection}
//                 onChange={(newFormData) => handleQuestionFormChange(currentSectionIndex, formIndex, newFormData)}
//               />
//             ))}
//           </>
//         )}
//         {!isUserFormPage && (
//           <div>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handlePreviousSection}
//               disabled={currentSectionIndex === 0}
//               style={{ marginRight: '10px' }}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleNextSection}
//               disabled={currentSectionIndex === sections.length - 1}
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Subform;
