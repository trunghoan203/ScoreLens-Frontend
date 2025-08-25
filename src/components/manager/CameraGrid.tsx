"use client";
import React from 'react';
import { useI18n } from '@/lib/i18n/provider';

interface Camera {
  id: string;
  table: string;
  ip: string;
  username: string;
  password: string;
  status: 'active' | 'inactive';
}

interface CameraGridProps {
  cameras: Camera[];
  onCameraClick?: (id: string) => void;
  onViewCamera?: (id: string) => void;
}

export default function CameraGrid({ cameras, onCameraClick, onViewCamera }: CameraGridProps) {
  const { t } = useI18n();

  return (
    <div className="w-full">
      <div className="hidden lg:block overflow-x-auto">
        <div className="space-y-2 rounded-lg min-w-[800px]">
          <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
            <div className="col-span-4 py-3 text-sm xl:text-base">{t('cameras.tableHeader')}</div>
            <div className="col-span-3 py-3 text-sm xl:text-base">{t('cameras.ipHeader')}</div>
            <div className="col-span-2 py-3 text-sm xl:text-base">{t('cameras.statusHeader')}</div>
            <div className="col-span-3 py-3 text-sm xl:text-base">{t('cameras.actionsHeader')}</div>
          </div>
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
              onClick={() => onCameraClick && onCameraClick(camera.id)}
            >
              <div className="col-span-4 py-4 font-semibold text-black text-sm xl:text-base px-2">{camera.table}</div>
              <div className="col-span-3 py-4 text-gray-700 text-sm xl:text-base px-2">{camera.ip}</div>
              <div className="col-span-2 py-4 flex justify-center px-2">
                <span className={`px-3 py-1 rounded-full text-white font-semibold text-xs xl:text-sm
                  ${camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {camera.status === 'active' ? t('cameras.connected') : t('cameras.notConnected')}
                </span>
              </div>
              <div className="col-span-3 py-4 flex justify-center px-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewCamera && onViewCamera(camera.id);
                  }}
                  disabled={camera.status !== 'active'}
                  className={`px-3 py-1 rounded-full text-white font-semibold text-xs xl:text-sm ${camera.status === 'active'
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                >
                  {t('cameras.viewCamera')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="block lg:hidden space-y-3">
        {cameras.map((camera) => (
          <div
            key={camera.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow touch-manipulation"
            onClick={() => onCameraClick && onCameraClick(camera.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{camera.table}</h3>
                <p className="text-gray-600 text-sm">{camera.ip}</p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-white font-semibold text-xs
                  ${camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {camera.status === 'active' ? t('cameras.connected') : t('cameras.notConnected')}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">{t('cameras.statusLabel')}</span>
                <span className={`text-xs font-medium ${camera.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {camera.status === 'active' ? t('cameras.status.active') : t('cameras.status.inactive')}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-lime-600 text-xs font-medium">{t('cameras.clickToViewDetails')}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewCamera && onViewCamera(camera.id);
                  }}
                  disabled={camera.status !== 'active'}
                  className={`px-3 py-1 rounded-full text-white font-semibold text-xs ${camera.status === 'active'
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                >
                  {t('cameras.viewCamera')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
