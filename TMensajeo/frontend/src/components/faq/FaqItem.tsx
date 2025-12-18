import React, { useState } from 'react';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <div onClick={() => setIsOpen(!isOpen)}>
        <h4>{question}</h4>
      </div>
      {isOpen && <p>{answer}</p>}
    </div>
  );
};

export default FaqItem;
