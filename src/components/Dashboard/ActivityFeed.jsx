import React from 'react';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      author: { name: 'B.V. Indra Dhirye', initials: 'BI' },
      recipient: 'Akanksha Kumari Pandey',
      type: 'praise',
      title: 'High Five',
      content:
        'Akanksha is very proactive and has a strong sense of ownership in everything she handles. We appreciate how quickly she takes action and responds to us, always ensuring that they are addressed promptly. Your responsiveness and helpful attitude make a significant difference, and we are happy for your continued support and commitment.',
      time: '3 days ago',
      reactions: 24,
      comments: 3,
    },
    {
      id: 2,
      author: { name: 'Tarun Ahuja', initials: 'TA' },
      recipient: 'Prabhat',
      type: 'praise',
      title: 'Great Work',
      content: 'Prabhat has been doing exceptional work on the project. Keep it up!',
      time: '5 days ago',
      reactions: 12,
      comments: 2,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Feed</h3>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
            {/* Header */}
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-700 font-semibold text-sm">{activity.author.initials}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.author.name}</span> praised{' '}
                  <span className="font-semibold">{activity.recipient}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>

            {/* Content */}
            <div className="ml-[52px] mb-4">
              <h4 className="text-lg font-semibold text-purple-600 mb-2">{activity.title}</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{activity.content}</p>
            </div>

            {/* Actions */}
            <div className="ml-[52px] flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition">
                <HeartIcon className="w-5 h-5" />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition">
                <ChatBubbleLeftIcon className="w-5 h-5" />
                <span className="text-sm">Comment</span>
              </button>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{activity.reactions} reactions</span>
                <span>{activity.comments} Comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;

