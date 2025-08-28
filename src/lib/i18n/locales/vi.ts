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
        toggleNavigationMenu: 'Chuyển đổi menu điều hướng',
        confirmLogout: 'Bạn có chắc chắn muốn đăng xuất không?',
        closeMenu: 'Đóng menu',
        logoutSuccess: 'Đăng xuất thành công!',
        logoutFailed: 'Đăng xuất thất bại.',
        tryAgain: 'Thử lại',
        backToHome: 'Quay lại trang chủ',
    },

    // Navigation
    nav: {
        home: 'Trang chủ',
        matchHistory: 'Lịch sử đấu',
        guide: 'Hướng dẫn',
        branches: 'Chi nhánh',
        managers: 'Quản lý',
        feedbacks: 'Phản hồi',
        cameras: 'Quản lý camera',
        tables: 'Quản lý bàn',
        members: 'Quản lý hội viên',
        dashboard: 'Trang chủ',
        admin: 'Chủ doanh nghiệp',
        superAdmin: 'Quản trị viên',
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
            newPasswordLabel: 'Mật khẩu mới',
            newPasswordPlaceholder: 'Nhập mật khẩu mới',
            confirmPasswordLabel: 'Xác nhận mật khẩu',
            confirmPasswordPlaceholder: 'Nhập lại mật khẩu mới',
            resetting: 'Đang đặt lại...',
            resetButton: 'Đặt lại mật khẩu',
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
            fullNameLabel: 'Họ và tên',
            fullNamePlaceholder: 'Nhập họ và tên của bạn',
            fullNameRequired: 'Họ và tên là bắt buộc',
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
            // Validation messages
            passwordRequired: 'Mật khẩu là bắt buộc',
            passwordMinLength8: 'Mật khẩu phải có ít nhất 8 ký tự',
            passwordComplexity: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
            confirmPasswordRequired: 'Xác nhận mật khẩu là bắt buộc',
            confirmPasswordMismatch: 'Mật khẩu xác nhận không khớp',
            // Toast messages
            pleaseCheckInfo: 'Vui lòng kiểm tra lại thông tin',
            generalError: 'Có lỗi xảy ra. Vui lòng thử lại.',
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
            fullName: 'Họ và tên',
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
            // Validation messages
            nameMinLength: 'Tên chi nhánh phải có ít nhất 2 ký tự',
            nameMaxLength: 'Tên chi nhánh không được vượt quá 255 ký tự',
            addressMinLength: 'Địa chỉ phải có ít nhất 5 ký tự',
            addressMaxLength: 'Địa chỉ không được vượt quá 255 ký tự',
            phoneInvalid: 'Số điện thoại không hợp lệ',
            tableNumberMin: 'Số bàn ít nhất là 1',
            // Toast messages
            pleaseCheckInfo: 'Vui lòng kiểm tra lại thông tin',
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
        // Manager Detail Page Validation
        managerNameRequired: 'Tên quản lý là bắt buộc',
        managerNameMinLength: 'Tên quản lý phải có ít nhất 2 ký tự',
        managerNameMaxLength: 'Tên quản lý không được vượt quá 255 ký tự',
        phoneInvalid: 'Số điện thoại không hợp lệ',
        dateOfBirthInvalid: 'Ngày sinh không hợp lệ (định dạng phải là dd/mm/yyyy)',
        dateOfBirthInvalidOrFuture: 'Ngày sinh không hợp lệ hoặc ở tương lai',
        emailInvalid: 'Email không hợp lệ',
        citizenCodeLength: 'CCCD phải có đúng 12 chữ số',
        citizenCodeProvinceInvalid: 'Mã tỉnh/thành phố không hợp lệ',
        citizenCodeGenderInvalid: 'Mã giới tính/thế kỷ không hợp lệ',
        citizenCodeYearInvalid: 'Năm sinh không hợp lệ',
        addressMinLength: 'Địa chỉ phải có ít nhất 5 ký tự',
        addressMaxLength: 'Địa chỉ không được vượt quá 255 ký tự',
        // Toast messages
        pleaseCheckInfo: 'Vui lòng kiểm tra lại thông tin',
        updateFailed: 'Cập nhật quản lý thất bại!',
        // Add Manager Page Validation
        clubIdRequired: 'Vui lòng chọn chi nhánh',
        dateOfBirthRequired: 'Ngày sinh là bắt buộc',
        citizenCodeRequired: 'CCCD là bắt buộc',
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

    // Brand Info Form
    brandInfoForm: {
        title: 'Thông tin thương hiệu',
        editTitle: 'Chỉnh sửa thông tin thương hiệu',
        logoLabel: 'Logo thương hiệu',
        logoRequired: 'Logo là bắt buộc',
        logoNotSelected: 'Chưa chọn logo',
        uploadSuccess: 'Upload logo thành công!',
        uploadFailed: 'Upload thất bại',
        imageFormatInfo: 'Định dạng ảnh cho phép: PNG, JPG, JPEG, tối đa 5MB',
        uploading: 'Đang tải lên...',
        brandNameLabel: 'Tên thương hiệu',
        brandNameRequired: 'Tên thương hiệu là bắt buộc',
        brandNameMinLength: 'Tên thương hiệu phải có ít nhất 2 ký tự',
        brandNamePlaceholder: 'Nhập tên thương hiệu...',
        phoneLabel: 'Số điện thoại',
        phoneRequired: 'Số điện thoại là bắt buộc',
        phoneInvalid: 'Số điện thoại không hợp lệ',
        phonePlaceholder: 'Nhập số điện thoại...',
        citizenCodeLabel: 'CCCD',
        citizenCodeRequired: 'CCCD là bắt buộc',
        citizenCodeLength: 'CCCD phải có đúng 12 chữ số',
        citizenCodeProvinceInvalid: 'Mã tỉnh/thành phố không hợp lệ',
        citizenCodeGenderInvalid: 'Mã giới tính/thế kỷ không hợp lệ',
        citizenCodeYearInvalid: 'Năm sinh không hợp lệ',
        citizenCodePlaceholder: 'Nhập CCCD...',
        websiteLabel: 'Website',
        websiteInvalid: 'URL không hợp lệ, phải bắt đầu bằng https://',
        websitePlaceholder: 'https://example.com',
        saveAndContinue: 'Lưu và tiếp tục',
        updateAndContinue: 'Cập nhật và tiếp tục',
        saving: 'Đang lưu...',
        updating: 'Đang cập nhật...',
        updateSuccess: 'Cập nhật thông tin thương hiệu thành công!',
        saveSuccess: 'Lưu thông tin thương hiệu thành công!',
        operationFailed: 'Thao tác thất bại. Vui lòng thử lại.',
    },

    // Branch Info Form
    branchInfoForm: {
        title: 'Thông tin chi nhánh',
        backToPrevious: '← Quay lại bước trước',
        branch: 'Chi nhánh',
        addBranch: 'Thêm chi nhánh',
        removeBranch: 'Xóa chi nhánh',
        clubNameLabel: 'Tên Câu Lạc Bộ',
        clubNameRequired: 'Tên chi nhánh là bắt buộc',
        clubNamePlaceholder: 'Nhập Tên Chi Nhánh...',
        tableCountLabel: 'Số Bàn',
        tableCountRequired: 'Số bàn là bắt buộc',
        tableCountPlaceholder: 'Nhập Số Bàn...',
        addressLabel: 'Địa Chỉ',
        addressRequired: 'Địa chỉ là bắt buộc',
        addressPlaceholder: 'Nhập Địa Chỉ',
        phoneLabel: 'Số Điện Thoại',
        phoneRequired: 'Số điện thoại là bắt buộc',
        phoneInvalid: 'Số điện thoại không hợp lệ',
        phonePlaceholder: 'Nhập Số Điện Thoại...',
        save: 'Lưu',
        edit: 'Chỉnh sửa',
        createNew: 'Tạo mới',
        saving: 'Đang lưu...',
        cancel: 'Hủy',
        deleteSuccess: 'Xóa chi nhánh thành công!',
        deleteFailed: 'Xóa chi nhánh thất bại!',
        updateSuccess: 'Cập nhật chi nhánh thành công!',
        createSuccess: 'Tạo chi nhánh thành công!',
        updateFailed: 'Cập nhật chi nhánh thất bại!',
        createFailed: 'Tạo chi nhánh thất bại!',
        confirmTitle: 'Xác nhận thông tin đăng ký',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy',
        creating: 'Đang tạo...',
        preparing: 'Đang chuẩn bị...',
        updateAndContinue: 'Cập nhật và tiếp tục',
        confirmInfo: 'Xác nhận thông tin',
        brandInfoTitle: 'Thông tin thương hiệu',
        branchInfoTitle: 'Thông tin chi nhánh',
        brandName: 'Tên thương hiệu',
        phoneNumber: 'Số điện thoại',
        website: 'Website',
        citizenCode: 'CCCD',
        address: 'Địa chỉ',
        tableCount: 'Số bàn',
        phone: 'Số điện thoại',
        noWebsite: 'N/A',
        createBrandAndClubSuccess: 'Tạo thương hiệu và câu lạc bộ thành công!',
        cannotUpdateStatus: 'Không thể cập nhật trạng thái admin về pending.',
        operationFailed: 'Thao tác thất bại. Vui lòng thử lại.',
        deleteConfirmTitle: 'Xác nhận xóa chi nhánh',
        deleteConfirmText: 'Xóa',
        deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa chi nhánh này không?',
        saveAndContinue: 'Lưu và tiếp tục',
        updating: 'Đang cập nhật...',
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
        markAsResolved: 'Đánh dấu đã xử lý',
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
            resolved: 'Đã xử lý',
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
        cannotEditFeedback: 'Bạn chỉ có thể chỉnh sửa feedback có trạng thái "Quản lý xử lý"',
        // Feedback Listing Page
        noSearchResults: 'Không tìm thấy phản hồi phù hợp',
        noFeedbacks: 'Chưa có phản hồi nào',
        tryDifferentFilters: 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy phản hồi phù hợp',
        showingResults: 'Hiển thị {start}-{end} trong tổng số {total} phản hồi',
        // Manager Feedback Page
        managementTitle: 'QUẢN LÝ PHẢN HỒI',
        loading: 'Đang tải...',
        cannotLoadFeedbacks: 'Không thể tải danh sách phản hồi',
        viewAll: 'Xem tất cả',
        filterOptions: {
            all: 'Tất cả',
            pending: 'Chưa xử lý',
            resolved: 'Đã xử lý',
        },
        timeLabel: 'Thời gian:',
        statusLabel: 'Trạng thái:',
        clickToViewDetails: 'Nhấn để xem chi tiết →',
        // Feedback Detail Page
        save: 'Lưu',
        edit: 'Chỉnh sửa',
        back: 'Quay lại',
        deletedClub: 'Không xác định',
        deletedTable: 'Không xác định',
        unknown: 'Không xác định',
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
        deleteConfirm: 'Bạn có chắc chắn muốn xóa camera này không?',
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
        // Camera Add Page
        addCameraTitle: 'THÊM CAMERA',
        selectTable: 'Chọn bàn',
        selectTablePlaceholder: 'Chọn bàn',
        ipAddressPlaceholder: 'Nhập địa chỉ IP',
        usernamePlaceholder: 'Nhập username',
        passwordPlaceholder: 'Nhập mật khẩu',
        checking: 'Đang kiểm tra...',
        test: 'Kiểm tra',
        cannotLoadTables: 'Không thể tải danh sách bàn',
        cameraAddedSuccess: 'Camera đã được thêm thành công!',
        cannotCreateCamera: 'Không thể tạo camera trong database',
        cannotConnectCamera: 'Không thể kết nối camera',
        errorCheckingCamera: 'Lỗi khi kiểm tra camera',
        unknownError: 'Lỗi không xác định',
        // Camera Management Page
        managementTitle: 'QUẢN LÝ CAMERA',
        searchPlaceholder: 'Nhập tên bàn để tìm kiếm',
        loading: 'Đang tải...',
        cannotLoadCameras: 'Không thể tải danh sách camera hoặc bàn',
        noCamerasFound: 'Không tìm thấy camera phù hợp',
        noCamerasYet: 'Chưa có camera nào',
        noCamerasDescription: 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy camera phù hợp',
        viewAll: 'Xem tất cả',
        tableHeader: 'BÀN',
        ipHeader: 'IP',
        statusHeader: 'TRẠNG THÁI',
        actionsHeader: 'HÀNH ĐỘNG',
        viewCamera: 'Xem Camera',
        statusLabel: 'Trạng thái:',
        clickToViewDetails: 'Nhấn để xem chi tiết →',
        cameraNotConnected: 'Camera chưa được kết nối. Vui lòng kiểm tra trạng thái kết nối.',
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
            empty: 'Bàn trống',
            inuse: 'Đang sử dụng',
        },
        types: {
            pool: 'Bida Pool',
            carom: 'Bida Carom'
        },
        ready: 'Sẵn sàng',
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
        // Member Detail Page
        memberNotFound: 'Không tìm thấy hội viên',
        cannotLoadMemberData: 'Không thể tải dữ liệu hội viên',
        memberNameRequired: 'Tên hội viên là bắt buộc',
        memberNameMinLength: 'Tên hội viên phải có ít nhất 2 ký tự',
        phoneRequired: 'Số điện thoại là bắt buộc',
        phoneInvalid: 'Số điện thoại không hợp lệ',
        phoneAlreadyUsed: 'Số điện thoại đã được sử dụng bởi hội viên khác',
        saveMemberFailed: 'Lưu hội viên thất bại.',
        deleteMemberFailed: 'Xóa hội viên thất bại.',
        memberManagement: 'QUẢN LÝ HỘI VIÊN',
        memberCode: 'Mã hội viên',
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
        // Manager Dashboard
        dashboardTitle: 'BẢNG ĐIỀU KHIỂN',
        availableTables: 'Bàn trống',
        tablesInUse: 'Đang sử dụng',
        searchPlaceholder: 'Nhập tên bàn để tìm kiếm',
        all: 'Tất cả',
        // Admin Dashboard specific
        adminDashboardTitle: 'BẢNG ĐIỀU KHIỂN',
        totalBranchesCard: 'Tổng chi nhánh',
        activeBranches: 'Đang mở',
        closedBranches: 'Đóng cửa',
        totalTablesCard: 'Tổng bàn',
        activeTables: 'Sử dụng',
        emptyTables: 'Trống',
        maintenanceTables: 'Bảo trì',
        totalManagersCard: 'Quản lý',
        workingManagers: 'Làm việc',
        onLeaveManagers: 'Tạm nghỉ',
        totalFeedbacksCard: 'Phản hồi',
        pendingFeedbacksCard: 'Cần xử lý',
        resolvedFeedbacks: 'Đã xử lý',
        branchComparison: 'So sánh chi nhánh',
        branchComparisonDesc: 'Số lượng bàn và quản lý theo chi nhánh',
        tableStatus: 'Trạng thái bàn',
        tableStatusDesc: 'Phân bố bàn đang sử dụng và trống',
        branchStatistics: 'Thống kê chi tiết theo chi nhánh',
        branchStatisticsDesc: 'Xem chi tiết hoạt động của từng chi nhánh',
        noDataTitle: 'Chưa có dữ liệu',
        noDataDesc: 'Hệ thống chưa có chi nhánh hoặc dữ liệu để hiển thị',
        chartNoData: 'Chưa có dữ liệu biểu đồ',
        errorTitle: 'Lỗi tải dữ liệu',
        clearError: 'Xóa lỗi',
        tryAgain: 'Thử lại',
        branchNumber: 'Chi nhánh #{number}',
        tableStatusTitle: 'Trạng thái bàn',
        managerStatusTitle: 'Trạng thái quản lý',
        tablesInUseStatus: 'Đang sử dụng',
        emptyTablesStatus: 'Trống',
        maintenanceTablesStatus: 'Bảo trì',
        workingManagersStatus: 'Đang làm việc',
        onLeaveManagersStatus: 'Tạm nghỉ',
        tables: 'bàn',
        managers: 'quản lý',
        inUse: 'Đang sử dụng',
        empty: 'Trống',
        maintenance: 'Bảo trì',
        managerStatus: 'Trạng thái quản lý',
        working: 'Đang làm việc',
        onLeave: 'Tạm nghỉ',
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
                    'Tạo trận đấu riêng mà không cần hỗ trợ',
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
                title: 'Phần 3: Nâng Cấp Lên Hội Viên',
                description: 'Bạn có muốn lưu lại mọi trận đấu để xem lại thành tích và sự tiến bộ của mình không? Hãy đăng ký làm Hội viên của câu lạc bộ!',
                memberBenefits: '🎁 Lợi Ích Khi Trở Thành Hội Viên:',
                items: [
                    'Lưu trữ vĩnh viễn tất cả trận đấu đã tham gia',
                    'Xem lịch sử trận đấu chi tiết',
                    'Tạo trận đấu riêng mà không cần hỗ trợ',
                    'Liên hệ Quản lý câu lạc bộ để đăng ký làm hội viên'
                ]
            },

        }
    },

    // FAQ
    faq: {
        loading: 'Đang tải...',
        title: 'Câu Hỏi Thường Gặp (FAQ)',
        categories: {
            general: 'Câu Hỏi Chung',
            usage: 'Hướng Dẫn Sử Dụng',
            membership: 'Hội Viên',
            technical: 'Kỹ Thuật',
        },
        general: {
            whatIsScoreLens: {
                question: 'ScoreLens là gì?',
                answer: 'ScoreLens là hệ thống tự động theo dõi điểm số billiards sử dụng công nghệ AI và camera. Hệ thống giúp ghi lại điểm số chính xác trong thời gian thực mà không cần can thiệp thủ công.'
            },
            needAccount: {
                question: 'Tôi có cần đăng ký tài khoản không?',
                answer: 'Không bắt buộc. Bạn có thể sử dụng như khách, nhưng đăng ký làm hội viên sẽ có nhiều lợi ích như lưu trữ lịch sử trận đấu, thống kê cá nhân và nhiều tính năng khác.'
            },
            isFree: {
                question: 'Hệ thống có miễn phí không?',
                answer: 'Có, bạn có thể sử dụng hệ thống hoàn toàn miễn phí với tư cách khách. Tuy nhiên, để có thêm nhiều tính năng và lưu trữ dữ liệu, bạn nên đăng ký làm hội viên.'
            }
        },
        usage: {
            howToUse: {
                question: 'Làm thế nào để sử dụng hệ thống ScoreLens?',
                answer: 'Chỉ cần quét mã QR trên bàn billiards bằng camera điện thoại, sau đó nhập tên đội và bắt đầu trận đấu. Hệ thống sẽ tự động theo dõi điểm số.'
            },
            phoneCompatibility: {
                question: 'Hệ thống có hoạt động trên tất cả điện thoại không?',
                answer: 'Có, hệ thống hoạt động trên cả iPhone và Android. Chỉ cần có camera và trình duyệt web là có thể sử dụng được.'
            },
            editScores: {
                question: 'Có thể chỉnh sửa điểm số không?',
                answer: 'Có, chủ phòng có thể chỉnh sửa điểm số nếu AI nhận diện sai. Nhấn nút \'Edit\' để điều chỉnh điểm số chính xác.'
            },
            endMatch: {
                question: 'Làm sao để kết thúc trận đấu?',
                answer: 'Chủ phòng có thể nhấn nút \'End\' để kết thúc trận đấu. Sau đó có thể đánh giá trận đấu và gửi phản hồi.'
            }
        },
        membership: {
            howToBecome: {
                question: 'Làm sao để trở thành hội viên?',
                answer: 'Liên hệ với quản lý câu lạc bộ để đăng ký làm hội viên. Bạn sẽ nhận được mã hội viên để sử dụng hệ thống với đầy đủ tính năng.'
            },
            benefits: {
                question: 'Lợi ích của việc trở thành hội viên là gì?',
                answer: 'Hội viên có thể lưu trữ vĩnh viễn tất cả trận đấu, xem lịch sử chi tiết, theo dõi thống kê cá nhân, tạo trận đấu riêng và nhận thông báo về các sự kiện đặc biệt.'
            },
            viewHistory: {
                question: 'Làm sao để xem lịch sử trận đấu?',
                answer: 'Nếu bạn là hội viên, có thể xem lịch sử tại trang \'Match History\'. Nếu là khách, dữ liệu sẽ mất khi đóng trình duyệt.'
            },
            convertToMember: {
                question: 'Có thể chuyển từ khách sang hội viên không?',
                answer: 'Có, bạn có thể đăng ký làm hội viên bất cứ lúc nào. Tuy nhiên, các trận đấu đã chơi trước đó với tư cách khách sẽ không được lưu trữ.'
            }
        },
        technical: {
            technology: {
                question: 'Hệ thống sử dụng công nghệ gì?',
                answer: 'ScoreLens sử dụng công nghệ AI (Trí tuệ nhân tạo) và camera để tự động nhận diện và theo dõi điểm số trong thời gian thực.'
            },
            accuracy: {
                question: 'Độ chính xác của hệ thống như thế nào?',
                answer: 'Hệ thống có độ chính xác cao, tuy nhiên trong một số trường hợp có thể cần điều chỉnh thủ công nếu AI nhận diện sai.'
            },
            security: {
                question: 'Dữ liệu có được bảo mật không?',
                answer: 'Có, chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo chính sách bảo mật và tuân thủ các quy định pháp luật hiện hành.'
            },
            offline: {
                question: 'Có thể sử dụng offline không?',
                answer: 'Hiện tại hệ thống cần kết nối internet để hoạt động. Chúng tôi đang phát triển tính năng offline trong tương lai.'
            }
        },
        notFound: {
            title: 'Không tìm thấy câu trả lời bạn cần?',
            button: 'Xem Hướng Dẫn Chi Tiết'
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
            // MemberIdForm component
            memberIdForm: {
                memberIdLabel: 'Mã Hội Viên (Nếu Có)',
                memberIdPlaceholder: 'Nhập mã hội viên...',
                memberNote: '* Nếu chưa có mã Hội viên, hãy liên hệ với nhân viên để đăng ký!',
                createMatchButton: 'Tạo trận đấu'
            },
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
        },
        entry: {
            title: 'BÀN',
            pool8Ball: 'Pool 8 Ball',
            loading: 'Đang tải...',
            description: 'Hãy nhập mã phòng để tiếp tục',
            continue: 'Tiếp tục',
            error: {
                incompleteCode: 'Vui lòng nhập đủ 6 chữ số!',
                invalidCode: 'Mã phòng không hợp lệ!',
                codeNotFound: 'Mã phòng không tồn tại hoặc đã bị hủy!'
            },
            success: {
                welcome: 'Chào mừng bạn đến với ScoreLens',
                validCode: 'Mã phòng hợp lệ!'
            }
        },
        join: {
            title: 'BÀN',
            pool8Ball: 'Pool 8 Ball',
            loading: 'Đang tải...',
            description: 'Nhập tên để tham gia phòng',
            fullNameLabel: 'Họ và Tên',
            fullNamePlaceholder: 'Nhập họ và tên ...',
            phoneLabel: 'Số Điện Thoại',
            phonePlaceholder: 'Nhập số điện thoại ...',
            verifyButton: 'Xác thực',
            verifying: 'Đang xác thực...',
            memberNote: '* Nếu chưa có mã hội viên, hãy liên hệ nhân viên để đăng ký!',
            continue: 'Tiếp tục',
            teamSelection: {
                title: 'Chọn đội để tham gia',
                teamA: 'Đội A',
                teamB: 'Đội B',
                cancel: 'Hủy',
                confirm: 'Xác nhận',
                processing: 'Đang xử lý...'
            },
            error: {
                noPhone: 'Vui lòng nhập số điện thoại.',
                cannotDetermineClub: 'Không thể xác định club. Vui lòng thử lại.',
                verificationFailed: 'Xác thực thất bại',
                notMember: 'Bạn chưa đăng ký hội viên',
                notBrandCompatible: 'Bạn không phải là hội viên của thương hiệu này.',
                accountBanned: 'Tài khoản của bạn đang bị cấm',
                noFullName: 'Vui lòng nhập họ và tên.',
                alreadyJoined: 'Bạn đã tham gia trận đấu này rồi.'
            },
            success: {
                verificationSuccess: 'Xác thực thành công!',
                welcomeWithName: 'Chào mừng {name}!',
                joinRoomSuccess: 'Tham gia phòng thành công!',
                createRoomSuccess: 'Tạo phòng thành công!'
            }
        },
        lobby: {
            title: 'BÀN',
            pool8: 'POOL 8',
            loading: 'ĐANG TẢI...',
            description: 'Nhập mã bên dưới để tham gia phòng',
            joinCode: 'Mã Tham Gia',
            shareCodeNote: 'Chia sẻ mã này cho người chơi để tham gia phòng',
            teamALabel: 'Đội A',
            teamBLabel: 'Đội B',
            roomOwnerPlaceholder: 'Tên chủ phòng',
            mainPlayerPlaceholder: 'Tên người chơi chính',
            playerPlaceholder: 'Tên người chơi {index}',
            startButton: 'Bắt đầu',
            loadingText: 'Đang tải...',
            notReady: 'Chưa sẵn sàng',
            connecting: 'Đang kết nối...',
            noPermission: 'Không có quyền',
            error: {
                noMatchId: 'Không có matchId. Vui lòng kiểm tra lại.',
                noWebSocketConnection: 'Chưa kết nối WebSocket. Vui lòng đợi kết nối hoàn tất.',
                authLoading: 'Đang xác thực quyền. Vui lòng đợi...',
                authError: 'Lỗi xác thực: {error}',
                hostOnly: 'Chỉ chủ phòng mới có thể bắt đầu trận đấu.',
                cannotAuthenticateStart: 'Không thể xác thực quyền bắt đầu trận đấu. Vui lòng liên hệ admin.',
                cannotStartMatch: 'Không thể bắt đầu trận đấu. Vui lòng thử lại.',
                errorStartingMatch: 'Đã xảy ra lỗi khi bắt đầu trận đấu.',
                cannotLoadTableInfo: 'Không thể tải thông tin bàn. Đang sử dụng thông tin mặc định.',
                cannotLoadMatchInfo: 'Không thể tải thông tin trận đấu',
                cannotLoadMatchByCode: 'Không thể tải thông tin trận đấu theo mã phòng',
                errorLoadingData: 'Đã xảy ra lỗi khi tải dữ liệu',
                cannotRestoreSession: 'Không thể khôi phục phiên làm việc',
                sessionRestoreError: 'Lỗi khôi phục phiên làm việc',
                cannotAuthenticateJoin: 'Không thể xác thực tham gia trận đấu',
                missingAuthInfo: 'Thiếu thông tin để xác thực tham gia trận đấu',
                newPlayerJoined: 'Người chơi mới đã tham gia phòng!',
                playerLeft: 'Người chơi đã rời khỏi phòng'
            },
            success: {
                matchStarted: 'Trận đấu đã bắt đầu!'
            }
        },

        // Lounge Page
        lounge: {
            title: 'BÀN',
            pool8: 'POOL 8',
            loading: 'ĐANG TẢI...',
            description: 'Bạn đã tham gia phòng với tên: {name}',
            joinCode: 'Mã Tham Gia',
            shareCodeNote: 'Chia sẻ mã này cho người chơi để tham gia phòng',
            teamALabel: 'Đội A',
            teamBLabel: 'Đội B',
            playerPlaceholder: 'Người Chơi {index}',
            leaveButton: 'Rời phòng',
            leaving: 'Đang rời phòng...',
            loadingText: 'Đang tham gia phòng...',
            confirmLeaveTitle: 'Xác nhận rời phòng',
            confirmLeaveMessage: 'Bạn có chắc chắn muốn rời khỏi phòng này không?',
            cancel: 'Hủy',
            confirm: 'Xác nhận',
            error: {
                cannotLoadTableInfo: 'Không thể tải thông tin bàn',
                cannotLoadMatchInfo: 'Không thể tải thông tin trận đấu',
                cannotLoadMatchByCode: 'Không thể tải thông tin trận đấu theo mã phòng',
                errorLoadingData: 'Có lỗi xảy ra khi tải dữ liệu',
                cannotLeaveRoom: 'Không thể rời phòng',
                errorLeavingRoom: 'Có lỗi xảy ra khi rời phòng'
            },
            success: {
                newPlayerJoined: 'Người chơi mới đã tham gia phòng!',
                playerLeft: 'Người chơi đã rời khỏi phòng',
                leftRoom: 'Đã rời khỏi phòng'
            }
        },
    },

    // Manager Matches
    managerMatches: {
        tableNotFound: 'Không tìm thấy bàn',
        cannotIdentifyMatch: 'Không xác định được trận đấu để hủy',
        cancelMatchSuccess: 'Hủy trận đấu thành công!',
        cancelMatchFailed: 'Hủy trận đấu thất bại!',
        cannotIdentifyMatchToEnd: 'Không xác định được trận đấu để kết thúc',
        cannotGetMatchInfo: 'Không thể lấy thông tin trận đấu',
        endMatchSuccess: 'Kết thúc trận đấu thành công!',
        endMatchFailed: 'Kết thúc trận đấu thất bại!',
        updateMembersFailed: 'Cập nhật thành viên thất bại!',
        createMatchSuccess: 'Tạo trận đấu thành công!',
        createMatchFailed: 'Tạo trận đấu thất bại!',
        cannotIdentifyMatchToStart: 'Không xác định được trận đấu để bắt đầu',
        startMatchSuccess: 'Bắt đầu trận đấu thành công!',
        startMatchFailed: 'Bắt đầu trận đấu thất bại!',
        cannotIdentifyMatchToUpdate: 'Không xác định được trận đấu để cập nhật',
        updateScoreSuccess: 'Cập nhật điểm số thành công!',
        updateScoreFailed: 'Cập nhật điểm số thất bại!',
        updateMembersSuccess: 'Cập nhật thành viên thành công!',
        duplicatePlayerNames: 'Tên người chơi không được giống nhau.',
        alreadyJoinedMatch: 'Bạn đã tham gia trận đấu này rồi.',
        cannotLoadCameras: 'Không thể tải danh sách camera',
        cannotLoadData: 'Không thể tải dữ liệu',
        team: 'Đội',
        unknown: 'Không xác định',
        autoRecordingStartFailed: 'Không thể bắt đầu tự động record video',
        noConnectedCamera: 'Không có camera nào đang kết nối cho bàn này',
    },

    // Team Members
    teamMembers: {
        title: 'CHỈNH SỬA THÀNH VIÊN',
        description: 'Bạn có thể nhập số điện thoại hội viên hoặc tên khách',
        teamA: 'Đội A',
        teamB: 'Đội B',
        roomOwnerPlaceholder: 'Tên chủ phòng',
        memberOrGuestPlaceholder: 'Số điện thoại hoặc tên khách',
        addPlayer: 'Thêm người chơi',
        removePlayer: 'Xóa người chơi',
        cancel: 'Hủy',
        saveChanges: 'Lưu thay đổi',
        errors: {
            tooManyPlayers: 'Không thể thêm quá 4 người chơi!',
            cannotRemoveOnlyOwner: 'Không thể xóa chủ phòng duy nhất!',
            matchNotFound: 'Không tìm thấy thông tin trận đấu',
            noPermission: 'Không có quyền chỉnh sửa thành viên',
            invalidSessionToken: 'SessionToken không hợp lệ',
            cannotDetermineClub: 'Không thể xác định club để validation membership',
            updateSuccess: 'Cập nhật thành viên thành công!',
            updateFailed: 'Cập nhật thành viên thất bại',
            validationError: 'Có lỗi validation:',
            invalidMemberCode: 'Mã hội viên không đúng',
            accountBanned: 'Tài khoản bị cấm'
        }
    },

    // Admin Add Branch
    adminAddBranch: {
        branchNameRequired: 'Tên chi nhánh là bắt buộc',
        branchNameMinLength: 'Tên chi nhánh phải có ít nhất 2 ký tự',
        branchNameMaxLength: 'Tên chi nhánh không được vượt quá 255 ký tự',
        addressRequired: 'Địa chỉ là bắt buộc',
        addressMinLength: 'Địa chỉ phải có ít nhất 5 ký tự',
        addressMaxLength: 'Địa chỉ không được vượt quá 255 ký tự',
        phoneRequired: 'Số điện thoại là bắt buộc',
        phoneInvalid: 'Số điện thoại không hợp lệ',
        tableNumberMin: 'Số bàn ít nhất là 1'
    },

    // Manager Add Member
    managerAddMember: {
        title: 'QUẢN LÝ HỘI VIÊN',
        addMemberTitle: 'THÊM HỘI VIÊN',
        memberNameLabel: 'Tên Hội Viên',
        memberNameRequired: 'Tên hội viên là bắt buộc',
        memberNameMinLength: 'Tên hội viên phải có ít nhất 2 ký tự',
        memberNamePlaceholder: 'Nhập tên hội viên',
        phoneLabel: 'Số Điện Thoại',
        phoneRequired: 'Số điện thoại là bắt buộc',
        phoneInvalid: 'Số điện thoại không hợp lệ',
        phonePlaceholder: 'Nhập số điện thoại',
        phoneAlreadyUsed: 'Số điện thoại đã được sử dụng bởi hội viên khác',
        addSuccess: 'Đã thêm hội viên thành công!',
        addFailed: 'Thêm hội viên thất bại.',
    },

    // Manager Members Page
    managerMembers: {
        loadingText: 'Đang tải...',
        loadMembersError: 'Không thể tải danh sách hội viên',
        noMembersFound: 'Chưa có hội viên nào',
        noMembersFoundWithSearch: 'Không tìm thấy hội viên phù hợp',
        noMembersDescription: 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy hội viên phù hợp',
        viewAll: 'Xem tất cả',
        showingMembers: 'Hiển thị {start}-{end} trong tổng số {total} hội viên',
        previous: 'Trước',
        next: 'Tiếp',
    },

    // Manager Table Management
    managerTable: {
        pageTitle: 'QUẢN LÝ BÀN',
        addTableTitle: 'THÊM BÀN',
        editTableTitle: 'CHỈNH SỬA BÀN',
        tableDetailsTitle: 'CHI TIẾT BÀN',
        backLabel: 'Quay lại',
        saveLabel: 'Lưu',
        editLabel: 'Chỉnh sửa',
        deleteLabel: 'Xóa',
        deleteConfirmTitle: 'Bạn có chắc chắn muốn xóa bàn này không?',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy',
        tableNameLabel: 'Tên Bàn',
        tableNameRequired: 'Tên bàn là bắt buộc',
        tableNameMinLength: 'Tên bàn phải có ít nhất 2 ký tự',
        tableNamePlaceholder: 'Nhập tên bàn',
        tableTypeLabel: 'Loại Bàn',
        statusLabel: 'Trạng Thái',
        statusEmpty: 'Trống',
        statusInUse: 'Đang sử dụng',
        statusMaintenance: 'Bảo trì',
        tableInMatchError: 'Bàn này đang diễn ra trận đấu, không được phép chỉnh sửa!',
        saveSuccess: 'Đã lưu bàn thành công!',
        saveFailed: 'Lưu bàn thất bại.',
        addSuccess: 'Đã thêm bàn thành công!',
        addFailed: 'Thêm bàn thất bại.',
        deleteFailed: 'Xóa bàn thất bại.',
        downloadQR: 'Tải mã QR',
        cannotLoadTables: 'Không thể tải danh sách bàn',
        noTablesFound: 'Không tìm thấy bàn phù hợp',
        noTablesFoundWithSearch: 'Không tìm thấy bàn phù hợp',
        tryDifferentSearch: 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy bàn phù hợp',
        viewAll: 'Xem tất cả',
        loading: 'Đang tải...',
    },

    // Super Admin Admin Detail Page
    superAdminAdminDetail: {
        pageTitle: 'ADMIN',
        detailTitle: 'THÔNG TIN CHI TIẾT',
        loading: 'Đang tải...',
        invalidId: 'ID không hợp lệ',
        adminNotFound: 'Không tìm thấy admin',
        statusLabel: 'Trạng thái:',
        statusPending: 'Chờ duyệt',
        statusApproved: 'Đã duyệt',
        statusRejected: 'Bị từ chối',
        rejectedReasonTitle: 'Lý do bị từ chối:',
        noLogo: 'Không có logo',
        brandLabel: 'Thương hiệu:',
        brandNameLabel: 'Tên Quán',
        fullNameLabel: 'Họ và Tên',
        citizenCodeLabel: 'CCCD',
        phoneNumberLabel: 'Số Điện Thoại',
        emailLabel: 'Email',
        branchLabel: 'Chi nhánh',
        branchNameLabel: 'Tên chi nhánh',
        addressLabel: 'Địa chỉ',
        tableNumberLabel: 'Số bàn',
        approveSuccess: 'Admin đã được duyệt.',
        approveFailed: 'Duyệt thất bại',
        rejectButton: 'TỪ CHỐI',
        approveButton: 'DUYỆT',
        backButton: 'QUAY LẠI',
        rejectReasonTitle: 'Nhập lý do từ chối',
        rejectReasonPlaceholder: 'Vui lòng nhập lý do từ chối tại đây...',
        rejectReasonRequired: 'Vui lòng nhập lý do từ chối!',
        cancelButton: 'Hủy',
        confirmRejectButton: 'Xác nhận từ chối',
        sending: 'Đang gửi...',
        rejectSuccess: 'Admin đã bị từ chối.',
        rejectFailed: 'Từ chối thất bại',
    },

    // Super Admin Feedback Detail Page
    superAdminFeedbackDetail: {
        pageTitle: 'PHẢN HỒI',
        managementTitle: 'QUẢN LÝ PHẢN HỒI',
        loading: 'Đang tải...',
        checking: 'Đang kiểm tra...',
        feedbackNotFound: 'Không tìm thấy phản hồi',
        cannotLoadFeedback: 'Không thể tải dữ liệu phản hồi',
        errorLoadingFeedback: 'Đã xảy ra lỗi khi tải thông tin phản hồi. Vui lòng thử lại sau.',
        tryAgain: 'Thử lại',
        backToList: 'Quay lại danh sách',
        brandLabel: 'Thương hiệu',
        branchLabel: 'Chi nhánh',
        tableLabel: 'Bàn',
        tableTypeLabel: 'Loại bàn',
        creatorTypeLabel: 'Loại người tạo',
        createdAtLabel: 'Thời gian tạo',
        updatedAtLabel: 'Thời gian cập nhật',
        statusLabel: 'Trạng thái',
        contentLabel: 'Nội dung phản hồi',
        processingNoteLabel: 'Ghi chú xử lý',
        processingHistoryLabel: 'Lịch sử xử lý',
        noProcessingHistory: 'Chưa có lịch sử xử lý',
        noProcessingHistoryDescription: 'Lịch sử xử lý sẽ hiển thị khi có người cập nhật phản hồi',
        unknown: 'Không xác định',
        guest: 'Khách',
        membership: 'Hội viên',
        pool8: 'Pool 8',
        carom: 'Carom',
        statusResolved: 'Đã xử lý',
        statusManagerP: 'Quản lý xử lý',
        statusAdminP: 'Chủ doanh nghiệp xử lý',
        statusSuperadminP: 'Quản trị viên xử lý',
        statusUnknown: 'Không xác định',
        adminProcessing: 'Chủ doanh nghiệp xử lý',
        superAdminProcessing: 'Quản trị viên xử lý',
        resolved: 'Đã xử lý',
        editPlaceholder: 'Nhập ghi chú xử lý...',
        cancel: 'Hủy',
        back: 'Quay lại',
        save: 'Lưu',
        edit: 'Chỉnh sửa',
        updateSuccess: 'Cập nhật thành công',
        updateFailed: 'Cập nhật thất bại',
        completed: 'Đã xử lý',
        deletedClub: 'Không xác định',
        deletedTable: 'Không xác định',
    },

    // Super Admin Home Page
    superAdminHome: {
        pageTitle: 'BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN',
        adminListTitle: 'DANH SÁCH ADMIN',
        feedbackListTitle: 'DANH SÁCH PHẢN HỒI',
        approvalTab: 'Đơn duyệt',
        feedbackTab: 'Phản hồi',
        loading: 'Đang tải...',
        cannotLoadAdminList: 'Không lấy được danh sách admin',
        searchPlaceholder: 'Nhập tên hoặc email...',
        allStatus: 'Tất cả',
        approvedStatus: 'Đã duyệt',
        pendingStatus: 'Chưa duyệt',
        rejectedStatus: 'Bị từ chối',
        statusApproved: 'Đã duyệt',
        statusPending: 'Chưa duyệt',
        statusRejected: 'Bị từ chối',
        noAdminsFound: 'Chưa có admin nào',
        noAdminsFoundWithSearch: 'Không tìm thấy admin phù hợp',
        tryDifferentKeywords: 'Thử thay đổi từ khóa tìm kiếm để tìm thấy admin phù hợp',
        useAddButton: 'Sử dụng nút "Thêm Admin" ở trên để tạo admin đầu tiên',
        viewAll: 'Xem tất cả',
        showingResults: 'Hiển thị {start}-{end} trong tổng số {total} admin',
        previous: 'Trước',
        next: 'Tiếp',
        loadMore: 'Xem thêm',
        noMoreAdmins: 'Không còn admin nào để tải',
        table: {
            name: 'TÊN',
            email: 'EMAIL',
            location: 'ĐỊA CHỈ',
            status: 'TRẠNG THÁI',
            createdAt: 'NGÀY TẠO',
            clickToViewDetails: 'Nhấn để xem chi tiết',
        },
        // Feedback table translations
        feedbackSearchPlaceholder: 'Nhập thương hiệu hoặc chi nhánh...',
        feedbackAllStatus: 'Tất cả',
        feedbackPendingStatus: 'Chưa xử lý',
        feedbackResolvedStatus: 'Đã xử lý',
        feedbackBrandColumn: 'THƯƠNG HIỆU',
        feedbackBranchColumn: 'CHI NHÁNH',
        feedbackDateColumn: 'NGÀY',
        feedbackStatusColumn: 'TRẠNG THÁI',
        feedbackDateLabel: 'Ngày:',
        feedbackNoBranch: 'Chưa có chi nhánh',
        feedbackNoFeedbacksFound: 'Không tìm thấy phản hồi nào.',
        feedbackClickToViewDetails: 'Nhấn để xem chi tiết →',
        feedbackShowingResults: 'Hiển thị {start}-{end} trong tổng số {total} phản hồi',
        feedbackStatusResolved: 'Đã xử lý',
        feedbackStatusManagerP: 'Quản lý xử lý',
        feedbackStatusAdminP: 'Chủ doanh nghiệp xử lý',
        feedbackStatusSuperadminP: 'Quản trị viên xử lý',
        feedbackStatusUnknown: 'Không xác định',
    },

    // Super Admin Login Page
    superAdminLogin: {
        pageTitle: 'Truy cập vào ScoreLens dành cho Super Admin',
        description: '',
        emailLabel: 'Nhập email Super Admin',
        emailPlaceholder: 'ScoreLens',
        submitButton: 'Gửi',
        sending: 'Đang gửi...',
        emailSentSuccess: 'Email đã được gửi thành công!',
        emailRequired: 'Email là bắt buộc',
        emailInvalid: 'Định dạng email không hợp lệ',
        generalError: 'Có lỗi xảy ra. Vui lòng thử lại.',
    },

    // Super Admin Verification Page
    superAdminVerification: {
        pageTitle: 'Xác thực đăng nhập',
        description: 'Nhập mã OTP đã được gửi đến email của bạn',
        otpRequired: 'Vui lòng nhập đầy đủ 6 chữ số',
        verificationSuccess: 'Xác thực thành công!',
        verificationFailed: 'Có lỗi xảy ra. Vui lòng thử lại.',
        notReceivedCode: 'Không nhận được mã?',
        resendCode: 'Gửi lại mã',
        resendTimer: 'Gửi lại sau',
        seconds: 's',
        resendSuccess: 'Mã xác thực đã được gửi lại!',
        resendFailed: 'Gửi lại mã thất bại.',
        submitButton: 'Gửi',
        sending: 'Đang gửi...',
        backToHome: 'Quay lại trang chủ',
    },

    // Terms Page
    terms: {
        loading: 'Đang tải...',
        pageTitle: 'ĐIỀU KHOẢN SỬ DỤNG',
        sections: {
            general: 'ĐIỀU KHOẢN CHUNG',
            account: 'TÀI KHOẢN & BẢO MẬT',
            usage: 'SỬ DỤNG DỊCH VỤ',
            privacy: 'BẢO MẬT & RIÊNG TƯ',
            liability: 'TRÁCH NHIỆM & GIỚI HẠN',
            termination: 'CHẤM DỨT & THAY ĐỔI',
        },
        general: {
            title: 'Điều Khoản Sử Dụng - Điều Khoản Chung',
            acceptance: {
                title: '1. Chấp Nhận Điều Khoản',
                content: 'Bằng việc truy cập và sử dụng hệ thống ScoreLens, bạn đồng ý tuân thủ và bị ràng buộc bởi những điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.',
            },
            serviceDescription: {
                title: '2. Mô Tả Dịch Vụ',
                content: 'ScoreLens là một hệ thống quản lý điểm số tự động cho các trò chơi thể thao, đặc biệt là bida. Hệ thống sử dụng công nghệ AI và camera để theo dõi và ghi điểm tự động, cung cấp trải nghiệm chơi game chính xác và tiện lợi.',
                features: [
                    'Ghi điểm tự động thông qua camera AI',
                    'Quản lý trận đấu và thành viên',
                    'Theo dõi lịch sử và thống kê trận đấu',
                    'Hệ thống thông báo và hỗ trợ',
                ],
            },
            ageAndCapacity: {
                title: '3. Độ Tuổi và Năng Lực',
                content: 'Bạn phải đủ 18 tuổi hoặc có sự đồng ý của cha mẹ/người giám hộ hợp pháp để sử dụng dịch vụ. Bạn cũng phải có đủ năng lực pháp lý để tham gia vào các thỏa thuận này.',
            },
            termsChanges: {
                title: '4. Thay Đổi Điều Khoản',
                content: 'Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Những thay đổi sẽ có hiệu lực ngay khi được đăng tải. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là chấp nhận các điều khoản mới.',
            },
        },
        account: {
            title: 'Điều Khoản Sử Dụng - Tài Khoản & Bảo Mật',
            registration: {
                title: '1. Đăng Ký Tài Khoản',
                content: 'Để sử dụng đầy đủ các tính năng của hệ thống, bạn cần tạo tài khoản với thông tin chính xác và cập nhật. Bạn chịu trách nhiệm duy trì tính bảo mật của thông tin đăng nhập.',
                requirements: [
                    'Cung cấp thông tin chính xác và đầy đủ',
                    'Bảo vệ mật khẩu và thông tin đăng nhập',
                    'Không chia sẻ tài khoản với người khác',
                    'Thông báo ngay khi phát hiện vi phạm bảo mật',
                ],
            },
            verification: {
                title: '2. Xác Thực và Bảo Mật',
                content: 'Hệ thống có thể yêu cầu xác thực qua email hoặc số điện thoại. Bạn đồng ý nhận các thông báo xác thực và bảo mật qua các kênh này.',
            },
            accountOwnership: {
                title: '3. Quyền Sở Hữu Tài Khoản',
                content: 'Tài khoản được tạo ra là tài sản cá nhân của bạn. Tuy nhiên, chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản nếu vi phạm điều khoản sử dụng.',
            },
            informationSecurity: {
                title: '4. Bảo Mật Thông Tin',
                content: 'Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo các tiêu chuẩn bảo mật cao nhất. Tuy nhiên, không có hệ thống nào là hoàn toàn an toàn, và bạn cũng cần thực hiện các biện pháp bảo mật cơ bản.',
            },
        },
        usage: {
            title: 'Điều Khoản Sử Dụng - Sử Dụng Dịch Vụ',
            legalUse: {
                title: '1. Sử Dụng Hợp Pháp',
                content: 'Bạn chỉ được sử dụng dịch vụ cho các mục đích hợp pháp và phù hợp với các điều khoản này. Việc sử dụng dịch vụ để thực hiện các hoạt động bất hợp pháp hoặc có hại là nghiêm cấm.',
            },
            prohibitedBehavior: {
                title: '2. Hành Vi Bị Cấm',
                content: 'Các hành vi sau đây bị nghiêm cấm khi sử dụng dịch vụ:',
                items: [
                    'Gian lận hoặc cố ý làm sai lệch kết quả trận đấu',
                    'Quấy rối hoặc đe dọa người chơi khác',
                    'Sử dụng phần mềm hoặc công cụ bên ngoài để can thiệp vào hệ thống',
                    'Phát tán nội dung không phù hợp hoặc có hại',
                    'Vi phạm quyền sở hữu trí tuệ',
                ],
            },
            cameraSystem: {
                title: '3. Sử Dụng Hệ Thống Camera',
                content: 'Hệ thống sử dụng camera AI để ghi điểm tự động. Bạn đồng ý:',
                items: [
                    'Cho phép camera ghi hình trong khu vực chơi game',
                    'Không cố ý che khuất hoặc làm nhiễu camera',
                    'Chấp nhận rằng việc ghi điểm có thể có sai số nhỏ',
                    'Báo cáo sự cố nếu phát hiện lỗi nghiêm trọng',
                ],
            },
            userContent: {
                title: '4. Nội Dung Người Dùng',
                content: 'Bạn chịu trách nhiệm về tất cả nội dung mà bạn tạo ra, đăng tải hoặc chia sẻ thông qua dịch vụ. Chúng tôi có quyền xóa bỏ nội dung vi phạm mà không cần thông báo trước.',
            },
        },
        privacy: {
            title: 'Điều Khoản Sử Dụng - Bảo Mật & Riêng Tư',
            informationCollection: {
                title: '1. Thu Thập Thông Tin',
                content: 'Chúng tôi thu thập các loại thông tin sau để cung cấp và cải thiện dịch vụ:',
                items: [
                    'Thông tin cá nhân: tên, email, số điện thoại',
                    'Thông tin tài khoản: tên đăng nhập, mật khẩu',
                    'Dữ liệu sử dụng: lịch sử trận đấu, thống kê',
                    'Dữ liệu kỹ thuật: địa chỉ IP, thiết bị, trình duyệt',
                ],
            },
            informationUse: {
                title: '2. Sử Dụng Thông Tin',
                content: 'Thông tin thu thập được sử dụng để:',
                items: [
                    'Cung cấp và duy trì dịch vụ',
                    'Cải thiện trải nghiệm người dùng',
                    'Gửi thông báo và cập nhật',
                    'Xử lý yêu cầu hỗ trợ',
                    'Phân tích và nghiên cứu',
                ],
            },
            informationSharing: {
                title: '3. Chia Sẻ Thông Tin',
                content: 'Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, trừ khi:',
                items: [
                    'Có sự đồng ý rõ ràng của bạn',
                    'Để tuân thủ yêu cầu pháp lý',
                    'Bảo vệ quyền và tài sản của chúng tôi',
                    'Với các đối tác tin cậy để cung cấp dịch vụ',
                ],
            },
            informationProtection: {
                title: '4. Bảo Vệ Thông Tin',
                content: 'Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn khỏi truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy.',
            },
        },
        liability: {
            title: 'Điều Khoản Sử Dụng - Trách Nhiệm & Giới Hạn',
            liabilityLimitation: {
                title: '1. Giới Hạn Trách Nhiệm',
                content: 'Trong phạm vi tối đa được phép theo luật pháp, ScoreLens và các đối tác của chúng tôi sẽ không chịu trách nhiệm về:',
                items: [
                    'Thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả',
                    'Mất mát dữ liệu hoặc thông tin',
                    'Gián đoạn dịch vụ không mong muốn',
                    'Thiệt hại do sử dụng sai mục đích',
                ],
            },
            serviceAccuracy: {
                title: '2. Độ Chính Xác của Dịch Vụ',
                content: 'Mặc dù chúng tôi nỗ lực cung cấp dịch vụ chính xác và đáng tin cậy, nhưng không thể đảm bảo rằng dịch vụ sẽ hoàn toàn không có lỗi hoặc gián đoạn. Bạn chấp nhận rủi ro khi sử dụng dịch vụ.',
            },
            userResponsibility: {
                title: '3. Trách Nhiệm của Người Dùng',
                content: 'Bạn chịu trách nhiệm:',
                items: [
                    'Sử dụng dịch vụ một cách an toàn và hợp pháp',
                    'Bảo vệ thông tin tài khoản của mình',
                    'Không sử dụng dịch vụ để gây hại cho người khác',
                    'Tuân thủ tất cả các quy định và luật pháp hiện hành',
                ],
            },
            indemnification: {
                title: '4. Bồi Thường',
                content: 'Bạn đồng ý bồi thường và giữ cho ScoreLens không bị thiệt hại từ bất kỳ khiếu nại, thiệt hại hoặc chi phí nào phát sinh từ việc vi phạm các điều khoản này.',
            },
        },
        termination: {
            title: 'Điều Khoản Sử Dụng - Chấm Dứt & Thay Đổi',
            serviceTermination: {
                title: '1. Chấm Dứt Dịch Vụ',
                content: 'Chúng tôi có quyền chấm dứt hoặc đình chỉ quyền truy cập vào dịch vụ của bạn vào bất kỳ lúc nào, vì bất kỳ lý do gì, bao gồm nhưng không giới hạn ở việc vi phạm các điều khoản này.',
            },
            terminationConsequences: {
                title: '2. Hậu Quả của Việc Chấm Dứt',
                content: 'Khi dịch vụ bị chấm dứt:',
                items: [
                    'Quyền truy cập vào tài khoản sẽ bị thu hồi ngay lập tức',
                    'Tất cả dữ liệu và nội dung có thể bị xóa vĩnh viễn',
                    'Không có khoản hoàn tiền nào được cung cấp',
                    'Các điều khoản này vẫn có hiệu lực sau khi chấm dứt',
                ],
            },
            serviceChanges: {
                title: '3. Thay Đổi Dịch Vụ',
                content: 'Chúng tôi có quyền thay đổi, đình chỉ hoặc chấm dứt dịch vụ vào bất kỳ lúc nào. Chúng tôi sẽ thông báo trước về những thay đổi quan trọng khi có thể.',
            },
            applicableLaw: {
                title: '4. Luật Áp Dụng',
                content: 'Các điều khoản này được điều chỉnh và giải thích theo luật pháp Việt Nam. Bất kỳ tranh chấp nào phát sinh từ việc sử dụng dịch vụ sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.',
            },
            contact: {
                title: '5. Liên Hệ',
                content: 'Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua:',
                items: [
                    'Email: scorelensbillards@gmail.com',
                    'Điện thoại: +84 357 859 348',
                    'Địa chỉ: Đại học FPT Quy Nhơn',
                ],
            },
        },
    },

    // AI Selection Component
    aiSelection: {
        title: 'Chọn tính năng AI',
        description: 'Bạn có muốn sử dụng AI trong trận đấu không?',
        withAi: {
            title: 'Có sử dụng AI',
            description: 'AI sẽ giúp tính điểm của trận đấu'
        },
        withoutAi: {
            title: 'Không sử dụng AI',
            description: 'Chỉ sử dụng tính năng cơ bản của trận đấu'
        },
        cancel: 'Hủy',
        createMatch: 'Tạo trận đấu',
        creating: 'Đang tạo...'
    },

    // Register Steps Component
    registerSteps: {
        brandInfo: 'Thông tin thương hiệu',
        branchInfo: 'Thông tin chi nhánh',
        confirm: 'Xác nhận',
    },

    // Verify Code Form Component
    verifyCodeForm: {
        title: 'Xác thực tài khoản',
        description: 'Chúng tôi đã gửi mã xác thực đến',
        codeLabel: 'Nhập mã xác minh 6 chữ số',
        verifyButton: 'Xác minh',
        verifying: 'Đang xác minh...',
        resendCode: 'Gửi lại mã',
        resendTimer: 'Gửi lại sau',
        seconds: 's',
        notReceivedCode: 'Không nhận được mã?',
        backToRegister: 'Quay lại đăng ký',
        resendSuccess: 'Mã xác thực đã được gửi lại.',
        verificationFailed: 'Xác thực thất bại. Vui lòng thử lại.',
    },

    // Match Detail Popup Component
    matchDetailPopup: {
        title: 'CHI TIẾT TRẬN ĐẤU',
        branch: 'Chi nhánh:',
        location: 'Địa điểm:',
        gameType: 'Loại game:',
        startTime: 'Bắt đầu:',
        endTime: 'Kết thúc:',
        playTime: 'Thời gian chơi:',
        aiMatch: 'Trận đấu AI:',
        yes: 'Có',
        no: 'Không',
        noMembers: 'Không có thành viên',
        player: 'Người chơi',
        host: '(Chủ phòng)',
        winnerAnnouncement: 'chiến thắng!',
        matchVideo: 'Video trận đấu',
        vod: 'VOD',
        close: 'Đóng',
        unknown: 'Không xác định',
        unknownLocation: 'Không xác định',
    },

    // Match History Components
    matchHistory: {
        search: {
            placeholder: 'Tìm kiếm trận đấu',
        },
        table: {
            time: 'THỜI GIAN',
            branch: 'CHI NHÁNH',
            format: 'THỂ THỨC',
            winningTeam: 'ĐỘI THẮNG',
            score: 'TỶ SỐ',
            viewDetails: 'Xem chi tiết',
            unknown: 'Không xác định',
        },
    },

    // Manager Components
    manager: {
        buttonViewMore: {
            back: 'Quay lại',
            viewMore: 'Xem thêm',
        },
        cameraRecord: {
            recording: 'Đang ghi...',
            recordWithAi: 'Record',
            aiAnalysis: 'AI Analysis:',
            analysisComplete: 'Phân tích hoàn tất',
            aiUploadFailed: 'AI upload thất bại:',
            recordFailed: 'Record thất bại',
            unknownError: 'Lỗi không xác định',
        },
        cameraVideo: {
            streamStarted: 'Đã bắt đầu video stream',
            cannotStartStream: 'Không thể bắt đầu video stream:',
            streamError: 'Lỗi khi bắt đầu video stream:',
            connectingVideo: 'Đang kết nối video...',
            connectionError: 'Lỗi kết nối',
            liveStream: 'Đang phát',
            close: 'Đóng',
            addCamera: 'Thêm Camera',
        },
        editMatch: {
            title: 'Chỉnh sửa trận đấu',
            description: 'Chọn loại chỉnh sửa bạn muốn thực hiện',
            editMembers: 'Chỉnh sửa thành viên',
            editScores: 'Chỉnh sửa điểm số',
            cancel: 'Hủy',
        },
        editScore: {
            title: 'Chỉnh sửa điểm số',
            description: 'Cập nhật điểm số cho từng đội',
            teamA: 'Đội A',
            teamB: 'Đội B',
            currentScore: 'Điểm hiện tại',
            newScore: 'Điểm mới',
            cancel: 'Hủy',
            saveChanges: 'Lưu thay đổi',
        },
        memberPageBanner: {
            title: 'QUẢN LÝ HỘI VIÊN',
        },
        memberGrid: {
            memberName: 'TÊN HỘI VIÊN',
            phoneNumber: 'SỐ ĐIỆN THOẠI',
            status: 'TRẠNG THÁI',
            active: 'Hoạt động',
            inactive: 'Không hoạt động',
            statusLabel: 'Trạng thái:',
            clickToViewDetails: 'Nhấn để xem chi tiết →',
        },
        matchSummary: {
            title: 'Tổng kết trận đấu',
            matchInfo: 'Thông tin trận đấu',
            gameType: 'Loại game:',
            startTime: 'Bắt đầu:',
            endTime: 'Kết thúc:',
            playTime: 'Thời gian chơi:',
            members: 'Thành viên:',
            player: 'Người chơi',
            wins: 'chiến thắng!',
            back: 'Quay lại',
            confirm: 'Xác nhận',
        },
        memberSearch: {
            placeholder: 'Nhập tên và số điện thoại để tìm kiếm',
            addMember: 'Thêm hội viên',
        },
        tableAvailable: {
            editMatch: 'Chỉnh sửa trận đấu',
            createMatch: 'Tạo trận đấu',
            teamA: 'Đội A',
            teamB: 'Đội B',
            player: 'Người Chơi',
            addPlayer: 'Thêm người chơi',
            removePlayer: 'Xóa người chơi',
            cannotAddMorePlayers: 'Không thể thêm quá 4 người chơi!',
            matchNeedsAtLeastOnePlayer: 'Trận đấu cần có ít nhất 1 người chơi!',
            errorProcessingTeams: 'Có lỗi xảy ra khi xử lý thông tin team!',
            back: 'Quay lại',
            ready: 'Sẵn sàng',
            creating: 'Đang tạo...',
            saveChanges: 'Lưu thay đổi',
        },
        tablePageBanner: {
            title: 'QUẢN LÝ BÀN',
        },
        tableSearch: {
            placeholder: 'Nhập tên bàn để tìm kiếm',
            all: 'Tất cả',
            pool8: 'Pool-8',
            carom: 'Carom',
            addTable: 'Thêm bàn',
        },
        tableGrid: {
            table: 'BÀN',
            tableType: 'LOẠI BÀN',
            status: 'TRẠNG THÁI',
            tableTypeLabel: 'Loại bàn:',
            statusLabel: 'Trạng thái:',
            empty: 'Trống',
            inUse: 'Đang sử dụng',
            maintenance: 'Bảo trì',
            clickToViewDetails: 'Nhấn để xem chi tiết →',
        },
        tableStatusBadge: {
            available: 'Bàn trống',
            inUse: 'Đang sử dụng',
            inUseWithAi: 'Đang sử dụng - AI',
        },
        tableUsing: {
            matchDetails: 'Chi tiết trận đấu',
            teamA: 'Đội A',
            teamB: 'Đội B',
            player: 'Người chơi',
            noMembers: 'Chưa có thành viên',
            videoAi: 'Video AI',
            back: 'Quay lại',
            start: 'Bắt đầu',
            edit: 'Chỉnh sửa',
            viewCamera: 'Xem Camera',
            loading: 'Đang tải...',
            cancelMatch: 'Hủy trận đấu',
            endMatch: 'Kết thúc',
            videoAiAnalysis: 'Phân tích video AI',
            close: 'Đóng',
            confirmCancelMatch: 'Xác nhận hủy trận đấu',
            confirmEndMatch: 'Xác nhận kết thúc trận đấu',
            confirmCancelMessage: 'Bạn có chắc chắn muốn hủy trận đấu này?',
            confirmEndMessage: 'Bạn có chắc chắn muốn kết thúc trận đấu này?',
            confirm: 'Xác nhận',
            cancel: 'Hủy',
            cannotIdentifyMatch: 'Không xác định được trận đấu để cập nhật điểm.',
            cannotUpdateVideoUrl: 'Không thể cập nhật video URL vào trận đấu',
            updatingScore: 'Đang cập nhật điểm...',
            scoreUpdated: 'Cập nhật điểm:',
            aiScoreUpdateFailed: 'Cập nhật điểm từ AI thất bại',
            cameraStreamRunning: 'Đang có camera stream đang chạy. Vui lòng đóng trước khi mở camera khác.',
            noConnectedCamera: 'Không có camera nào đang kết nối cho bàn này',
        },
    },

    // Shared Components
    shared: {
        addFormLayout: {
            back: 'Quay lại',
            add: 'Thêm',
        },
        agreementCheckbox: {
            agreement: 'Tôi đăng ký và đã đọc các',
            termsAndPrivacy: 'Điều khoản và chính sách bảo mật',
        },
        headerHome: {
            toggleMenu: 'Chuyển đổi menu',
        },
        noteWithToggle: {
            note: 'GHI CHÚ',
            expand: 'Xem thêm',
            collapse: 'Thu gọn',
        },
        notificationItem: {
            justNow: 'Vừa xong',
            minutesAgo: 'phút trước',
            hoursAgo: 'giờ trước',
            daysAgo: 'ngày trước',
            markAsRead: 'Đánh dấu đã đọc',
            delete: 'Xóa',
        },
        videoAI: {
            title: 'Video AI Billiards',
            addVideoHere: 'Thêm video tại đây',
            supportedFormats: 'Hỗ trợ: MP4, MOV, AVI',
            maxSize: 'Tối đa: {size}GB',
            videoSelected: 'Video đã chọn: {name}',
            pressAnalyze: 'Hãy nhấn "Phân tích Video" để bắt đầu phân tích.',
            videoUploaded: 'Video đã tải lên',
            clear: 'Xóa',
            analyzeVideo: 'Phân tích Video',
            analyzing: 'Đang phân tích...',
            pleaseSelectVideo: 'Vui lòng chọn video trước!',
            errorSendingVideo: 'Lỗi khi gửi video để phân tích',
            videoAnalysisError: 'Lỗi phân tích video!',
            aiResultSent: 'Đã gửi kết quả AI đến xử lý điểm!',
            processingScore: 'Thành công! Đang xử lý điểm...',
            pleaseDropVideo: 'Vui lòng thả file video!',
            analysisResults: 'Kết quả phân tích',
            analysisType: 'Loại phân tích:',
            fileName: 'Tên file:',
            processedVideo: 'Video đã xử lý',
            viewProcessedVideo: 'Xem video đã xử lý',
            matchEvents: 'Sự kiện trận đấu',
            eventType: 'Loại sự kiện',
            turn: 'Lượt đánh',
            time: 'Thời gian',
            details: 'Chi tiết',
            downloadVideo: 'Tải video',
            downloadCsv: 'Tải CSV',
            downloadingVideo: 'Đang tải {filename}...',
            videoDownloaded: 'Đã tải thành công {filename}!',
            videoDownloadError: 'Lỗi khi tải video!',
            analysisResultsWillShow: 'Kết quả phân tích sẽ hiển thị ở đây',
            pool8Ball: 'Pool 8-Ball',
            carom: 'Carom',
            notAvailable: 'N/A',
            yourBrowserNotSupport: 'Trình duyệt của bạn không hỗ trợ thẻ video.',
            // Recorded clips section
            recordedClips: 'Clip đã ghi',
            tableInfo: '- Bàn {tableId}',
            cameraInfo: '- Camera {cameraId}',
            matchInfo: 'Trận đấu {matchId}',
            lastUpdate: 'Cập nhật lúc',
            refresh: 'Tải lại',
            refreshing: 'Đang tải lại',
            showList: 'Xem danh sách',
            hideList: 'Ẩn danh sách',
            loadingClips: 'Đang tải danh sách clip...',
            noClipsRecorded: 'Chưa có clip nào được ghi',
            useRecordButton: 'Sử dụng nút "Record" trên camera để tạo clip mới',
            clipSelected: 'Clip đã chọn: {name}',
            deselect: 'Bỏ chọn',
            orSelectFromList: 'Hoặc chọn từ danh sách clip đã ghi ở trên',
            readyForAnalysis: 'Sẵn sàng để phân tích AI',
            unknown: 'Không xác định',
            createdAt: 'Tạo lúc:',
            clipSelectedFromRecordings: 'Clip đã được chọn từ danh sách recordings',
            // Toast messages
            cannotLoadClips: 'Không thể tải danh sách clip đã ghi',
            clipSelectedSuccess: 'Đã chọn clip: {name}',
            cannotSelectClip: 'Không thể chọn clip',
            pleaseSelectVideoFormat: 'Vui lòng chọn đúng định dạng video!',
            analyzingClip: 'Đang phân tích clip: {name}',
        },
        confirmPopup: {
            defaultTitle: 'Xác nhận thông tin',
            defaultConfirmText: 'Xác nhận',
            defaultCancelText: 'Quay lại',
        },
        roleBadge: {
            host: 'Chủ phòng',
            hostDescription: 'Người tạo trận đấu',
            participant: 'Participant',
            participantDescription: 'Người tham gia',
            manager: 'Manager',
            managerDescription: 'Quản lý',
            unknown: 'Unknown',
            unknownDescription: 'Không xác định',
        },
        editOption: {
            title: 'Chọn loại chỉnh sửa',
            description: 'Bạn muốn chỉnh sửa gì trong trận đấu?',
            editScore: 'Chỉnh sửa điểm',
            editScoreDescription: 'Thay đổi tỉ số trận đấu',
            editMembers: 'Chỉnh sửa thành viên',
            editMembersDescription: 'Thêm/xóa người chơi trong đội',
            cancel: 'Hủy',
        },
        feedback: {
            title: 'ĐÁNH GIÁ',
            subtitle: 'Chia sẻ trải nghiệm của bạn',
            feedbackLabel: 'ĐÁNH GIÁ:',
            placeholder: 'Nhập đánh giá của bạn...',
            cancel: 'Hủy',
            submit: 'Đánh giá',
            submitting: 'Đang gửi...',
            pleaseEnterFeedback: 'Vui lòng nhập phản hồi!',
            missingTableInfo: 'Thiếu thông tin bàn để gửi phản hồi!',
            cannotDetermineClub: 'Không thể xác định thông tin câu lạc bộ!',
            missingUserInfo: 'Thiếu thông tin xác thực người dùng!',
            submitFailed: 'Gửi phản hồi thất bại!',
        },
        matchEnd: {
            title: 'Bạn có muốn kết thúc trận đấu không?',
            back: 'Trở về',
            confirm: 'Xác nhận',
        },
        scoreEditor: {
            title: 'CHỈNH SỬA ĐIỂM SỐ',
            teamA: 'Đội A',
            teamB: 'Đội B',
            noPermissionTitle: 'Bạn không có quyền chỉnh sửa điểm trận đấu',
            noPermissionDescription: 'Chỉ người tạo trận đấu (Host) mới có thể thực hiện thao tác này',
            close: 'Đóng',
            resetTeamA: 'Đặt lại điểm Đội A',
            resetTeamB: 'Đặt lại điểm Đội B',
            cancel: 'Huỷ',
            saveScore: 'Lưu điểm',
            noPermissionError: 'Bạn không có quyền chỉnh sửa điểm. Chỉ người tạo trận đấu mới có thể thực hiện.',
            updateSuccess: 'Đã cập nhật thành công!',
        },
        sessionTokenSync: {
            title: '🔄 Đồng bộ SessionToken',
            matchId: 'Match ID:',
            currentToken: 'Token hiện tại:',
            none: 'Không có',
            userIdentity: 'Danh tính người dùng:',
            membershipId: 'ID thành viên:',
            guestToken: 'Token khách:',
            syncing: '🔄 Đang đồng bộ...',
            syncSessionToken: '🔄 Đồng bộ SessionToken',
            lastSyncResult: 'Kết quả đồng bộ cuối:',
            noMatchId: 'Không có matchId để đồng bộ',
            cannotDetermineUser: 'Không thể xác định người dùng để lấy phiên làm việc',
            sessionUpdated: 'Đã cập nhật phiên làm việc mới!',
            sessionSynced: 'Phiên làm việc đã đồng bộ',
            cannotGetNewSession: 'Không thể lấy phiên làm việc mới',
            cannotSyncSession: 'Không thể đồng bộ phiên làm việc',
        },
        successMessage: {
            title: 'Cảm ơn quý khách đã sử dụng dịch vụ ScoreLens!',
            confirm: 'Xác nhận',
        },

        services: {
            adminDashboard: {
                cannotLoadDashboardData: 'Không thể lấy dữ liệu dashboard',
                cannotLoadDashboardStats: 'Không thể lấy thống kê dashboard',
                cannotLoadClubDetail: 'Không thể lấy thông tin chi tiết club',
                unknownError: 'Đã xảy ra lỗi không xác định',
            },
            managerCamera: {
                failedToCreateCamera: 'Tạo camera thất bại',
                failedToTestConnection: 'Kiểm tra kết nối camera thất bại',
                failedToTestPing: 'Kiểm tra ping camera thất bại',
                networkError: 'Lỗi mạng',
                unknownError: 'Lỗi không xác định',
                errorOccurred: 'Đã xảy ra lỗi',
            },
            managerMember: {
                phoneNumberAlreadyUsed: 'Số điện thoại đã được sử dụng bởi hội viên khác',
            },
        },
    },

    // Table Card Component
    tableCard: {
        status: {
            using: 'Đang sử dụng',
            usingWithAi: 'Đang sử dụng - AI',
            available: 'Bàn trống',
            maintenance: 'Bảo trì'
        },
        type: {
            pool8: 'Bida Pool',
            carom: 'Bida Carom'
        },
        creator: {
            label: 'Người tạo:',
            manager: 'Quản lý',
            member: 'Hội viên',
            guest: 'Khách'
        },
        team: {
            teamA: 'Đội A',
            teamB: 'Đội B',
            vs: 'VS'
        },
        button: {
            viewDetails: 'Xem chi tiết',
            ready: 'Sẵn sàng',
            maintenance: 'Bảo trì'
        }
    },

    // Scoreboard Page
    scoreboard: {
        title: 'BÀN',
        pool8: 'POOL 8',
        loading: 'ĐANG TẢI...',
        scoreboard: 'BẢNG ĐIỂM',
        joinCode: 'Mã Tham Gia',
        teamA: 'Đội A',
        teamB: 'Đội B',
        vs: 'VS',
        noMembers: 'Chưa có thành viên',
        playerPlaceholder: 'Người Chơi {index}',
        host: 'Chủ phòng',
        member: 'Thành viên',
        quickActions: 'Thao tác nhanh',
        plus1TeamA: '+1 Đội A',
        plus1TeamB: '+1 Đội B',
        minus1TeamA: '-1 Đội A',
        minus1TeamB: '-1 Đội B',
        edit: 'Chỉnh sửa',
        end: 'Kết thúc',
        hideCamera: 'Ẩn Camera',
        showCamera: 'Xem Camera',
        aiResults: 'Kết Quả AI',
        cameraRestoring: 'Đang khôi phục thông tin camera...',
        connectingCamera: 'Đang kết nối camera...',
        cameraError: 'Lỗi kết nối camera',
        viewers: 'người xem',
        peopleWatching: 'người đang xem',
        error: {
            noCameraInfo: 'Không có thông tin camera',
            cameraNotConnected: 'Camera không kết nối',
            cannotStartStream: 'Không thể bắt đầu video stream',
            streamError: 'Lỗi khi bắt đầu video stream',
            unknownError: 'Lỗi không xác định',
            cannotLoadMatch: 'Không thể tải thông tin trận đấu',
            cannotLoadTable: 'Không thể tải thông tin bàn',
            noMatchInfo: 'Không tìm thấy thông tin trận đấu',
            noEditPermission: 'Bạn không có quyền chỉnh sửa',
            noValidSessionToken: 'Vui lòng cung cấp sessionToken hợp lệ',
            updateScoreFailed: 'Cập nhật điểm thất bại',
            updateTeamAFailed: 'Cập nhật điểm Đội A thất bại',
            updateTeamBFailed: 'Cập nhật điểm Đội B thất bại',
            cannotSyncSession: 'Không thể đồng bộ phiên làm việc',
            cannotGetNewSession: 'Không thể lấy phiên làm việc mới',
            cannotDetermineUser: 'Không thể xác định người dùng để lấy phiên làm việc',
            noMatchIdToSync: 'Không có matchId để sync',
            cannotEndMatch: 'Không thể kết thúc trận đấu. Vui lòng thử lại.',
            cannotAuthenticateEndMatch: 'Không thể xác thực người dùng để kết thúc trận đấu',
            noEditPermissionForMembers: 'Bạn không có quyền chỉnh sửa',
            cannotDetermineClub: 'Không thể xác định club để chỉnh sửa thành viên'
        },
        success: {
            streamStarted: 'Đã bắt đầu video stream',
            joinedStream: 'Đã tham gia stream hiện tại',
            sessionSynced: 'Phiên làm việc đã đồng bộ',
            scoreUpdated: 'Cập nhật điểm thành công'
        }
    },

    // End Match Page
    endMatch: {
        end: {
            loading: 'Đang tải...',
            title: 'TRẬN ĐẤU ĐÃ KẾT THÚC',
            joinCode: 'Mã Tham Gia',
            teamA: 'Đội A',
            teamB: 'Đội B',
            vs: 'VS',
            noMembers: 'Chưa có thành viên',
            playerPlaceholder: 'Người Chơi {index}',
            matchInfo: 'Thông tin trận đấu',
            playTime: 'Thời gian chơi',
            playerCount: 'Số người chơi',
            gameType: 'Loại game',
            winningTeam: 'Đội chiến thắng',
            draw: 'Hòa',
            people: 'người',
            thankYou: 'Cảm ơn bạn đã sử dụng',
            exit: 'Thoát',
            feedback: 'Phản hồi',
            matchEnded: 'Trận đấu đã kết thúc!',
            thankYouFeedback: 'Cảm ơn bạn đã đánh giá!',
            error: {
                cannotLoadMatch: 'Không thể tải dữ liệu trận đấu',
                cannotLoadTable: 'Không thể tải thông tin bàn'
            }
        }
    },

    // Admin Dashboard Page
    adminDashboard: {
        loading: 'Đang tải...',
        errorTitle: 'Lỗi tải bảng điều khiển',
        clearError: 'Xóa lỗi',
        tryAgain: 'Thử lại',
        adminDashboardTitle: 'BẢNG ĐIỀU KHIỂN ADMIN',
        noDataTitle: 'Không có dữ liệu',
        noDataDesc: 'Hiện tại không có dữ liệu để hiển thị.',
        totalBranchesCard: 'Tổng chi nhánh',
        activeBranches: 'Đang hoạt động',
        closedBranches: 'Đã đóng',
        totalTablesCard: 'Tổng bàn',
        activeTables: 'Đang sử dụng',
        emptyTables: 'Trống',
        maintenanceTables: 'Bảo trì',
        totalManagersCard: 'Tổng quản lý',
        workingManagers: 'Đang làm việc',
        onLeaveManagers: 'Tạm nghỉ',
        totalFeedbacksCard: 'Tổng phản hồi',
        pendingFeedbacksCard: 'Chờ xử lý',
        resolvedFeedbacks: 'Đã xử lý',
        branchComparison: 'So sánh chi nhánh',
        branchComparisonDesc: 'So sánh số lượng bàn và quản lý giữa các chi nhánh',
        tableStatus: 'Trạng thái bàn',
        tableStatusDesc: 'Phân bố trạng thái bàn',
        chartNoData: 'Không có dữ liệu cho biểu đồ',
        branchStatistics: 'Thống kê chi nhánh',
        branchStatisticsDesc: 'Thống kê chi tiết cho từng chi nhánh',
        branchNumber: 'Chi nhánh #{number}',
        tables: 'Bàn',
        managers: 'Quản lý',
        inUse: 'Đang sử dụng',
        empty: 'Trống',
        maintenance: 'Bảo trì',
        managerStatus: 'Trạng thái quản lý',
        working: 'Đang làm việc',
        onLeave: 'Tạm nghỉ'
    },

} as const;
