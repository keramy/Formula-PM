on report module when you add line description and images it should have a button save and next line .there is a add new line and next line button here. so next line button is useless.
report editor only saving the images to the last created line.
remove capture with metadata feature. we can only have showing a pin on a project layout. This is future implementation.
remove autogenerate future.
make exported pdf using real data to its belonging project.
Enchance the export pdfs format 
Plan: Reports Module Improvements & Common Issues                                                                                                                                   │ │
│ │                                                                                                                                                                                     │ │
│ │ Issue: The reportmodulefeedbacks.md file is empty, but I can identify several common areas for improvement in reports modules.                                                      │ │
│ │                                                                                                                                                                                     │ │
│ │ Proposed Improvements Based on Common Feedback Areas:                                                                                                                               │ │
│ │                                                                                                                                                                                     │ │
│ │ 1. User Experience & Navigation                                                                                                                                                     │ │
│ │                                                                                                                                                                                     │ │
│ │ - Better Back Navigation: Ensure smooth navigation between reports list and editor                                                                                                  │ │
│ │ - Loading States: Add better loading indicators during report operations                                                                                                            │ │
│ │ - Error Handling: Improve error messages and user feedback                                                                                                                          │ │
│ │ - Responsive Design: Ensure mobile-friendly layout                                                                                                                                  │ │
│ │                                                                                                                                                                                     │ │
│ │ 2. Report Editor Enhancements                                                                                                                                                       │ │
│ │                                                                                                                                                                                     │ │
│ │ - Auto-Save: Implement periodic auto-save to prevent data loss                                                                                                                      │ │
│ │ - Progress Indicators: Show save status and completion progress                                                                                                                     │ │
│ │ - Undo/Redo: Add undo functionality for line editing                                                                                                                                │ │
│ │ - Keyboard Shortcuts: Add common shortcuts (Ctrl+S for save, etc.)                                                                                                                  │ │
│ │                                                                                                                                                                                     │ │
│ │ 3. Performance Optimizations                                                                                                                                                        │ │
│ │                                                                                                                                                                                     │ │
│ │ - Lazy Loading: Ensure components load efficiently                                                                                                                                  │ │
│ │ - Image Optimization: Optimize image upload and preview                                                                                                                             │ │
│ │ - Memory Management: Prevent memory leaks in editor                                                                                                                                 │ │
│ │ - Bundle Size: Check for unnecessary dependencies                                                                                                                                   │ │
│ │                                                                                                                                                                                     │ │
│ │ 4. Data Validation & Error Prevention                                                                                                                                               │ │
│ │                                                                                                                                                                                     │ │
│ │ - Form Validation: Ensure required fields are validated                                                                                                                             │ │
│ │ - Image Size Limits: Prevent oversized image uploads                                                                                                                                │ │
│ │ - Report Title Validation: Ensure unique and valid report titles                                                                                                                    │ │
│ │ - Project Data Validation: Handle missing project data gracefully                                                                                                                   │ │
│ │                                                                                                                                                                                     │ │
│ │ 5. Integration & Compatibility                                                                                                                                                      │ │
│ │                                                                                                                                                                                     │ │
│ │ - Project Integration: Ensure seamless integration with project pages                                                                                                               │ │
│ │ - User Permissions: Verify role-based access works correctly                                                                                                                        │ │
│ │ - API Error Handling: Handle network failures gracefully                                                                                                                            │ │
│ │ - Cross-Browser Testing: Ensure compatibility                                                                                                                                       │ │
│ │                                                                                                                                                                                     │ │
│ │ 6. Export & Publishing                                                                                                                                                              │ │
│ │                                                                                                                                                                                     │ │
│ │ - PDF Quality: Ensure high-quality PDF exports                                                                                                                                      │ │
│ │ - Export Options: Add more format options if needed                                                                                                                                 │ │
│ │ - Publishing Workflow: Streamline report approval process                                                                                                                           │ │
│ │ - Email Integration: Consider adding email sharing                                                                                                                                  │ │
│ │                                                                                                                                                                                     │ │
│ │ Immediate Actions to Take:                                                                                                                                                          │ │
│ │                                                                                                                                                                                     │ │
│ │ 1. Code Review: Check for console errors and warnings                                                                                                                               │ │
│ │ 2. Performance Check: Verify loading times and responsiveness                                                                                                                       │ │
│ │ 3. User Flow Testing: Test complete report creation workflow                                                                                                                        │ │
│ │ 4. Error Scenarios: Test edge cases and error conditions                                                                                                                            │ │
│ │ 5. Mobile Testing: Ensure mobile usability                                                                                                                                          │ │
│ │ 6. Integration Testing: Verify project page integration works 