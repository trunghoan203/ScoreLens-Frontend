# 🔧 Backend updateTeamMembers - Fixed Logic

## 🐛 **Vấn đề hiện tại:**
Backend đang tạo lại `sessionToken` mới cho TẤT CẢ members thay vì chỉ giữ nguyên token của host.

## ✅ **Logic đã fix:**

```typescript
export const updateTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { teams } = req.body;
        const match = (req as any).match as IMatch;
        const matchMember = (req as any).matchMember; // Lấy từ middleware

        if (!req.body) {
            res.status(400).json({
                success: false,
                message: 'Request body không được cung cấp.'
            });
            return;
        }

        if (!teams || !Array.isArray(teams) || teams.length !== 2) {
            res.status(400).json({
                success: false,
                message: 'Teams phải có 2 thành viên trở lên.'
            });
            return;
        }

        if (!match) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy trận đấu.'
            });
            return;
        }

        // Middleware requireHostRole đã kiểm tra quyền rồi
        // matchMember đã được xác thực là host

        if (match.status === 'completed') {
            res.status(400).json({
                success: false,
                message: 'Không thể cập nhật thông tin trận đấu đã hoàn thành hoặc đã bị hủy.'
            });
            return;
        }

        for (let teamIndex = 0; teamIndex < 2; teamIndex++) {
            const rawMembers = teams[teamIndex];
            if (!rawMembers || !Array.isArray(rawMembers)) {
                res.status(400).json({
                    success: false,
                    message: `Members cho đội ${teamIndex} phải là một mảng.`
                });
                return;
            }

            const processedMembers: IMatchTeamMember[] = [];
            for (const member of rawMembers) {
                if (member.phoneNumber) {
                    const foundMembership = await Membership.findOne({ phoneNumber: member.phoneNumber });
                    if (foundMembership) {
                        if (foundMembership.status === 'inactive') {
                            res.status(403).json({
                                success: false,
                                message: `Tài khoản hội viên của ${foundMembership.fullName} đang bị cấm`
                            });
                            return;
                        }

                        const table = await Table.findOne({ tableId: match.tableId });
                        if (table) {
                            const club = await Club.findOne({ clubId: table.clubId });
                            if (club && foundMembership.brandId !== club.brandId) {
                                res.status(403).json({
                                    success: false,
                                    message: `Không tìm thấy hội viên.`
                                });
                                return;
                            }
                        }

                        // 🎯 Kiểm tra role trong DB: Host hay Participant?
                        const isHost = foundMembership.membershipId === match.createdByMembershipId;
                        
                        // Nếu không phải host, kiểm tra xem có phải là guest host không
                        let finalRole: 'host' | 'participant' = isHost ? 'host' : 'participant';
                        if (!isHost && !match.createdByMembershipId && match.creatorGuestToken) {
                            // Trường hợp host là guest user
                            const isGuestHost = member.phoneNumber && match.creatorGuestToken.includes(member.phoneNumber.slice(-6));
                            if (isGuestHost) {
                                finalRole = 'host';
                            }
                        }
                        
                        // 🎯 Smart Token Preservation: Chỉ giữ nguyên token của host
                        let finalSessionToken: string;
                        if (finalRole === 'host') {
                            // Host: Giữ nguyên token cũ từ DB
                            const existingMember = match.teams[teamIndex].members.find(m => 
                                m.membershipId === foundMembership.membershipId
                            );
                            finalSessionToken = existingMember ? existingMember.sessionToken : generateSessionToken();
                        } else {
                            // Participant: Luôn tạo token mới
                            finalSessionToken = generateSessionToken();
                        }

                        processedMembers.push({
                            membershipId: foundMembership.membershipId,
                            membershipName: foundMembership.fullName,
                            role: finalRole,
                            sessionToken: finalSessionToken,
                        });
                    } else {
                        // 🎯 Guest user: Kiểm tra role và token
                        const existingGuestMember = match.teams[teamIndex].members.find(m => 
                            m.guestName === `Guest ${member.phoneNumber}`
                        );

                        // Kiểm tra xem có phải là guest host không
                        let guestRole: 'host' | 'participant' = 'participant';
                        if (!match.createdByMembershipId && match.creatorGuestToken) {
                            const isGuestHost = match.creatorGuestToken.includes(member.phoneNumber.slice(-6));
                            if (isGuestHost) {
                                guestRole = 'host';
                            }
                        }

                        // 🎯 Smart Token Preservation cho Guest
                        let guestSessionToken: string;
                        if (guestRole === 'host') {
                            // Guest Host: Giữ nguyên token cũ
                            guestSessionToken = existingGuestMember ? existingGuestMember.sessionToken : generateSessionToken();
                        } else {
                            // Guest Participant: Luôn tạo token mới
                            guestSessionToken = generateSessionToken();
                        }

                        processedMembers.push({
                            guestName: `Guest ${member.phoneNumber}`,
                            role: guestRole,
                            sessionToken: guestSessionToken,
                        });
                    }
                }
                else if (member.guestName) {
                    // 🎯 Guest name: Kiểm tra role và token
                    const existingGuestMember = match.teams[teamIndex].members.find(m => 
                        m.guestName === member.guestName
                    );

                    // Kiểm tra xem có phải là guest host không
                    let guestNameRole: 'host' | 'participant' = 'participant';
                    if (!match.createdByMembershipId && match.creatorGuestToken) {
                        const isGuestHost = match.creatorGuestToken.includes(member.guestName.slice(-6));
                        if (isGuestHost) {
                            guestNameRole = 'host';
                        }
                    }

                    // 🎯 Smart Token Preservation cho Guest Name
                    let guestNameSessionToken: string;
                    if (guestNameRole === 'host') {
                        // Guest Host: Giữ nguyên token cũ
                        guestNameSessionToken = existingGuestMember ? existingGuestMember.sessionToken : generateSessionToken();
                    } else {
                        // Guest Participant: Luôn tạo token mới
                        guestNameSessionToken = generateSessionToken();
                    }

                    processedMembers.push({
                        guestName: member.guestName,
                        role: guestNameRole,
                        sessionToken: guestNameSessionToken,
                    });
                }
            }

            match.teams[teamIndex].members = processedMembers;
        }

        const updatedMatch = await match.save();

        getIO().to(updatedMatch.matchId).emit('match_updated', updatedMatch);

        // Trả về sessionToken của host để Frontend sử dụng
        let hostSessionToken = null;
        for (const team of updatedMatch.teams) {
            const hostMember = team.members.find(m => m.role === 'host');
            if (hostMember) {
                hostSessionToken = hostMember.sessionToken;
                break;
            }
        }

        res.status(200).json({ 
            success: true, 
            data: updatedMatch,
            hostSessionToken: hostSessionToken // Thêm sessionToken của host
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: MESSAGES.MSG100 });
    }
};
```

## 🎯 **Logic mới:**

### **1. Host (Membership hoặc Guest):**
- ✅ **Giữ nguyên** `sessionToken` cũ từ DB
- ✅ **Không bị mất** authentication
- ✅ **Tiếp tục** có quyền edit

### **2. Participants (Membership hoặc Guest):**
- ✅ **Luôn tạo** `sessionToken` mới
- ✅ **Cần re-authenticate** nếu muốn join lại
- ✅ **Không có** quyền edit

## 🔄 **Kết quả:**

- 🎯 **Host không bị mất token** khi update teams
- 🎯 **Participants luôn có token mới** (security)
- 🎯 **Không còn lỗi "SessionToken không hợp lệ"**
- 🎯 **Role-based permissions** hoạt động chính xác

## 📝 **Cách implement:**

1. **Copy logic đã fix** vào Backend `updateTeamMembers`
2. **Test** với Frontend hiện tại
3. **Verify** host không bị mất token
4. **Verify** participants có token mới
