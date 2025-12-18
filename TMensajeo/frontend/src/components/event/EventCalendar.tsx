import React from 'react';

interface EventCalendarProps {
  events: any[];
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  return (
    <div className="event-calendar">
      <h3>Calendario de Eventos</h3>
      {events.length > 0 ? (
        <div>{events.length} eventos</div>
      ) : (
        <p>No hay eventos</p>
      )}
      {/* Calendar implementation */}
    </div>
  );
};

export default EventCalendar;
