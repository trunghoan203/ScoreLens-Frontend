import { MatchHistorySearch } from './MatchHistorySearch';
import { MatchHistoryTable } from './MatchHistoryTable';

interface Match {
    id: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    playTime?: string;
    type: string;
    winningTeam: string;
    winningTeamMembers: string[];
    score: string;
    videoUrl: string;
    status?: string;
    matchCode?: string;
    clubName?: string;
    address?: string;
    isAIAssisted?: boolean;
}

interface MatchHistorySectionProps {
    search: string;
    setSearch: (value: string) => void;
    dateFilter?: string;
    setDateFilter?: (value: string) => void;
    matches: Match[];
    onViewDetail: (match: Match) => void;
}

export function MatchHistorySection({
    search,
    setSearch,
    dateFilter = '',
    setDateFilter = () => { },
    matches,
    onViewDetail
}: MatchHistorySectionProps) {
    return (
        <div className="w-full">
            <MatchHistorySearch
                search={search}
                setSearch={setSearch}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
            />
            <div className="w-full">
                <MatchHistoryTable matches={matches} onViewDetail={onViewDetail} />
            </div>
        </div>
    );
} 