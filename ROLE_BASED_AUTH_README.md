# Role-Based Authorization System - Frontend Implementation

## **Tổng quan**

Frontend đã được cập nhật để tương thích với hệ thống phân quyền mới của Backend. Hệ thống này đảm bảo bảo mật và kiểm soát quyền truy cập dựa trên role của user trong trận đấu.

## **Các file đã được cập nhật**

### **1. `src/lib/userMatchService.ts`**
- ✅ Thêm `sessionToken` vào tất cả các request cần thiết
- ✅ Cập nhật interfaces để hỗ trợ role-based authorization
- ✅ Thêm error handling cho các error code mới
- ✅ Thêm interfaces `MatchMember` và `MatchResponse` với role
- ✅ Đồng bộ status values với Backend: `'pending' | 'ongoing' | 'completed'`

### **2. `src/lib/socketService.ts`**
- ✅ Thêm authentication methods cho WebSocket
- ✅ Thêm role checking trước khi emit events
- ✅ Thêm các helper methods để kiểm tra quyền
- ✅ Thêm event listeners cho authentication và permission denied

### **3. `src/lib/hooks/useMatchRole.ts`** (MỚI)
- ✅ Hook để quản lý role và sessionToken
- ✅ Tự động authenticate với match room
- ✅ Quản lý trạng thái authentication
- ✅ Cleanup khi component unmount

### **4. `src/components/ui/RoleBadge.tsx`** (MỚI)
- ✅ Component hiển thị role với styling nhất quán
- ✅ Hỗ trợ 3 kích thước: sm, md, lg
- ✅ Tùy chọn hiển thị icon
- ✅ Màu sắc khác nhau cho từng role

### **5. `src/components/ui/PermissionGuard.tsx`** (MỚI)
- ✅ Component để conditionally render content dựa trên quyền
- ✅ Fallback mặc định khi không có quyền
- ✅ Tùy chỉnh fallback content
- ✅ Hiển thị thông tin về role yêu cầu và role hiện tại

### **6. `src/components/user/ScoreEditor.tsx`**
- ✅ Cập nhật để sử dụng role-based authorization
- ✅ Hiển thị role badge
- ✅ Kiểm tra quyền trước khi cho phép chỉnh sửa
- ✅ Thông báo lỗi khi không có quyền

## **Cách sử dụng**

### **1. Sử dụng useMatchRole hook**

```typescript
import { useMatchRole } from '@/lib/hooks/useMatchRole';

function MatchComponent({ matchId }: { matchId: string }) {
  const { 
    role, 
    isHost, 
    isManager, 
    canEdit, 
    authenticateMatch, 
    isLoading, 
    error 
  } = useMatchRole(matchId);

  useEffect(() => {
    if (matchId && sessionToken) {
      authenticateMatch(matchId, sessionToken);
    }
  }, [matchId, sessionToken]);

  if (isLoading) return <div>Đang xác thực...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      {canEdit ? (
        <button>Chỉnh sửa trận đấu</button>
      ) : (
        <p>Bạn không có quyền chỉnh sửa</p>
      )}
    </div>
  );
}
```

### **2. Sử dụng RoleBadge component**

```typescript
import RoleBadge from '@/components/ui/RoleBadge';

function UserInfo({ role }: { role: 'host' | 'participant' | 'manager' }) {
  return (
    <div className="flex items-center gap-2">
      <span>Quyền:</span>
      <RoleBadge role={role} size="md" showIcon />
    </div>
  );
}
```

### **3. Sử dụng PermissionGuard component**

```typescript
import PermissionGuard from '@/components/ui/PermissionGuard';

function MatchActions({ canEdit, userRole }: { canEdit: boolean; userRole: string }) {
  return (
    <div>
      <PermissionGuard 
        canAccess={canEdit}
        requiredRole="host"
        currentRole={userRole}
      >
        <button>Chỉnh sửa điểm</button>
        <button>Kết thúc trận</button>
      </PermissionGuard>
      
      <PermissionGuard 
        canAccess={true}
        showFallback={false}
      >
        <button>Xem thông tin</button>
      </PermissionGuard>
    </div>
  );
}
```

### **4. Cập nhật API calls với sessionToken**

```typescript
import { userMatchService } from '@/lib/userMatchService';

// Cập nhật điểm
const updateScore = async (matchId: string, teamIndex: number, score: number) => {
  try {
    await userMatchService.updateScore(matchId, {
      teamIndex,
      score,
      sessionToken: currentSessionToken // ← Bắt buộc phải có
    });
    toast.success('Cập nhật điểm thành công!');
  } catch (error) {
    toast.error(error.message);
  }
};

// Cập nhật thành viên
const updateMembers = async (matchId: string, teams: any[][]) => {
  try {
    await userMatchService.updateTeamMembersV2(
      matchId, 
      teams, 
      currentSessionToken, // ← Bắt buộc phải có
      actorGuestToken, 
      actorMembershipId
    );
    toast.success('Cập nhật thành viên thành công!');
  } catch (error) {
    toast.error(error.message);
  }
};
```

## **WebSocket Authentication**

### **1. Kết nối và authenticate**

```typescript
import { socketService } from '@/lib/socketService';

// Kết nối socket
socketService.connect();

// Authenticate với match room
socketService.authenticateMatch(matchId, sessionToken);

// Lắng nghe kết quả authentication
socketService.onAuthResult((authResult) => {
  if (authResult.success) {
    console.log('Role:', authResult.role);
    // Bắt đầu lắng nghe các events khác
  } else {
    console.error('Authentication failed:', authResult.message);
  }
});

// Lắng nghe permission denied
socketService.onPermissionDenied((permissionData) => {
  console.error('Permission denied:', permissionData.message);
});
```

