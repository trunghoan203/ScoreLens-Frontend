"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from "next/navigation";
import { HeaderSuperAdmin } from '@/components/shared/HeaderSuperAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { getFeedbackDetail, updateFeedback } from '@/lib/saFeedbackService';
import { useSuperAdminAuthGuard } from '@/lib/hooks/useSuperAdminAuthGuard';
import { useI18n } from '@/lib/i18n/provider';
import toast from 'react-hot-toast';
import FeedbackDetailLayout from "@/components/shared/FeedbackDetailLayout";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { NoteWithToggle } from '@/components/shared/NoteWithToggle';
import EmptyState from '@/components/ui/EmptyState';

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
    brandName?: string;
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

export default function FeedbackDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { isChecking } = useSuperAdminAuthGuard();
  const { t } = useI18n();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [status, setStatus] = useState<Feedback['status']>('adminP');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const feedbackDetailData = await getFeedbackDetail(id);
        let feedbackObj: Record<string, unknown> | undefined;

        if (feedbackDetailData && typeof feedbackDetailData === 'object' && 'data' in feedbackDetailData) {
          const data = feedbackDetailData.data as Record<string, unknown>;
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
              clubId: String(clubInfo?.clubId || feedbackObj.clubId || ''),
              clubName: String(clubInfo?.clubName || t('superAdminFeedbackDetail.deletedClub')),
              address: String(clubInfo?.address || ''),
              brandName: String(clubInfo?.brandName || t('superAdminFeedbackDetail.unknown'))
            },
            tableInfo: {
              tableId: String(feedbackObj.tableId || ''),
              tableName: String(tableInfo?.name || t('superAdminFeedbackDetail.deletedTable')),
              tableNumber: String(tableInfo?.tableNumber || ''),
              category: String(tableInfo?.category || t('superAdminFeedbackDetail.unknown'))
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
          if (mappedFeedback.status === 'managerP') {
            setStatus('adminP');
          } else {
            setStatus(mappedFeedback.status);
          }
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
          // Even if feedback object is not found, we can still show a basic structure
          // to prevent the page from crashing
          const basicFeedback: Feedback = {
            feedbackId: String(id || ''),
            createdBy: {
              userId: '',
              type: 'guest'
            },
            clubId: '',
            tableId: '',
            clubInfo: {
              clubId: '',
              clubName: t('superAdminFeedbackDetail.deletedClub'),
              address: '',
              brandName: t('superAdminFeedbackDetail.unknown')
            },
            tableInfo: {
              tableId: '',
              tableName: t('superAdminFeedbackDetail.deletedTable'),
              tableNumber: '',
              category: t('superAdminFeedbackDetail.unknown')
            },
            content: t('superAdminFeedbackDetail.feedbackNotFound'),
            status: 'superadminP',
            note: '',
            history: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setFeedback(basicFeedback);
          setStatus('superadminP');
          setNotes('');
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching feedback detail:', error);

        // Create a basic feedback structure even when there's an error
        // This allows users to still view the feedback content if available
        const errorFeedback: Feedback = {
          feedbackId: String(id || ''),
          createdBy: {
            userId: '',
            type: 'guest'
          },
          clubId: '',
          tableId: '',
          clubInfo: {
            clubId: '',
            clubName: t('superAdminFeedbackDetail.deletedClub'),
            address: '',
            brandName: t('superAdminFeedbackDetail.unknown')
          },
          tableInfo: {
            tableId: '',
            tableName: t('superAdminFeedbackDetail.deletedTable'),
            tableNumber: '',
            category: t('superAdminFeedbackDetail.unknown')
          },
          content: t('superAdminFeedbackDetail.cannotLoadFeedback'),
          status: 'superadminP',
          note: '',
          history: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setFeedback(errorFeedback);
        setStatus('superadminP');
        setNotes('');
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, t]);

  const statusOptions = [
    { value: 'adminP', label: t('superAdminFeedbackDetail.adminProcessing') },
    { value: 'superadminP', label: t('superAdminFeedbackDetail.superAdminProcessing') },
    { value: 'resolved', label: t('superAdminFeedbackDetail.resolved') },
  ];

  const canEditFeedback = feedback?.status === 'superadminP';

  const hasBeenProcessedBySuperAdmin = feedback?.status === 'resolved';

  const canShowEditButton = canEditFeedback && !hasBeenProcessedBySuperAdmin;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'adminP': return 'danger';
      case 'superadminP': return 'danger';
      default: return 'danger';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return t('superAdminFeedbackDetail.statusResolved');
      case 'adminP': return t('superAdminFeedbackDetail.statusAdminP');
      case 'superadminP': return t('superAdminFeedbackDetail.statusSuperadminP');
      default: return t('superAdminFeedbackDetail.statusUnknown');
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'pool-8': return t('superAdminFeedbackDetail.pool8');
      case 'carom': return t('superAdminFeedbackDetail.carom');
      default: return category;
    }
  };

  const handleSave = async () => {
    try {
      if (!id) return;

      await updateFeedback(id, {
        note: notes,
        status,
      });
      toast.success(t('superAdminFeedbackDetail.updateSuccess'));
      setIsEditMode(false);
      setNotes('');
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };

      const message = err.response?.data?.message;
      const errors = err.response?.data?.errors;

      if (errors?.note && errors.note.length > 0) {
        toast.error(errors.note[0]);
      } else if (message) {
        toast.error(message);
      } else {
        toast.error(t('superAdminFeedbackDetail.updateFailed'));
      }
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      setIsEditMode(false);
      if (feedback) {
        setStatus(feedback.status);
        let latestNote = '';
        if (feedback.history && feedback.history.length > 0) {
          const sortedHistory = [...feedback.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          latestNote = sortedHistory.find(h => h.note && h.note.trim() !== '')?.note || '';
        }
        setNotes(latestNote || feedback.note || '');

      }
    } else {
      router.push('/superadmin/home?tab=feedback');
    }
  };

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">{t('superAdminFeedbackDetail.checking')}</div>;
  }

  if (loading) return (
    <div className="py-6 sm:py-8">
      <LoadingSkeleton type="card" lines={6} className="w-full max-w-2xl mx-auto" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col bg-[#FFFFFF] items-center py-8 sm:py-10 px-4 min-h-screen w-full">
      <EmptyState
        icon={
          <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        }
        title={error}
        description={t('superAdminFeedbackDetail.errorLoadingFeedback')}
        primaryAction={{
          label: t('superAdminFeedbackDetail.tryAgain'),
          onClick: () => {
            setError(null);
            window.location.reload();
          },
          icon: (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        }}
        secondaryAction={{
          label: t('superAdminFeedbackDetail.backToList'),
          onClick: () => router.push('/superadmin/home?tab=feedback'),
          icon: (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          )
        }}
        showAdditionalInfo={false}
      />
    </div>
  );

  if (!feedback) return <div className="p-4 text-center text-red-500">{t('superAdminFeedbackDetail.feedbackNotFound')}</div>;

  return (
    <>
      <HeaderSuperAdmin />
      <PageBanner title={t('superAdminFeedbackDetail.pageTitle')} />
      <div className="flex flex-col bg-[#FFFFFF] items-center py-6 sm:py-8 lg:py-10 px-4 min-h-screen w-full">
        <div className="w-full max-w-none">
          <FeedbackDetailLayout title={t('superAdminFeedbackDetail.managementTitle')}>
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 w-full">
              <div className="flex-1 space-y-4 sm:space-y-6 order-1 lg:order-none">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.brandLabel')}</label>
                  <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black" value={feedback.clubInfo?.brandName || t('superAdminFeedbackDetail.unknown')} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.branchLabel')}</label>
                  <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black" value={feedback.clubInfo?.clubName || feedback.clubId || t('superAdminFeedbackDetail.deletedClub')} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.tableLabel')}</label>
                  <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black" value={feedback.tableInfo?.tableName || feedback.tableId || t('superAdminFeedbackDetail.deletedTable')} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.tableTypeLabel')}</label>
                  <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black" value={getCategoryText(feedback.tableInfo?.category || '')} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.creatorTypeLabel')}</label>
                  <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black" value={feedback.createdBy?.type === 'guest' ? t('superAdminFeedbackDetail.guest') : t('superAdminFeedbackDetail.membership')} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.createdAtLabel')}</label>
                  <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black" value={feedback.createdAt ? new Date(feedback.createdAt).toLocaleString('vi-VN') : t('superAdminFeedbackDetail.unknown')} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.updatedAtLabel')}</label>
                  <input className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black" value={feedback.updatedAt ? new Date(feedback.updatedAt).toLocaleString('vi-VN') : t('superAdminFeedbackDetail.unknown')} disabled />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.statusLabel')}</label>
                  {isEditMode ? (
                    <div className="relative w-full">
                      <select
                        className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black outline-none appearance-none"
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
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.contentLabel')}</label>
                  <textarea
                    className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black"
                    value={feedback.content}
                    disabled
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">{t('superAdminFeedbackDetail.processingNoteLabel')}</label>
                  {isEditMode ? (
                    <textarea
                      className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                      placeholder={t('superAdminFeedbackDetail.editPlaceholder')}
                    />
                  ) : (
                    <textarea
                      className="w-full bg-gray-100 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base text-black"
                      value={notes}
                      disabled
                      rows={3}
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-4 sm:space-y-6 order-2 lg:order-none">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-center text-black">{t('superAdminFeedbackDetail.processingHistoryLabel')}</label>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 max-h-[600px] sm:max-h-[925px] overflow-y-auto">
                    {feedback.history && feedback.history.length > 0 ? (
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
                                  {item.date ? new Date(item.date).toLocaleString('vi-VN') : t('superAdminFeedbackDetail.unknown')}
                                </span>
                              </div>
                              {item.note && <NoteWithToggle note={item.note} />}
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
                        <p className="text-gray-500 text-xs sm:text-sm font-medium">{t('superAdminFeedbackDetail.noProcessingHistory')}</p>
                        <p className="text-gray-400 text-xs mt-1">{t('superAdminFeedbackDetail.noProcessingHistoryDescription')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              {isEditMode ? (
                <>
                  <button
                    type="button"
                    className="w-full sm:w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-2 sm:order-1"
                    onClick={handleCancel}
                  >
                    {t('superAdminFeedbackDetail.cancel')}
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-1 sm:order-2"
                    onClick={handleSave}
                  >
                    {t('superAdminFeedbackDetail.save')}
                  </button>
                </>
              ) : feedback?.status === 'superadminP' ? (
                <>
                  <button
                    type="button"
                    className="w-full sm:w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-2 sm:order-1"
                    onClick={handleCancel}
                  >
                    {t('superAdminFeedbackDetail.back')}
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg order-1 sm:order-2"
                    onClick={() => setIsEditMode(true)}
                  >
                    {t('superAdminFeedbackDetail.edit')}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="w-full sm:w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
                  onClick={handleCancel}
                >
                  {t('superAdminFeedbackDetail.back')}
                </button>
              )}
            </div>
          </FeedbackDetailLayout>
        </div>
      </div>
    </>
  );
}
