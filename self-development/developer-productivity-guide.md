# Developer Productivity Guide for Formula PM

## 📝 **VS Code Setup for Maximum Productivity**

### **1. Essential VS Code Extensions**

**Must-Have Extensions for React Development:**

```json
{
  "recommendations": [
    // React Development
    "dsznajder.es7-react-js-snippets",       // React snippets
    "burkeholland.simple-react-snippets",     // More React snippets
    "rodrigovallades.es7-react-js-snippets",  // ES7+ snippets
    
    // Code Quality
    "dbaeumer.vscode-eslint",                // ESLint integration
    "esbenp.prettier-vscode",                // Prettier formatting
    "streetsidesoftware.code-spell-checker",  // Spell checker
    
    // Productivity Boosters
    "formulahendry.auto-rename-tag",         // Auto rename HTML/JSX tags
    "formulahendry.auto-close-tag",          // Auto close tags
    "naumovs.color-highlight",               // Highlight colors
    "coenraads.bracket-pair-colorizer-2",    // Colored brackets
    "oderwat.indent-rainbow",                // Indent guides
    "usernamehw.errorlens",                  // See errors inline
    
    // Git Integration
    "eamodio.gitlens",                       // Git supercharged
    "mhutchie.git-graph",                    // Git graph visualization
    
    // Development Tools
    "ritwickdey.liveserver",                 // Live server
    "rangav.vscode-thunder-client",          // API testing
    "christian-kohler.path-intellisense",    // Path autocomplete
    "christian-kohler.npm-intellisense",     // NPM autocomplete
    
    // Database
    "cweijan.vscode-postgresql-client2",     // PostgreSQL client
    "mtxr.sqltools",                         // SQL tools
    
    // AI Assistance (Optional)
    "github.copilot",                        // GitHub Copilot
    "tabnine.tabnine-vscode"                // TabNine AI
  ]
}
```

### **2. VS Code Settings Configuration**

Create/update `.vscode/settings.json` in your project root:

```json
{
  // Auto-format on save
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  
  // Prettier as default formatter
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  // File associations
  "files.associations": {
    "*.js": "javascriptreact"
  },
  
  // Emmet for JSX
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "emmet.triggerExpansionOnTab": true,
  
  // Auto-save
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  
  // Terminal
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  
  // Hide files you don't need to see
  "files.exclude": {
    "**/node_modules": true,
    "**/build": true,
    "**/.git": true
  },
  
  // Bracket pair colorization
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  
  // Better IntelliSense
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  
  // Error lens - see errors inline
  "errorLens.enabled": true,
  "errorLens.fontStyle": "italic",
  
  // Minimap
  "editor.minimap.enabled": true,
  "editor.minimap.maxColumn": 120,
  
  // Font and appearance
  "editor.fontSize": 14,
  "editor.lineHeight": 22,
  "editor.fontLigatures": true,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', Consolas, monospace",
  
  // Cursor
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": true
}
```

### **3. Custom Keyboard Shortcuts**

Add to your `keybindings.json` (File > Preferences > Keyboard Shortcuts > Open Keyboard Shortcuts JSON):

```json
[
  // Quick console.log
  {
    "key": "ctrl+shift+l",
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus",
    "args": {
      "snippet": "console.log('$1', $1)$0"
    }
  },
  
  // Wrap in JSX element
  {
    "key": "ctrl+shift+w",
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus && editorLangId == javascriptreact",
    "args": {
      "snippet": "<${1:div}>\n\t$TM_SELECTED_TEXT\n</${1}>"
    }
  },
  
  // Quick React component
  {
    "key": "ctrl+shift+r",
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus",
    "args": {
      "snippet": "const ${1:ComponentName} = () => {\n\treturn (\n\t\t<div>\n\t\t\t$0\n\t\t</div>\n\t);\n};\n\nexport default ${1};"
    }
  },
  
  // Quick useState
  {
    "key": "ctrl+shift+s",
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus",
    "args": {
      "snippet": "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});"
    }
  },
  
  // Quick useEffect
  {
    "key": "ctrl+shift+e",
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus",
    "args": {
      "snippet": "useEffect(() => {\n\t$0\n}, [${1:dependencies}]);"
    }
  }
]
```

### **4. Custom Snippets**

Create custom snippets for Formula PM (File > Preferences > User Snippets > javascriptreact.json):

```json
{
  "Formula Component": {
    "prefix": "fcomp",
    "body": [
      "import React, { useState, useEffect } from 'react';",
      "import { Box, Typography } from '@mui/material';",
      "",
      "const ${1:ComponentName} = ({ ${2:props} }) => {",
      "  const [${3:state}, set${3/(.*)/${1:/capitalize}/}] = useState(${4:null});",
      "",
      "  useEffect(() => {",
      "    ${5:// Effect code}",
      "  }, []);",
      "",
      "  return (",
      "    <Box>",
      "      <Typography variant=\"h6\">${6:Title}</Typography>",
      "      $0",
      "    </Box>",
      "  );",
      "};",
      "",
      "export default ${1};"
    ]
  },
  
  "API Call": {
    "prefix": "fapi",
    "body": [
      "const fetch${1:Data} = async () => {",
      "  try {",
      "    setLoading(true);",
      "    const response = await apiService.${2:get}('${3:endpoint}');",
      "    set${4:Data}(response.data);",
      "  } catch (error) {",
      "    console.error('Error fetching ${1}:', error);",
      "    setError(error.message);",
      "  } finally {",
      "    setLoading(false);",
      "  }",
      "};"
    ]
  },
  
  "Material UI Form": {
    "prefix": "fform",
    "body": [
      "<Box component=\"form\" onSubmit={handleSubmit} sx={{ mt: 2 }}>",
      "  <TextField",
      "    fullWidth",
      "    label=\"${1:Label}\"",
      "    name=\"${2:name}\"",
      "    value={formData.${2}}",
      "    onChange={handleChange}",
      "    margin=\"normal\"",
      "    required",
      "  />",
      "  <Button",
      "    type=\"submit\"",
      "    fullWidth",
      "    variant=\"contained\"",
      "    sx={{ mt: 3, mb: 2 }}",
      "  >",
      "    ${3:Submit}",
      "  </Button>",
      "</Box>"
    ]
  },
  
  "useContext Hook": {
    "prefix": "fcontext",
    "body": [
      "const { ${1:contextValue} } = use${2:Context}();"
    ]
  }
}
```

