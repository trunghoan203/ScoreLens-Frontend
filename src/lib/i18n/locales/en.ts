export default {
    // Common
    common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        add: 'Add',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        clear: 'Clear',
        submit: 'Submit',
        close: 'Close',
        open: 'Open',
        yes: 'Yes',
        no: 'No',
        required: 'Required',
        optional: 'Optional',
        status: 'Status',
        actions: 'Actions',
        details: 'Details',
        name: 'Name',
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        profile: 'Profile',
        settings: 'Settings',
        language: 'Language',
        english: 'English',
        vietnamese: 'Vietnamese',
        notLoggedIn: 'Not logged in',
        unknownBrand: 'Unknown brand',
        admin: 'Admin',
        notifications: 'Notifications',
        newNotifications: 'new notifications',
        markAllAsRead: 'Mark all as read',
        loadingNotifications: 'Loading notifications...',
        noNotifications: 'No notifications',
        newNotificationsWillAppearHere: 'New notifications will appear here',
        notAvailable: 'N/A',
        unknown: 'Unknown',
        all: 'All',
        clickToViewDetails: 'Click to view details',
        confirmInformation: 'Confirm Information',
        toggleNavigationMenu: 'Toggle navigation menu',
        confirmLogout: 'Are you sure you want to logout?',
        closeMenu: 'Close menu',
        logoutSuccess: 'Logout successful!',
        logoutFailed: 'Logout failed.',
    },

    // Navigation
    nav: {
        home: 'Home',
        matchHistory: 'Match History',
        guide: 'Guide',
        branches: 'Clubs',
        managers: 'Managers',
        feedbacks: 'Feedbacks',
        cameras: 'Cameras',
        tables: 'Tables',
        members: 'Members',
        dashboard: 'Dashboard',
        admin: 'Admin',
        superAdmin: 'Super Admin',
        brand: 'Brand',
    },

    // Auth
    auth: {
        loginTitle: 'Login',
        registerTitle: 'Register',
        forgotPassword: {
            title: 'Forgot Password?',
            description: 'Enter email to recover password',
            emailPlaceholder: 'Enter your email',
            sendButton: 'Send',
            sending: 'Sending...',
            emailSentSuccess: 'Email sent successfully! Please check your inbox.',
            generalError: 'An error occurred. Please try again.',
            passwordMinLength: 'Password must be at least 8 characters.',
            passwordMismatch: 'Passwords do not match.',
            resetSuccess: 'Password reset successful!',
            resetFailed: 'Password reset failed.',
            successTitle: 'PASSWORD RESET SUCCESSFUL',
            successDescription: 'You can now login with your new password.',
            canLoginNow: 'You can now login!',
            backToLogin: 'Back to Login',
            rememberPassword: 'Remember your password?',
        },
        logoutConfirm: 'Are you sure you want to logout?',
        resetPassword: 'Reset Password',
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        confirmPasswordPlaceholder: 'Confirm your password',
        loginSuccess: 'Login successful!',
        registerSuccess: 'Registration successful!',
        logoutSuccess: 'Logout successful!',
        invalidCredentials: 'Invalid email or password',
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must be at least 6 characters',
        passwordMismatch: 'Passwords do not match',
        emailInvalid: 'Invalid email format',
        roleSelection: {
            title: 'What role would you like to login with?',
            businessOwner: 'Admin',
            manager: 'Manager',
        },
        managerLogin: {
            title: 'Manager Login',
            description: 'Please enter your email to continue',
            emailLabel: 'Email',
            emailPlaceholder: 'Enter your email',
            emailRequired: 'Manager code is required',
            loginButton: 'Login',
            loggingIn: 'Logging in...',
            backToHome: 'Back to home',
            verificationSent: 'Verification code has been sent!',
            errorMessage: 'An error occurred. Please try again.',
        },
        adminLogin: {
            title: 'Admin Login',
            description: 'Please login to continue',
            emailLabel: 'Email',
            emailPlaceholder: 'Enter your email',
            emailRequired: 'Email is required',
            emailInvalid: 'Invalid email',
            passwordLabel: 'Password',
            passwordPlaceholder: 'Enter password',
            passwordRequired: 'Password is required',
            passwordMinLength: 'Password must be at least 8 characters',
            passwordComplexity: 'Password must contain uppercase, lowercase, numbers and special characters',
            rememberMe: 'Remember Me',
            forgotPassword: 'Forgot password?',
            loginButton: 'Login',
            loggingIn: 'Logging in...',
            loginSuccess: 'Login successful!',
            loginFailed: 'Login failed. Please try again.',
            logoutSuccess: 'Logout successful!',
            logoutFailed: 'Logout failed.',
            noAccount: "Don't have an account?",
            register: 'Register',
            backToHome: 'Back to home',
        },
        adminRegister: {
            title: 'Admin Registration',
            description: 'Please enter your information to register a Admin account.',
            fullNameLabel: 'Full Name',
            fullNamePlaceholder: 'Enter your full name',
            fullNameRequired: 'Full name is required',
            emailLabel: 'Email',
            emailPlaceholder: 'Enter your email',
            emailRequired: 'Email is required',
            passwordLabel: 'Password',
            passwordPlaceholder: 'Enter password',
            passwordRequired: 'Password is required',
            passwordMinLength: 'Password must be at least 8 characters',
            passwordComplexity: 'Password must contain uppercase, lowercase, numbers and special characters',
            passwordHint: 'Password must be at least 8 characters, including uppercase, lowercase, numbers and special characters.',
            confirmPasswordLabel: 'Confirm Password',
            confirmPasswordPlaceholder: 'Re-enter password',
            confirmPasswordRequired: 'Confirm password is required',
            confirmPasswordMismatch: 'Passwords do not match',
            agreeTerms: 'I agree to the',
            termsOfService: 'terms of service',
            agreeRequired: 'You must agree to the terms of service',
            continueButton: 'Continue',
            registerButton: 'Register',
            registering: 'Registering...',
            registerSuccess: 'Registration successful!',
            registerFailed: 'Registration failed. Please try again.',
            verificationTitle: 'Enter 6-digit verification code',
            verificationDescription: 'We have sent a verification code to',
            verificationButton: 'Verify',
            verifying: 'Verifying...',
            resendCode: 'Resend code',
            resendTimer: 'Resend in',
            backButton: 'Go back',
            backToHome: 'Back to home',
            hasAccount: 'Already have an account?',
            login: 'Login',
        },
        adminVerification: {
            title: 'Account Verification',
            description: 'We have sent a verification code to',
            verificationTitle: 'Enter 6-digit verification code',
            verificationButton: 'Verify',
            verifying: 'Verifying...',
            verificationSuccess: 'Verification successful!',
            verificationFailed: 'Verification failed. Please try again.',
            otpRequired: 'Please enter all 6 digits',
            resendCode: 'Resend code',
            resendTimer: 'Resend in',
            backToLogin: 'Back to login',
            notReceivedCode: 'Did not receive the code?',
        },
        managerVerification: {
            title: 'Manager Verification',
            description: 'We have sent a verification code to',
            verificationTitle: 'Enter 6-digit verification code',
            verificationButton: 'Verify',
            verifying: 'Verifying...',
            verificationSuccess: 'Verification successful!',
            verificationFailed: 'Verification failed. Please try again.',
            otpRequired: 'Please enter all 6 digits',
            resendCode: 'Resend code',
            resendTimer: 'Resend in',
            backToLogin: 'Back to login',
            notReceivedCode: 'Did not receive the code?',
            codeResent: 'Verification code has been resent!',
            resendFailed: 'Failed to resend code.',
        },
        adminResetPassword: {
            title: 'Reset Password',
            description: 'Please enter your new password.',
            descriptionWithEmail: 'Reset password for',
            newPasswordLabel: 'New Password',
            newPasswordPlaceholder: 'Enter new password',
            confirmPasswordLabel: 'Confirm Password',
            confirmPasswordPlaceholder: 'Re-enter new password',
            resetButton: 'Reset Password',
            resetting: 'Resetting...',
            resetSuccess: 'Password reset successful!',
            resetFailed: 'An error occurred. Please try again.',
            passwordMinLength: 'Password must be at least 6 characters.',
            passwordMismatch: 'Passwords do not match.',
            backToLogin: 'Back to login',
            successTitle: 'Password reset successful!',
            successDescription: 'You can now login with your new password.',
            // Validation messages
            passwordRequired: 'Password is required',
            passwordMinLength8: 'Password must be at least 8 characters',
            passwordComplexity: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
            confirmPasswordRequired: 'Confirm password is required',
            confirmPasswordMismatch: 'Confirm password does not match',
            // Toast messages
            pleaseCheckInfo: 'Please check the information again',
            generalError: 'An error occurred. Please try again.',
        },
        accountRejected: {
            title: 'Account Rejected',
            description: 'Please check your email or',
            here: 'here',
            forMoreDetails: 'for more details.',
            backToLogin: 'Back to Login',
        },
        reform: {
            title: 'REJECTED INFORMATION',
            accountMismatchWarning: 'Login account does not match the link. Displaying current account data.',
            cannotLoadData: 'Cannot load data',
            noAuthToken: 'Authentication token not found',
            deleteAccountSuccess: 'Account deleted successfully',
            deleteAccountFailed: 'Failed to delete account',
            steps: {
                details: 'Detailed Information',
                brand: 'Brand Information',
                branch: 'Club Information',
                confirm: 'Confirm',
            },
            successTitle: 'YOU HAVE SUCCESSFULLY REGISTERED',
            successDescription: 'Please wait for us to approve your registration request!',
            thankYou: 'Thank you for registering!',
            redirectMessage: 'You will be redirected automatically in',
            seconds: 'seconds',
            adminInfo: 'Admin Information',
            fullName: 'Full Name',
            status: 'Status',
            rejected: 'Rejected',
            pending: 'Pending',
            rejectedReason: 'Rejection Reason',
            brandInfo: 'Brand Information',
            brandName: 'Brand Name',
            phoneNumber: 'Phone Number',
            website: 'Website',
            citizenCode: 'Citizen ID',
            noBrandInfo: 'No brand information available.',
            branchList: 'Clubs List',
            address: 'Address',
            tableNumber: 'Number of Tables',
            noBranches: 'No clubs available.',
            editRegistrationInfo: 'Edit Registration Information',
            deleteAccount: 'Delete Account',
            confirmRegistrationInfo: 'Confirm Registration Information',
            brandInfoTitle: 'Brand Information',
            branchInfoTitle: 'Club Information',
            branch: 'Club',
            confirmInfo: 'Confirm Information',
            deleteAccountConfirm: 'Confirm Account Deletion',
            deleteAccountConfirmText: 'Deleting account will permanently delete the account and all related data including brand and club information.',
            deleteAccountConfirmQuestion: 'Are you sure you want to delete this account?',
            deleteAccountConfirmWarning: 'This action cannot be undone.',
            deleting: 'Deleting...',
        },
    },

    // Clubs
    branches: {
        title: 'CLUBS',
        addBranch: 'Add Club',
        editBranch: 'Edit Club',
        branchDetails: 'Club Details',
        branchName: 'Club Name',
        branchNamePlaceholder: 'Enter club name',
        addressPlaceholder: 'Enter address',
        phonePlaceholder: 'Enter phone number',
        tableNumber: 'Number of Tables',
        tableNumberPlaceholder: 'Enter number of tables',
        registeredTables: 'Registered Tables',
        actualTables: 'Actual Tables on System',
        tableMismatch: '⚠️ Number of tables on system does not match registered tables',
        status: {
            open: 'Open',
            closed: 'Closed',
            maintenance: 'Maintenance',
        },
        addSuccess: 'Club added successfully!',
        updateSuccess: 'Club updated successfully!',
        deleteSuccess: 'Club deleted successfully!',
        deleteConfirm: 'Are you sure you want to delete club "{name}"?',
        addressExists: 'This address already exists in the system',
        addressRequired: 'Address is required',
        addressMinLength: 'Address must be at least 5 characters',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Invalid phone number',
        tableNumberRequired: 'Number of tables is required',
        tableNumberMin: 'Number of tables must be greater than 0',
        tableNumberCannotBeZero: 'Number of tables cannot be 0',
        cannotLoadBranches: 'Cannot load clubs list',
        searchError: 'Search error',
        noSearchResults: 'No matching clubs found',
        noBranches: 'No clubs yet',
        tryDifferentKeywords: 'Try changing search keywords to find matching clubs',
        useAddButton: 'Use the "Add Club" button above to create your first club',
        viewAll: 'View all',
        searchPlaceholder: 'Enter name or address to search',
        table: {
            branchName: 'CLUB NAME',
            address: 'ADDRESS',
            tableCount: 'TABLE',
            status: 'STATUS',
            clickToViewDetails: 'Click to view details',
        },
        detailPage: {
            title: 'CLUB',
            editBranch: 'EDIT CLUB',
            branchDetails: 'CLUB DETAILS',
            backToBranches: 'Back',
            edit: 'Edit',
            saving: 'Saving...',
            save: 'Save',
            delete: 'Delete',
            deleting: 'Deleting...',
            deleteConfirm: 'Are you sure you want to delete?',
            deleteConfirmMessage: 'Are you sure you want to delete club "{name}"?',
            cancel: 'Cancel',
            confirm: 'Confirm',
            branchName: 'Club Name',
            branchNameRequired: 'Club name is required',
            address: 'Address',
            addressRequired: 'Address is required',
            phoneNumber: 'Phone Number',
            phoneNumberRequired: 'Phone number is required',
            registeredTables: 'Registered Tables',
            registeredTablesRequired: 'Number of registered tables is required',
            actualTables: 'Actual Tables on System',
            actualTablesRequired: 'Number of actual tables is required',
            status: 'Status',
            statusOpen: 'Open',
            statusClosed: 'Closed',
            statusMaintenance: 'Maintenance',
            tableMismatchWarning: '⚠️ Number of tables on system does not match registered tables',
            invalidClubId: 'Invalid Club ID',
            cannotLoadBranch: 'Cannot load club information',
            updateSuccess: 'Club updated successfully!',
            updateFailed: 'Failed to update club',
            deleteSuccess: 'Club deleted successfully!',
            deleteFailed: 'Failed to delete club',
            branchNotFound: 'Club information not found',
            // Validation messages
            nameMinLength: 'Club name must be at least 2 characters',
            nameMaxLength: 'Club name cannot exceed 255 characters',
            addressMinLength: 'Address must be at least 5 characters',
            addressMaxLength: 'Address cannot exceed 255 characters',
            phoneInvalid: 'Invalid phone number',
            tableNumberMin: 'Number of tables must be at least 1',
            // Toast messages
            pleaseCheckInfo: 'Please check the information again',
        },
    },

    // Managers
    managers: {
        title: 'MANAGERS',
        addManager: 'Add Manager',
        editManager: 'Edit Manager',
        managerDetails: 'Manager Details',
        managerName: 'Manager Name',
        managerNamePlaceholder: 'Enter manager name',
        managerEmail: 'Manager Email',
        managerEmailPlaceholder: 'Enter manager email',
        managerPhone: 'Manager Phone',
        managerPhonePlaceholder: 'Enter manager phone',
        branch: 'Club',
        selectBranch: 'Select Club',
        selectBranchPlaceholder: '-- Select club --',
        addSuccess: 'Manager added successfully!',
        updateSuccess: 'Manager updated successfully!',
        deleteSuccess: 'Manager deleted successfully!',
        deleteConfirm: 'Are you sure you want to delete?',
        noBranch: 'No club assigned',
        searchPlaceholder: 'Enter name or phone number to search',
        cannotLoadData: 'Cannot load manager details',
        saveSuccess: 'Manager saved successfully!',
        saveFailed: 'Update manager failed!',
        deleteFailed: 'Delete manager failed!',
        dateOfBirth: 'Date of Birth',
        dateFormat: 'dd/mm/yyyy',
        citizenCode: 'Citizen Code',
        noBrandLinked: 'Your admin account is not linked to any brand.',
        cannotLoadList: 'Cannot load manager list',
        noSearchResults: 'No matching managers found',
        noManagers: 'No managers yet',
        tryDifferentKeywords: 'Try changing search keywords to find matching managers',
        useAddButton: 'Use the "Add Manager" button above to create the first manager',
        cannotLoadBranches: 'Cannot load club list',
        addFailed: 'Add manager failed!',
        // Manager Detail Page Validation
        managerNameRequired: 'Manager name is required',
        managerNameMinLength: 'Manager name must be at least 2 characters',
        managerNameMaxLength: 'Manager name cannot exceed 255 characters',
        phoneInvalid: 'Invalid phone number',
        dateOfBirthInvalid: 'Invalid date of birth (format must be dd/mm/yyyy)',
        dateOfBirthInvalidOrFuture: 'Invalid date of birth or date is in the future',
        emailInvalid: 'Invalid email',
        citizenCodeLength: 'Citizen ID must be exactly 12 digits',
        citizenCodeProvinceInvalid: 'Invalid province/city code',
        citizenCodeGenderInvalid: 'Invalid gender/century code',
        citizenCodeYearInvalid: 'Invalid birth year',
        addressMinLength: 'Address must be at least 5 characters',
        addressMaxLength: 'Address cannot exceed 255 characters',
        // Toast messages
        pleaseCheckInfo: 'Please check the information again',
        updateFailed: 'Failed to update manager!',
        // Add Manager Page Validation
        clubIdRequired: 'Please select a club',
        dateOfBirthRequired: 'Date of birth is required',
        citizenCodeRequired: 'Citizen ID is required',
        table: {
            managerName: 'MANAGER NAME',
            branch: 'CLUB',
            phone: 'PHONE',
            status: 'STATUS',
        },
        status: {
            active: 'Active',
            inactive: 'Inactive',
        },
    },

    // Brand Info Form
    brandInfoForm: {
        title: 'Brand Information',
        editTitle: 'Edit Brand Information',
        logoLabel: 'Brand Logo',
        logoRequired: 'Logo is required',
        logoNotSelected: 'No logo selected',
        uploadSuccess: 'Logo uploaded successfully!',
        uploadFailed: 'Upload failed',
        imageFormatInfo: 'Allowed formats: PNG, JPG, JPEG, max 5MB',
        uploading: 'Uploading...',
        brandNameLabel: 'Brand Name',
        brandNameRequired: 'Brand name is required',
        brandNameMinLength: 'Brand name must be at least 2 characters',
        brandNamePlaceholder: 'Enter brand name...',
        phoneLabel: 'Phone Number',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Invalid phone number format',
        phonePlaceholder: 'Enter phone number...',
        citizenCodeLabel: 'Citizen Code',
        citizenCodeRequired: 'Citizen code is required',
        citizenCodeLength: 'Citizen code must be exactly 12 digits',
        citizenCodeProvinceInvalid: 'Invalid province code',
        citizenCodeGenderInvalid: 'Invalid gender/century code',
        citizenCodeYearInvalid: 'Invalid birth year',
        citizenCodePlaceholder: 'Enter citizen code...',
        websiteLabel: 'Website',
        websiteInvalid: 'Invalid URL, must start with https://',
        websitePlaceholder: 'https://example.com',
        saveAndContinue: 'Save and Continue',
        updateAndContinue: 'Update and Continue',
        saving: 'Saving...',
        updating: 'Updating...',
        updateSuccess: 'Brand information updated successfully!',
        saveSuccess: 'Brand information saved successfully!',
        operationFailed: 'Operation failed. Please try again.',
    },

    // Branch Info Form
    branchInfoForm: {
        title: 'Branch Information',
        backToPrevious: '← Back to previous step',
        branch: 'Branch',
        addBranch: 'Add Branch',
        removeBranch: 'Remove Branch',
        clubNameLabel: 'Club Name',
        clubNameRequired: 'Club name is required',
        clubNamePlaceholder: 'Enter club name...',
        tableCountLabel: 'Number of Tables',
        tableCountRequired: 'Number of tables is required',
        tableCountPlaceholder: 'Enter number of tables...',
        addressLabel: 'Address',
        addressRequired: 'Address is required',
        addressPlaceholder: 'Enter address',
        phoneLabel: 'Phone Number',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Invalid phone number format',
        phonePlaceholder: 'Enter phone number...',
        save: 'Save',
        edit: 'Edit',
        createNew: 'Create New',
        saving: 'Saving...',
        cancel: 'Cancel',
        deleteSuccess: 'Branch deleted successfully!',
        deleteFailed: 'Failed to delete branch!',
        updateSuccess: 'Branch updated successfully!',
        createSuccess: 'Branch created successfully!',
        updateFailed: 'Failed to update branch!',
        createFailed: 'Failed to create branch!',
        confirmTitle: 'Confirm Registration Information',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        creating: 'Creating...',
        preparing: 'Preparing...',
        updateAndContinue: 'Update and Continue',
        confirmInfo: 'Confirm Information',
        brandInfoTitle: 'Brand Information',
        branchInfoTitle: 'Branch Information',
        brandName: 'Brand Name',
        phoneNumber: 'Phone Number',
        website: 'Website',
        citizenCode: 'Citizen ID',
        address: 'Address',
        tableCount: 'Number of Tables',
        phone: 'Phone Number',
        noWebsite: 'N/A',
        createBrandAndClubSuccess: 'Brand and clubs created successfully!',
        cannotUpdateStatus: 'Cannot update admin status to pending.',
        operationFailed: 'Operation failed. Please try again.',
        deleteConfirmTitle: 'Confirm Delete Branch',
        deleteConfirmText: 'Delete',
        deleteConfirmMessage: 'Are you sure you want to delete this branch?',
    },

    // Feedbacks
    feedbacks: {
        title: 'FEEDBACKS',
        feedbackDetails: 'Feedback Details',
        feedbackContent: 'Feedback Content',
        feedbackType: 'Feedback Type',
        feedbackStatus: 'Feedback Status',
        feedbackDate: 'Feedback Date',
        customerName: 'Customer Name',
        customerEmail: 'Customer Email',
        customerPhone: 'Customer Phone',
        rating: 'Rating',
        response: 'Response',
        respondToFeedback: 'Respond to Feedback',
        markAsResolved: 'Mark as Resolved',
        markAsPending: 'Mark as Pending',
        type: {
            general: 'General',
            complaint: 'Complaint',
            suggestion: 'Suggestion',
            bug: 'Bug Report',
        },
        searchPlaceholder: 'Enter club or table to search',
        table: {
            branch: 'CLUB',
            table: 'TABLE',
            time: 'TIME',
            status: 'STATUS',
        },
        status: {
            pending: 'Pending',
            resolved: 'Resolved',
            inProgress: 'In Progress',
            managerP: 'Manager Processing',
            adminP: 'Admin Processing',
            superadminP: 'Super Admin Processing',
        },
        // Feedback Detail Page
        cannotLoadData: 'Cannot load feedback data',
        notFound: 'Feedback not found',
        loadErrorDescription: 'An error occurred while loading feedback information. Please try again later.',
        backToList: 'Back to list',
        manageFeedback: 'MANAGE FEEDBACK',
        tableType: 'Table Type',
        creatorTypeLabel: 'Creator Type',
        creatorType: {
            guest: 'Guest',
            membership: 'Member',
        },
        createdAt: 'Created At',
        updatedAt: 'Updated At',
        processingNote: 'Processing Note',
        processingNotePlaceholder: 'Enter processing note...',
        processingHistory: 'Processing History',
        noProcessingHistory: 'No processing history yet',
        processingHistoryDescription: 'Processing history will appear when someone updates the feedback',
        saveSuccess: 'Feedback saved successfully!',
        saveFailed: 'Failed to save feedback.',
        // Feedback Listing Page
        noSearchResults: 'No matching feedbacks found',
        noFeedbacks: 'No feedbacks yet',
        tryDifferentFilters: 'Try changing search keywords or filters to find matching feedbacks',
        showingResults: 'Showing {start}-{end} of {total} feedbacks',
        // Manager Feedback Page
        managementTitle: 'FEEDBACK MANAGEMENT',
        loading: 'Loading...',
        cannotLoadFeedbacks: 'Cannot load feedback list',
        viewAll: 'View All',
        filterOptions: {
            all: 'All',
            pending: 'Pending',
            resolved: 'Resolved',
        },
        timeLabel: 'Time:',
        statusLabel: 'Status:',
        clickToViewDetails: 'Click to view details →',
        // Feedback Detail Page
        save: 'Save',
        edit: 'Edit',
        back: 'Back',
    },

    // Cameras
    cameras: {
        title: 'CAMERAS',
        addCamera: 'Add Camera',
        editCamera: 'Edit Camera',
        cameraDetails: 'Camera Details',
        cameraName: 'Camera Name',
        cameraNamePlaceholder: 'Enter camera name',
        cameraUrl: 'Camera URL',
        cameraUrlPlaceholder: 'Enter camera stream URL',
        cameraStatus: 'Camera Status',
        cameraLocation: 'Camera Location',
        cameraLocationPlaceholder: 'Enter camera location',
        status: {
            active: 'Active',
            inactive: 'Inactive',
            maintenance: 'Maintenance',
        },
        addSuccess: 'Camera added successfully!',
        updateSuccess: 'Camera updated successfully!',
        deleteSuccess: 'Camera deleted successfully!',
        deleteConfirm: 'Are you sure you want to delete camera "{name}"?',
        // Camera Detail Page
        manageCamera: 'MANAGE CAMERA',
        editCameraTitle: 'EDIT CAMERA',
        cameraDetailsTitle: 'CAMERA DETAILS',
        table: 'Table',
        tableRequired: 'Table is required',
        ipAddress: 'IP Address',
        ipAddressRequired: 'IP address is required',
        ipAddressInvalid: 'Invalid IP address',
        username: 'Username',
        usernameRequired: 'Username is required',
        usernameMinLength: 'Username must be at least 2 characters',
        password: 'Password',
        passwordRequired: 'Password is required',
        connectionStatus: 'Connection Status',
        connectionStatusRequired: 'Connection status is required',
        connected: 'Connected',
        notConnected: 'Not Connected',
        cannotLoadData: 'Cannot load camera or table data',
        cameraNotFound: 'Camera not found',
        saveSuccess: 'Camera saved successfully!',
        saveFailed: 'Failed to save camera.',
        deleteFailed: 'Failed to delete camera.',
        formatCategory: {
            pool8: 'Pool 8',
            carom: 'Carom',
        },
        // Camera Add Page
        addCameraTitle: 'ADD CAMERA',
        selectTable: 'Select Table',
        selectTablePlaceholder: 'Select table',
        ipAddressPlaceholder: 'Enter IP address',
        usernamePlaceholder: 'Enter username',
        passwordPlaceholder: 'Enter password',
        checking: 'Checking...',
        test: 'Test',
        cannotLoadTables: 'Cannot load table list',
        cameraAddedSuccess: 'Camera has been added successfully!',
        cannotCreateCamera: 'Cannot create camera in database',
        cannotConnectCamera: 'Cannot connect to camera',
        errorCheckingCamera: 'Error checking camera',
        unknownError: 'Unknown error',
        // Camera Management Page
        managementTitle: 'CAMERA MANAGEMENT',
        searchPlaceholder: 'Enter table name to search',
        loading: 'Loading...',
        cannotLoadCameras: 'Cannot load camera or table list',
        noCamerasFound: 'No cameras found',
        noCamerasYet: 'No cameras yet',
        noCamerasDescription: 'Try changing search keywords or filters to find suitable cameras',
        viewAll: 'View All',
        tableHeader: 'TABLE',
        ipHeader: 'IP',
        statusHeader: 'STATUS',
        actionsHeader: 'ACTIONS',
        viewCamera: 'View Camera',
        statusLabel: 'Status:',
        clickToViewDetails: 'Click to view details →',
        cameraNotConnected: 'Camera is not connected. Please check connection status.',
    },

    // Tables
    tables: {
        title: 'TABLES',
        addTable: 'Add Table',
        editTable: 'Edit Table',
        tableDetails: 'Table Details',
        tableName: 'Table Name',
        tableNamePlaceholder: 'Enter table name',
        tableNumber: 'Table Number',
        tableNumberPlaceholder: 'Enter table number',
        tableStatus: 'Table Status',
        tableType: 'Table Type',
        tableLocation: 'Table Location',
        tableLocationPlaceholder: 'Enter table location',
        status: {
            available: 'Available',
            occupied: 'Occupied',
            maintenance: 'Maintenance',
            reserved: 'Reserved',
            empty: 'Available',
            inuse: 'In Use',
        },
        types: {
            pool: 'Pool Billiards',
            carom: 'Carom Billiards'
        },
        ready: 'Ready',
        type: {
            standard: 'Standard',
            premium: 'Premium',
            vip: 'VIP',
        },
        addSuccess: 'Table added successfully!',
        updateSuccess: 'Table updated successfully!',
        deleteSuccess: 'Table deleted successfully!',
        deleteConfirm: 'Are you sure you want to delete table "{name}"?',
    },

    // Members
    members: {
        title: 'MEMBERS',
        addMember: 'Add Member',
        editMember: 'Edit Member',
        memberDetails: 'Member Details',
        memberName: 'Member Name',
        memberNamePlaceholder: 'Enter member name',
        memberEmail: 'Member Email',
        memberEmailPlaceholder: 'Enter member email',
        memberPhone: 'Member Phone',
        memberPhonePlaceholder: 'Enter member phone',
        memberId: 'Member ID',
        memberIdPlaceholder: 'Enter member ID',
        membershipType: 'Membership Type',
        membershipStatus: 'Membership Status',
        joinDate: 'Join Date',
        expiryDate: 'Expiry Date',
        status: {
            active: 'Active',
            inactive: 'Inactive',
            suspended: 'Suspended',
            expired: 'Expired',
        },
        type: {
            basic: 'Basic',
            premium: 'Premium',
            vip: 'VIP',
        },
        addSuccess: 'Member added successfully!',
        updateSuccess: 'Member updated successfully!',
        deleteSuccess: 'Member deleted successfully!',
        deleteConfirm: 'Are you sure you want to delete member "{name}"?',
        // Member Detail Page
        memberNotFound: 'Member not found',
        cannotLoadMemberData: 'Cannot load member data',
        memberNameRequired: 'Member name is required',
        memberNameMinLength: 'Member name must be at least 2 characters',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Invalid phone number',
        phoneAlreadyUsed: 'Phone number is already used by another member',
        saveMemberFailed: 'Failed to save member.',
        deleteMemberFailed: 'Failed to delete member.',
        memberManagement: 'MEMBER MANAGEMENT',
        memberCode: 'Member Code',
    },

    // Dashboard
    dashboard: {
        title: 'Dashboard',
        overview: 'Overview',
        statistics: 'Statistics',
        recentActivity: 'Recent Activity',
        totalBranches: 'Total Clubs',
        totalManagers: 'Total Managers',
        totalMembers: 'Total Members',
        totalTables: 'Total Tables',
        activeMatches: 'Active Matches',
        pendingFeedbacks: 'Pending Feedbacks',
        revenue: 'Revenue',
        visitors: 'Visitors',
        loading: 'Loading...',
        cannotLoadStats: 'Cannot load statistics data',
        noTablesFound: 'No tables found',
        noTablesFoundWithSearch: 'No matching tables found',
        tryChangingSearch: 'Try changing search keywords or filters to find suitable tables',
        viewAll: 'View all',
        viewMore: 'View more',
        minutes: 'minutes',
        hours: 'hours',
        hour: 'hour',
        minute: 'minute',
        // Manager Dashboard
        dashboardTitle: 'DASHBOARD',
        availableTables: 'Available',
        tablesInUse: 'In Use',
        searchPlaceholder: 'Enter table name to search',
        all: 'All',
    },

    // Match
    match: {
        title: 'Match',
        createMatch: 'Create Match',
        joinMatch: 'Join Match',
        matchLobby: 'Match Lobby',
        matchLounge: 'Match Lounge',
        scoreboard: 'Scoreboard',
        matchHistory: 'Match History',
        matchDetails: 'Match Details',
        matchStatus: 'Match Status',
        matchType: 'Match Type',
        matchDate: 'Match Date',
        matchDuration: 'Match Duration',
        players: 'Players',
        scores: 'Scores',
        winner: 'Winner',
        status: {
            waiting: 'Waiting',
            inProgress: 'In Progress',
            completed: 'Completed',
            cancelled: 'Cancelled',
        },
        type: {
            friendly: 'Friendly',
            competitive: 'Competitive',
            tournament: 'Tournament',
        },
    },

    // Errors
    errors: {
        general: 'An error occurred. Please try again.',
        networkError: 'Network error. Please check your connection.',
        serverError: 'Server error. Please try again later.',
        notFound: 'Not found',
        unauthorized: 'Unauthorized access',
        forbidden: 'Access forbidden',
        validationError: 'Please check your input and try again.',
        fileUploadError: 'File upload failed. Please try again.',
        sessionExpired: 'Your session has expired. Please login again.',
    },

    // Messages
    messages: {
        confirmDelete: 'Are you sure you want to delete this item?',
        confirmAction: 'Are you sure you want to perform this action?',
        unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?',
        loadingData: 'Loading data...',
        noData: 'No data available',
        noResults: 'No results found',
        tryAgain: 'Please try again',
        contactSupport: 'Please contact support if the problem persists.',
    },

    // Form validation
    validation: {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        minLength: 'Must be at least {min} characters',
        maxLength: 'Must be no more than {max} characters',
        numeric: 'Must be a number',
        positive: 'Must be a positive number',
        url: 'Please enter a valid URL',
        password: 'Password must be at least 6 characters',
        confirmPassword: 'Passwords must match',
    },

    // Home page
    home: {
        hero: {
            title: 'EVERY SHOT - EVERY RULE',
            subtitle: 'Join the vibrant billiards community - where professional tournaments are organized, skills are elevated, and glory peaks are conquered!',
        },
        scoringSystem: {
            title: 'What is the Billiards Scoring System?',
            description: 'The automatic Billiards scoring system helps simplify score tracking, ensuring accuracy and transparency in every match. Suitable for modern professional tournaments, this system supports:',
            features: [
                'Real-time score updates',
                'Match history storage',
                'Quick result compilation',
                'Reduces manual scoring errors',
            ],
        },
        features: {
            clubManagement: {
                title: 'BILLIARDS CLUB MANAGEMENT SYSTEM',
                items: [
                    'Helps organizers and operators manage billiards clubs more effectively',
                    'Manage match schedules, scores, and match history',
                    'Support real-time monitoring of each table\'s activity',
                    'Easy to use, suitable for all club management models',
                ],
            },
            memberSystem: {
                title: 'MEMBER SYSTEM',
                items: [
                    'Create a loyal player community right at your establishment',
                    'Manage and store member information',
                    'Facilitate events, member rankings',
                    'Customer care through promotions',
                ],
            },
        },
        values: {
            title: 'OUR VALUES',
            items: [
                { title: 'Intuitive Interface', description: '' },
                { title: 'Detailed Score Reports', description: '' },
                { title: 'Account Security Support', description: '' },
                { title: 'Dedicated Support', description: '' },
            ],
        },
        footer: {
            tagline: 'AUTOMATIC BILLIARDS SCORING - ACCURATE IN EVERY SHOT.',
            functions: {
                title: 'FUNCTIONS',
                items: [
                    'Automatic score tracking',
                    'Club management',
                    'Member system',
                ],
            },
            support: {
                title: 'SUPPORT',
                items: [
                    'Frequently asked questions',
                    'Terms of service',
                    'Online guide (FAQs)',
                ],
            },
            contact: {
                title: 'CONTACT/SOCIAL MEDIA',
                phone: 'Phone: 0912345678',
                email: 'Email: scorelensbillards@gmail.com',
            },
        },
    },

    // Club
    club: {
        title: 'BRAND INFORMATION',
        image: 'Image',
        uploadImage: 'Upload Image',
        uploading: 'Uploading...',
        brandName: 'Brand Name',
        brandNamePlaceholder: 'Enter brand name...',
        website: 'Website',
        websitePlaceholder: 'Enter website...',
        citizenCode: 'Citizen ID',
        citizenCodePlaceholder: 'Enter citizen ID...',
        phone: 'Phone Number',
        phonePlaceholder: 'Enter phone number...',
        branch: 'Club',
        branchName: 'Club Name',
        address: 'Address',
        currentTables: 'Current Tables',
        edit: 'Edit',
        saveInfo: 'Save',
        saving: 'Saving...',
        confirmUpdate: 'Confirm Update',
        update: 'Update',
        confirmUpdateMessage: 'Are you sure you want to update the brand information?',
        cannotLoadInfo: 'Cannot load brand or club information',
        uploadSuccess: 'Logo uploaded successfully!',
        uploadFailed: 'Upload failed',
        updateSuccess: 'Brand information updated successfully!',
        updateFailed: 'Failed to update brand information!',
        noChanges: 'No information has changed',
        validation: {
            brandNameRequired: 'Brand name is required',
            brandNameMinLength: 'Brand name must be at least 2 characters',
            invalidUrl: 'Invalid URL, must start with https://',
            citizenCodeRequired: 'Citizen ID is required',
            citizenCodeLength: 'Citizen ID must be exactly 12 digits',
            invalidProvinceCode: 'Invalid province/city code',
            invalidGenderCode: 'Invalid gender/century code',
            invalidYear: 'Invalid birth year',
            phoneRequired: 'Phone number is required',
            invalidPhone: 'Invalid phone number'
        }
    },

    // Confirm
    confirm: {
        title: 'COMPLETE ACCOUNT INFORMATION',
        registrationSuccess: 'YOU HAVE SUCCESSFULLY REGISTERED',
        waitForApproval: 'Please wait for us to approve your registration request!',
        thankYou: 'Thank you for registering!',
        redirectMessage: 'You will be redirected automatically in',
        seconds: 'seconds...',
    },
    accountPending: {
        title: 'Account Pending Approval',
        description: 'Your account has been submitted to the system and is waiting for Administrator confirmation.',
        checkLater: 'Please check back later or contact the Administrator for faster support.',
        backToLogin: 'Back to Login',
    },

    // Guide
    guide: {
        loading: 'Loading...',
        roles: {
            business: 'ADMIN',
            manager: 'MANAGER',
            member: 'MEMBERSHIP',
            user: 'USER',
        },
        business: {
            title: 'ScoreLens System User Guide - ADMIN Role',
            part1: {
                title: 'Part 1: Registration and Account Activation',
                description: 'As a Admin, you will go through a registration and verification process to manage the ScoreLens system for your brand.',
                step1: {
                    title: 'Step 1: Account Registration',
                    items: [
                        'Access the Admin registration page',
                        'Enter email and create a strong password for your account',
                        'Verify email with OTP code sent to your inbox'
                    ]
                },
                step2: {
                    title: 'Step 2: Complete Admin Information',
                    items: [
                        'Enter brand information: brand name, website, citizen ID, phone number',
                        'Add club information: club name, address, phone number',
                        'Declare number of tables at each club',
                        'Upload brand logo (optional)'
                    ]
                },
                step3: {
                    title: 'Step 3: Wait for Super Admin Approval',
                    items: [
                        'After completion, account will be in "Pending" status',
                        'Super Admin will review information and approve account',
                        'You will receive email notification when account is approved'
                    ]
                },
                step4: {
                    title: 'Step 4: Access System',
                    items: [
                        'After approval, login with registered email and password',
                        'Start managing ScoreLens system for your brand'
                    ]
                }
            },
            part2: {
                title: 'Part 2: Dashboard and Overview Management',
                description: 'After successful login, you will be taken to the Admin Dashboard - your command center.',
                quickStats: {
                    title: 'Quick Statistics:',
                    items: [
                        'Total active clubs',
                        'Number of working managers',
                        'New feedback requiring attention'
                    ]
                }
            },
            part3: {
                title: 'Part 3: Main Management Functions',
                brandManagement: {
                    title: 'Brand Information Management',
                    items: [
                        'View and edit brand information: name, website, citizen ID, phone number',
                        'Manage brand logo',
                        'View list of all clubs under the brand',
                        'Add new clubs when expanding'
                    ]
                },
                managerManagement: {
                    title: 'Manager Account Management',
                    items: [
                        'View list of all working managers',
                        'Add new manager: Enter personal information, email, phone number',
                        'Assign manager to specific club',
                        'Activate/deactivate manager account',
                        'Search and filter managers by club, status'
                    ]
                },
                feedbackManagement: {
                    title: 'Feedback and Support Management',
                    items: [
                        'View all feedback from users and managers',
                        'Filter feedback by status: Pending, In Progress, Completed',
                        'Filter by club and time range',
                        'Search feedback by keywords',
                        'Update status and respond to sender'
                    ]
                }
            },
            part4: {
                title: 'Part 4: Additional Functions',
                items: [
                    'Personal profile management: Change personal information and password',
                    'View overview reports: Statistics of all club activities',
                    'Performance tracking: Evaluate manager performance effectiveness',
                    'Send notifications: Send important notifications to all managers'
                ]
            }
        },
        manager: {
            title: 'ScoreLens System User Guide - MANAGER Role',
            part1: {
                title: 'Part 1: Manager Account Activation',
                description: 'Your account is created and authorized by the Admin. You will receive login information via email.',
                receiveInfo: {
                    title: 'Receive Account Information',
                    items: [
                        'Check email to receive login information from Admin',
                        'Email will contain login link and detailed instructions'
                    ]
                },
                loginByEmail: {
                    title: 'Login by Email',
                    items: [
                        'Access the provided login link',
                        'Enter email registered by Admin',
                        'System will send verification code to your email',
                        'Enter verification code to complete login'
                    ]
                },
                subsequentLogin: {
                    title: 'Subsequent Logins',
                    items: [
                        'Just enter registered email',
                        'System automatically sends new verification code',
                        'Enter verification code to access system'
                    ]
                }
            },
            part2: {
                title: 'Part 2: Manager Dashboard',
                description: 'After login, you will see the Dashboard - your command center at the club.',
                overview: {
                    title: '📊 Overview Statistics:',
                    items: [
                        'Total tables: Number of tables in the club',
                        'Tables in use: Tables currently having matches',
                        'Available tables: Tables ready for immediate use',
                        'Total members: Number of registered members'
                    ]
                }
            },
            part3: {
                title: 'Part 3: Daily Operations Management',
                equipmentManagement: {
                    title: 'Equipment Management (Tables & Cameras)',
                    items: [
                        'View list of all tables in the club',
                        'Add new table: Enter table name, table type (Pool 8, Pool 9, Snooker...)',
                        'Camera management: Assign cameras to each table for match monitoring',
                        'Edit table information: Update name, type, table status',
                        'Filter and search tables: By type, status, table name'
                    ]
                },
                matchManagement: {
                    title: 'Match Management',
                    items: [
                        'Monitor ongoing matches in real-time',
                        'View match list by table, time, status',
                        'Edit match information when needed:',
                        'Correct scores misrecognized by AI Camera',
                        'Update player information if mistaken',
                        'Manually end match if necessary',
                        'View history of completed matches'
                    ]
                },
                memberManagement: {
                    title: 'Member Management',
                    items: [
                        'View list of all registered members',
                        'Add new member: Enter personal information, phone number, email',
                        'Edit member information when needed',
                        'Activate/deactivate member account',
                        'Search members by name, phone number',
                        'View match history of each member'
                    ]
                },
                feedbackManagement: {
                    title: 'Feedback Management',
                    items: [
                        'View all feedback from users in the club',
                        'Respond and resolve reported issues',
                        'Update feedback status to inform sender of progress',
                        'Filter feedback by priority and status'
                    ]
                }
            },
            part4: {
                title: 'Part 4: Additional Functions',
                items: [
                    'Personal profile management: Change personal information and password',
                    'View activity reports: Statistics on matches, members, revenue',
                    'Send notifications: Send important notifications to members',
                    'Send feedback: Send feedback about system to Admin'
                ]
            }
        },
        member: {
            title: 'ScoreLens System User Guide - For MEMBERSHIPS/GUESTS',
            part1: {
                title: 'Part 1: Start Match - Scan QR Code',
                description: 'As a membership/guest, you can create and join matches easily with just a few simple steps.',
                step1: {
                    title: 'Step 1: Go to Table',
                    items: [
                        'Choose the table you want to use',
                        'Ensure table is available and ready for match'
                    ]
                },
                step2: {
                    title: 'Step 2: Scan QR Code',
                    items: [
                        'Open Camera app on phone',
                        'Scan QR code placed on the table',
                        'Browser will automatically open ScoreLens website'
                    ]
                },
                step3: {
                    title: 'Step 3: Create Match',
                    items: [
                        'Enter names for Team A and Team B',
                        'Select table type (Pool 8, Pool 9, Snooker...)',
                        'Press "Create match" to start'
                    ]
                }
            },
            part2: {
                title: 'Part 2: Match Management - Room Owner Rights',
                importantNote: '🎯 Important Note: Only the Room Owner (person who created the match) has the right to perform management operations.',
                realTimeScoring: {
                    title: 'Real-Time Score Tracking',
                    items: [
                        'Scores are updated automatically through AI Camera',
                        'View real-time score ratio on screen',
                        'No need to manually enter scores'
                    ]
                },
                editScores: {
                    title: 'Edit Scores (Room Owner)',
                    items: [
                        'If AI misrecognizes, room owner can edit scores',
                        'Press "Edit" button to adjust scores for each team',
                        'Save to update accurate score ratio'
                    ]
                },
                memberManagement: {
                    title: 'Member Management (Room Owner)',
                    items: [
                        'Add new members to team',
                        'Remove members from team if needed',
                        'Edit member names',
                        'Distribute members between Team A and Team B'
                    ]
                },
                joinMatch: {
                    title: 'Join Match (Other Members)',
                    items: [
                        'Scan QR code on table to join ongoing match',
                        'Enter room code provided by room owner',
                        'View real-time scores but cannot edit'
                    ]
                }
            },
            part3: {
                title: 'Part 3: End and Evaluate',
                endMatch: {
                    title: 'End Match (Room Owner)',
                    items: [
                        'Press "End" button when match is complete',
                        'View final results and winner',
                        'Match will be saved to history'
                    ]
                },
                evaluateMatch: {
                    title: 'Evaluate Match',
                    items: [
                        'All players can evaluate the match',
                        'Write comments about gaming experience',
                        'Send feedback to improve service'
                    ]
                }
            },
            part4: {
                title: 'Part 4: Member Benefits',
                memberPrivileges: '✨ Member Privileges:',
                items: [
                    'Permanently store all participated matches',
                    'View detailed match history',
                    'Track personal statistics and progress',
                    'Create private matches without assistance',
                    'Receive notifications about special events'
                ]
            }
        },
        user: {
            title: 'ScoreLens System User Guide - For USERS',
            part1: {
                title: 'Part 1: Quick Start - Just 3 Steps',
                description: 'You can use the ScoreLens system immediately without registering an account. Just follow these 3 simple steps:',
                step1: {
                    title: 'Step 1: Open Phone Camera',
                    items: [
                        'Use the native Camera app on your phone',
                        'Works on both iPhone and Android'
                    ]
                },
                step2: {
                    title: 'Step 2: Scan QR Code',
                    items: [
                        'Point camera at QR code on the table',
                        'QR code is placed right on the table for easy scanning'
                    ]
                },
                step3: {
                    title: 'Step 3: Automatically Open Website',
                    items: [
                        'Browser will automatically open ScoreLens website',
                        'Display table information and ready to use'
                    ]
                }
            },
            part2: {
                title: 'Part 2: Using Website During Match',
                initialInfo: {
                    title: 'Enter Initial Information',
                    items: [
                        'Enter name or nickname for Team A and Team B',
                        'Select table type (Pool 8, Pool 9, Snooker...)',
                        'Press "Start" to initialize match'
                    ]
                },
                realTimeScoring: {
                    title: 'Real-Time Score Tracking',
                    items: [
                        'Scores are updated automatically in real-time',
                        'No need to manually enter scores',
                        'Can glance at phone anytime to see score ratio'
                    ]
                },
                editScores: {
                    title: 'Edit Scores (If Needed)',
                    items: [
                        'If AI misrecognizes scores, can edit',
                        'Press "Edit" button to adjust scores',
                        'Save to update accurate score ratio'
                    ]
                },
                endMatch: {
                    title: 'End Match',
                    items: [
                        'Press "End" button when match is complete',
                        'View final results and winner',
                        'Evaluate match (optional)'
                    ]
                }
            },
            part3: {
                title: 'Part 3: Important Notes',
                criticalNote: '⚠️ Extremely Important Note: Since you are using the web app as a guest, this match data is only temporary. If you close the browser tab or exit, information about this match will be permanently lost and you will not be able to view it again.',
            },
            part4: {
                title: 'Part 4: Upgrade to Member',
                description: 'Do you want to save all matches to review your achievements and progress? Register as a Member of the club!',
                memberBenefits: '🎁 Benefits When Becoming a Member:',
                items: [
                    'Permanently store all participated matches',
                    'View detailed match history',
                    'Track personal statistics and progress',
                    'Create private matches without assistance',
                    'Receive notifications about special events',
                    'Contact Club Manager to register as a member'
                ]
            }
        }
    },

    // History
    history: {
        title: 'MATCH HISTORY LOOKUP',
        totalMembers: 'Total Members',
        totalMatches: 'Total Matches',
        todayMatches: 'Today\'s Matches',
        memberIdLabel: 'Member ID',
        memberIdPlaceholder: 'Enter your member ID',
        memberIdNote: '* If you don\'t have a Member ID, please contact staff to register!',
        viewHistoryButton: 'View Match History',
        loading: 'Loading...',
        memberNotFound: 'Member not found with this phone number',
        errorMessage: 'Member not found with this phone number',
        detailPage: {
            title: 'MATCH HISTORY',
            memberIdLabel: 'Member ID:',
            totalMatches: 'Total matches',
            matches: 'matches',
            phoneNotFound: 'Phone number not found',
            cannotLoadHistory: 'Cannot load match history',
            backToSearch: 'Back to search page',
            noMatchesFound: 'No matches found',
            noMatchesYet: 'No matches yet',
            tryDifferentKeywords: 'Try changing search keywords or date to find suitable matches',
            tryDifferentSearch: 'Try changing search keywords to find suitable matches',
            tryDifferentDate: 'Try changing date to find suitable matches',
            noMatchesInSystem: 'This member has no matches in the system',
            viewAll: 'View all',
            showingResults: 'Showing {start}-{end} of {total} matches',
            teamA: 'TEAM A',
            teamB: 'TEAM B',
            draw: 'Draw',
            pool: 'Pool',
            carom: 'Carom',
            unknown: 'Unknown',
            notAvailable: 'N/A',
            notDetermined: 'Not determined'
        }
    },

    // User Match
    userMatch: {
        create: {
            title: 'Welcome to ScoreLens',
            tableInfo: 'Table',
            pool8Ball: 'Pool 8 Ball',
            fullNameLabel: 'Full Name',
            fullNamePlaceholder: 'Enter your full name...',
            memberIdLabel: 'Member ID',
            memberIdPlaceholder: 'Enter member ID...',
            verifyButton: 'Verify',
            verifying: 'Verifying...',
            memberNote: '* If you don\'t have a Member ID, please contact staff to register!',
            joinButton: 'Join',
            createMatchButton: 'Create Match',
            checkingTable: 'Checking table...',
            error: {
                noTableId: 'Error: Table information not found',
                noTableIdDescription: 'Please scan the QR code on the table to start.',
                invalidUrl: 'Invalid URL, please scan the QR code again.',
                cannotVerifyTable: 'Cannot verify table. Please try again.',
                tableInUse: 'Table is currently in use, cannot create match',
                noFullName: 'Please enter your full name.',
                noTableInfo: 'Table information not found. Please scan the QR code again.',
                noClubInfo: 'Club information not found',
                invalidResponse: 'Invalid response',
                verificationFailed: 'Verification failed',
                notMember: 'You are not registered as a member',
                accountBanned: 'Your account is banned',
                notBrandCompatible: 'You are not registered as a member.'
            },
            success: {
                matchCreated: 'Match created successfully',
                welcome: 'Welcome',
                welcomeWithName: 'Welcome {name}'
            },
            teamNames: {
                teamA: 'Team A',
                teamB: 'Team B'
            }
        }
    },

    // Manager Matches
    managerMatches: {
        tableNotFound: 'Table not found',
        cannotIdentifyMatch: 'Cannot identify match to cancel',
        cancelMatchSuccess: 'Match cancelled successfully!',
        cancelMatchFailed: 'Failed to cancel match!',
        cannotIdentifyMatchToEnd: 'Cannot identify match to end',
        cannotGetMatchInfo: 'Cannot get match information',
        endMatchSuccess: 'Match ended successfully!',
        endMatchFailed: 'Failed to end match!',
        updateMembersFailed: 'Failed to update members!',
        team: 'Team',
        unknown: 'Unknown',
    },

    // Team Members
    teamMembers: {
        title: 'EDIT MEMBERS',
        description: 'You can enter member phone number or guest name',
        teamA: 'Team A',
        teamB: 'Team B',
        roomOwnerPlaceholder: 'Room owner name',
        memberOrGuestPlaceholder: 'Phone number or guest name',
        addPlayer: 'Add player',
        removePlayer: 'Remove player',
        cancel: 'Cancel',
        saveChanges: 'Save changes',
        errors: {
            tooManyPlayers: 'Cannot add more than 4 players!',
            cannotRemoveOnlyOwner: 'Cannot remove the only room owner!',
            matchNotFound: 'Match information not found',
            noPermission: 'No permission to edit members',
            invalidSessionToken: 'Invalid SessionToken',
            cannotDetermineClub: 'Cannot determine club for membership validation',
            updateSuccess: 'Members updated successfully!',
            updateFailed: 'Failed to update members',
            validationError: 'Validation error:',
            invalidMemberCode: 'Invalid member code',
            accountBanned: 'Account is banned'
        }
    },

    // Admin Add Branch
    adminAddBranch: {
        branchNameRequired: 'Branch name is required',
        branchNameMinLength: 'Branch name must be at least 2 characters',
        branchNameMaxLength: 'Branch name cannot exceed 255 characters',
        addressRequired: 'Address is required',
        addressMinLength: 'Address must be at least 5 characters',
        addressMaxLength: 'Address cannot exceed 255 characters',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Invalid phone number',
        tableNumberMin: 'Minimum number of tables is 1'
    },

    // Manager Add Member
    managerAddMember: {
        title: 'MEMBER MANAGEMENT',
        addMemberTitle: 'ADD MEMBER',
        memberNameLabel: 'Member Name',
        memberNameRequired: 'Member name is required',
        memberNameMinLength: 'Member name must be at least 2 characters',
        memberNamePlaceholder: 'Enter member name',
        phoneLabel: 'Phone Number',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Invalid phone number',
        phonePlaceholder: 'Enter phone number',
        phoneAlreadyUsed: 'Phone number is already used by another member',
        addSuccess: 'Member added successfully!',
        addFailed: 'Failed to add member.',
    },

    // Manager Members Page
    managerMembers: {
        loadingText: 'Loading...',
        loadMembersError: 'Cannot load member list',
        noMembersFound: 'No members found',
        noMembersFoundWithSearch: 'No matching members found',
        noMembersDescription: 'Try changing search keywords or filters to find suitable members',
        viewAll: 'View all',
        showingMembers: 'Showing {start}-{end} of {total} members',
        previous: 'Previous',
        next: 'Next',
    },

    // Manager Table Management
    managerTable: {
        pageTitle: 'TABLE MANAGEMENT',
        editTableTitle: 'EDIT TABLE',
        tableDetailsTitle: 'TABLE DETAILS',
        backLabel: 'Back',
        saveLabel: 'Save',
        editLabel: 'Edit',
        deleteLabel: 'Delete',
        deleteConfirmTitle: 'Are you sure you want to delete this table?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        tableNameLabel: 'Table Name',
        tableNameRequired: 'Table name is required',
        tableNameMinLength: 'Table name must be at least 2 characters',
        tableTypeLabel: 'Table Type',
        statusLabel: 'Status',
        statusEmpty: 'Empty',
        statusInUse: 'In Use',
        statusMaintenance: 'Maintenance',
        tableInMatchError: 'This table is currently in a match, editing is not allowed!',
        saveSuccess: 'Table saved successfully!',
        saveFailed: 'Failed to save table.',
        deleteFailed: 'Failed to delete table.',
        downloadQR: 'Download QR Code',
    },
} as const;
