"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import { useRouter, useParams } from "next/navigation";
import toast from 'react-hot-toast';
import { adminFeedbackService } from '@/lib/adminFeedbackService';
import FeedbackDetailLayout from "@/components/shared/FeedbackDetailLayout";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { NoteWithToggle } from '@/components/shared/NoteWithToggle';
import EmptyState from '@/components/ui/EmptyState';
import { useI18n } from "@/lib/i18n/provider";

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
  status: 'managerP' | 'adminP' | 'superadminP' | 'resolved';
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

export default function AdminFeedbackDetailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const feedbackId = params?.feedbackId as string;

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [status, setStatus] = useState<Feedback['status']>('adminP');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const feedbackDetailData = await adminFeedbackService.getAllFeedbacks();
        let feedbacksArr: unknown[] = [];
        if (Array.isArray(feedbackDetailData)) feedbacksArr = feedbackDetailData;
        else if (feedbackDetailData && typeof feedbackDetailData === 'object' && Array.isArray((feedbackDetailData as { feedbacks?: unknown[] }).feedbacks)) feedbacksArr = (feedbackDetailData as { feedbacks: unknown[] }).feedbacks;
        else if (feedbackDetailData && typeof feedbackDetailData === 'object' && Array.isArray((feedbackDetailData as { data?: unknown[] }).data)) feedbacksArr = (feedbackDetailData as { data: unknown[] }).data;

        const found = feedbacksArr.find((f) => {
          const obj = f as Partial<Feedback>;
          return obj.feedbackId === feedbackId || obj._id === feedbackId;
        });

        if (found) {
          const feedbackObj = found as Record<string, unknown>;
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
              clubId: String(clubInfo?.clubId || feedbackObj.clubId || ''),
              clubName: String(clubInfo?.clubName || t('feedbacks.deletedClub')),
              address: String(clubInfo?.address || '')
            },
            tableInfo: {
              tableId: String(feedbackObj.tableId || ''),
              tableName: String(tableInfo?.name || t('feedbacks.deletedTable')),
              tableNumber: String(tableInfo?.tableNumber || ''),
              category: String(tableInfo?.category || t('feedbacks.unknown'))
            },
            content: String(feedbackObj.content || ''),
            status: (feedbackObj.status as Feedback['status']) || 'adminP',
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

        // Create a basic feedback structure even when there's an error
        // This allows users to still view the feedback content if available
        const errorFeedback: Feedback = {
          feedbackId: String(feedbackId || ''),
          createdBy: {
            userId: '',
            type: 'guest'
          },
          clubId: '',
          tableId: '',
          clubInfo: {
            clubId: '',
            clubName: t('feedbacks.deletedClub'),
            address: ''
          },
          tableInfo: {
            tableId: '',
            tableName: t('feedbacks.deletedTable'),
            tableNumber: '',
            category: t('feedbacks.unknown')
          },
          content: t('feedbacks.cannotLoadData'),
          status: 'adminP',
          note: '',
          history: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setFeedback(errorFeedback);
        setStatus('adminP');
        setNotes('');
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [feedbackId, isEditMode]);

  const statusOptions = [
    { value: 'managerP', label: t('feedbacks.status.managerP') },
    { value: 'adminP', label: t('feedbacks.status.adminP') },
    { value: 'superadminP', label: t('feedbacks.status.superadminP') },
    { value: 'resolved', label: t('feedbacks.status.resolved') },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'managerP': return 'danger';
      case 'adminP': return 'danger';
      case 'superadminP': return 'danger';
      default: return 'danger';
    }
  };

  const canEdit = feedback?.status === 'managerP' || feedback?.status === 'adminP' || feedback?.status === 'resolved';

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return t('feedbacks.status.resolved');
      case 'managerP': return t('feedbacks.status.managerP');
      case 'adminP': return t('feedbacks.status.adminP');
      case 'superadminP': return t('feedbacks.status.superadminP');
      default: return t('common.unknown');
    }
  };

  const handleSave = async () => {
    try {
      await adminFeedbackService.updateFeedback(feedbackId, {
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
    if (!canEdit) {
      toast.error(t('feedbacks.cannotEditFeedback'));
      return;
    }
    setIsEditMode(true);
    setNotes('');
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <Sidebar />
      <main className="flex-1 bg-white min-h-screen">
        <div className="sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300">
          <HeaderAdminPage />
        </div>
        <div className="px-10 pb-10">
          <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
            <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
              {t('feedbacks.title')}
            </span>
          </div>

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
                label: t('common.tryAgain'),
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
                onClick: () => router.push('/admin/feedbacks'),
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
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6 order-1 md:order-none">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.table.branch')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.clubInfo?.clubName || feedback?.clubId || t('feedbacks.deletedClub')} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.table.table')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.tableInfo?.tableName || feedback?.tableId || t('feedbacks.deletedTable')} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.tableType')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.tableInfo?.category === 'pool-8' ? 'Pool 8' : feedback?.tableInfo?.category === 'carom' ? 'Carom' : feedback?.tableInfo?.category || t('feedbacks.unknown')} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.creatorTypeLabel')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.createdBy?.type === 'guest' ? t('feedbacks.creatorType.guest') : (feedback?.createdBy?.type === 'membership' ? t('feedbacks.creatorType.membership') : '')} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.createdAt')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.createdAt ? new Date(feedback.createdAt).toLocaleString('vi-VN') : t('feedbacks.unknown')} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.updatedAt')}</label>
                    <input className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black" value={feedback?.updatedAt ? new Date(feedback.updatedAt).toLocaleString('vi-VN') : t('feedbacks.unknown')} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('common.status')}</label>
                    {isEditMode && canEdit ? (
                      <div className="relative w-full">
                        <select
                          className="w-full bg-gray-100 rounded-lg px-6 py-3 text-black outline-none appearance-none min-w-[280px] sm:min-w-[320px] lg:min-w-[380px]"
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                    ) : (
                      <Badge
                        variant={getStatusColor(status)}
                        className="text-sm px-2 font-semibold flex-shrink-0 whitespace-nowrap"
                      >
                        {getStatusText(status)}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.feedbackContent')}</label>
                    <textarea
                      className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
                      value={feedback?.content || ''}
                      disabled
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">{t('feedbacks.processingNote')}</label>
                    {isEditMode && canEdit ? (
                      <textarea
                        className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                        placeholder={t('feedbacks.processingNotePlaceholder')}
                      />
                    ) : (
                      <textarea
                        className="w-full bg-gray-100 rounded-lg px-4 py-2 text-black"
                        value={notes}
                        disabled
                        rows={3}
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-6 order-2 md:order-none">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black text-center">{t('feedbacks.processingHistory')}</label>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-[925px] overflow-y-auto">
                      {feedback?.history && feedback.history.length > 0 ? (
                        <div className="space-y-3">
                          {feedback.history
                            .slice()
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 15)
                            .map((item, index) => (
                              <div key={index} className="border-l-4 border-lime-400 pl-4 py-2 bg-white rounded-r-lg">
                                <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-gray-800">{item.byName}</span>
                                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">{item.byRole}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {item.date ? new Date(item.date).toLocaleString('vi-VN') : t('feedbacks.unknown')}
                                  </span>
                                </div>
                                {item.note && (
                                  <NoteWithToggle note={item.note} />
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-400 mb-2">
                            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
                {isEditMode ? (
                  <>
                    <button
                      type="button"
                      className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg order-1 md:order-2 touch-manipulation"
                      onClick={handleSave}
                    >
                      {t('common.save')}
                    </button>
                    <button
                      type="button"
                      className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg order-2 md:order-1 touch-manipulation"
                      onClick={() => router.push('/admin/feedbacks')}
                    >
                      {t('common.back')}
                    </button>
                  </>
                ) : canEdit ? (
                  <>
                    <button
                      type="button"
                      className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg order-1 md:order-2 touch-manipulation"
                      onClick={handleEditMode}
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      type="button"
                      className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg order-2 md:order-1 touch-manipulation"
                      onClick={() => router.push('/admin/feedbacks')}
                    >
                      {t('common.back')}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg touch-manipulation"
                    onClick={() => router.push('/admin/feedbacks')}
                  >
                    {t('common.back')}
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