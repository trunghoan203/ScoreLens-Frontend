import { MatchHistorySearch } from './MatchHistorySearch';
import { MatchHistoryTable } from './MatchHistoryTable';

interface Match {
    id: string;
    time: string;
    type: string;
    winningTeam: string;
    winningTeamMembers: string[];
    score: string;
    vod: string;
    status?: string;
    matchCode?: string;
    clubName?: string;
}

interface MatchHistorySectionProps {
    search: string;
    setSearch: (value: string) => void;
    matches: Match[];
}

export function MatchHistorySection({ search, setSearch, matches }: MatchHistorySectionProps) {
    return (
        <div className="w-full">
            <MatchHistorySearch search={search} setSearch={setSearch} />
            <div className="w-full">
                <MatchHistoryTable matches={matches} />
            </div>
        </div>
    );
} 