import React from 'react';
import EventCard from './EventCard';

interface EventListProps {
  events: any[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
