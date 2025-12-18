import React from 'react';
import FaqItem from './FaqItem';

interface FaqListProps {
  faqs: any[];
}

const FaqList: React.FC<FaqListProps> = ({ faqs }) => {
  return (
    <div className="faq-list">
      {faqs.map((faq) => (
        <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FaqList;
