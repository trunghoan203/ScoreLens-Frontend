import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from '@/lib/config';

interface DashboardStats {
    totalTables: number;
    inUse: number;
    available: number;
    members: number;
}

interface UseDashboardWebSocketProps {
    onStatsUpdate: (stats: DashboardStats) => void;
    enabled?: boolean;
}

export const useDashboardWebSocket = ({
    onStatsUpdate,
    enabled = true
}: UseDashboardWebSocketProps) => {
    const socketRef = useRef<Socket | null>(null);
    const isConnected = useRef(false);

    useEffect(() => {
        if (!enabled) return;

        const newSocket = io(config.socketUrl, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        newSocket.on('connect', () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('managerAccessToken') : null;
                if (token) {
                    const [, payloadB64] = token.split('.');
                    const json = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
                    const managerId: string | undefined = json?.managerId;
                    if (managerId) {
                        newSocket.emit('join_role_room', { userId: managerId, role: 'manager' });
                    }
                } else {
                    newSocket.emit('join_role_room', { userId: undefined, role: 'manager' });
                }
            } catch {
                newSocket.emit('join_role_room', { userId: undefined, role: 'manager' });
            }
            isConnected.current = true;
        });

        newSocket.on('dashboard_stats_updated', (stats: DashboardStats) => {
            onStatsUpdate(stats);
        });

        newSocket.on('match_created', () => {
            // Trigger stats update when new match is created
            newSocket.emit('request_dashboard_stats');
        });

        newSocket.on('match_ended', () => {
            // Trigger stats update when match ends
            newSocket.emit('request_dashboard_stats');
        });

        newSocket.on('table_status_changed', () => {
            // Trigger stats update when table status changes
            newSocket.emit('request_dashboard_stats');
        });

        newSocket.on('disconnect', () => {
            isConnected.current = false;
        });

        socketRef.current = newSocket;

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                isConnected.current = false;
            }
        };
    }, [enabled, onStatsUpdate]);

    const requestStats = () => {
        if (socketRef.current && isConnected.current) {
            socketRef.current.emit('request_dashboard_stats');
        }
    };

    return {
        isConnected: isConnected.current,
        requestStats
    };
};
