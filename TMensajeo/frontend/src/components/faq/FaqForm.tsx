import React, { useState } from 'react';

interface FaqFormProps {
  onSubmit: (data: any) => void;
}

const FaqForm: React.FC<FaqFormProps> = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ question, answer }); }}>
      <input type="text" placeholder="Pregunta" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <textarea placeholder="Respuesta" value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <button type="submit">Guardar FAQ</button>
    </form>
  );
};

export default FaqForm;
