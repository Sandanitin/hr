import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Modal from '../../components/Common/Modal';
import { CalendarIcon, PlusIcon, ClockIcon, MapPinIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const HRCalendar = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [events, setEvents] = useState([
    { id: 1, title: 'Team Meeting', date: '2024-03-15', time: '10:00 AM', location: 'Conference Room A', type: 'meeting', attendees: ['John Doe', 'Jane Smith'] },
    { id: 2, title: 'Training Session', date: '2024-03-18', time: '02:00 PM', location: 'Training Hall', type: 'training', attendees: ['All Employees'] },
    { id: 3, title: 'Company Holiday', date: '2024-03-20', time: 'All Day', location: 'Office Closed', type: 'holiday', attendees: [] },
    { id: 4, title: 'Performance Review', date: '2024-03-22', time: '11:00 AM', location: 'HR Office', type: 'review', attendees: ['Bob Wilson'] },
  ]);

  const eventTypes = {
    meeting: { color: 'bg-blue-500', label: 'Meeting' },
    training: { color: 'bg-green-500', label: 'Training' },
    holiday: { color: 'bg-red-500', label: 'Holiday' },
    review: { color: 'bg-purple-500', label: 'Review' },
    other: { color: 'bg-gray-500', label: 'Other' },
  };

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const calendarDays = getDaysInMonth(currentDate);

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const filteredEvents = events.filter(event => {
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSaveEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      id: editingEvent ? editingEvent.id : events.length + 1,
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
      location: formData.get('location'),
      type: formData.get('type'),
      attendees: formData.get('attendees') ? formData.get('attendees').split(',').map(a => a.trim()) : [],
      description: formData.get('description') || '',
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? newEvent : e));
      toast.success('Event updated successfully!');
    } else {
      setEvents([...events, newEvent]);
      toast.success('Event created successfully!');
    }
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      setEvents(events.filter(e => e.id !== event.id));
      toast.success('Event deleted successfully!');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar & Events</h1>
            <p className="text-gray-600 mt-1">Manage company events, meetings, and holidays</p>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowEventModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Event
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Events</p>
            <p className="text-3xl font-bold text-gray-900">{events.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-blue-600">
              {events.filter(e => {
                const eventDate = new Date(e.date);
                return eventDate.getMonth() === currentDate.getMonth() && 
                       eventDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Meetings</p>
            <p className="text-3xl font-bold text-green-600">
              {events.filter(e => e.type === 'meeting').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Holidays</p>
            <p className="text-3xl font-bold text-red-600">
              {events.filter(e => e.type === 'holiday').length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <CalendarIcon className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">{currentMonth}</h2>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-700 py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="h-24"></div>;
                }
                const dayEvents = getEventsForDate(day);
                return (
                  <div
                    key={index}
                    className="h-24 border border-gray-200 rounded-lg p-2 flex flex-col cursor-pointer hover:bg-gray-50 transition"
                  >
                    <span className="text-sm font-medium mb-1">{day}</span>
                    <div className="flex-1 overflow-y-auto space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded ${eventTypes[event.type]?.color || eventTypes.other.color} text-white truncate`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredEvents
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 10)
                .map(event => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => {
                      setEditingEvent(event);
                      setShowEventModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className={`w-3 h-3 rounded-full ${eventTypes[event.type]?.color || eventTypes.other.color} mr-2`}></div>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event);
                        }}
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Search Events */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
        size="lg"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
            <input
              type="text"
              name="title"
              defaultValue={editingEvent?.title || ''}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter event title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                defaultValue={editingEvent?.date || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
              <input
                type="text"
                name="time"
                defaultValue={editingEvent?.time || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 10:00 AM or All Day"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                defaultValue={editingEvent?.location || ''}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
              <select
                name="type"
                defaultValue={editingEvent?.type || 'meeting'}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="meeting">Meeting</option>
                <option value="training">Training</option>
                <option value="holiday">Holiday</option>
                <option value="review">Performance Review</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
            <input
              type="text"
              name="attendees"
              defaultValue={editingEvent?.attendees?.join(', ') || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Comma-separated list of attendees"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              defaultValue={editingEvent?.description || ''}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter event description"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setShowEventModal(false);
                setEditingEvent(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default HRCalendar;

