export default {
    // Common
    common: {
        loading: 'Đang tải...',
        error: 'Lỗi',
        success: 'Thành công',
        cancel: 'Hủy',
        confirm: 'Xác nhận',
        save: 'Lưu',
        edit: 'Chỉnh sửa',
        delete: 'Xóa',
        add: 'Thêm',
        back: 'Quay lại',
        next: 'Tiếp theo',
        previous: 'Trước',
        search: 'Tìm kiếm',
        filter: 'Lọc',
        clear: 'Xóa',
        submit: 'Gửi',
        close: 'Đóng',
        open: 'Mở',
        yes: 'Có',
        no: 'Không',
        required: 'Bắt buộc',
        optional: 'Tùy chọn',
        status: 'Trạng thái',
        actions: 'Hành động',
        details: 'Chi tiết',
        name: 'Tên',
        address: 'Địa chỉ',
        phone: 'Điện thoại',
        email: 'Email',
        password: 'Mật khẩu',
        confirmPassword: 'Xác nhận mật khẩu',
        login: 'Đăng nhập',
        register: 'Đăng ký',
        logout: 'Đăng xuất',
        profile: 'Hồ sơ',
        settings: 'Cài đặt',
        language: 'Ngôn ngữ',
        english: 'Tiếng Anh',
        vietnamese: 'Tiếng Việt',
        notLoggedIn: 'Chưa đăng nhập',
        unknownBrand: 'Brand không xác định',
        admin: 'Admin',
        notifications: 'Thông báo',
        newNotifications: 'thông báo mới',
        markAllAsRead: 'Đánh dấu tất cả',
        loadingNotifications: 'Đang tải thông báo...',
        noNotifications: 'Không có thông báo',
        newNotificationsWillAppearHere: 'Các thông báo mới sẽ xuất hiện tại đây',
        notAvailable: 'N/A',
        unknown: 'Không xác định',
        all: 'Tất cả',
        clickToViewDetails: 'Nhấn để xem chi tiết',
        confirmInformation: 'Xác nhận thông tin',
    },

    // Navigation
    nav: {
        home: 'Trang chủ',
        matchHistory: 'Lịch sử đấu',
        guide: 'Hướng dẫn',
        branches: 'Chi nhánh',
        managers: 'Quản lý',
        feedbacks: 'Phản hồi',
        cameras: 'Camera',
        tables: 'Bàn',
        members: 'Thành viên',
        dashboard: 'Bảng điều khiển',
        admin: 'Quản trị',
        superAdmin: 'Siêu quản trị',
        brand: 'Thương hiệu',
    },

    // Auth
    auth: {
        loginTitle: 'Đăng nhập',
        registerTitle: 'Đăng ký',
        forgotPassword: {
            title: 'Quên mật khẩu?',
            description: 'Nhập email để lấy lại mật khẩu',
            emailPlaceholder: 'Nhập email của bạn',
            sendButton: 'Gửi',
            sending: 'Đang gửi...',
            emailSentSuccess: 'Email đã được gửi thành công! Vui lòng kiểm tra hộp thư.',
            generalError: 'Có lỗi xảy ra. Vui lòng thử lại.',
            passwordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự.',
            passwordMismatch: 'Mật khẩu xác nhận không khớp.',
            resetSuccess: 'Đặt lại mật khẩu thành công!',
            resetFailed: 'Đặt lại mật khẩu thất bại.',
            successTitle: 'ĐẶT LẠI MẬT KHẨU THÀNH CÔNG',
            successDescription: 'Bạn có thể đăng nhập với mật khẩu mới.',
            canLoginNow: 'Bạn đã có thể đăng nhập!',
            backToLogin: 'Trở về Đăng nhập',
            rememberPassword: 'Đã nhớ mật khẩu?',
        },
        logoutConfirm: 'Bạn có chắc chắn muốn đăng xuất không?',
        resetPassword: 'Đặt lại mật khẩu',
        emailPlaceholder: 'Nhập email của bạn',
        passwordPlaceholder: 'Nhập mật khẩu của bạn',
        confirmPasswordPlaceholder: 'Xác nhận mật khẩu của bạn',
        loginSuccess: 'Đăng nhập thành công!',
        registerSuccess: 'Đăng ký thành công!',
        logoutSuccess: 'Đăng xuất thành công!',
        invalidCredentials: 'Email hoặc mật khẩu không đúng',
        emailRequired: 'Email là bắt buộc',
        passwordRequired: 'Mật khẩu là bắt buộc',
        passwordMinLength: 'Mật khẩu phải có ít nhất 6 ký tự',
        passwordMismatch: 'Mật khẩu không khớp',
        emailInvalid: 'Định dạng email không hợp lệ',
        roleSelection: {
            title: 'Bạn muốn đăng nhập với vai trò nào?',
            businessOwner: 'Chủ doanh nghiệp',
            manager: 'Quản lý',
        },
        managerLogin: {
            title: 'Đăng nhập Quản lý',
            description: 'Vui lòng nhập email để tiếp tục',
            emailLabel: 'Email',
            emailPlaceholder: 'Nhập email của bạn',
            emailRequired: 'Mã quản lý là bắt buộc',
            loginButton: 'Đăng nhập',
            loggingIn: 'Đang đăng nhập...',
            backToHome: 'Quay lại trang chủ',
            verificationSent: 'Mã xác thực đã được gửi!',
            errorMessage: 'Đã xảy ra lỗi. Vui lòng thử lại.',
        },
        adminLogin: {
            title: 'Đăng nhập Chủ doanh nghiệp',
            description: 'Vui lòng đăng nhập để tiếp tục',
            emailLabel: 'Email',
            emailPlaceholder: 'Nhập email của bạn',
            emailRequired: 'Email là bắt buộc',
            emailInvalid: 'Email không hợp lệ',
            passwordLabel: 'Mật khẩu',
            passwordPlaceholder: 'Nhập mật khẩu',
            passwordRequired: 'Mật khẩu là bắt buộc',
            passwordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự',
            passwordComplexity: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
            rememberMe: 'Nhớ mật khẩu',
            forgotPassword: 'Quên mật khẩu?',
            loginButton: 'Đăng nhập',
            loggingIn: 'Đang đăng nhập...',
            loginSuccess: 'Đăng nhập thành công!',
            loginFailed: 'Đăng nhập thất bại. Vui lòng thử lại.',
            logoutSuccess: 'Đăng xuất thành công!',
            logoutFailed: 'Đăng xuất thất bại.',
            noAccount: 'Bạn chưa có tài khoản?',
            register: 'Đăng ký',
            backToHome: 'Quay lại trang chủ',
        },
        adminRegister: {
            title: 'Đăng ký Chủ doanh nghiệp',
            description: 'Vui lòng nhập thông tin để đăng ký tài khoản Chủ doanh nghiệp.',
            fullNameLabel: 'Họ tên',
            fullNamePlaceholder: 'Nhập họ tên của bạn',
            fullNameRequired: 'Họ tên là bắt buộc',
            emailLabel: 'Email',
            emailPlaceholder: 'Nhập email của bạn',
            emailRequired: 'Email là bắt buộc',
            passwordLabel: 'Mật khẩu',
            passwordPlaceholder: 'Nhập mật khẩu',
            passwordRequired: 'Mật khẩu là bắt buộc',
            passwordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự',
            passwordComplexity: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
            passwordHint: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và kí tự đặc biệt.',
            confirmPasswordLabel: 'Xác nhận mật khẩu',
            confirmPasswordPlaceholder: 'Nhập lại mật khẩu',
            confirmPasswordRequired: 'Xác nhận mật khẩu là bắt buộc',
            confirmPasswordMismatch: 'Mật khẩu xác nhận không khớp',
            agreeTerms: 'Tôi đồng ý với',
            termsOfService: 'điều khoản sử dụng',
            agreeRequired: 'Bạn phải đồng ý với điều khoản sử dụng',
            continueButton: 'Tiếp tục',
            registerButton: 'Đăng ký',
            registering: 'Đang đăng ký...',
            registerSuccess: 'Đăng ký thành công!',
            registerFailed: 'Đăng ký thất bại. Vui lòng thử lại.',
            verificationTitle: 'Nhập mã xác minh 6 chữ số',
            verificationDescription: 'Chúng tôi đã gửi mã xác thực đến',
            verificationButton: 'Xác minh',
            verifying: 'Đang xác minh...',
            resendCode: 'Gửi lại mã',
            resendTimer: 'Gửi lại sau',
            backButton: 'Quay lại',
            backToHome: 'Quay lại trang chủ',
            hasAccount: 'Đã có tài khoản?',
            login: 'Đăng nhập',
        },
        adminVerification: {
            title: 'Xác thực tài khoản',
            description: 'Chúng tôi đã gửi mã xác thực đến',
            verificationTitle: 'Nhập mã xác minh 6 chữ số',
            verificationButton: 'Xác minh',
            verifying: 'Đang xác minh...',
            verificationSuccess: 'Xác thực thành công!',
            verificationFailed: 'Xác thực thất bại. Vui lòng thử lại.',
            otpRequired: 'Vui lòng nhập đầy đủ 6 chữ số',
            resendCode: 'Gửi lại mã',
            resendTimer: 'Gửi lại sau',
            backToLogin: 'Quay lại đăng nhập',
            notReceivedCode: 'Không nhận được mã?',
        },
        managerVerification: {
            title: 'Xác minh mã quản lý',
            description: 'Chúng tôi đã gửi mã xác minh đến',
            verificationTitle: 'Nhập mã xác minh 6 chữ số',
            verificationButton: 'Xác minh',
            verifying: 'Đang xác minh...',
            verificationSuccess: 'Xác thực thành công!',
            verificationFailed: 'Xác thực thất bại. Vui lòng thử lại.',
            otpRequired: 'Vui lòng nhập đầy đủ 6 chữ số',
            resendCode: 'Gửi lại mã',
            resendTimer: 'Gửi lại sau',
            backToLogin: 'Quay lại đăng nhập',
            notReceivedCode: 'Không nhận được mã?',
            codeResent: 'Mã xác thực đã được gửi lại!',
            resendFailed: 'Gửi lại mã thất bại.',
        },
        adminResetPassword: {
            title: 'Đặt lại mật khẩu',
            description: 'Vui lòng nhập mật khẩu mới.',
            descriptionWithEmail: 'Đặt lại mật khẩu cho',
            newPasswordLabel: 'Mật khẩu mới',
            newPasswordPlaceholder: 'Nhập mật khẩu mới',
            confirmPasswordLabel: 'Xác nhận mật khẩu',
            confirmPasswordPlaceholder: 'Nhập lại mật khẩu mới',
            resetButton: 'Đặt lại mật khẩu',
            resetting: 'Đang đặt lại...',
            resetSuccess: 'Đặt lại mật khẩu thành công!',
            resetFailed: 'Có lỗi xảy ra. Vui lòng thử lại.',
            passwordMinLength: 'Mật khẩu phải có ít nhất 6 ký tự.',
            passwordMismatch: 'Mật khẩu xác nhận không khớp.',
            backToLogin: 'Quay lại đăng nhập',
            successTitle: 'Đặt lại mật khẩu thành công!',
            successDescription: 'Bạn đã có thể đăng nhập với mật khẩu mới.',
        },
        accountRejected: {
            title: 'Tài khoản bị từ chối',
            description: 'Vui lòng kiểm tra email hoặc',
            here: 'tại đây',
            forMoreDetails: 'để biết thêm chi tiết.',
            backToLogin: 'Quay lại đăng nhập',
        },
        reform: {
            title: 'THÔNG TIN BỊ TỪ CHỐI',
            accountMismatchWarning: 'Tài khoản đăng nhập không khớp với liên kết. Hiển thị dữ liệu của tài khoản hiện tại.',
            cannotLoadData: 'Không thể tải dữ liệu',
            noAuthToken: 'Không tìm thấy token xác thực',
            deleteAccountSuccess: 'Xóa tài khoản thành công',
            deleteAccountFailed: 'Xóa tài khoản thất bại',
            steps: {
                details: 'Thông tin chi tiết',
                brand: 'Thông tin thương hiệu',
                branch: 'Thông tin chi nhánh',
                confirm: 'Xác nhận',
            },
            successTitle: 'BẠN ĐÃ ĐĂNG KÝ THÀNH CÔNG',
            successDescription: 'Vui lòng chờ chúng tôi chấp nhận yêu cầu đăng ký của bạn!',
            thankYou: 'Cảm ơn bạn đã đăng ký!',
            redirectMessage: 'Bạn sẽ được chuyển hướng tự động trong',
            seconds: 'giây',
            adminInfo: 'Thông tin Admin',
            fullName: 'Họ tên',
            status: 'Trạng thái',
            rejected: 'Đã bị từ chối',
            pending: 'Đang chờ duyệt',
            rejectedReason: 'Lý do bị từ chối',
            brandInfo: 'Thông tin Thương hiệu',
            brandName: 'Tên thương hiệu',
            phoneNumber: 'Số điện thoại',
            website: 'Website',
            citizenCode: 'CCCD',
            noBrandInfo: 'Chưa có thông tin thương hiệu.',
            branchList: 'Danh sách Chi nhánh',
            address: 'Địa chỉ',
            tableNumber: 'Số bàn',
            noBranches: 'Chưa có chi nhánh nào.',
            editRegistrationInfo: 'Chỉnh sửa thông tin đăng ký',
            deleteAccount: 'Xóa tài khoản',
            confirmRegistrationInfo: 'Xác nhận thông tin đăng ký',
            brandInfoTitle: 'Thông tin thương hiệu',
            branchInfoTitle: 'Thông tin chi nhánh',
            branch: 'Chi Nhánh',
            confirmInfo: 'Xác nhận thông tin',
            deleteAccountConfirm: 'Xác nhận xóa tài khoản',
            deleteAccountConfirmText: 'Xóa tài khoản sẽ xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan bao gồm thông tin thương hiệu và chi nhánh.',
            deleteAccountConfirmQuestion: 'Bạn có chắc chắn muốn xóa tài khoản này không?',
            deleteAccountConfirmWarning: 'Hành động này không thể hoàn tác.',
            deleting: 'Đang xóa...',
        },
    },

    // Branches
    branches: {
        title: 'CHI NHÁNH',
        addBranch: 'Thêm chi nhánh',
        editBranch: 'Chỉnh sửa chi nhánh',
        branchDetails: 'Chi tiết chi nhánh',
        branchName: 'Tên chi nhánh',
        branchNamePlaceholder: 'Nhập tên chi nhánh',
        addressPlaceholder: 'Nhập địa chỉ',
        phonePlaceholder: 'Nhập số điện thoại',
        tableNumber: 'Số bàn',
        tableNumberPlaceholder: 'Nhập số bàn',
        registeredTables: 'Số bàn đã đăng ký',
        actualTables: 'Số bàn thực tế trên hệ thống',
        tableMismatch: '⚠️ Số bàn trên hệ thống không đúng với số bàn đã đăng ký',
        status: {
            open: 'Mở cửa',
            closed: 'Đóng cửa',
            maintenance: 'Bảo trì',
        },
        addSuccess: 'Đã thêm chi nhánh thành công!',
        updateSuccess: 'Cập nhật chi nhánh thành công!',
        deleteSuccess: 'Xóa chi nhánh thành công!',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa chi nhánh "{name}" không?',
        addressExists: 'Địa chỉ này đã tồn tại trong hệ thống',
        addressRequired: 'Địa chỉ là bắt buộc',
        addressMinLength: 'Địa chỉ phải có ít nhất 5 ký tự',
        phoneRequired: 'Số điện thoại là bắt buộc',
        phoneInvalid: 'Số điện thoại không hợp lệ',
        tableNumberRequired: 'Số bàn là bắt buộc',
        tableNumberMin: 'Số bàn phải lớn hơn 0',
        tableNumberCannotBeZero: 'Số bàn không thể là 0',
        cannotLoadBranches: 'Không thể tải danh sách chi nhánh',
        searchError: 'Lỗi tìm kiếm',
        noSearchResults: 'Không tìm thấy chi nhánh phù hợp',
        noBranches: 'Chưa có chi nhánh nào',
        tryDifferentKeywords: 'Thử thay đổi từ khóa tìm kiếm để tìm thấy chi nhánh phù hợp',
        useAddButton: 'Sử dụng nút "Thêm chi nhánh" ở trên để tạo chi nhánh đầu tiên',
        viewAll: 'Xem tất cả',
        searchPlaceholder: 'Nhập tên hoặc địa chỉ để tìm kiếm',
        table: {
            branchName: 'TÊN CHI NHÁNH',
            address: 'ĐỊA CHỈ',
            tableCount: 'SỐ BÀN',
            status: 'TRẠNG THÁI',
            clickToViewDetails: 'Nhấn để xem chi tiết',
        },
        detailPage: {
            title: 'CHI NHÁNH',
            editBranch: 'CHỈNH SỬA CHI NHÁNH',
            branchDetails: 'CHI TIẾT CHI NHÁNH',
            backToBranches: 'Quay lại',
            edit: 'Chỉnh sửa',
            saving: 'Đang lưu...',
            save: 'Lưu',
            delete: 'Xóa',
            deleting: 'Xóa...',
            deleteConfirm: 'Bạn có chắc chắn muốn xóa không?',
            deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa chi nhánh "{name}" không?',
            cancel: 'Hủy',
            confirm: 'Xác nhận',
            branchName: 'Tên Chi Nhánh',
            branchNameRequired: 'Tên chi nhánh là bắt buộc',
            address: 'Địa chỉ',
            addressRequired: 'Địa chỉ là bắt buộc',
            phoneNumber: 'Số điện thoại',
            phoneNumberRequired: 'Số điện thoại là bắt buộc',
            registeredTables: 'Số bàn đã đăng ký',
            registeredTablesRequired: 'Số bàn đã đăng ký là bắt buộc',
            actualTables: 'Số bàn thực tế trên hệ thống',
            actualTablesRequired: 'Số bàn thực tế là bắt buộc',
            status: 'Trạng thái',
            statusOpen: 'Mở cửa',
            statusClosed: 'Đóng cửa',
            statusMaintenance: 'Bảo trì',
            tableMismatchWarning: '⚠️ Số bàn trên hệ thống không đúng với số bàn đã đăng ký',
            invalidClubId: 'Club ID không hợp lệ',
            cannotLoadBranch: 'Không thể tải thông tin chi nhánh',
            updateSuccess: 'Cập nhật chi nhánh thành công!',
            updateFailed: 'Cập nhật chi nhánh thất bại',
            deleteSuccess: 'Xóa chi nhánh thành công!',
            deleteFailed: 'Xóa chi nhánh thất bại',
            branchNotFound: 'Không tìm thấy thông tin chi nhánh',
        },
    },

    // Managers
    managers: {
        title: 'QUẢN LÝ',
        addManager: 'Thêm quản lý',
        editManager: 'Chỉnh sửa quản lý',
        managerDetails: 'Chi tiết quản lý',
        managerName: 'Tên quản lý',
        managerNamePlaceholder: 'Nhập tên quản lý',
        managerEmail: 'Email quản lý',
        managerEmailPlaceholder: 'Nhập email quản lý',
        managerPhone: 'Điện thoại quản lý',
        managerPhonePlaceholder: 'Nhập điện thoại quản lý',
        branch: 'Chi nhánh',
        selectBranch: 'Chọn Chi Nhánh',
        selectBranchPlaceholder: '-- Chọn chi nhánh --',
        addSuccess: 'Thêm quản lý thành công!',
        updateSuccess: 'Cập nhật quản lý thành công!',
        deleteSuccess: 'Xóa quản lý thành công!',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa không?',
        noBranch: 'Chưa có chi nhánh',
        searchPlaceholder: 'Nhập tên hoặc số điện thoại để tìm kiếm',
        cannotLoadData: 'Không thể tải chi tiết quản lý',
        saveSuccess: 'Lưu quản lý thành công!',
        saveFailed: 'Cập nhật quản lý thất bại!',
        deleteFailed: 'Xóa quản lý thất bại!',
        dateOfBirth: 'Ngày Sinh',
        dateFormat: 'dd/mm/yyyy',
        citizenCode: 'CCCD',
        noBrandLinked: 'Tài khoản admin của bạn không được liên kết với thương hiệu nào.',
        cannotLoadList: 'Không thể tải danh sách quản lý',
        noSearchResults: 'Không tìm thấy quản lý phù hợp',
        noManagers: 'Chưa có quản lý nào',
        tryDifferentKeywords: 'Thử thay đổi từ khóa tìm kiếm để tìm thấy quản lý phù hợp',
        useAddButton: 'Sử dụng nút "Thêm quản lý" ở trên để tạo quản lý đầu tiên',
        cannotLoadBranches: 'Không thể tải danh sách chi nhánh',
        addFailed: 'Thêm quản lý thất bại!',
        table: {
            managerName: 'TÊN QUẢN LÝ',
            branch: 'CHI NHÁNH',
            phone: 'SỐ ĐIỆN THOẠI',
            status: 'TRẠNG THÁI',
        },
        status: {
            active: 'Hoạt động',
            inactive: 'Tạm nghỉ',
        },
    },

    // Feedbacks
    feedbacks: {
        title: 'PHẢN HỒI',
        feedbackDetails: 'Chi tiết phản hồi',
        feedbackContent: 'Nội dung phản hồi',
        feedbackType: 'Loại phản hồi',
        feedbackStatus: 'Trạng thái phản hồi',
        feedbackDate: 'Ngày phản hồi',
        customerName: 'Tên khách hàng',
        customerEmail: 'Email khách hàng',
        customerPhone: 'Điện thoại khách hàng',
        rating: 'Đánh giá',
        response: 'Phản hồi',
        respondToFeedback: 'Phản hồi khách hàng',
        markAsResolved: 'Đánh dấu đã giải quyết',
        markAsPending: 'Đánh dấu chờ xử lý',
        type: {
            general: 'Chung',
            complaint: 'Khiếu nại',
            suggestion: 'Đề xuất',
            bug: 'Báo lỗi',
        },
        searchPlaceholder: 'Nhập chi nhánh hoặc bàn để tìm kiếm',
        table: {
            branch: 'CHI NHÁNH',
            table: 'BÀN',
            time: 'THỜI GIAN',
            status: 'TRẠNG THÁI',
        },
        status: {
            pending: 'Chờ xử lý',
            resolved: 'Đã giải quyết',
            inProgress: 'Đang xử lý',
            managerP: 'Quản lý xử lý',
            adminP: 'Chủ doanh nghiệp xử lý',
            superadminP: 'Quản trị viên xử lý',
        },
        // Feedback Detail Page
        cannotLoadData: 'Không thể tải dữ liệu phản hồi',
        notFound: 'Không tìm thấy phản hồi',
        loadErrorDescription: 'Đã xảy ra lỗi khi tải thông tin phản hồi. Vui lòng thử lại sau.',
        backToList: 'Quay lại danh sách',
        manageFeedback: 'QUẢN LÝ PHẢN HỒI',
        tableType: 'Loại bàn',
        creatorTypeLabel: 'Loại người tạo',
        creatorType: {
            guest: 'Khách',
            membership: 'Hội viên',
        },
        createdAt: 'Thời gian tạo',
        updatedAt: 'Thời gian cập nhật',
        processingNote: 'Ghi chú xử lý',
        processingNotePlaceholder: 'Nhập ghi chú xử lý...',
        processingHistory: 'Lịch sử xử lý',
        noProcessingHistory: 'Chưa có lịch sử xử lý',
        processingHistoryDescription: 'Lịch sử xử lý sẽ hiển thị khi có người cập nhật phản hồi',
        saveSuccess: 'Đã lưu phản hồi thành công!',
        saveFailed: 'Lưu phản hồi thất bại.',
        // Feedback Listing Page
        cannotLoadList: 'Không thể tải danh sách phản hồi',
        noSearchResults: 'Không tìm thấy phản hồi phù hợp',
        noFeedbacks: 'Chưa có phản hồi nào',
        tryDifferentFilters: 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy phản hồi phù hợp',
        showingResults: 'Hiển thị {start}-{end} trong tổng số {total} phản hồi',
    },

    // Cameras
    cameras: {
        title: 'CAMERA',
        addCamera: 'Thêm camera',
        editCamera: 'Chỉnh sửa camera',
        cameraDetails: 'Chi tiết camera',
        cameraName: 'Tên camera',
        cameraNamePlaceholder: 'Nhập tên camera',
        cameraUrl: 'URL camera',
        cameraUrlPlaceholder: 'Nhập URL stream camera',
        cameraStatus: 'Trạng thái camera',
        cameraLocation: 'Vị trí camera',
        cameraLocationPlaceholder: 'Nhập vị trí camera',
        status: {
            active: 'Hoạt động',
            inactive: 'Không hoạt động',
            maintenance: 'Bảo trì',
        },
        addSuccess: 'Thêm camera thành công!',
        updateSuccess: 'Cập nhật camera thành công!',
        deleteSuccess: 'Xóa camera thành công!',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa camera "{name}" không?',
        // Camera Detail Page
        manageCamera: 'QUẢN LÝ CAMERA',
        editCameraTitle: 'CHỈNH SỬA CAMERA',
        cameraDetailsTitle: 'CHI TIẾT CAMERA',
        table: 'Bàn',
        tableRequired: 'Bàn là bắt buộc',
        ipAddress: 'Địa chỉ IP',
        ipAddressRequired: 'Địa chỉ IP là bắt buộc',
        ipAddressInvalid: 'Địa chỉ IP không hợp lệ',
        username: 'Tên đăng nhập',
        usernameRequired: 'Tên đăng nhập là bắt buộc',
        usernameMinLength: 'Tên đăng nhập phải có ít nhất 2 ký tự',
        password: 'Mật khẩu',
        passwordRequired: 'Mật khẩu là bắt buộc',
        connectionStatus: 'Trạng thái kết nối',
        connectionStatusRequired: 'Trạng thái kết nối là bắt buộc',
        connected: 'Đã kết nối',
        notConnected: 'Chưa kết nối',
        cannotLoadData: 'Không thể tải dữ liệu camera hoặc bàn',
        cameraNotFound: 'Không tìm thấy camera',
        saveSuccess: 'Đã lưu camera thành công!',
        saveFailed: 'Lưu camera thất bại.',
        deleteFailed: 'Xóa camera thất bại.',
        formatCategory: {
            pool8: 'Pool 8',
            carom: 'Carom',
        },
    },

    // Tables
    tables: {
        title: 'BÀN',
        addTable: 'Thêm bàn',
        editTable: 'Chỉnh sửa bàn',
        tableDetails: 'Chi tiết bàn',
        tableName: 'Tên bàn',
        tableNamePlaceholder: 'Nhập tên bàn',
        tableNumber: 'Số bàn',
        tableNumberPlaceholder: 'Nhập số bàn',
        tableStatus: 'Trạng thái bàn',
        tableType: 'Loại bàn',
        tableLocation: 'Vị trí bàn',
        tableLocationPlaceholder: 'Nhập vị trí bàn',
        status: {
            available: 'Có sẵn',
            occupied: 'Đang sử dụng',
            maintenance: 'Bảo trì',
            reserved: 'Đã đặt',
        },
        type: {
            standard: 'Tiêu chuẩn',
            premium: 'Cao cấp',
            vip: 'VIP',
        },
        addSuccess: 'Thêm bàn thành công!',
        updateSuccess: 'Cập nhật bàn thành công!',
        deleteSuccess: 'Xóa bàn thành công!',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa bàn "{name}" không?',
    },

    // Members
    members: {
        title: 'THÀNH VIÊN',
        addMember: 'Thêm thành viên',
        editMember: 'Chỉnh sửa thành viên',
        memberDetails: 'Chi tiết thành viên',
        memberName: 'Tên thành viên',
        memberNamePlaceholder: 'Nhập tên thành viên',
        memberEmail: 'Email thành viên',
        memberEmailPlaceholder: 'Nhập email thành viên',
        memberPhone: 'Điện thoại thành viên',
        memberPhonePlaceholder: 'Nhập điện thoại thành viên',
        memberId: 'ID thành viên',
        memberIdPlaceholder: 'Nhập ID thành viên',
        membershipType: 'Loại thành viên',
        membershipStatus: 'Trạng thái thành viên',
        joinDate: 'Ngày tham gia',
        expiryDate: 'Ngày hết hạn',
        status: {
            active: 'Hoạt động',
            inactive: 'Không hoạt động',
            suspended: 'Tạm khóa',
            expired: 'Hết hạn',
        },
        type: {
            basic: 'Cơ bản',
            premium: 'Cao cấp',
            vip: 'VIP',
        },
        addSuccess: 'Thêm thành viên thành công!',
        updateSuccess: 'Cập nhật thành viên thành công!',
        deleteSuccess: 'Xóa thành viên thành công!',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa thành viên "{name}" không?',
    },

    // Dashboard
    dashboard: {
        title: 'Bảng điều khiển',
        overview: 'Tổng quan',
        statistics: 'Thống kê',
        recentActivity: 'Hoạt động gần đây',
        totalBranches: 'Tổng chi nhánh',
        totalManagers: 'Tổng quản lý',
        totalMembers: 'Tổng thành viên',
        totalTables: 'Tổng bàn',
        activeMatches: 'Trận đấu đang diễn ra',
        pendingFeedbacks: 'Phản hồi chờ xử lý',
        revenue: 'Doanh thu',
        visitors: 'Khách hàng',
        loading: 'Đang tải...',
        cannotLoadStats: 'Không thể tải dữ liệu thống kê',
        noTablesFound: 'Chưa có bàn nào',
        noTablesFoundWithSearch: 'Không tìm thấy bàn phù hợp',
        tryChangingSearch: 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy bàn phù hợp',
        viewAll: 'Xem tất cả',
        viewMore: 'Xem thêm',
        minutes: 'phút',
        hours: 'giờ',
        hour: 'giờ',
        minute: 'phút',
    },

    // Match
    match: {
        title: 'Trận đấu',
        createMatch: 'Tạo trận đấu',
        joinMatch: 'Tham gia trận đấu',
        matchLobby: 'Sảnh chờ',
        matchLounge: 'Phòng chờ',
        scoreboard: 'Bảng điểm',
        matchHistory: 'Lịch sử trận đấu',
        matchDetails: 'Chi tiết trận đấu',
        matchStatus: 'Trạng thái trận đấu',
        matchType: 'Loại trận đấu',
        matchDate: 'Ngày trận đấu',
        matchDuration: 'Thời gian trận đấu',
        players: 'Người chơi',
        scores: 'Điểm số',
        winner: 'Người thắng',
        status: {
            waiting: 'Chờ',
            inProgress: 'Đang diễn ra',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
        },
        type: {
            friendly: 'Giao hữu',
            competitive: 'Cạnh tranh',
            tournament: 'Giải đấu',
        },
    },

    // Errors
    errors: {
        general: 'Đã xảy ra lỗi. Vui lòng thử lại.',
        networkError: 'Lỗi mạng. Vui lòng kiểm tra kết nối.',
        serverError: 'Lỗi máy chủ. Vui lòng thử lại sau.',
        notFound: 'Không tìm thấy',
        unauthorized: 'Truy cập không được phép',
        forbidden: 'Truy cập bị cấm',
        validationError: 'Vui lòng kiểm tra thông tin nhập và thử lại.',
        fileUploadError: 'Tải file thất bại. Vui lòng thử lại.',
        sessionExpired: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    },

    // Messages
    messages: {
        confirmDelete: 'Bạn có chắc chắn muốn xóa mục này không?',
        confirmAction: 'Bạn có chắc chắn muốn thực hiện hành động này không?',
        unsavedChanges: 'Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời đi không?',
        loadingData: 'Đang tải dữ liệu...',
        noData: 'Không có dữ liệu',
        noResults: 'Không tìm thấy kết quả',
        tryAgain: 'Vui lòng thử lại',
        contactSupport: 'Vui lòng liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.',
    },

    // Form validation
    validation: {
        required: 'Trường này là bắt buộc',
        email: 'Vui lòng nhập địa chỉ email hợp lệ',
        phone: 'Vui lòng nhập số điện thoại hợp lệ',
        minLength: 'Phải có ít nhất {min} ký tự',
        maxLength: 'Không được quá {max} ký tự',
        numeric: 'Phải là số',
        positive: 'Phải là số dương',
        url: 'Vui lòng nhập URL hợp lệ',
        password: 'Mật khẩu phải có ít nhất 6 ký tự',
        confirmPassword: 'Mật khẩu phải khớp',
    },

    // Home page
    home: {
        hero: {
            title: 'EVERY SHOT - EVERY RULE',
            subtitle: 'Tham gia cộng đồng bi-da sôi động - nơi tổ chức những giải đấu chuyên nghiệp, nâng tầm kỹ năng và chinh phục đỉnh cao vinh quang!',
        },
        scoringSystem: {
            title: 'Hệ thống tính điểm Bida là gì?',
            description: 'Hệ thống tính điểm Bida tự động giúp đơn giản hóa theo dõi điểm số, chính xác và minh bạch trong từng trận đấu. Phù hợp cho các giải đấu chuyên nghiệp hiện đại, hệ thống này hỗ trợ:',
            features: [
                'Cập nhật điểm số theo thời gian thực',
                'Lưu trữ lịch sử trận đấu',
                'Tổng hợp kết quả nhanh chóng',
                'Hạn chế sai sót khi tính điểm thủ công',
            ],
        },
        features: {
            clubManagement: {
                title: 'HỆ THỐNG QUẢN LÝ CLB BIDA',
                items: [
                    'Giúp ban tổ chức và vận hành CLB bida hiệu quả hơn',
                    'Quản lý lịch thi đấu, điểm số và lịch sử trận đấu',
                    'Hỗ trợ theo dõi hoạt động của từng bàn theo thời gian thực',
                    'Dễ sử dụng, phù hợp với mọi mô hình quản lý CLB',
                ],
            },
            memberSystem: {
                title: 'HỆ THỐNG HỘI VIÊN',
                items: [
                    'Tạo cộng đồng người chơi trung thành ngay tại quán của bạn',
                    'Quản lý và lưu trữ thông tin hội viên',
                    'Tạo điều kiện tổ chức các sự kiện, xếp hạng hội viên',
                    'Chăm sóc khách hàng thông qua các ưu đãi',
                ],
            },
        },
        values: {
            title: 'GIÁ TRỊ CỦA CHÚNG TÔI',
            items: [
                { title: 'Giao diện trực quan', description: '' },
                { title: 'Báo cáo điểm số chi tiết', description: '' },
                { title: 'Hỗ trợ bảo mật tài khoản', description: '' },
                { title: 'Hỗ trợ tận tâm', description: '' },
            ],
        },
        footer: {
            tagline: 'TÍNH ĐIỂM BIDA TỰ ĐỘNG - CHÍNH XÁC TRONG TỪNG LƯỢT CHƠI.',
            functions: {
                title: 'CHỨC NĂNG',
                items: [
                    'Theo dõi điểm tự động',
                    'Quản lý CLB',
                    'Hệ thống hội viên',
                ],
            },
            support: {
                title: 'HỖ TRỢ',
                items: [
                    'Các câu hỏi phổ biến',
                    'Điều khoản dịch vụ',
                    'Hướng dẫn trực tuyến (FAQs)',
                ],
            },
            contact: {
                title: 'LIÊN HỆ/MẠNG XÃ HỘI',
                phone: 'Số điện thoại: 0912345678',
                email: 'Email: scorelensbillards@gmail.com',
            },
        },
    },

    // Club
    club: {
        title: 'THÔNG TIN THƯƠNG HIỆU',
        image: 'Hình ảnh',
        uploadImage: 'Tải ảnh',
        uploading: 'Đang upload...',
        brandName: 'Tên Thương Hiệu',
        brandNamePlaceholder: 'Nhập tên thương hiệu...',
        website: 'Website',
        websitePlaceholder: 'Nhập website...',
        citizenCode: 'CCCD',
        citizenCodePlaceholder: 'Nhập CCCD...',
        phone: 'Số Điện Thoại',
        phonePlaceholder: 'Nhập SĐT...',
        branch: 'Chi nhánh',
        branchName: 'Tên chi nhánh',
        address: 'Địa chỉ',
        currentTables: 'Số bàn hiện có',
        edit: 'Chỉnh sửa',
        saveInfo: 'Lưu thông tin',
        saving: 'Đang lưu...',
        confirmUpdate: 'Xác nhận cập nhật',
        update: 'Cập nhật',
        confirmUpdateMessage: 'Bạn có chắc chắn muốn cập nhật thông tin thương hiệu không?',
        cannotLoadInfo: 'Không thể tải thông tin thương hiệu hoặc chi nhánh',
        uploadSuccess: 'Upload logo thành công!',
        uploadFailed: 'Upload thất bại',
        updateSuccess: 'Cập nhật thông tin thương hiệu thành công!',
        updateFailed: 'Cập nhật thông tin thương hiệu thất bại!',
        noChanges: 'Không có thông tin nào thay đổi',
        validation: {
            brandNameRequired: 'Tên thương hiệu là bắt buộc',
            brandNameMinLength: 'Tên thương hiệu phải có ít nhất 2 ký tự',
            invalidUrl: 'URL không hợp lệ, phải bắt đầu bằng https://',
            citizenCodeRequired: 'CCCD là bắt buộc',
            citizenCodeLength: 'Căn cước công dân (CCCD) phải có đúng 12 chữ số',
            invalidProvinceCode: 'Mã tỉnh/thành phố không hợp lệ',
            invalidGenderCode: 'Mã giới tính/thế kỷ không hợp lệ',
            invalidYear: 'Năm sinh không hợp lệ',
            phoneRequired: 'Số điện thoại là bắt buộc',
            invalidPhone: 'Số điện thoại không hợp lệ'
        }
    },

    // Confirm
    confirm: {
        title: 'BỔ SUNG THÔNG TIN TÀI KHOẢN',
        registrationSuccess: 'BẠN ĐÃ ĐĂNG KÝ THÀNH CÔNG',
        waitForApproval: 'Vui lòng chờ chúng tôi chấp nhận yêu cầu đăng ký của bạn!',
        thankYou: 'Cảm ơn bạn đã đăng ký!',
        redirectMessage: 'Bạn sẽ được chuyển hướng tự động trong',
        seconds: 'giây...',
    },
    accountPending: {
        title: 'Tài khoản đang chờ duyệt',
        description: 'Tài khoản của bạn đã được gửi lên hệ thống và đang chờ Quản trị viên xác nhận.',
        checkLater: 'Vui lòng kiểm tra lại sau hoặc liên hệ với Quản trị viên để được hỗ trợ nhanh hơn.',
        backToLogin: 'Quay lại đăng nhập',
    },

    // Guide
    guide: {
        loading: 'Đang tải...',
        roles: {
            business: 'CHỦ DOANH NGHIỆP',
            manager: 'QUẢN LÝ',
            member: 'HỘI VIÊN',
            user: 'NGƯỜI DÙNG',
        },
        business: {
            title: 'Hướng Dẫn Sử Dụng Hệ Thống Scorelens - Vai Trò CHỦ DOANH NGHIỆP',
            part1: {
                title: 'Phần 1: Đăng Ký và Kích Hoạt Tài Khoản',
                description: 'Là một Chủ Doanh Nghiệp, bạn sẽ trải qua quy trình đăng ký và xác thực để có thể quản lý hệ thống ScoreLens cho thương hiệu của mình.',
                step1: {
                    title: 'Bước 1: Đăng Ký Tài Khoản',
                    items: [
                        'Truy cập trang đăng ký dành cho Chủ Doanh Nghiệp',
                        'Nhập email và tạo mật khẩu mạnh cho tài khoản',
                        'Xác thực email bằng mã OTP được gửi đến hộp thư'
                    ]
                },
                step2: {
                    title: 'Bước 2: Bổ Sung Thông Tin Doanh Nghiệp',
                    items: [
                        'Nhập thông tin thương hiệu: Tên thương hiệu, Đường dẫn trình duyệt (Website), Căn cước công dân (CCCD), Số điện thoại',
                        'Thêm thông tin chi nhánh: Tên chi nhánh, Địa chỉ, Số điện thoại',
                        'Khai báo số lượng bàn chơi tại mỗi chi nhánh',
                        'Upload logo thương hiệu (tùy chọn)'
                    ]
                },
                step3: {
                    title: 'Bước 3: Chờ Duyệt Từ Quản Trị Viên',
                    items: [
                        'Sau khi hoàn tất, tài khoản sẽ ở trạng thái "Chờ duyệt"',
                        'Quản trị viên sẽ xem xét thông tin và phê duyệt tài khoản',
                        'Bạn sẽ nhận được email thông báo khi tài khoản được duyệt'
                    ]
                },
                step4: {
                    title: 'Bước 4: Truy Cập Hệ Thống',
                    items: [
                        'Sau khi được duyệt, đăng nhập bằng email và mật khẩu đã đăng ký',
                        'Bắt đầu quản lý hệ thống ScoreLens cho thương hiệu của bạn'
                    ]
                }
            },
            part2: {
                title: 'Phần 2: Bảng Điều Khiển và Quản Lý Tổng Quan',
                description: 'Sau khi đăng nhập thành công, bạn sẽ được đưa đến Bảng điều khiển (Admin Dashboard) - trung tâm điều hành của bạn.',
                quickStats: {
                    title: 'Thống Kê Nhanh:',
                    items: [
                        'Tổng số chi nhánh đang hoạt động',
                        'Số lượng quản lý đang làm việc',
                        'Phản hồi mới cần xử lý'
                    ]
                }
            },
            part3: {
                title: 'Phần 3: Các Chức Năng Quản Lý Chính',
                brandManagement: {
                    title: 'Quản Lý Thông Tin Thương Hiệu',
                    items: [
                        'Xem và chỉnh sửa thông tin thương hiệu: tên, website, Căn cước công dân (CCCD), số điện thoại',
                        'Quản lý logo thương hiệu',
                        'Xem danh sách tất cả chi nhánh thuộc thương hiệu',
                        'Thêm chi nhánh mới khi cần mở rộng'
                    ]
                },
                managerManagement: {
                    title: 'Quản Lý Tài Khoản Quản Lý (Manager)',
                    items: [
                        'Xem danh sách tất cả quản lý đang làm việc',
                        'Thêm quản lý mới: Nhập thông tin cá nhân, email, số điện thoại',
                        'Gán quản lý cho chi nhánh cụ thể',
                        'Kích hoạt/vô hiệu hóa tài khoản quản lý',
                        'Tìm kiếm và lọc quản lý theo chi nhánh, trạng thái'
                    ]
                },
                feedbackManagement: {
                    title: 'Quản Lý Phản Hồi và Hỗ Trợ',
                    items: [
                        'Xem tất cả phản hồi từ người dùng và quản lý',
                        'Lọc phản hồi theo trạng thái: Chờ xử lý, đang xử lý, đã hoàn thành',
                        'Lọc theo chi nhánh và khoảng thời gian',
                        'Tìm kiếm phản hồi theo từ khóa',
                        'Cập nhật trạng thái và phản hồi cho người gửi'
                    ]
                }
            },
            part4: {
                title: 'Phần 4: Các Chức Năng Bổ Sung',
                items: [
                    'Quản lý hồ sơ cá nhân: Thay đổi thông tin cá nhân và mật khẩu',
                    'Xem báo cáo tổng quan: Thống kê hoạt động của tất cả chi nhánh',
                    'Theo dõi hiệu suất: Đánh giá hiệu quả hoạt động của các quản lý',
                    'Gửi thông báo: Gửi thông báo quan trọng đến tất cả quản lý'
                ]
            }
        },
        manager: {
            title: 'Hướng Dẫn Sử Dụng Hệ Thống ScoreLens - Vai Trò QUẢN LÝ',
            part1: {
                title: 'Phần 1: Kích Hoạt Tài Khoản Quản Lý',
                description: 'Tài khoản của bạn được tạo và cấp quyền bởi Chủ Doanh Nghiệp. Bạn sẽ nhận được thông tin đăng nhập qua email.',
                receiveInfo: {
                    title: 'Nhận Thông Tin Tài Khoản',
                    items: [
                        'Kiểm tra email để nhận thông tin đăng nhập từ Chủ Doanh Nghiệp',
                        'Email sẽ chứa đường link đăng nhập và hướng dẫn chi tiết'
                    ]
                },
                loginByEmail: {
                    title: 'Đăng Nhập Bằng Email',
                    items: [
                        'Truy cập đường link đăng nhập được cung cấp',
                        'Nhập email đã được Chủ Doanh Nghiệp đăng ký',
                        'Hệ thống sẽ gửi mã xác thực đến email của bạn',
                        'Nhập mã xác thực để hoàn tất đăng nhập'
                    ]
                },
                subsequentLogin: {
                    title: 'Đăng Nhập Lần Sau',
                    items: [
                        'Chỉ cần nhập email đã đăng ký',
                        'Hệ thống tự động gửi mã xác thực mới',
                        'Nhập mã xác thực để truy cập hệ thống'
                    ]
                }
            },
            part2: {
                title: 'Phần 2: Bảng Điều Khiển Quản Lý',
                description: 'Sau khi đăng nhập, bạn sẽ thấy Bảng điều khiển - trung tâm điều hành của bạn tại câu lạc bộ.',
                overview: {
                    title: '📊 Thống Kê Tổng Quan:',
                    items: [
                        'Tổng số bàn: Số lượng bàn chơi trong câu lạc bộ',
                        'Bàn đang sử dụng: Số bàn hiện tại đang có trận đấu',
                        'Bàn trống: Số bàn có thể sử dụng ngay',
                        'Tổng thành viên: Số lượng hội viên đã đăng ký'
                    ]
                }
            },
            part3: {
                title: 'Phần 3: Quản Lý Vận Hành Hàng Ngày',
                equipmentManagement: {
                    title: 'Quản Lý Thiết Bị (Bàn chơi & Camera)',
                    items: [
                        'Xem danh sách tất cả bàn chơi trong câu lạc bộ',
                        'Thêm bàn mới: Nhập tên bàn, loại bàn (Pool 8, Pool 9, Snooker...)',
                        'Quản lý camera: Gán camera cho từng bàn để theo dõi trận đấu',
                        'Chỉnh sửa thông tin bàn: Cập nhật tên, loại, trạng thái bàn',
                        'Lọc và tìm kiếm bàn: Theo loại, trạng thái, tên bàn'
                    ]
                },
                matchManagement: {
                    title: 'Quản Lý Trận Đấu',
                    items: [
                        'Theo dõi các trận đấu đang diễn ra trong thời gian thực',
                        'Xem danh sách trận đấu theo bàn, thời gian, trạng thái',
                        'Chỉnh sửa thông tin trận đấu khi cần thiết:',
                        'Sửa lại điểm số bị Camera AI nhận diện sai',
                        'Cập nhật thông tin người chơi nếu bị nhầm lẫn',
                        'Kết thúc trận đấu thủ công nếu cần thiết',
                        'Xem lịch sử trận đấu đã kết thúc'
                    ]
                },
                memberManagement: {
                    title: 'Quản Lý Hội Viên',
                    items: [
                        'Xem danh sách tất cả hội viên đã đăng ký',
                        'Thêm hội viên mới: Nhập thông tin cá nhân, số điện thoại, email',
                        'Chỉnh sửa thông tin hội viên khi cần thiết',
                        'Kích hoạt/vô hiệu hóa tài khoản hội viên',
                        'Tìm kiếm hội viên theo tên, số điện thoại',
                        'Xem lịch sử trận đấu của từng hội viên'
                    ]
                },
                feedbackManagement: {
                    title: 'Quản Lý Phản Hồi',
                    items: [
                        'Xem tất cả phản hồi từ người dùng trong câu lạc bộ',
                        'Phản hồi và giải quyết các vấn đề được báo cáo',
                        'Cập nhật trạng thái phản hồi để người gửi biết tiến trình',
                        'Lọc phản hồi theo mức độ ưu tiên và trạng thái'
                    ]
                }
            },
            part4: {
                title: 'Phần 4: Các Chức Năng Bổ Sung',
                items: [
                    'Quản lý hồ sơ cá nhân: Thay đổi thông tin cá nhân và mật khẩu',
                    'Xem báo cáo hoạt động: Thống kê về trận đấu, hội viên, doanh thu',
                    'Gửi thông báo: Gửi thông báo quan trọng đến hội viên',
                    'Gửi phản hồi: Gửi phản hồi về hệ thống cho Chủ Doanh Nghiệp'
                ]
            }
        },
        member: {
            title: 'Hướng Dẫn Sử Dụng Hệ Thống ScoreLens - Dành Cho HỘI VIÊN',
            part1: {
                title: 'Phần 1: Bắt Đầu Trận Đấu - Quét Mã QR',
                description: 'Là hội viên, bạn có thể tạo và tham gia trận đấu một cách dễ dàng chỉ với vài thao tác đơn giản.',
                step1: {
                    title: 'Bước 1: Đến Bàn Chơi',
                    items: [
                        'Chọn bàn chơi bạn muốn sử dụng',
                        'Đảm bảo bàn đang trống và sẵn sàng cho trận đấu'
                    ]
                },
                step2: {
                    title: 'Bước 2: Quét Mã QR',
                    items: [
                        'Mở ứng dụng Camera trên điện thoại',
                        'Quét mã QR được đặt trên bàn chơi',
                        'Trình duyệt sẽ tự động mở trang web ScoreLens'
                    ]
                },
                step3: {
                    title: 'Bước 3: Tạo Trận Đấu',
                    items: [
                        'Nhập tên cho đội A và đội B',
                        'Chọn loại bàn (Pool 8, Pool 9, Snooker...)',
                        'Nhấn "Tạo trận đấu" để bắt đầu'
                    ]
                }
            },
            part2: {
                title: 'Phần 2: Quản Lý Trận Đấu - Quyền Chủ Phòng',
                importantNote: '🎯 Lưu Ý Quan Trọng: Chỉ Chủ phòng (người tạo trận đấu) mới có quyền thực hiện các thao tác quản lý.',
                realTimeScoring: {
                    title: 'Theo Dõi Điểm Số Trực Tiếp',
                    items: [
                        'Điểm số được cập nhật tự động thông qua AI Camera',
                        'Xem tỷ số thời gian thực trên màn hình',
                        'Không cần nhập điểm thủ công'
                    ]
                },
                editScores: {
                    title: 'Chỉnh Sửa Điểm Số (Chủ phòng)',
                    items: [
                        'Nếu AI nhận diện sai, chủ phòng có thể chỉnh sửa điểm',
                        'Nhấn nút "Chỉnh sửa" để điều chỉnh điểm cho từng đội',
                        'Lưu lại để cập nhật tỷ số chính xác'
                    ]
                },
                memberManagement: {
                    title: 'Quản Lý Thành Viên (Chủ phòng)',
                    items: [
                        'Thêm thành viên mới vào đội',
                        'Xóa thành viên khỏi đội nếu cần',
                        'Chỉnh sửa tên thành viên',
                        'Phân chia thành viên giữa đội A và đội B'
                    ]
                },
                joinMatch: {
                    title: 'Tham Gia Trận Đấu (Thành viên khác)',
                    items: [
                        'Quét mã QR trên bàn để tham gia trận đấu đang diễn ra',
                        'Nhập mã phòng được chủ phòng cung cấp',
                        'Xem điểm số trực tiếp nhưng không thể chỉnh sửa'
                    ]
                }
            },
            part3: {
                title: 'Phần 3: Kết Thúc và Đánh Giá',
                endMatch: {
                    title: 'Kết Thúc Trận Đấu (Chủ phòng)',
                    items: [
                        'Nhấn nút "Kết thúc" khi trận đấu hoàn thành',
                        'Xem kết quả cuối cùng và người chiến thắng',
                        'Trận đấu sẽ được lưu vào lịch sử'
                    ]
                },
                evaluateMatch: {
                    title: 'Đánh Giá Trận Đấu',
                    items: [
                        'Tất cả người chơi có thể đánh giá trận đấu',
                        'Viết nhận xét về trải nghiệm chơi',
                        'Gửi phản hồi để cải thiện dịch vụ'
                    ]
                }
            },
            part4: {
                title: 'Phần 4: Lợi Ích Dành Cho Hội Viên',
                memberPrivileges: '✨ Đặc Quyền Hội Viên:',
                items: [
                    'Lưu trữ vĩnh viễn tất cả trận đấu đã tham gia',
                    'Xem lịch sử trận đấu chi tiết',
                    'Theo dõi thống kê cá nhân và tiến độ',
                    'Tạo trận đấu riêng mà không cần hỗ trợ',
                    'Nhận thông báo về các sự kiện đặc biệt'
                ]
            }
        },
        user: {
            title: 'Hướng Dẫn Sử Dụng Hệ Thống ScoreLens - Dành Cho NGƯỜI DÙNG',
            part1: {
                title: 'Phần 1: Bắt Đầu Nhanh Chóng - Chỉ 3 Bước',
                description: 'Bạn có thể sử dụng hệ thống ScoreLens ngay lập tức mà không cần đăng ký tài khoản. Chỉ cần làm theo 3 bước đơn giản sau:',
                step1: {
                    title: 'Bước 1: Mở Camera Điện Thoại',
                    items: [
                        'Sử dụng ứng dụng Camera gốc trên điện thoại',
                        'Hoạt động trên cả iPhone và Android'
                    ]
                },
                step2: {
                    title: 'Bước 2: Quét Mã QR',
                    items: [
                        'Đưa camera về phía mã QR trên bàn chơi',
                        'Mã QR được đặt ngay trên bàn để dễ dàng quét'
                    ]
                },
                step3: {
                    title: 'Bước 3: Tự Động Mở Trang Web',
                    items: [
                        'Trình duyệt sẽ tự động mở trang web ScoreLens',
                        'Hiển thị thông tin bàn chơi và sẵn sàng sử dụng'
                    ]
                }
            },
            part2: {
                title: 'Phần 2: Sử Dụng Trang Web Trong Trận Đấu',
                initialInfo: {
                    title: 'Nhập Thông Tin Ban Đầu',
                    items: [
                        'Nhập tên hoặc biệt danh cho đội A và đội B',
                        'Chọn loại bàn chơi (Pool 8, Pool 9, Snooker...)',
                        'Nhấn "Bắt đầu" để khởi tạo trận đấu'
                    ]
                },
                realTimeScoring: {
                    title: 'Theo Dõi Điểm Số Trực Tiếp',
                    items: [
                        'Điểm số được cập nhật tự động trong thời gian thực',
                        'Không cần nhập điểm thủ công',
                        'Có thể liếc nhìn điện thoại bất cứ lúc nào để xem tỷ số'
                    ]
                },
                editScores: {
                    title: 'Chỉnh Sửa Điểm (Nếu Cần)',
                    items: [
                        'Nếu AI nhận diện sai điểm, có thể chỉnh sửa',
                        'Nhấn nút "Chỉnh sửa" để điều chỉnh điểm số',
                        'Lưu lại để cập nhật tỷ số chính xác'
                    ]
                },
                endMatch: {
                    title: 'Kết Thúc Trận Đấu',
                    items: [
                        'Nhấn nút "Kết thúc" khi trận đấu hoàn thành',
                        'Xem kết quả cuối cùng và người chiến thắng',
                        'Đánh giá trận đấu (tùy chọn)'
                    ]
                }
            },
            part3: {
                title: 'Phần 3: Lưu Ý Quan Trọng',
                criticalNote: '⚠️ Lưu Ý Cực Kỳ Quan Trọng: Vì bạn đang sử dụng web app với tư cách khách, dữ liệu trận đấu này chỉ là tạm thời. Nếu bạn đóng tab trình duyệt hoặc thoát ra, thông tin về trận đấu này sẽ mất vĩnh viễn và bạn sẽ không thể xem lại được.',
            },
            part4: {
                title: 'Phần 4: Nâng Cấp Lên Hội Viên',
                description: 'Bạn có muốn lưu lại mọi trận đấu để xem lại thành tích và sự tiến bộ của mình không? Hãy đăng ký làm Hội viên của câu lạc bộ!',
                memberBenefits: '🎁 Lợi Ích Khi Trở Thành Hội Viên:',
                items: [
                    'Lưu trữ vĩnh viễn tất cả trận đấu đã tham gia',
                    'Xem lịch sử trận đấu chi tiết',
                    'Theo dõi thống kê cá nhân và tiến độ',
                    'Tạo trận đấu riêng mà không cần hỗ trợ',
                    'Nhận thông báo về các sự kiện đặc biệt',
                    'Liên hệ Quản lý câu lạc bộ để đăng ký làm hội viên'
                ]
            }
        }
    },

    // History
    history: {
        title: 'TRA CỨU LỊCH SỬ ĐẤU',
        totalMembers: 'Tổng số hội viên',
        totalMatches: 'Tổng số trận đấu',
        todayMatches: 'Trận đấu hôm nay',
        memberIdLabel: 'Mã Hội Viên',
        memberIdPlaceholder: 'Nhập mã hội viên của bạn',
        memberIdNote: '* Nếu chưa có mã Hội viên, hãy liên hệ với nhân viên để đăng ký!',
        viewHistoryButton: 'Xem lịch sử đấu',
        loading: 'Đang tải...',
        memberNotFound: 'Không tìm thấy Hội viên với số điện thoại này',
        errorMessage: 'Không tìm thấy Hội viên với số điện thoại này',
        detailPage: {
            title: 'LỊCH SỬ ĐẤU',
            memberIdLabel: 'Mã Hội viên:',
            totalMatches: 'Tổng cộng',
            matches: 'trận đấu',
            phoneNotFound: 'Không tìm thấy số điện thoại',
            cannotLoadHistory: 'Không thể tải lịch sử trận đấu',
            backToSearch: 'Quay lại trang tìm kiếm',
            noMatchesFound: 'Không tìm thấy trận đấu phù hợp',
            noMatchesYet: 'Chưa có trận đấu nào',
            tryDifferentKeywords: 'Thử thay đổi từ khóa tìm kiếm hoặc ngày tháng để tìm thấy trận đấu phù hợp',
            tryDifferentSearch: 'Thử thay đổi từ khóa tìm kiếm để tìm thấy trận đấu phù hợp',
            tryDifferentDate: 'Thử thay đổi ngày tháng để tìm thấy trận đấu phù hợp',
            noMatchesInSystem: 'Hội viên này chưa có trận đấu nào trong hệ thống',
            viewAll: 'Xem tất cả',
            showingResults: 'Hiển thị {start}-{end} trong tổng số {total} trận đấu',
            teamA: 'ĐỘI A',
            teamB: 'ĐỘI B',
            draw: 'Hòa',
            pool: 'Pool',
            carom: 'Carom',
            unknown: 'Không xác định',
            notAvailable: 'N/A',
            notDetermined: 'Không xác định'
        }
    },

    // User Match
    userMatch: {
        create: {
            title: 'Chào mừng bạn đến với ScoreLens',
            tableInfo: 'Bàn chơi',
            pool8Ball: 'Pool 8 Ball',
            fullNameLabel: 'Họ và Tên',
            fullNamePlaceholder: 'Nhập họ và tên ...',
            memberIdLabel: 'Mã Hội Viên',
            memberIdPlaceholder: 'Nhập mã hội viên ...',
            verifyButton: 'Xác thực',
            verifying: 'Đang xác thực...',
            memberNote: '* Nếu chưa có mã hội viên, hãy liên hệ nhân viên để đăng ký!',
            joinButton: 'Tham gia',
            createMatchButton: 'Tạo trận đấu',
            checkingTable: 'Đang kiểm tra bàn...',
            error: {
                noTableId: 'Lỗi: Không tìm thấy thông tin bàn',
                noTableIdDescription: 'Vui lòng quét lại mã QR trên bàn để bắt đầu.',
                invalidUrl: 'URL không hợp lệ, vui lòng quét lại mã QR.',
                cannotVerifyTable: 'Không thể xác thực bàn. Vui lòng thử lại.',
                tableInUse: 'Bàn đang được sử dụng, không thể tạo trận đấu',
                noFullName: 'Vui lòng nhập họ và tên.',
                noTableInfo: 'Không tìm thấy thông tin bàn. Vui lòng quét lại mã QR.',
                noClubInfo: 'Không tìm thấy thông tin club',
                invalidResponse: 'Response không hợp lệ',
                verificationFailed: 'Xác thực thất bại',
                notMember: 'Bạn chưa đăng ký hội viên',
                accountBanned: 'Tài khoản của bạn đang bị cấm',
                notBrandCompatible: 'Bạn chưa đăng ký hội viên.'
            },
            success: {
                matchCreated: 'Tạo trận đấu thành công',
                welcome: 'Chào mừng bạn',
                welcomeWithName: 'Chào mừng {name}'
            },
            teamNames: {
                teamA: 'Đội A',
                teamB: 'Đội B'
            }
        }
    },
} as const;
