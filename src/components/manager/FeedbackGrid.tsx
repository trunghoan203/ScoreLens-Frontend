"use client";
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n/provider';

interface Feedback {
  id: string;
  branch: string;
  table: string;
  time: string;
  status: 'managerP' | 'adminP' | 'superadminP' | 'resolved';
  feedback: string;
  notes: string;
  createdAt: Date;
}

interface FeedbackGridProps {
  feedbacks: Feedback[];
  onFeedbackClick?: (id: string) => void;
}

export default function FeedbackGrid({
  feedbacks,
  onFeedbackClick
}: FeedbackGridProps) {
  const { t } = useI18n();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'managerP': return 'danger';
      case 'adminP': return 'danger';
      case 'superadminP': return 'danger';
      default: return 'danger';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return t('feedbacks.status.resolved');
      case 'managerP': return t('feedbacks.status.managerP');
      case 'adminP': return t('feedbacks.status.adminP');
      case 'superadminP': return t('feedbacks.status.superadminP');
      default: return 'Không xác định';
    }
  };

  return (
    <div className="w-full">
      <div className="hidden lg:block overflow-x-auto">
        <div className="space-y-2 rounded-lg min-w-[800px]">
          <div className="grid grid-cols-4 bg-black text-white font-semibold text-center">
            <div className="py-3 text-sm xl:text-base">{t('feedbacks.table.branch')}</div>
            <div className="py-3 text-sm xl:text-base">{t('feedbacks.table.table')}</div>
            <div className="py-3 text-sm xl:text-base">{t('feedbacks.table.time')}</div>
            <div className="py-3 text-sm xl:text-base">{t('feedbacks.table.status')}</div>
          </div>
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="grid grid-cols-4 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
              onClick={() => onFeedbackClick && onFeedbackClick(feedback.id)}
            >
              <div className="py-4 font-semibold text-black text-sm xl:text-base px-2">{feedback.branch}</div>
              <div className="py-4 text-gray-700 text-sm xl:text-base px-2">{feedback.table}</div>
              <div className="py-4 text-gray-700 text-sm xl:text-base px-2">{feedback.time}</div>
              <div className="py-4 flex justify-center px-2">
                <Badge
                  variant={getStatusColor(feedback.status)}
                  className="text-sm font-semibold flex-shrink-0 whitespace-nowrap"
                >
                  {getStatusText(feedback.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="block lg:hidden space-y-3">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow touch-manipulation"
            onClick={() => onFeedbackClick && onFeedbackClick(feedback.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{feedback.branch}</h3>
                <p className="text-gray-600 text-sm">{feedback.table}</p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <Badge
                  variant={getStatusColor(feedback.status)}
                  className="text-sm font-semibold flex-shrink-0 whitespace-nowrap"
                >
                  {getStatusText(feedback.status)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">{t('feedbacks.timeLabel')}</span>
                <span className="text-gray-800 text-xs font-medium">{feedback.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">{t('feedbacks.statusLabel')}</span>
                <span className={`text-xs font-medium ${feedback.status === 'resolved' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {getStatusText(feedback.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}