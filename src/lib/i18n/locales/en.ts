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
        members: 'Memberships',
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
        deleteSuccess: 'Club deleted successfully!',
        deleteFailed: 'Failed to delete club!',
        updateSuccess: 'Branch updated successfully!',
        createSuccess: 'Club created successfully!',
        updateFailed: 'Failed to update club!',
        createFailed: 'Failed to create club!',
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
        },
        entry: {
            title: 'TABLE',
            pool8Ball: 'Pool 8 Ball',
            loading: 'Loading...',
            description: 'Please enter the room code to continue',
            continue: 'Continue',
            error: {
                incompleteCode: 'Please enter all 6 digits!',
                invalidCode: 'Invalid room code!',
                codeNotFound: 'Room code does not exist or has been cancelled!'
            },
            success: {
                welcome: 'Welcome to ScoreLens',
                validCode: 'Valid room code!'
            }
        },
        join: {
            title: 'TABLE',
            pool8Ball: 'Pool 8 Ball',
            loading: 'Loading...',
            description: 'Enter name to join room',
            fullNameLabel: 'Full Name',
            fullNamePlaceholder: 'Enter your full name...',
            phoneLabel: 'Phone Number',
            phonePlaceholder: 'Enter phone number...',
            verifyButton: 'Verify',
            verifying: 'Verifying...',
            memberNote: '* If you don\'t have a Member ID, please contact staff to register!',
            continue: 'Continue',
            teamSelection: {
                title: 'Choose team to join',
                teamA: 'Team A',
                teamB: 'Team B',
                cancel: 'Cancel',
                confirm: 'Confirm',
                processing: 'Processing...'
            },
            error: {
                noPhone: 'Please enter phone number.',
                cannotDetermineClub: 'Cannot determine club. Please try again.',
                verificationFailed: 'Verification failed',
                notMember: 'You are not registered as a member',
                notBrandCompatible: 'You are not a member of this brand.',
                accountBanned: 'Your account is banned',
                noFullName: 'Please enter your full name.',
                alreadyJoined: 'You have already joined this match.'
            },
            success: {
                verificationSuccess: 'Verification successful!',
                welcomeWithName: 'Welcome {name}!',
                joinRoomSuccess: 'Successfully joined room!',
                createRoomSuccess: 'Room created successfully!'
            }
        },
        lobby: {
            title: 'TABLE',
            pool8: 'POOL 8',
            loading: 'LOADING...',
            description: 'Enter the code below to join the room',
            joinCode: 'Join Code',
            shareCodeNote: 'Share this code with players to join the room',
            teamALabel: 'Team A',
            teamBLabel: 'Team B',
            roomOwnerPlaceholder: 'Room owner name',
            mainPlayerPlaceholder: 'Main player name',
            playerPlaceholder: 'Player {index} name',
            startButton: 'Start',
            loadingText: 'Loading...',
            notReady: 'Not ready',
            connecting: 'Connecting...',
            noPermission: 'No permission',
            error: {
                noMatchId: 'No matchId. Please check again.',
                noWebSocketConnection: 'WebSocket not connected. Please wait for connection to complete.',
                authLoading: 'Authenticating permissions. Please wait...',
                authError: 'Authentication error: {error}',
                hostOnly: 'Only host can start the match.',
                cannotAuthenticateStart: 'Cannot authenticate start match permission. Please contact admin.',
                cannotStartMatch: 'Cannot start match. Please try again.',
                errorStartingMatch: 'An error occurred while starting the match.',
                cannotLoadTableInfo: 'Cannot load table information. Using default information.',
                cannotLoadMatchInfo: 'Cannot load match information',
                cannotLoadMatchByCode: 'Cannot load match information by room code',
                errorLoadingData: 'An error occurred while loading data',
                cannotRestoreSession: 'Cannot restore session',
                sessionRestoreError: 'Session restore error',
                cannotAuthenticateJoin: 'Cannot authenticate join match',
                missingAuthInfo: 'Missing information to authenticate join match',
                newPlayerJoined: 'New player has joined the room!',
                playerLeft: 'Player has left the room'
            },
            success: {
                matchStarted: 'Match has started!'
            }
        },

        // Lounge Page
        lounge: {
            title: 'TABLE',
            pool8: 'POOL 8',
            loading: 'LOADING...',
            description: 'You have joined the room with name: {name}',
            joinCode: 'Join Code',
            shareCodeNote: 'Share this code with players to join the room',
            teamALabel: 'Team A',
            teamBLabel: 'Team B',
            playerPlaceholder: 'Player {index}',
            leaveButton: 'Leave Room',
            leaving: 'Leaving room...',
            loadingText: 'Joining room...',
            confirmLeaveTitle: 'Confirm Leave Room',
            confirmLeaveMessage: 'Are you sure you want to leave this room?',
            cancel: 'Cancel',
            confirm: 'Confirm',
            error: {
                cannotLoadTableInfo: 'Cannot load table information',
                cannotLoadMatchInfo: 'Cannot load match information',
                cannotLoadMatchByCode: 'Cannot load match information by room code',
                errorLoadingData: 'An error occurred while loading data',
                cannotLeaveRoom: 'Cannot leave room',
                errorLeavingRoom: 'An error occurred while leaving room'
            },
            success: {
                newPlayerJoined: 'New player has joined the room!',
                playerLeft: 'Player has left the room',
                leftRoom: 'Left the room'
            }
        },
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
        addTableTitle: 'ADD TABLE',
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
        tableNamePlaceholder: 'Enter table name',
        tableTypeLabel: 'Table Type',
        statusLabel: 'Status',
        statusEmpty: 'Empty',
        statusInUse: 'In Use',
        statusMaintenance: 'Maintenance',
        tableInMatchError: 'This table is currently in a match, editing is not allowed!',
        saveSuccess: 'Table saved successfully!',
        saveFailed: 'Failed to save table.',
        addSuccess: 'Table added successfully!',
        addFailed: 'Failed to add table.',
        deleteFailed: 'Failed to delete table.',
        downloadQR: 'Download QR Code',
        cannotLoadTables: 'Cannot load table list',
        noTablesFound: 'No matching tables found',
        noTablesFoundWithSearch: 'No matching tables found',
        tryDifferentSearch: 'Try changing search keywords or filters to find suitable tables',
        viewAll: 'View all',
        loading: 'Loading...',
    },

    // Super Admin Admin Detail Page
    superAdminAdminDetail: {
        pageTitle: 'ADMIN',
        detailTitle: 'DETAILED INFORMATION',
        loading: 'Loading...',
        invalidId: 'Invalid ID',
        adminNotFound: 'Admin not found',
        statusLabel: 'Status:',
        statusPending: 'Pending',
        statusApproved: 'Approved',
        statusRejected: 'Rejected',
        rejectedReasonTitle: 'Rejection Reason:',
        noLogo: 'No logo',
        brandLabel: 'Brand:',
        brandNameLabel: 'Brand Name',
        fullNameLabel: 'Full Name',
        citizenCodeLabel: 'Citizen ID',
        phoneNumberLabel: 'Phone Number',
        emailLabel: 'Email',
        branchLabel: 'Branch',
        branchNameLabel: 'Branch Name',
        addressLabel: 'Address',
        tableNumberLabel: 'Number of Tables',
        approveSuccess: 'Admin has been approved.',
        approveFailed: 'Approval failed',
        rejectButton: 'REJECT',
        approveButton: 'APPROVE',
        backButton: 'BACK',
        rejectReasonTitle: 'Enter Rejection Reason',
        rejectReasonPlaceholder: 'Please enter rejection reason here...',
        rejectReasonRequired: 'Please enter rejection reason!',
        cancelButton: 'Cancel',
        confirmRejectButton: 'Confirm Rejection',
        sending: 'Sending...',
        rejectSuccess: 'Admin has been rejected.',
        rejectFailed: 'Rejection failed',
    },

    // Super Admin Feedback Detail Page
    superAdminFeedbackDetail: {
        pageTitle: 'FEEDBACK',
        managementTitle: 'FEEDBACK MANAGEMENT',
        loading: 'Loading...',
        checking: 'Checking...',
        feedbackNotFound: 'Feedback not found',
        cannotLoadFeedback: 'Cannot load feedback data',
        errorLoadingFeedback: 'An error occurred while loading feedback information. Please try again later.',
        tryAgain: 'Try Again',
        backToList: 'Back to List',
        brandLabel: 'Brand',
        branchLabel: 'Branch',
        tableLabel: 'Table',
        tableTypeLabel: 'Table Type',
        creatorTypeLabel: 'Creator Type',
        createdAtLabel: 'Created At',
        updatedAtLabel: 'Updated At',
        statusLabel: 'Status',
        contentLabel: 'Feedback Content',
        processingNoteLabel: 'Processing Note',
        processingHistoryLabel: 'Processing History',
        noProcessingHistory: 'No processing history',
        noProcessingHistoryDescription: 'Processing history will appear when someone updates the feedback',
        unknown: 'Unknown',
        guest: 'Guest',
        membership: 'Membership',
        pool8: 'Pool 8',
        carom: 'Carom',
        statusResolved: 'Resolved',
        statusManagerP: 'Manager Processing',
        statusAdminP: 'Admin Processing',
        statusSuperadminP: 'Super Admin Processing',
        statusUnknown: 'Unknown',
        adminProcessing: 'Admin Processing',
        superAdminProcessing: 'Super Admin Processing',
        resolved: 'Resolved',
        editPlaceholder: 'Enter processing note...',
        cancel: 'Cancel',
        back: 'Back',
        save: 'Save',
        edit: 'Edit',
        updateSuccess: 'Updated successfully',
        updateFailed: 'Update failed',
    },

    // Super Admin Home Page
    superAdminHome: {
        pageTitle: 'SUPER ADMIN DASHBOARD',
        adminListTitle: 'ADMIN LIST',
        feedbackListTitle: 'FEEDBACK LIST',
        approvalTab: 'Approval Requests',
        feedbackTab: 'Feedbacks',
        loading: 'Loading...',
        cannotLoadAdminList: 'Cannot load admin list',
        searchPlaceholder: 'Enter name or email...',
        allStatus: 'All',
        approvedStatus: 'Approved',
        pendingStatus: 'Pending',
        rejectedStatus: 'Rejected',
        statusApproved: 'Approved',
        statusPending: 'Pending',
        statusRejected: 'Rejected',
        noAdminsFound: 'No admins found',
        noAdminsFoundWithSearch: 'No matching admins found',
        tryDifferentKeywords: 'Try changing search keywords to find matching admins',
        useAddButton: 'Use the "Add Admin" button above to create the first admin',
        viewAll: 'View all',
        showingResults: 'Showing {start}-{end} of {total} admins',
        previous: 'Previous',
        next: 'Next',
        loadMore: 'Load more',
        noMoreAdmins: 'No more admins to load',
        table: {
            name: 'NAME',
            email: 'EMAIL',
            location: 'LOCATION',
            status: 'STATUS',
            createdAt: 'CREATED AT',
            clickToViewDetails: 'Click to view details',
        },
        // Feedback table translations
        feedbackSearchPlaceholder: 'Enter brand or branch...',
        feedbackAllStatus: 'All',
        feedbackPendingStatus: 'Pending',
        feedbackResolvedStatus: 'Resolved',
        feedbackBrandColumn: 'BRAND',
        feedbackBranchColumn: 'BRANCH',
        feedbackDateColumn: 'DATE',
        feedbackStatusColumn: 'STATUS',
        feedbackDateLabel: 'Date:',
        feedbackNoBranch: 'No branch yet',
        feedbackNoFeedbacksFound: 'No feedbacks found',
        feedbackClickToViewDetails: 'Click to view details →',
        feedbackShowingResults: 'Showing {start}-{end} of {total} feedbacks',
        feedbackStatusResolved: 'Resolved',
        feedbackStatusManagerP: 'Manager Processing',
        feedbackStatusAdminP: 'Admin Processing',
        feedbackStatusSuperadminP: 'Super Admin Processing',
        feedbackStatusUnknown: 'Unknown',
    },

    // Super Admin Login Page
    superAdminLogin: {
        pageTitle: 'Access ScoreLens for Super Admin',
        description: '',
        emailLabel: 'Enter Super Admin email',
        emailPlaceholder: 'ScoreLens',
        submitButton: 'Send',
        sending: 'Sending...',
        emailSentSuccess: 'Email sent successfully!',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        generalError: 'An error occurred. Please try again.',
    },

    // Super Admin Verification Page
    superAdminVerification: {
        pageTitle: 'Login Verification',
        description: 'Enter the OTP code sent to your email',
        otpRequired: 'Please enter all 6 digits',
        verificationSuccess: 'Verification successful!',
        verificationFailed: 'An error occurred. Please try again.',
        notReceivedCode: 'Did not receive the code?',
        resendCode: 'Resend code',
        resendTimer: 'Resend in',
        seconds: 's',
        resendSuccess: 'Verification code has been resent!',
        resendFailed: 'Failed to resend code.',
        submitButton: 'Send',
        sending: 'Sending...',
        backToHome: 'Back to home',
    },

    // Terms Page
    terms: {
        loading: 'Loading...',
        pageTitle: 'TERMS OF SERVICE',
        sections: {
            general: 'GENERAL TERMS',
            account: 'ACCOUNT & SECURITY',
            usage: 'SERVICE USAGE',
            privacy: 'PRIVACY & SECURITY',
            liability: 'LIABILITY & LIMITATIONS',
            termination: 'TERMINATION & CHANGES',
        },
        general: {
            title: 'Terms of Service - General Terms',
            acceptance: {
                title: '1. Acceptance of Terms',
                content: 'By accessing and using the ScoreLens system, you agree to comply with and be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use our service.',
            },
            serviceDescription: {
                title: '2. Service Description',
                content: 'ScoreLens is an automatic scoring management system for sports games, particularly billiards. The system uses AI technology and cameras to automatically track and record scores, providing accurate and convenient gaming experience.',
                features: [
                    'Automatic scoring through AI camera',
                    'Match and member management',
                    'Match history and statistics tracking',
                    'Notification and support system',
                ],
            },
            ageAndCapacity: {
                title: '3. Age and Capacity',
                content: 'You must be at least 18 years old or have parental/legal guardian consent to use the service. You must also have the legal capacity to enter into these agreements.',
            },
            termsChanges: {
                title: '4. Changes to Terms',
                content: 'We reserve the right to change these terms at any time. Changes will take effect immediately upon posting. Continued use of the service after changes constitutes acceptance of the new terms.',
            },
        },
        account: {
            title: 'Terms of Service - Account & Security',
            registration: {
                title: '1. Account Registration',
                content: 'To use the full features of the system, you need to create an account with accurate and updated information. You are responsible for maintaining the security of your login information.',
                requirements: [
                    'Provide accurate and complete information',
                    'Protect passwords and login information',
                    'Do not share account with others',
                    'Notify immediately when security breaches are detected',
                ],
            },
            verification: {
                title: '2. Verification and Security',
                content: 'The system may require verification via email or phone number. You agree to receive verification and security notifications through these channels.',
            },
            accountOwnership: {
                title: '3. Account Ownership',
                content: 'The created account is your personal property. However, we reserve the right to suspend or terminate the account if terms of service are violated.',
            },
            informationSecurity: {
                title: '4. Information Security',
                content: 'We are committed to protecting your personal information according to the highest security standards. However, no system is completely secure, and you also need to implement basic security measures.',
            },
        },
        usage: {
            title: 'Terms of Service - Service Usage',
            legalUse: {
                title: '1. Legal Use',
                content: 'You may only use the service for lawful purposes and in accordance with these terms. Using the service to conduct illegal or harmful activities is strictly prohibited.',
            },
            prohibitedBehavior: {
                title: '2. Prohibited Behavior',
                content: 'The following behaviors are strictly prohibited when using the service:',
                items: [
                    'Cheating or intentionally distorting match results',
                    'Harassing or threatening other players',
                    'Using external software or tools to interfere with the system',
                    'Distributing inappropriate or harmful content',
                    'Violating intellectual property rights',
                ],
            },
            cameraSystem: {
                title: '3. Camera System Usage',
                content: 'The system uses AI cameras for automatic scoring. You agree to:',
                items: [
                    'Allow cameras to record in the gaming area',
                    'Not intentionally obstruct or interfere with cameras',
                    'Accept that scoring may have minor errors',
                    'Report issues if serious errors are detected',
                ],
            },
            userContent: {
                title: '4. User Content',
                content: 'You are responsible for all content you create, upload, or share through the service. We reserve the right to remove violating content without prior notice.',
            },
        },
        privacy: {
            title: 'Terms of Service - Privacy & Security',
            informationCollection: {
                title: '1. Information Collection',
                content: 'We collect the following types of information to provide and improve our service:',
                items: [
                    'Personal information: name, email, phone number',
                    'Account information: username, password',
                    'Usage data: match history, statistics',
                    'Technical data: IP address, device, browser',
                ],
            },
            informationUse: {
                title: '2. Information Use',
                content: 'Collected information is used to:',
                items: [
                    'Provide and maintain service',
                    'Improve user experience',
                    'Send notifications and updates',
                    'Process support requests',
                    'Analyze and research',
                ],
            },
            informationSharing: {
                title: '3. Information Sharing',
                content: 'We do not sell, exchange, or transfer your personal information to third parties, except when:',
                items: [
                    'We have your explicit consent',
                    'To comply with legal requirements',
                    'To protect our rights and property',
                    'With trusted partners to provide service',
                ],
            },
            informationProtection: {
                title: '4. Information Protection',
                content: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
            },
        },
        liability: {
            title: 'Terms of Service - Liability & Limitations',
            liabilityLimitation: {
                title: '1. Liability Limitation',
                content: 'To the maximum extent permitted by law, ScoreLens and our partners will not be liable for:',
                items: [
                    'Indirect, incidental, or consequential damages',
                    'Loss of data or information',
                    'Unintended service interruptions',
                    'Damages from misuse',
                ],
            },
            serviceAccuracy: {
                title: '2. Service Accuracy',
                content: 'Although we strive to provide accurate and reliable service, we cannot guarantee that the service will be completely error-free or uninterrupted. You accept the risk when using the service.',
            },
            userResponsibility: {
                title: '3. User Responsibility',
                content: 'You are responsible for:',
                items: [
                    'Using the service safely and legally',
                    'Protecting your account information',
                    'Not using the service to harm others',
                    'Complying with all applicable regulations and laws',
                ],
            },
            indemnification: {
                title: '4. Indemnification',
                content: 'You agree to indemnify and hold ScoreLens harmless from any claims, damages, or costs arising from violation of these terms.',
            },
        },
        termination: {
            title: 'Terms of Service - Termination & Changes',
            serviceTermination: {
                title: '1. Service Termination',
                content: 'We reserve the right to terminate or suspend your access to the service at any time, for any reason, including but not limited to violation of these terms.',
            },
            terminationConsequences: {
                title: '2. Consequences of Termination',
                content: 'When service is terminated:',
                items: [
                    'Account access will be revoked immediately',
                    'All data and content may be permanently deleted',
                    'No refunds will be provided',
                    'These terms remain effective after termination',
                ],
            },
            serviceChanges: {
                title: '3. Service Changes',
                content: 'We reserve the right to change, suspend, or terminate the service at any time. We will provide advance notice of important changes when possible.',
            },
            applicableLaw: {
                title: '4. Applicable Law',
                content: 'These terms are governed by and construed in accordance with Vietnamese law. Any disputes arising from the use of the service will be resolved in courts with jurisdiction in Vietnam.',
            },
            contact: {
                title: '5. Contact',
                content: 'If you have any questions about these terms, please contact us via:',
                items: [
                    'Email: scorelensbillards@gmail.com',
                    'Phone: +84 357 859 348',
                    'Address: FPT University Quy Nhơn',
                ],
            },
        },
    },

    // AI Selection Component
    aiSelection: {
        title: 'Choose AI Feature',
        description: 'Do you want to use AI in the match?',
        withAi: {
            title: 'Use AI',
            description: 'AI will help calculate match scores'
        },
        withoutAi: {
            title: 'Don\'t use AI',
            description: 'Only use basic match features'
        },
        cancel: 'Cancel',
        createMatch: 'Create Match',
        creating: 'Creating...'
    },

    // Table Card Component
    tableCard: {
        status: {
            using: 'In Use',
            usingWithAi: 'In Use - AI',
            available: 'Available',
            maintenance: 'Maintenance'
        },
        type: {
            pool8: 'Pool Billiards',
            carom: 'Carom Billiards'
        },
        creator: {
            label: 'Creator:',
            manager: 'Manager',
            member: 'Member',
            guest: 'Guest'
        },
        team: {
            teamA: 'Team A',
            teamB: 'Team B',
            vs: 'VS'
        },
        button: {
            viewDetails: 'View Details',
            ready: 'Ready',
            maintenance: 'Maintenance'
        }
    },

    // Scoreboard Page
    scoreboard: {
        title: 'TABLE',
        pool8: 'POOL 8',
        loading: 'LOADING...',
        scoreboard: 'SCOREBOARD',
        joinCode: 'Join Code',
        teamA: 'Team A',
        teamB: 'Team B',
        vs: 'VS',
        noMembers: 'No members yet',
        playerPlaceholder: 'Player {index}',
        host: 'Host',
        member: 'Member',
        quickActions: 'Quick Actions',
        plus1TeamA: '+1 Team A',
        plus1TeamB: '+1 Team B',
        minus1TeamA: '-1 Team A',
        minus1TeamB: '-1 Team B',
        edit: 'Edit',
        end: 'End',
        hideCamera: 'Hide Camera',
        showCamera: 'Show Camera',
        aiResults: 'AI Results',
        cameraRestoring: 'Restoring camera information...',
        connectingCamera: 'Connecting camera...',
        cameraError: 'Camera connection error',
        viewers: 'viewers',
        peopleWatching: 'people watching',
        error: {
            noCameraInfo: 'No camera information',
            cameraNotConnected: 'Camera not connected',
            cannotStartStream: 'Cannot start video stream',
            streamError: 'Error starting video stream',
            unknownError: 'Unknown error',
            cannotLoadMatch: 'Cannot load match information',
            cannotLoadTable: 'Cannot load table information',
            noMatchInfo: 'No match information found',
            noEditPermission: 'You do not have edit permission',
            noValidSessionToken: 'Please provide a valid sessionToken',
            updateScoreFailed: 'Score update failed',
            updateTeamAFailed: 'Failed to update Team A score',
            updateTeamBFailed: 'Failed to update Team B score',
            cannotSyncSession: 'Cannot sync session',
            cannotGetNewSession: 'Cannot get new session',
            cannotDetermineUser: 'Cannot determine user to get session',
            noMatchIdToSync: 'No matchId to sync',
            cannotEndMatch: 'Cannot end match. Please try again.',
            cannotAuthenticateEndMatch: 'Cannot authenticate user to end match',
            noEditPermissionForMembers: 'You do not have permission to edit',
            cannotDetermineClub: 'Cannot determine club to edit members'
        },
        success: {
            streamStarted: 'Video stream started',
            joinedStream: 'Joined current stream',
            sessionSynced: 'Session synchronized',
            scoreUpdated: 'Score updated successfully'
        }
    },

} as const;
