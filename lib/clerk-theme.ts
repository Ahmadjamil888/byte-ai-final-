import { dark } from '@clerk/themes';

export const clerkTheme = {
  ...dark,
  elements: {
    ...dark.elements,
    // Main container
    card: "bg-gray-900 border border-gray-700 shadow-2xl",
    headerTitle: "text-white font-semibold text-xl",
    headerSubtitle: "text-gray-400",
    
    // Form elements
    formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl",
    formFieldInput: "bg-gray-800 border border-gray-600 text-white rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200",
    formFieldLabel: "text-gray-300 font-medium",
    
    // Links and text
    formFieldAction: "text-orange-400 hover:text-orange-300 transition-colors duration-200",
    identityPreviewText: "text-gray-300",
    identityPreviewEditButton: "text-orange-400 hover:text-orange-300",
    
    // Social buttons
    socialButtonsBlockButton: "bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200 rounded-lg",
    socialButtonsBlockButtonText: "text-white font-medium",
    
    // Footer
    footerActionText: "text-gray-400",
    footerActionLink: "text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200",
    
    // Divider
    dividerLine: "bg-gray-700",
    dividerText: "text-gray-500",
    
    // Alert/Error messages
    alertText: "text-red-400",
    formFieldErrorText: "text-red-400 text-sm",
    
    // Loading states
    spinner: "text-orange-500",
    
    // Modal/Overlay
    modalBackdrop: "bg-black/50 backdrop-blur-sm",
    modalContent: "bg-gray-900 border border-gray-700 rounded-lg shadow-2xl",
    
    // User button (profile dropdown)
    userButtonBox: "bg-gray-800 border border-gray-600 rounded-lg shadow-lg",
    userButtonTrigger: "hover:bg-gray-700 transition-colors duration-200 rounded-lg",
    
    // Navbar (if using Clerk's navbar)
    navbar: "bg-gray-900 border-b border-gray-700",
    navbarButton: "text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200 rounded-lg",
    
    // Breadcrumbs
    breadcrumbsItem: "text-gray-400",
    breadcrumbsItemDivider: "text-gray-600",
    
    // Profile page elements
    profileSectionTitle: "text-white font-semibold",
    profileSectionContent: "text-gray-300",
    
    // Organization elements (if using organizations)
    organizationSwitcherTrigger: "bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200 rounded-lg",
    
    // Subscription/Billing elements
    subscriptionPlanBox: "bg-gray-800 border border-gray-600 rounded-lg p-4 hover:border-orange-500/50 transition-colors duration-200",
    subscriptionPlanTitle: "text-white font-semibold",
    subscriptionPlanDescription: "text-gray-400",
    subscriptionPlanPrice: "text-orange-400 font-bold",
    
    // Custom classes for our theme
    rootBox: "font-sans",
    
    // Override any default styling that doesn't match our theme
    formFieldInputShowPasswordButton: "text-gray-400 hover:text-white transition-colors duration-200",
    formFieldInputShowPasswordIcon: "text-gray-400",
    
    // Tabs (if using tabbed interface)
    tabButton: "text-gray-400 hover:text-white border-b-2 border-transparent hover:border-orange-500 transition-all duration-200",
    tabButtonActive: "text-orange-400 border-b-2 border-orange-500",
    
    // Badge elements
    badge: "bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full px-2 py-1 text-xs font-medium",
    
    // Menu items
    menuItem: "text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200 rounded-lg px-3 py-2",
    menuItemActive: "text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2",
  },
  
  // Layout customizations
  layout: {
    logoImageUrl: undefined, // Use default or set custom logo
    logoLinkUrl: "/",
    showOptionalFields: true,
    socialButtonsPlacement: "bottom" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  
  // Variables for consistent theming
  variables: {
    colorPrimary: "#f97316", // Orange-500
    colorDanger: "#ef4444", // Red-500
    colorSuccess: "#22c55e", // Green-500
    colorWarning: "#eab308", // Yellow-500
    colorNeutral: "#6b7280", // Gray-500
    
    // Background colors
    colorBackground: "#111827", // Gray-900
    colorInputBackground: "#1f2937", // Gray-800
    
    // Text colors
    colorText: "#ffffff",
    colorTextSecondary: "#9ca3af", // Gray-400
    
    // Border colors
    colorBorder: "#374151", // Gray-700
    
    // Spacing
    spacingUnit: "1rem",
    borderRadius: "0.5rem",
    
    // Font
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "0.875rem",
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
};