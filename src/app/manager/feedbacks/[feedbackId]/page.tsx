"use client";
import React, { useState, useEffect } from 'react';
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import { useRouter, useParams } from "next/navigation";
import toast from 'react-hot-toast';
import { managerFeedbackService } from '@/lib/managerFeedbackService';
import FeedbackDetailLayout from "@/components/shared/FeedbackDetailLayout";
import FeedbackPageBanner from "@/components/manager/FeedbackPageBanner";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { NoteWithToggle } from '@/components/shared/NoteWithToggle';
import EmptyState from '@/components/ui/EmptyState';
import { useI18n } from '@/lib/i18n/provider';

interface Feedback {
  feedbackId: string;
  _id?: string;
  createdBy: {
    userId: string;
    type: 'guest' | 'membership';
  };
  clubId: string;
  tableId: string;
  clubInfo?: {
    clubId: string;
    clubName: string;
    address?: string;
  };
  tableInfo?: {
    tableId: string;
    tableName: string;
    tableNumber?: string;
    category?: string;
  };
  content: string;
  status: 'managerP' | 'adminP' | 'resolved';
  note?: string;
  history: Array<{
    byId: string;
    byName: string;
    byRole: string;
    note?: string;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export default function FeedbackDetailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const feedbackId = params?.feedbackId as string;

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [status, setStatus] = useState<Feedback['status']>('managerP');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const feedbackDetailData = await managerFeedbackService.getFeedbackDetail(feedbackId);
        let feedbackObj: Record<string, unknown> | undefined;
        if (feedbackDetailData && typeof feedbackDetailData === 'object') {
          const data = feedbackDetailData as Record<string, unknown>;
          if (data.feedback) {
            feedbackObj = data.feedback as Record<string, unknown>;
          } else if (data.data && typeof data.data === 'object' && (data.data as Record<string, unknown>).feedback) {
            feedbackObj = (data.data as Record<string, unknown>).feedback as Record<string, unknown>;
          } else {
            feedbackObj = data;
          }
        }

        if (feedbackObj) {
          const tableInfo = feedbackObj.tableInfo as Record<string, unknown> | undefined;
          const clubInfo = feedbackObj.clubInfo as Record<string, unknown> | undefined;
          const createdBy = feedbackObj.createdBy as Record<string, unknown> | undefined;
          const history = feedbackObj.history as Array<Record<string, unknown>> | undefined;

          const mappedFeedback: Feedback = {
            feedbackId: String(feedbackObj.feedbackId || feedbackObj._id || ''),
            createdBy: {
              userId: String(createdBy?.userId || ''),
              type: (createdBy?.type as 'guest' | 'membership') || 'guest'
            },
            clubId: String(feedbackObj.clubId || ''),
            tableId: String(feedbackObj.tableId || ''),
            clubInfo: {
              clubId: String(clubInfo?.clubId || ''),
              clubName: String(clubInfo?.clubName || ''),
              address: String(clubInfo?.address || '')
            },
            tableInfo: {
              tableId: String(feedbackObj.tableId || ''),
              tableName: String(tableInfo?.name || t('common.unknown')),
              tableNumber: String(tableInfo?.tableNumber || ''),
              category: String(tableInfo?.category || t('common.unknown'))
            },
            content: String(feedbackObj.content || ''),
            status: (feedbackObj.status as Feedback['status']) || 'pending',
            note: String(feedbackObj.note || ''),
            history: (history || []).map(h => ({
              byId: String(h.byId || ''),
              byName: String(h.byName || ''),
              byRole: String(h.byRole || ''),
              note: String(h.note || ''),
              date: h.date ? new Date(h.date as string) : new Date()
            })),
            createdAt: feedbackObj.createdAt ? new Date(feedbackObj.createdAt as string) : new Date(),
            updatedAt: feedbackObj.updatedAt ? new Date(feedbackObj.updatedAt as string) : new Date(),
          };

          setFeedback(mappedFeedback);
          setStatus(mappedFeedback.status);
          let latestNote = '';
          if (mappedFeedback.history && mappedFeedback.history.length > 0) {
            const sortedHistory = [...mappedFeedback.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            latestNote = sortedHistory.find(h => h.note && h.note.trim() !== '')?.note || '';
          }
          if (!isEditMode) {
            setNotes(latestNote || mappedFeedback.note || '');
          } else {
            setNotes('');
          }
          setError(null);
        } else {
          setError(t('feedbacks.notFound'));
        }
      } catch (error) {
        console.error('Error fetching feedback detail:', error);
        setError(t('feedbacks.cannotLoadData'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [feedbackId, isEditMode]);

  const statusOptions = [
    { value: 'managerP', label: t('feedbacks.status.managerP') },
    { value: 'adminP', label: t('feedbacks.status.adminP') },
    { value: 'resolved', label: t('feedbacks.status.resolved') },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'managerP': return 'danger';
      case 'adminP': return 'danger';
      default: return 'danger';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return t('feedbacks.status.resolved');
      case 'managerP': return t('feedbacks.status.managerP');
      case 'adminP': return t('feedbacks.status.adminP');
      default: return t('common.unknown');
    }
  };

  const handleSave = async () => {
    try {
      await managerFeedbackService.updateFeedback(feedbackId, {
        note: notes,
        status,
      });
      toast.success(t('feedbacks.saveSuccess'));
      setIsEditMode(false);
      setNotes('');
    } catch (error) {
      console.error(error);
      toast.error(t('feedbacks.saveFailed'));
    }
  };

  const handleEditMode = () => {
    setIsEditMode(true);
    setNotes('');
  }

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <SidebarManager />
      <main className="flex-1 bg-white min-h-screen lg:ml-0">
        <div className="sticky top-0 z-10 bg-[#FFFFFF] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 transition-all duration-300">
          <HeaderManager />
        </div>
        <div className="px-4 sm:px-6 lg:px-10 pb-10 pt-16 lg:pt-0">
          <FeedbackPageBanner />
          {loading ? (
            <div className="py-8">
              <LoadingSkeleton type="card" lines={6} className="w-full max-w-2xl mx-auto" />
            </div>
          ) : error ? (
            <EmptyState
              icon={
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
              title={error}
              description={t('feedbacks.loadErrorDescription')}
              primaryAction={{
                label: t('messages.tryAgain'),
                onClick: () => {
                  setError(null);
                  window.location.reload();
                },
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )
              }}
              secondaryAction={{
                label: t('feedbacks.backToList'),
                onClick: () => router.push('/manager/feedbacks'),
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                )
              }}
              showAdditionalInfo={false}
            />
          ) : feedback ? (
            <FeedbackDetailLayout title={t('feedbacks.manageFeedback')}>
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                <div className="flex-1 space-y-4 sm:space-y-6 order-1 lg:order-none">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.table.branch')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black text-sm sm:text-base" value={feedback?.clubInfo?.clubName || feedback?.clubId || ''} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.table.table')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black text-sm sm:text-base" value={feedback?.tableInfo?.tableName || feedback?.tableId || ''} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.tableType')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black text-sm sm:text-base" value={feedback?.tableInfo?.category === 'pool-8' ? 'Pool - 8' : feedback?.tableInfo?.category === 'carom' ? 'Carom' : feedback?.tableInfo?.category || t('common.unknown')} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.creatorTypeLabel')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black text-sm sm:text-base" value={feedback?.createdBy?.type === 'guest' ? t('feedbacks.creatorType.guest') : (feedback?.createdBy?.type === 'membership' ? t('feedbacks.creatorType.membership') : '')} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.createdAt')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black text-sm sm:text-base" value={feedback?.createdAt ? new Date(feedback.createdAt).toLocaleString('vi-VN') : ''} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.updatedAt')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black text-sm sm:text-base" value={feedback?.updatedAt ? new Date(feedback.updatedAt).toLocaleString('vi-VN') : ''} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.feedbackStatus')}</label>
                    {isEditMode ? (
                      <div className="relative w-full">
                        <select
                          className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black outline-none appearance-none text-sm sm:text-base"
                          value={status}
                          onChange={e => setStatus(e.target.value as Feedback['status'])}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <Image
                          src="/icon/chevron-down_Black.svg"
                          alt="Dropdown"
                          width={20}
                          height={20}
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                    ) : (
                      <Badge
                        variant={getStatusColor(status)}
                        className="text-sm font-semibold flex-shrink-0 whitespace-nowrap"
                      >
                        {getStatusText(status)}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.feedbackContent')}</label>
                    <textarea
                      className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black text-sm sm:text-base"
                      value={feedback?.content || ''}
                      disabled
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.processingNote')}</label>
                    {isEditMode ? (
                      <textarea
                        className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black text-sm sm:text-base"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                        placeholder={t('feedbacks.processingNotePlaceholder')}
                      />
                    ) : (
                      <textarea
                        className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-black text-sm sm:text-base"
                        value={notes}
                        disabled
                        rows={3}
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-4 sm:space-y-6 order-2 lg:order-none">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black text-center">{t('feedbacks.processingHistory')}</label>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 max-h-[600px] sm:max-h-[925px] overflow-y-auto">
                      {feedback?.history && feedback.history.length > 0 ? (
                        <div className="space-y-3">
                          {feedback.history
                            .slice()
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 15)
                            .map((item, index) => (
                              <div key={index} className="border-l-4 border-lime-400 pl-3 sm:pl-4 py-2 bg-white rounded-r-lg">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-xs sm:text-sm text-gray-800">{item.byName}</span>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">{item.byRole}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {item.date ? new Date(item.date).toLocaleString('vi-VN') : ''}
                                  </span>
                                </div>
                                {item.note && (
                                  <NoteWithToggle note={item.note} />
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 sm:py-8">
                          <div className="text-gray-400 mb-2">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-sm font-medium">{t('feedbacks.noProcessingHistory')}</p>
                          <p className="text-gray-400 text-xs mt-1">{t('feedbacks.processingHistoryDescription')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row w-full justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  type="button"
                  className="w-full sm:w-32 lg:w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
                  onClick={() => router.push('/manager/feedbacks')}
                >
                  {t('feedbacks.back')}
                </button>

                {isEditMode ? (
                  <button
                    type="button"
                    className="w-full sm:w-32 lg:w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
                    onClick={handleSave}
                  >
                    {t('feedbacks.save')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full sm:w-32 lg:w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
                    onClick={handleEditMode}
                  >
                    {t('feedbacks.edit')}
                  </button>
                )}
              </div>
            </FeedbackDetailLayout>
          ) : null}
        </div>
      </main>
    </div>
  );
} 