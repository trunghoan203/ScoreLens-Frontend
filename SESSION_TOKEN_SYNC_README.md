# 🔄 SessionToken Synchronization Implementation

## 🎯 **Overview**

Frontend implementation để đồng bộ sessionToken giữa Frontend và Backend, tránh conflict và "SessionToken không hợp lệ" errors.

## 🔧 **Backend API Requirements**

### **1. Create Match API**
```typescript
POST /api/membership/matches
Response: {
  success: true,
  data: {
    matchId: string,
    matchCode: string,
    hostSessionToken: string  // ← MỚI: Backend trả về hostSessionToken
  }
}
```

### **2. Join Match API**
```typescript
POST /api/membership/matches/join
Response: {
  success: true,
  data: {
    matchId: string,
    userSessionToken: string,  // ← MỚI: Backend trả về userSessionToken
    role: 'host' | 'participant'
  }
}
```

### **3. Get Match by ID API**
```typescript
GET /api/membership/matches/:matchId?membershipId=MB-123&guestName=GuestName
Response: {
  success: true,
  data: {
    matchId: string,
    teams: [...],
    // ... other match data
  }
}
```

### **4. Session Token API (NEW)**
```typescript
POST /api/membership/matches/:matchId/session-token
Body: {
  membershipId?: string,  // Nếu user có membership
  guestName?: string      // Nếu user là guest
}
Response: {
  success: true,
  data: {
    sessionToken: string,
    role: 'host' | 'participant',
    userName: string
  }
}
```

## 🚀 **Frontend Implementation**

### **1. Modified userMatchService.ts**

#### **New Interfaces:**
```typescript
export interface CreateMatchResponse {
  success: boolean;
  data: {
    matchId: string;
    matchCode: string;
    hostSessionToken: string;  // ← MỚI
    message?: string;
  };
}

export interface JoinMatchResponse {
  success: boolean;
  data: {
    matchId: string;
    userSessionToken: string;  // ← MỚI
    role: 'host' | 'participant';
    message?: string;
  };
}
```

#### **Enhanced getMatchById:**
```typescript
async getMatchById(matchId: string, queryParams?: { 
  membershipId?: string; 
  guestName?: string 
}) {
  // Support query params để lấy đúng sessionToken cho user
}
```

#### **New getSessionToken API:**
```typescript
async getSessionToken(matchId: string, payload: { 
  membershipId?: string; 
  guestName?: string 
}) {
  // Dedicated API để lấy sessionToken mới nhất
}
```

### **2. Enhanced scoreboard/page.tsx**

#### **Smart SessionToken Sync:**
```typescript
const syncSessionTokenWithBackend = async () => {
  // Xác định user identity (membershipId hoặc guestName)
  let sessionTokenPayload: { membershipId?: string; guestName?: string } = {};
  
  if (matchInfo?.createdByMembershipId) {
    sessionTokenPayload.membershipId = matchInfo.createdByMembershipId;
  } else if (actorGuestToken) {
    // Tìm guestName từ teams data
    const currentMember = allMembers.find((m: any) => 
      m.guestName && m.guestName.includes(actorGuestToken.slice(-6))
    );
    if (currentMember?.guestName) {
      sessionTokenPayload.guestName = currentMember.guestName;
    }
  }
  
  // Gọi API để lấy sessionToken mới nhất
  const sessionResponse = await userMatchService.getSessionToken(matchId, sessionTokenPayload);
  
  if (sessionResponse.success && sessionResponse.data?.sessionToken) {
    const newSessionToken = sessionResponse.data.sessionToken;
    setSessionToken(newSessionToken);
    toast.success('Đã cập nhật phiên làm việc mới!');
  }
};
```

### **3. New SessionTokenSync Component**

#### **Features:**
- ✅ Dedicated UI cho sessionToken synchronization
- ✅ Smart user identity detection
- ✅ Real-time token comparison
- ✅ Detailed sync results display
- ✅ Error handling và user feedback

#### **Usage:**
```typescript
<SessionTokenSync
  matchId={matchId}
  currentSessionToken={sessionToken}
  onTokenUpdate={setSessionToken}
  matchInfo={matchInfo}
  actorGuestToken={actorGuestToken}
/>
```

## 🔄 **Synchronization Flow**

### **1. Create Match Flow:**
```
Frontend createMatch() → Backend returns hostSessionToken → Frontend stores hostSessionToken
```

### **2. Join Match Flow:**
```
Frontend joinMatch() → Backend returns userSessionToken → Frontend stores userSessionToken
```

### **3. Sync Token Flow:**
```
User clicks "Sync Token" → Frontend determines user identity → Calls getSessionToken API → Updates local sessionToken
```

### **4. Auto-Sync Flow:**
```
Component mount → Check token validity → Auto-sync if needed → Update token → Re-authenticate
```

## 🎯 **Benefits**

### **1. No More Token Conflicts:**
- ✅ Frontend và Backend luôn có sessionToken giống nhau
- ✅ Eliminates "SessionToken không hợp lệ" errors
- ✅ Seamless user experience

### **2. Smart Identity Detection:**
- ✅ Automatically detects membershipId hoặc guestName
- ✅ No manual configuration needed
- ✅ Works for both members và guests

### **3. Real-time Synchronization:**
- ✅ Dedicated API cho sessionToken sync
- ✅ Immediate token updates
- ✅ Automatic re-authentication

### **4. Better Error Handling:**
- ✅ Specific error messages cho token issues
- ✅ Graceful fallbacks
- ✅ User-friendly notifications

## 🧪 **Testing**

### **1. Test Create Match:**
```typescript
const response = await userMatchService.createMatch(matchData);
console.log('Host SessionToken:', response.data.hostSessionToken);
```

### **2. Test Join Match:**
```typescript
const response = await userMatchService.joinMatch(joinData);
console.log('User SessionToken:', response.data.userSessionToken);
```

### **3. Test Sync Token:**
```typescript
// Click "Sync Token" button
// Check console logs
// Verify token update
```

### **4. Test API Calls:**
```typescript
// After sync, test updateScore
// Should work without "SessionToken không hợp lệ" error
```

## 🔮 **Future Enhancements**

### **1. Auto-Sync on Token Expiry:**
- Detect token expiry
- Auto-sync before API calls
- Background sync process

### **2. Token Validation:**
- Validate token format
- Check token expiry
- Proactive token refresh

### **3. Multi-User Support:**
- Support multiple users in same match
- Individual token management
- Role-based token access

## 📝 **Notes**

- Backend cần implement các API mới
- Frontend sẽ fallback về old logic nếu API mới chưa sẵn sàng
- SessionToken format: `ST-timestamp-randomstring`
- Timestamp comparison để detect token age

---

**🎯 Implementation hoàn thành! Frontend đã sẵn sàng cho SessionToken synchronization!**
