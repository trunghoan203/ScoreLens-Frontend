# 🚨 Backend Issues - SessionToken Validation Problems

## 📋 Tổng quan vấn đề

**Frontend đang gặp lỗi:** `SessionToken không hợp lệ` khi gọi API `updateScore` mặc dù:
- ✅ `getMatchById` hoạt động bình thường
- ✅ `sessionToken` có format đúng (`ST-1755520...`)
- ✅ User có role `host` và `canEdit: true`
- ✅ `actorMembershipId` khớp với `MB-1755520170639`

## 🔍 Phân tích lỗi

### **1. API Call Sequence:**
```
1. ✅ getMatchById(matchId) → SUCCESS
2. ❌ updateScore(matchId, payload) → FAILED: "SessionToken không hợp lệ"
```

### **2. Payload được gửi:**
```javascript
{
  teamIndex: 0,
  score: 0,
  actorGuestToken: undefined,
  actorMembershipId: "MB-1755520170639",
  sessionToken: "ST-1755520287521-g9ale3dxl"
}
```

### **3. Backend Response:**
```javascript
{
  code: undefined,  // ← VẤN ĐỀ: Không có error code
  message: "SessionToken không hợp lệ."
}
```

## 🚨 Các vấn đề backend cần fix

### **1. SessionToken Validation Logic**

#### **Vấn đề:**
- Backend đang reject `sessionToken` hợp lệ
- Validation logic có thể sai hoặc không khớp với frontend

#### **Cần kiểm tra:**
```typescript
// Trong middleware matchRoleAuth.middleware.ts
export const requireHostRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionToken } = req.body;
    const match = req.match; // Từ findMatchById middleware
    
    // ❌ VẤN ĐỀ: Logic validation có thể sai
    // Cần debug:
    console.log('🔍 Middleware Debug:', {
      sessionToken,
      matchId: match?.id,
      matchMembers: match?.teams?.flatMap(t => t.members),
      requestBody: req.body
    });
    
    // Kiểm tra sessionToken có thuộc về member nào trong match không
    const matchMember = match?.teams?.flatMap(t => t.members)
      .find(m => m.sessionToken === sessionToken);
      
    if (!matchMember) {
      return res.status(403).json({
        code: 'INVALID_SESSION',
        message: 'SessionToken không hợp lệ.'
      });
    }
    
    // Kiểm tra role
    if (matchMember.role !== 'host') {
      return res.status(403).json({
        code: 'HOST_REQUIRED',
        message: 'Chỉ người tạo trận đấu mới có thể thực hiện thao tác này.'
      });
    }
    
    req.matchMember = matchMember;
    next();
  } catch (error) {
    console.error('❌ Middleware Error:', error);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Lỗi xác thực'
    });
  }
};
```

### **2. Database Schema Mismatch**

#### **Vấn đề có thể:**
- `sessionToken` trong database không khớp với frontend gửi
- Field mapping sai giữa model và database
- `sessionToken` bị hash/encrypt không đúng cách

#### **Cần kiểm tra:**
```typescript
// Trong Match.model.ts
export interface MatchMember {
  sessionToken: string; // ← Kiểm tra field này có đúng không
  role: 'host' | 'participant';
  // ... other fields
}

// Trong database query
const match = await Match.findById(matchId)
  .populate({
    path: 'teams.members',
    select: 'sessionToken role guestName membershipName fullName'
  });
```

### **3. Route Middleware Order**

#### **Vấn đề có thể:**
- Middleware order sai
- `findMatchById` không chạy trước `requireHostRole`
- `req.match` undefined

#### **Cần kiểm tra:**
```typescript
// Trong Membership.route.ts
router.put('/:id/score', 
  findMatchById,        // ← Phải chạy trước
  requireHostRole,      // ← Phải chạy sau
  MatchController.updateScore
);
```

### **4. Request Body Parsing**

#### **Vấn đề có thể:**
- `req.body` không được parse đúng
- `sessionToken` bị mất trong quá trình xử lý
- Content-Type header sai

#### **Cần kiểm tra:**
```typescript
// Trong app.ts hoặc main server file
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trong controller
export const updateScore = async (req: Request, res: Response) => {
  console.log('🔍 Controller Debug:', {
    body: req.body,
    headers: req.headers,
    match: req.match,
    matchMember: req.matchMember
  });
  
  // ... rest of logic
};
```

## 🧪 Debug Steps cho Backend

### **Step 1: Kiểm tra Middleware Flow**
```typescript
// Thêm console.log vào tất cả middleware
export const findMatchById = async (req: Request, res: Response, next: NextFunction) => {
  console.log('🔍 findMatchById: Start', { matchId: req.params.id });
  // ... logic
  console.log('🔍 findMatchById: End', { match: req.match });
  next();
};

export const requireHostRole = async (req: Request, res: Response, next: NextFunction) => {
  console.log('🔍 requireHostRole: Start', { 
    match: req.match,
    body: req.body 
  });
  // ... logic
  console.log('🔍 requireHostRole: End', { matchMember: req.matchMember });
  next();
};
```

### **Step 2: Kiểm tra Database Data**
```typescript
// Trong controller hoặc middleware
const match = await Match.findById(matchId)
  .populate('teams.members');

console.log('🔍 Database Match Data:', {
  matchId,
  teams: match?.teams?.map(t => ({
    members: t.members?.map(m => ({
      sessionToken: m.sessionToken,
      role: m.role,
      guestName: m.guestName,
      membershipName: m.membershipName
    }))
  }))
});
```

### **Step 3: Kiểm tra Request Processing**
```typescript
// Trong controller
export const updateScore = async (req: Request, res: Response) => {
  const { teamIndex, score, sessionToken, actorGuestToken, actorMembershipId } = req.body;
  
  console.log('🔍 updateScore Controller:', {
    params: req.params,
    body: req.body,
    match: req.match,
    matchMember: req.matchMember,
    sessionToken,
    actorGuestToken,
    actorMembershipId
  });
  
  // ... rest of logic
};
```

## 🔧 Fixes cần thực hiện

### **1. Immediate Fixes:**
- ✅ Thêm error codes vào tất cả error responses
- ✅ Thêm console.log debug vào middleware
- ✅ Kiểm tra database schema và data

### **2. Logic Fixes:**
- ✅ Sửa sessionToken validation logic
- ✅ Đảm bảo middleware order đúng
- ✅ Kiểm tra field mapping

### **3. Error Handling:**
- ✅ Standardize error response format
- ✅ Thêm error codes cho từng loại lỗi
- ✅ Log đầy đủ error details

## 📊 Expected vs Actual

### **Expected (Frontend):**
```javascript
{
  teamIndex: 0,
  score: 0,
  actorMembershipId: "MB-1755520170639",
  sessionToken: "ST-1755520287521-g9ale3dxl"
}
```

### **Actual (Backend Error):**
```javascript
{
  code: undefined,  // ← Should be: 'INVALID_SESSION'
  message: "SessionToken không hợp lệ."
}
```

## 🎯 Priority Levels

- **🔴 HIGH**: SessionToken validation logic
- **🟡 MEDIUM**: Error response format
- **🟢 LOW**: Debug logging

## 📝 Next Steps

1. **Backend Team:**
   - Kiểm tra middleware flow
   - Debug sessionToken validation
   - Fix error response format

2. **Frontend Team:**
   - Test lại sau khi backend fix
   - Verify sessionToken format
   - Check error handling

---

**📅 Created:** $(date)
**🔍 Status:** Backend needs investigation
**👥 Assigned:** Backend Team
**��️ Priority:** HIGH
