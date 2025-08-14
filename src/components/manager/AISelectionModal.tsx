import React from 'react';
import { Button } from '../ui/button';

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
                    Chọn tính năng AI
                </h2>

                {/* Question */}
                <p className="text-black text-center mb-6">
                    Bạn có muốn sử dụng AI trong trận đấu không?
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
                        <div className="font-bold text-center text-black">Có sử dụng AI</div>
                        <div className="text-sm text-center text-gray-600 mt-1">
                            AI sẽ giúp tính điểm của trận đấu
                        </div>
                    </div>

                    <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedOption === 'no-ai'
                            ? 'border-lime-500 bg-lime-100'
                            : 'border-gray-400 bg-white'
                            }`}
                        onClick={() => setSelectedOption('no-ai')}
                    >
                        <div className="font-bold text-center text-black">Không sử dụng AI</div>
                        <div className="text-sm text-center text-gray-600 mt-1">
                            Chỉ sử dụng tính năng cơ bản của trận đấu
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
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="lime"
                        className="px-8 text-base w-[160px]"
                    >
                        Tạo trận đấu
                    </Button>
                </div>
            </div>
        </div>
    );
};