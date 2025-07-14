import { MatchHistorySearch } from './MatchHistorySearch';
import { MatchHistoryTable } from './MatchHistoryTable';

interface Match {
    id: string;
    time: string;
    type: string;
    teamA: string[];
    teamB: string[];
    score: string;
    vod: string;
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
            <div className="overflow-x-auto w-full">
                <MatchHistoryTable matches={matches} />
            </div>
        </div>
    );
} 