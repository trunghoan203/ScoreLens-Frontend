export default function StatusBadge({ status }: { status: 'empty' | 'inuse' | 'maintenance' }) {
  return (
    <span
      className={
        "w-32 min-w-[100px] text-center px-2 py-2 rounded-full text-white font-semibold text-sm flex items-center justify-center " +
        (status === "empty" ? "bg-green-500" : status === "inuse" ? "bg-red-500" : "bg-yellow-500")
      }
    >
      {status === "empty" ? "Bàn trống" : status === "inuse" ? "Đang sử dụng" : "Bảo trì"}
    </span>
  );
} 