### **2. Emit events với role checking**

```typescript
// Cập nhật điểm (chỉ host/manager)
socketService.emitScoreUpdate(matchId, teamIndex, score);

// Kết thúc trận (chỉ host/manager)
socketService.emitMatchEnd(matchId, matchData);

// Kiểm tra quyền trước khi thực hiện
if (socketService.canEdit()) {
  socketService.emitScoreUpdate(matchId, teamIndex, score);
} else {
  toast.error('Bạn không có quyền cập nhật điểm');
}
```

## **Error Handling**

### **1. Các error code mới**

```typescript
// FORBIDDEN - Không có quyền
if (error.code === 'FORBIDDEN') {
  toast.error('Bạn không có quyền thực hiện thao tác này');
}

// UNAUTHORIZED - Thiếu sessionToken
if (error.code === 'UNAUTHORIZED') {
  toast.error('Vui lòng cung cấp sessionToken hợp lệ');
}

// INVALID_SESSION - SessionToken không hợp lệ
if (error.code === 'INVALID_SESSION') {
  toast.error('SessionToken không hợp lệ, vui lòng tham gia lại trận đấu');
}

// HOST_REQUIRED - Cần quyền host
if (error.code === 'HOST_REQUIRED') {
  toast.error('Chỉ người tạo trận đấu mới có thể thực hiện');
}
```

### **2. Hiển thị error messages**

```typescript
import { toast } from 'react-hot-toast';

try {
  await userMatchService.updateScore(matchId, payload);
} catch (error) {
  // Error message đã được format sẵn trong service
  toast.error(error.message);
}
```

## **Migration Guide**

### **1. Cập nhật existing components**

```typescript
// TRƯỚC
function ScoreEditor({ onClose, onSave, initialScoreA, initialScoreB }) {
  // Component logic
}

// SAU
function ScoreEditor({ 
  onClose, 
  onSave, 
  initialScoreA, 
  initialScoreB,
  canEdit = true,        // ← Thêm prop này
  userRole = 'participant' // ← Thêm prop này
}) {
  // Component logic với role checking
}
```

### **2. Cập nhật API calls**

```typescript
// TRƯỚC
await userMatchService.updateScore(matchId, {
  teamIndex,
  score
});

// SAU
await userMatchService.updateScore(matchId, {
  teamIndex,
  score,
  sessionToken: currentSessionToken // ← Bắt buộc thêm
});
```

### **3. Cập nhật WebSocket usage**

```typescript
// TRƯỚC
socketService.emitScoreUpdate(matchId, teamIndex, score);

// SAU
// Cần authenticate trước
socketService.authenticateMatch(matchId, sessionToken);
socketService.onAuthResult((result) => {
  if (result.success) {
    socketService.emitScoreUpdate(matchId, teamIndex, score);
  }
});
```

## **Testing**

### **1. Test với role host**

```typescript
// Mock role host
const mockRole = {
  role: 'host',
  sessionToken: 'ST-1234567890-abc123def',
  matchId: 'MATCH-001'
};

// Test các actions được phép
expect(component.find('button[data-testid="edit-score"]')).toBeInTheDocument();
expect(component.find('button[data-testid="end-match"]')).toBeInTheDocument();
```

### **2. Test với role participant**

```typescript
// Mock role participant
const mockRole = {
  role: 'participant',
  sessionToken: 'ST-1234567891-xyz789ghi',
  matchId: 'MATCH-001'
};

// Test các actions bị cấm
expect(component.find('button[data-testid="edit-score"]')).not.toBeInTheDocument();
expect(component.find('div[data-testid="permission-denied"]')).toBeInTheDocument();
```

## **Troubleshooting**

### **1. Lỗi thường gặp**

**"Bạn không có quyền chỉnh sửa điểm"**
- Kiểm tra xem user có role = "host" không
- Kiểm tra sessionToken có hợp lệ không
- Kiểm tra xem đã authenticate với WebSocket chưa

**"Vui lòng cung cấp sessionToken hợp lệ"**
- Đảm bảo gửi sessionToken trong request body
- Kiểm tra xem sessionToken có đúng format không

**"WebSocket authentication failed"**
- Kiểm tra xem đã gọi `authenticateMatch` chưa
- Kiểm tra xem matchId và sessionToken có đúng không
- Kiểm tra xem socket có kết nối thành công không

### **2. Debug tips**

```typescript
// Log role và authentication status
console.log('Current role:', socketService.getCurrentRole());
console.log('Is authenticated:', socketService.isMatchAuthenticated());
console.log('Can edit:', socketService.canEdit());

// Log WebSocket events
socketService.onAuthResult((result) => {
  console.log('Auth result:', result);
});

socketService.onPermissionDenied((data) => {
  console.log('Permission denied:', data);
});
```

## **Kết luận**

Hệ thống role-based authorization đã được implement đầy đủ ở Frontend. Các component và services đã được cập nhật để:

1. ✅ Gửi sessionToken trong tất cả API calls cần thiết
2. ✅ Authenticate WebSocket trước khi thực hiện actions
3. ✅ Kiểm tra quyền trước khi render UI elements
4. ✅ Hiển thị error messages rõ ràng cho user
5. ✅ Cung cấp fallback UI khi không có quyền

Để sử dụng, chỉ cần:
1. Import và sử dụng `useMatchRole` hook
2. Truyền `canEdit` và `userRole` props vào components
3. Sử dụng `PermissionGuard` để bảo vệ content
4. Gửi `sessionToken` trong tất cả API calls

Hệ thống sẽ tự động xử lý authentication và authorization, đảm bảo bảo mật cho ứng dụng.