### **5. Multi-Cursor and Selection Tips**

```javascript
// Multiple cursors
Ctrl+Alt+Down/Up    // Add cursor below/above
Alt+Click           // Add cursor at click position
Ctrl+D              // Select next occurrence
Ctrl+Shift+L        // Select all occurrences
Alt+Shift+Drag      // Column selection

// Smart selection
Ctrl+Shift+Right    // Expand selection by word
Alt+Shift+Right     // Expand selection by scope
Ctrl+L              // Select entire line
```

### **6. Navigation Shortcuts**

```bash
# File Navigation
Ctrl+P              # Quick file open (fuzzy search)
Ctrl+Tab            # Switch between open files
Ctrl+Shift+P        # Command palette
Ctrl+,              # Open settings

# Code Navigation
F12                 # Go to definition
Alt+F12             # Peek definition
Shift+F12           # Find all references
Ctrl+Shift+O        # Go to symbol in file
Ctrl+T              # Go to symbol in workspace
Ctrl+G              # Go to line number

# Editor Navigation
Ctrl+Home/End       # Go to start/end of file
Ctrl+Left/Right     # Move by word
Alt+Left/Right      # Navigate back/forward
```

### **7. Productivity Features**

**Emmet for Quick HTML/JSX:**
```jsx
// Type these and press Tab:
div.container>h1{Title}+p{Content}+button{Click}

// Becomes:
<div className="container">
  <h1>Title</h1>
  <p>Content</p>
  <button>Click</button>
</div>

// More examples:
ul>li*5             // Creates ul with 5 li items
div#app.main        // <div id="app" className="main"></div>
input[type=text]    // <input type="text" />
```

**Quick Refactoring:**
```javascript
F2                  // Rename symbol (updates all references)
Ctrl+.              // Quick fix menu
Shift+Alt+F         // Format entire document
Ctrl+K Ctrl+F       // Format selection
```

### **8. Terminal Integration**

```bash
# Terminal shortcuts
Ctrl+`              # Toggle terminal
Ctrl+Shift+`        # Create new terminal
Ctrl+Shift+5        # Split terminal
Alt+Left/Right      # Switch between terminals

# Multiple terminal setup for Formula PM
Terminal 1: Backend server (npm run dev)
Terminal 2: Frontend server (npm start)
Terminal 3: Git commands
Terminal 4: Testing/utilities
```

### **9. Workspace Optimization**

**Recommended Workspace Layout:**
```
┌─────────────────┬──────────────────────┬────────────┐
│                 │                      │            │
│  File Explorer  │    Main Editor       │  Outline   │
│                 │                      │            │
│  - Components   │  CurrentFile.jsx     │  Methods   │
│  - Services     │                      │  State     │
│  - Utils        │                      │            │
│                 │                      │            │
├─────────────────┴──────────────────────┴────────────┤
│                    Terminal                          │
│  Backend | Frontend | Git | Utils                   │
└──────────────────────────────────────────────────────┘
```

### **10. Extension Recommendations by Category**

**For React Development:**
- ES7+ React/Redux/React-Native snippets
- Simple React Snippets
- Reactjs code snippets

**For Code Quality:**
- ESLint
- Prettier
- Error Lens
- Code Spell Checker

**For Productivity:**
- Auto Rename Tag
- Auto Close Tag
- Bracket Pair Colorizer
- Path Intellisense
- npm Intellisense

**For Git:**
- GitLens
- Git Graph
- Git History

**For Testing:**
- Jest Runner
- Jest Snippets
- Test Explorer UI

### **11. Performance Tips**

**VS Code Performance Settings:**
```json
{
  // Disable features that slow down large projects
  "search.followSymlinks": false,
  "git.autorefresh": false,
  "git.autofetch": false,
  
  // Exclude folders from search
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/build": true,
    "**/dist": true
  },
  
  // Disable extensions for certain files
  "files.associations": {
    "*.min.js": "plaintext",
    "*.min.css": "plaintext"
  }
}
```

### **12. Themes for Long Coding Sessions**

**Recommended Themes:**
- **One Dark Pro** - Balanced contrast, easy on eyes
- **Dracula Official** - High contrast for clarity
- **Night Owl** - Optimized for night coding
- **Material Theme Palenight** - Soft, comfortable colors
- **Shades of Purple** - Vibrant but not harsh

**Font Recommendations:**
- **Fira Code** - Excellent ligatures
- **Cascadia Code** - Microsoft's coding font
- **JetBrains Mono** - Designed for developers
- **Source Code Pro** - Adobe's coding font

Remember: The best setup is the one that makes YOU most productive. Experiment with these settings and customize them to your workflow!