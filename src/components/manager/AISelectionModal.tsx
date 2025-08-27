import React from 'react';
import { Button } from '../ui/button';
import { useI18n } from '@/lib/i18n/provider';

interface AISelectionModalProps {
    open: boolean;
    onConfirm: (isAiAssisted: boolean) => void;
    onCancel: () => void;
}

export const AISelectionModal: React.FC<AISelectionModalProps> = ({
    open,
    onConfirm,
    onCancel
}) => {
    const { t } = useI18n();
    const [selectedOption, setSelectedOption] = React.useState<'ai' | 'no-ai'>('ai');

    if (!open) return null;

    const handleConfirm = () => {
        onConfirm(selectedOption === 'ai');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                {/* Title */}
                <h2 className="text-2xl font-bold text-black text-center mb-4">
                    {t('aiSelection.title')}
                </h2>

                {/* Question */}
                <p className="text-black text-center mb-6">
                    {t('aiSelection.description')}
                </p>

                {/* AI Options */}
                <div className="space-y-4 mb-6">
                    <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedOption === 'ai'
                            ? 'border-lime-500 bg-lime-100'
                            : 'border-gray-400 bg-white'
                            }`}
                        onClick={() => setSelectedOption('ai')}
                    >
                        <div className="font-bold text-center text-black">{t('aiSelection.withAi.title')}</div>
                        <div className="text-sm text-center text-gray-600 mt-1">
                            {t('aiSelection.withAi.description')}
                        </div>
                    </div>

                    <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedOption === 'no-ai'
                            ? 'border-lime-500 bg-lime-100'
                            : 'border-gray-400 bg-white'
                            }`}
                        onClick={() => setSelectedOption('no-ai')}
                    >
                        <div className="font-bold text-center text-black">{t('aiSelection.withoutAi.title')}</div>
                        <div className="text-sm text-center text-gray-600 mt-1">
                            {t('aiSelection.withoutAi.description')}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 w-full justify-center">
                    <Button
                        onClick={onCancel}
                        variant="destructive"
                        className="px-8 text-base font-semibold w-[160px]"
                    >
                        {t('aiSelection.cancel')}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="lime"
                        className="px-8 text-base w-[160px]"
                    >
                        {t('aiSelection.createMatch')}
                    </Button>
                </div>
            </div>
        </div>
    );
};