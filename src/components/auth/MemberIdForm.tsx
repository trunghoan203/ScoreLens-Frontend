import { Button }from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MemberIdFormProps {
  memberId: string;
  onMemberIdChange: (value: string) => void;
  onSubmit: () => void;
}

export default function MemberIdForm({ memberId, onMemberIdChange, onSubmit }: MemberIdFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label htmlFor="memberId" className="block text-left text-sm font-medium text-gray-700">
          Mã Hội Viên (Nếu Có)
        </label>
        <Input
          id="memberId"
          type="text"
          value={memberId}
          onChange={(e) => onMemberIdChange(e.target.value)}
          className="mt-1 text-center text-lg text-black"
        />
      </div>
      <p className="text-left text-xs text-red-600">
        * Nếu chưa có mã Hội viên, hãy liên hệ với nhân viên để đăng ký!
      </p>
      <div className="pt-4">
  <Button
    type="submit"
    className="w-full bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
  >
    Tạo trận đấu
  </Button>
</div>
    </form>
  );
}