Error: TypeError: Cannot read properties of undefined (reading 'name')

Component Stack:
    at ScopeTab (http://localhost:3003/src/features/projects/components/EnhancedProjectDetailPage.jsx?t=1751370884950:789:21)
    at div
    at http://localhost:3003/.vite/deps/chunk-KPOJAITF.js?v=ed0da442:1460:49
    at Box (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3501:19)
    at div
    at TabPanel (http://localhost:3003/src/features/projects/components/EnhancedProjectDetailPage.jsx?t=1751370884950:138:18)
    at div
    at http://localhost:3003/.vite/deps/chunk-KPOJAITF.js?v=ed0da442:1460:49
    at Box (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3501:19)
    at div
    at http://localhost:3003/.vite/deps/chunk-KPOJAITF.js?v=ed0da442:1460:49
    at Box (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3501:19)
    at div
    at http://localhost:3003/.vite/deps/chunk-KPOJAITF.js?v=ed0da442:1460:49
    at Box (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3501:19)
    at CleanPageLayout (http://localhost:3003/src/components/layout/CleanPageLayout.jsx?t=1751364649630:23:3)
    at EnhancedProjectDetailPage (http://localhost:3003/src/features/projects/components/EnhancedProjectDetailPage.jsx?t=1751370884950:1558:25)
    at Suspense
    at RouteErrorBoundary (http://localhost:3003/src/components/common/RouteErrorBoundary.jsx:47:5)
    at PageWrapper (http://localhost:3003/src/router/AppRouter.jsx?t=1751370884950:129:24)
    at RenderedRoute (http://localhost:3003/.vite/deps/react-router-dom.js?v=ed0da442:4267:5)
    at Outlet (http://localhost:3003/.vite/deps/react-router-dom.js?v=ed0da442:4664:26)
    at div
    at http://localhost:3003/.vite/deps/chunk-KPOJAITF.js?v=ed0da442:1460:49
    at Container (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:4884:19)
    at div
    at http://localhost:3003/.vite/deps/chunk-KPOJAITF.js?v=ed0da442:1460:49
    at Box (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3501:19)
    at div
    at http://localhost:3003/.vite/deps/chunk-KPOJAITF.js?v=ed0da442:1460:49
    at Box (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3501:19)
    at ModernDashboardLayout (http://localhost:3003/src/components/layout/ModernDashboardLayout.jsx?t=1751370317029:25:34)
    at RouteErrorBoundary (http://localhost:3003/src/components/common/RouteErrorBoundary.jsx:47:5)
    at ProtectedRoute (http://localhost:3003/src/components/auth/ProtectedRoute.jsx:22:27)
    at RenderedRoute (http://localhost:3003/.vite/deps/react-router-dom.js?v=ed0da442:4267:5)
    at Routes (http://localhost:3003/.vite/deps/react-router-dom.js?v=ed0da442:4731:5)
    at Suspense
    at AppRouter
    at DataProvider (http://localhost:3003/src/context/DataContext.jsx:20:32)
    at DataErrorBoundary (http://localhost:3003/src/components/common/DataErrorBoundary.jsx:35:5)
    at AppWithProviders (http://localhost:3003/src/app/App.jsx?t=1751370884950:56:7)
    at NavigationProvider (http://localhost:3003/src/context/NavigationContext.jsx:29:38)
    at NotificationProvider (http://localhost:3003/src/context/NotificationContext.jsx:30:40)
    at AuthProvider (http://localhost:3003/src/context/AuthContext.jsx:52:32)
    at DefaultPropsProvider (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3895:3)
    at RtlProvider (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3872:5)
    at ThemeProvider (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3823:5)
    at ThemeProvider (http://localhost:3003/.vite/deps/chunk-CEFE34AL.js?v=ed0da442:3977:5)
    at ThemeProvider (http://localhost:3003/.vite/deps/chunk-IT4HNIMO.js?v=ed0da442:2242:12)
    at ThemeProvider (http://localhost:3003/src/context/ThemeContext.jsx:31:33)
    at Router (http://localhost:3003/.vite/deps/react-router-dom.js?v=ed0da442:4673:15)
    at BrowserRouter (http://localhost:3003/.vite/deps/react-router-dom.js?v=ed0da442:5451:5)
    at QueryClientProvider (http://localhost:3003/.vite/deps/chunk-TCIMFCVQ.js?v=ed0da442:2922:3)
    at AppProviders (http://localhost:3003/src/components/providers/AppProviders.jsx:38:25)
    at ErrorBoundary (http://localhost:3003/src/components/common/ErrorBoundary.jsx:35:5)
    at App

Stack Trace:TypeError: Cannot read properties of undefined (reading 'name')
    at ScopeTab (http://localhost:3003/src/features/projects/components/EnhancedProjectDetailPage.jsx?t=1751370884950:804:35)
    at renderWithHooks (http://localhost:3003/.vite/deps/chunk-SP2UK2M6.js?v=ed0da442:12152:26)
    at mountIndeterminateComponent (http://localhost:3003/.vite/deps/chunk-SP2UK2M6.js?v=ed0da442:15647:21)
    at beginWork (http://localhost:3003/.vite/deps/chunk-SP2UK2M6.js?v=ed0da442:16670:22)
    at beginWork$1 (http://localhost:3003/.vite/deps/chunk-SP2UK2M6.js?v=ed0da442:20639:22)
    at performUnitOfWork (http://localhost:3003/.vite/deps/chunk-SP2UK2M6.js?v=ed0da442:20062:20)
    at workLoopSync (http://localhost:3003/.vite/deps/chunk-SP2UK2M6.js?v=ed0da442:19998:13)
    at renderRootSync (http://localhost:3003/.vite/deps/chunk-SP2UK2M6.js?v=ed0da442:19976:15)
    at recoverFromConcurrentError (http://localhost:3003/.vite/deps/chunk-SP2UK2M6.js?v=ed0da442:19573:28)
    at performSyncWorkOnRoot (http://localhost:3003/.vite/deps/chunk-SP2UK2M6.js?v=ed0da442:19721:28)