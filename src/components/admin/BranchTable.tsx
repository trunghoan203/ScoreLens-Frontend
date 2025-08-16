import StatusBadge from './StatusBadge';
import { useRouter } from 'next/navigation';

interface Branch {
  _id?: string;
  clubId?: string;
  name: string;
  address: string;
  tableNumber?: number;
  status: 'open' | 'closed';
}

export default function BranchTable({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  return (
    <div className="space-y-2 rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
        <div className="col-span-3 py-3">TÊN CHI NHÁNH</div>
        <div className="col-span-4 py-3">ĐỊA CHỈ</div>
        <div className="col-span-2 py-3">SỐ BÀN</div>
        <div className="col-span-3 py-3">TRẠNG THÁI</div>
      </div>
      {branches.map((b, idx) => (
        <div
          key={idx}
          className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
          onClick={() => router.push(`/admin/branches/${b.clubId || b._id || idx}`)}
        >
          <div className="col-span-3 py-4 font-semibold text-black">{b.name}</div>
          <div className="col-span-4 py-4 text-gray-700">{b.address}</div>
          <div className="col-span-2 py-4 text-gray-700">{b.tableNumber || 0}</div>
          <div className="col-span-3 py-4 flex justify-center">
            <StatusBadge status={b.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
