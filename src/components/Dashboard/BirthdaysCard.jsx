import React, { useState } from 'react';
import { CakeIcon, GiftIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const BirthdaysCard = () => {
  const [activeTab, setActiveTab] = useState('birthdays');

  const birthdaysToday = [
    { name: 'Bhavani R.', initials: 'BR', date: 'Today' },
  ];

  const upcomingBirthdays = [
    { name: 'Bhavana G.', initials: 'BG', date: 'Tomorrow' },
    { name: 'Juhi L.', initials: 'JL', date: 'Tomorrow' },
    { name: 'Tarun K.', initials: 'TK', date: '20 February' },
    { name: 'Sanchi K.', initials: 'SK', date: '20 February' },
    { name: 'Ashok L.', initials: 'AL', date: '21 February' },
  ];

  const newJoiners = [
    { name: 'New Employee', initials: 'NE', date: 'Today' },
  ];

  const tabs = [
    { id: 'birthdays', label: 'Birthdays', count: 1, icon: CakeIcon },
    { id: 'anniversaries', label: 'Work Anniversaries', count: 0, icon: GiftIcon },
    { id: 'joiners', label: 'New Joinees', count: 1, icon: UserPlusIcon },
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'birthdays':
        return {
          today: birthdaysToday,
          upcoming: upcomingBirthdays,
          title: 'Birthdays Today',
          upcomingTitle: 'Upcoming Birthdays',
        };
      case 'anniversaries':
        return {
          today: [],
          upcoming: [],
          title: 'Anniversaries Today',
          upcomingTitle: 'Upcoming Anniversaries',
        };
      case 'joiners':
        return {
          today: newJoiners,
          upcoming: [],
          title: 'New Joiners Today',
          upcomingTitle: 'Upcoming Joiners',
        };
      default:
        return { today: [], upcoming: [], title: '', upcomingTitle: '' };
    }
  };

  const content = getContent();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.count} {tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Today */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">{content.title}</h4>
          {content.today.length > 0 ? (
            <div className="space-y-3">
              {content.today.map((person, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-700 font-semibold">{person.initials}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.date}</p>
                  </div>
                  <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition">
                    Wish
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No {activeTab} today</p>
          )}
        </div>

        {/* Upcoming */}
        {content.upcoming.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">{content.upcomingTitle}</h4>
            <div className="flex flex-wrap gap-3">
              {content.upcoming.map((person, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-gray-700 font-semibold text-xs">{person.initials}</span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium text-center">{person.name.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500">{person.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdaysCard;

