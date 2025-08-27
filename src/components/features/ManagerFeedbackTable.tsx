'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import managerFeedbackService from '@/lib/managerFeedbackService';
import { useI18n } from '@/lib/i18n/provider';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ApiFeedback {
    _id: string;
    feedbackId: string;
    createdBy: {
        userId: string;
        type: 'guest' | 'membership';
    };
    content: string;
    status: 'managerP' | 'adminP' | 'superadminP' | 'resolved';
    needSupport: boolean;
    note?: string;
    history: Array<{
        byId: string;
        byName: string;
        byRole: string;
        action: string;
        note?: string;
        date: string;
    }>;
    createdAt: string;
    updatedAt: string;
    clubId: string;
    tableId: string;
    clubInfo?: {
        clubName: string;
        address: string;
        phoneNumber: string;
        brandId?: string;
        brandName?: string;
    };
    tableInfo?: {
        name: string;
        category: string;
    };
}

export function ManagerFeedbackTable() {
    const router = useRouter();
    const { t } = useI18n();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');
    const [feedbacks, setFeedbacks] = useState<ApiFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemPage = 10;

    useEffect(() => {
        setLoading(true);
        managerFeedbackService.getAllFeedbacks()
            .then((data: any) => {
                setFeedbacks(data.feedbacks);
                setLoading(false);
            })
            .catch(() => {
                toast.error(t('managerFeedbacks.cannotLoadFeedbacks'));
                setFeedbacks([]);
                setLoading(false);
            });
    }, [t]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, selectedDate]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredFeedbacks = feedbacks.filter((fb) => {
        if (fb.status !== 'managerP' && fb.status !== 'adminP' && fb.status !== 'resolved') {
            return false;
        }

        const matchesSearch =
            (fb.clubInfo?.clubName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (fb.tableInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = !selectedDate || (fb.createdAt ? new Date(fb.createdAt).toISOString().slice(0, 10) : '') === selectedDate;

        let matchesStatus = true;
        if (statusFilter === 'pending') {
            matchesStatus = fb.status === 'managerP';
        } else if (statusFilter === 'resolved') {
            matchesStatus = fb.status === 'resolved';
        } else if (statusFilter === 'all') {
            matchesStatus = fb.status === 'managerP' || fb.status === 'adminP' || fb.status === 'resolved';
        }

        return matchesSearch && matchesDate && matchesStatus;
    });

    const sortedFeedbacks = filteredFeedbacks.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
    });

    const totalPages = Math.ceil(sortedFeedbacks.length / itemPage);
    const startIndex = (currentPage - 1) * itemPage;
    const endIndex = startIndex + itemPage;
    const displayedFeedbacks = sortedFeedbacks.slice(startIndex, endIndex);

    const getStatusText = (status: string) => {
        switch (status) {
            case 'resolved': return t('managerFeedbacks.statusResolved');
            case 'managerP': return t('managerFeedbacks.statusManagerP');
            case 'adminP': return t('managerFeedbacks.statusAdminP');
            case 'superadminP': return t('managerFeedbacks.statusSuperadminP');
            default: return t('managerFeedbacks.statusUnknown');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'success';
            case 'managerP': return 'danger';
            case 'adminP': return 'warning';
            case 'superadminP': return 'danger';
            default: return 'danger';
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="backdrop-blur-md border-lime-400 bg-white/60 border border-gray-200 rounded-2xl shadow-lg px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 transition-all duration-300">
                <div className="relative w-full sm:w-90">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-lime-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                        type="text"
                        placeholder={t('managerFeedbacks.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 sm:py-2.5 pl-3 sm:pl-4 pr-8 sm:pr-10 text-sm sm:text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-50">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 sm:py-2.5 pl-3 sm:pl-4 pr-8 sm:pr-10 text-sm font-medium text-black shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none appearance-none"
                        >
                            <option value="all">{t('managerFeedbacks.allStatus')}</option>
                            <option value="pending">{t('managerFeedbacks.pendingStatus')}</option>
                            <option value="resolved">{t('managerFeedbacks.resolvedStatus')}</option>
                        </select>
                        <Image
                            src="/icon/chevron-down_Black.svg"
                            alt="Dropdown"
                            width={20}
                            height={20}
                            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 sm:w-5 sm:h-5"
                        />
                    </div>

                    <div className="relative w-full sm:w-55">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-white/80 border border-gray-200 rounded-xl py-2 sm:py-2.5 pl-3 sm:pl-4 pr-3 sm:pr-4 text-sm sm:text-base font-medium text-black placeholder-gray-400 shadow-sm focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="hidden lg:block overflow-x-auto">
                    <div className="space-y-2 rounded-lg min-w-[800px]">
                        <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
                            <div className="col-span-3 py-3 text-sm xl:text-base">{t('managerFeedbacks.tableColumn')}</div>
                            <div className="col-span-3 py-3 text-sm xl:text-base">{t('managerFeedbacks.clubColumn')}</div>
                            <div className="col-span-3 py-3 text-sm xl:text-base">{t('managerFeedbacks.dateColumn')}</div>
                            <div className="col-span-3 py-3 text-sm xl:text-base">{t('managerFeedbacks.statusColumn')}</div>
                        </div>
                        {loading ? (
                            <div className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">{t('managerFeedbacks.loading')}</div>
                        ) : displayedFeedbacks.length > 0 ? (
                            displayedFeedbacks.map((fb) => (
                                <div
                                    key={fb.feedbackId}
                                    className="grid grid-cols-12 items-center text-center bg-white rounded-lg cursor-pointer hover:bg-lime-50 transition"
                                    onClick={() => router.push(`/manager/feedback/${fb.feedbackId}`)}
                                >
                                    <div className="col-span-3 py-4 font-semibold text-black text-sm xl:text-base px-2">
                                        {fb.tableInfo?.name || t('managerFeedbacks.unknown')}
                                    </div>
                                    <div className="col-span-3 py-4 text-gray-700 text-sm xl:text-base px-2">
                                        {fb.clubInfo?.clubName || ''}
                                    </div>
                                    <div className="col-span-3 py-4 text-gray-700 text-sm xl:text-base px-2">
                                        {fb.createdAt ? new Date(fb.createdAt).toISOString().slice(0, 10) : ''}
                                    </div>
                                    <div className="col-span-3 py-4 flex justify-center px-2">
                                        <Badge
                                            variant={getStatusColor(fb.status)}
                                            className="rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs font-semibold"
                                        >
                                            {getStatusText(fb.status)}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">{t('managerFeedbacks.noFeedbacksFound')}</div>
                        )}
                    </div>
                </div>

                <div className="block lg:hidden space-y-3">
                    {loading ? (
                        <div className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">{t('managerFeedbacks.loading')}</div>
                    ) : displayedFeedbacks.length > 0 ? (
                        displayedFeedbacks.map((fb) => (
                            <div
                                key={fb.feedbackId}
                                className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow touch-manipulation"
                                onClick={() => router.push(`/manager/feedback/${fb.feedbackId}`)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-base mb-1">
                                            {fb.tableInfo?.name || t('managerFeedbacks.unknown')}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{fb.clubInfo?.clubName || ''}</p>
                                    </div>
                                    <Badge
                                        variant={getStatusColor(fb.status)}
                                        className="ml-3 px-3 py-1 rounded-full text-white font-medium text-xs flex-shrink-0"
                                    >
                                        {getStatusText(fb.status)}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <span className="text-gray-500 text-xs font-medium w-8">{t('managerFeedbacks.dateLabel')}</span>
                                        <span className="text-gray-800 text-sm font-medium">
                                            {fb.createdAt ? new Date(fb.createdAt).toISOString().slice(0, 10) : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex justify-end">
                                        <span className="text-lime-600 text-xs font-medium">{t('managerFeedbacks.clickToViewDetails')}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">{t('managerFeedbacks.noFeedbacksFound')}</div>
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 sm:py-3 w-12 sm:w-16 rounded-lg font-medium transition flex items-center justify-center text-xs sm:text-sm ${currentPage === 1
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-lime-400 hover:bg-lime-500 text-white'
                            }`}
                    >
                        <Image
                            src="/icon/chevron-left.svg"
                            alt="Previous"
                            width={20}
                            height={20}
                            className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-2 sm:px-3 py-2 w-8 sm:w-10 rounded-lg font-medium transition flex items-center justify-center text-xs sm:text-sm ${currentPage === page
                                ? 'bg-lime-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 sm:py-3 w-12 sm:w-16 rounded-lg font-medium transition flex items-center justify-center text-xs sm:text-sm ${currentPage === totalPages
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-lime-400 hover:bg-lime-500 text-white'
                            }`}
                    >
                        <Image
                            src="/icon/chevron-right.svg"
                            alt="Next"
                            width={20}
                            height={20}
                            className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                    </button>
                </div>
            )}

            <div className="mt-3 sm:mt-4 text-center text-gray-400 italic text-xs sm:text-sm">
                {t('managerFeedbacks.showingResults').replace('{start}', (startIndex + 1).toString()).replace('{end}', Math.min(endIndex, sortedFeedbacks.length).toString()).replace('{total}', sortedFeedbacks.length.toString())}
            </div>
        </div>
    );
}
