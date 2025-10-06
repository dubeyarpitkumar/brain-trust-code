import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Auth
      auth: {
        signIn: "Sign In",
        signUp: "Sign Up",
        forgotPassword: "Forgot Password?",
        resetPassword: "Reset Password",
        sendResetLink: "Send Reset Link",
        backToLogin: "Back to Login",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        logout: "Logout",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        welcome: "Welcome to TaskMaster",
        subtitle: "Organize your life, one task at a time",
      },

      // Validation
      validation: {
        emailRequired: "Email is required",
        emailInvalid: "Invalid email address",
        passwordRequired: "Password is required",
        passwordMin: "Password must be at least 8 characters",
        passwordUppercase: "Password must contain at least one uppercase letter",
        passwordLowercase: "Password must contain at least one lowercase letter",
        passwordNumber: "Password must contain at least one number",
        passwordSpecial: "Password must contain at least one special character",
        passwordMatch: "Passwords must match",
      },

      // Supabase Error Messages
      errors: {
        "Invalid login credentials": "Invalid email or password",
        "User already registered": "This email is already registered",
        "Email not confirmed": "Please confirm your email address",
        "Password should be at least 6 characters":
          "Password must be at least 6 characters",
        "Unable to validate email address: invalid format":
          "Invalid email format",
        "User not found": "User not found",
        "Network request failed": "Network error. Please check your connection",
        "Failed to fetch": "Network error. Please try again",
        "Signup requires a valid password": "Please enter a valid password",
        "Invalid email or password": "Invalid email or password",
        genericError: "An error occurred. Please try again.",
      },

      // Dashboard
      dashboard: {
        title: "Dashboard",
        totalTasks: "Total Tasks",
        completedTasks: "Completed",
        pendingTasks: "Pending",
        completionRate: "Completion Rate",
      },

      // Tasks
      tasks: {
        myTasks: "My Tasks",
        addTask: "Add Task",
        title: "Title",
        notes: "Notes",
        status: "Status",
        all: "All",
        completed: "Completed",
        pending: "Pending",
        search: "Search tasks...",
        readMore: "Read More",
        readLess: "Read Less",
        edit: "Edit",
        delete: "Delete",
        markComplete: "Mark Complete",
        markPending: "Mark Pending",
        noTasks: "No tasks yet",
        noTasksDesc: "Get started by creating your first task!",
        sortLatest: "Latest First",
        sortOldest: "Oldest First",
      },

      // Task Form
      taskForm: {
        createTask: "Create Task",
        editTask: "Edit Task",
        titlePlaceholder: "Enter task title...",
        notesPlaceholder: "Add notes (optional)...",
        cancel: "Cancel",
        save: "Save",
        create: "Create",
      },

      // AI Generator
      ai: {
        title: "AI Task Generator",
        description: "Enter your goal and let AI suggest tasks to help you achieve it",
        goalPlaceholder: "e.g., Get fit, Plan a wedding, Learn coding...",
        generate: "Generate",
        generating: "Generating...",
        saveToTasks: "Save to My Tasks",
        saving: "Saving...",
        enterGoal: "Please enter a goal",
        tasksGenerated: "Generated {{count}} tasks!",
        taskSaved: "Task saved successfully!",
        saveFailed: "Failed to save task",
      },

      // Messages
      messages: {
        taskCreated: "Task created successfully!",
        taskUpdated: "Task updated successfully!",
        taskDeleted: "Task deleted successfully!",
        loginSuccess: "Welcome back!",
        signupSuccess: "Account created successfully!",
        logoutSuccess: "Logged out successfully!",
        resetLinkSent: "Password reset link sent to your email!",
        error: "An error occurred. Please try again.",
      },

      // Common
      common: {
        loading: "Loading...",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        close: "Close",
        confirm: "Confirm",
        theme: "Theme",
        language: "Language",
        settings: "Settings",
        create: "Create",
        update: "Update",
      },
    },
  },
  hi: {
    translation: {
      // Auth
      auth: {
        signIn: "साइन इन करें",
        signUp: "साइन अप करें",
        forgotPassword: "पासवर्ड भूल गए?",
        resetPassword: "पासवर्ड रीसेट करें",
        sendResetLink: "रीसेट लिंक भेजें",
        backToLogin: "लॉगिन पर वापस जाएं",
        email: "ईमेल",
        password: "पासवर्ड",
        confirmPassword: "पासवर्ड की पुष्टि करें",
        logout: "लॉगआउट",
        noAccount: "खाता नहीं है?",
        haveAccount: "पहले से खाता है?",
        welcome: "टास्कमास्टर में आपका स्वागत है",
        subtitle: "अपने जीवन को व्यवस्थित करें, एक समय में एक कार्य",
      },

      // Validation
      validation: {
        emailRequired: "ईमेल आवश्यक है",
        emailInvalid: "अमान्य ईमेल पता",
        passwordRequired: "पासवर्ड आवश्यक है",
        passwordMin: "पासवर्ड कम से कम 8 अक्षर का होना चाहिए",
        passwordUppercase: "पासवर्ड में कम से कम एक बड़ा अक्षर होना चाहिए",
        passwordLowercase: "पासवर्ड में कम से कम एक छोटा अक्षर होना चाहिए",
        passwordNumber: "पासवर्ड में कम से कम एक संख्या होनी चाहिए",
        passwordSpecial: "पासवर्ड में कम से कम एक विशेष वर्ण होना चाहिए",
        passwordMatch: "पासवर्ड मेल खाने चाहिए",
      },

      // Supabase Error Messages
      errors: {
        "Invalid login credentials": "अमान्य ईमेल या पासवर्ड",
        "User already registered": "यह ईमेल पहले से पंजीकृत है",
        "Email not confirmed": "कृपया अपने ईमेल पते की पुष्टि करें",
        "Password should be at least 6 characters":
          "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
        "Unable to validate email address: invalid format": "अमान्य ईमेल प्रारूप",
        "User not found": "उपयोगकर्ता नहीं मिला",
        "Network request failed": "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें",
        "Failed to fetch": "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें",
        "Signup requires a valid password": "कृपया एक मान्य पासवर्ड दर्ज करें",
        "Invalid email or password": "अमान्य ईमेल या पासवर्ड",
        genericError: "एक त्रुटि हुई। कृपया पुन: प्रयास करें।",
      },

      // Dashboard
      dashboard: {
        title: "डैशबोर्ड",
        totalTasks: "कुल कार्य",
        completedTasks: "पूर्ण",
        pendingTasks: "लंबित",
        completionRate: "पूर्णता दर",
      },

      // Tasks
      tasks: {
        myTasks: "मेरे कार्य",
        addTask: "कार्य जोड़ें",
        title: "शीर्षक",
        notes: "नोट्स",
        status: "स्थिति",
        all: "सभी",
        completed: "पूर्ण",
        pending: "लंबित",
        search: "कार्य खोजें...",
        readMore: "और पढ़ें",
        readLess: "कम पढ़ें",
        edit: "संपादित करें",
        delete: "हटाएं",
        markComplete: "पूर्ण के रूप में चिह्नित करें",
        markPending: "लंबित के रूप में चिह्नित करें",
        noTasks: "अभी तक कोई कार्य नहीं",
        noTasksDesc: "अपना पहला कार्य बनाकर शुरू करें!",
        sortLatest: "नवीनतम पहले",
        sortOldest: "सबसे पुराना पहले",
      },

      // Task Form
      taskForm: {
        createTask: "कार्य बनाएं",
        editTask: "कार्य संपादित करें",
        titlePlaceholder: "कार्य शीर्षक दर्ज करें...",
        notesPlaceholder: "नोट्स जोड़ें (वैकल्पिक)...",
        cancel: "रद्द करें",
        save: "सहेजें",
        create: "बनाएं",
      },

      // AI Generator
      ai: {
        title: "AI कार्य जनरेटर",
        description:
          "अपना लक्ष्य दर्ज करें और AI को इसे प्राप्त करने में मदद के लिए कार्य सुझाने दें",
        goalPlaceholder: "उदा: फिट रहें, शादी की योजना बनाएं, कोडिंग सीखें...",
        generate: "जनरेट करें",
        generating: "जनरेट हो रहा है...",
        saveToTasks: "मेरे कार्यों में सहेजें",
        saving: "सहेजा जा रहा है...",
        enterGoal: "कृपया एक लक्ष्य दर्ज करें",
        tasksGenerated: "{{count}} कार्य जनरेट किए गए!",
        taskSaved: "कार्य सफलतापूर्वक सहेजा गया!",
        saveFailed: "कार्य सहेजने में विफल",
      },

      // Messages
      messages: {
        taskCreated: "कार्य सफलतापूर्वक बनाया गया!",
        taskUpdated: "कार्य सफलतापूर्वक अपडेट किया गया!",
        taskDeleted: "कार्य सफलतापूर्वक हटाया गया!",
        loginSuccess: "वापस स्वागत है!",
        signupSuccess: "खाता सफलतापूर्वक बनाया गया!",
        logoutSuccess: "सफलतापूर्वक लॉगआउट किया गया!",
        resetLinkSent: "आपके ईमेल पर पासवर्ड रीसेट लिंक भेजा गया!",
        error: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
      },

      // Common
      common: {
        loading: "लोड हो रहा है...",
        save: "सहेजें",
        cancel: "रद्द करें",
        delete: "हटाएं",
        edit: "संपादित करें",
        close: "बंद करें",
        confirm: "पुष्टि करें",
        theme: "थीम",
        language: "भाषा",
        settings: "सेटिंग्स",
        create: "बनाएं",
        update: "अपडेट करें",
      },
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
