# Task List: Script Tag Restructuring for DSP Compliance

## Overview
Modify the `handleExport` function in `src/Ad.js` to generate HTML that matches the DSP-approved script structure found in `_examples/300x600/index.html`.

## Current Issues
- Multiple script tags (up to 3)
- Scripts placed in `<head>` section
- External script dependencies (AppNexus)
- Complex conditional script logic

## Target Structure (DSP-Approved)
- Single inline `<script>` tag
- Placed at the end of `<body>`
- All JavaScript consolidated into one block
- No external script dependencies
- **Keep AppNexus conditional logic but implement without external library**

## Required Changes

### 1. Consolidate Script Tags
**File:** `src/Ad.js` - `handleExport` function (around line 585)
**Task:** Merge all JavaScript into a single inline script block

**Current Structure:**
```html
<head>
  <!-- External AppNexus script (conditional) -->
  <script type="text/javascript" src="..."></script>
  
  <!-- Inline variables script -->
  <script type="text/javascript">
    var clickTag = "...";
    var clickTags = {...};
  </script>
</head>
<body>
  <!-- Content -->
  
  <!-- Animation script -->
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      // Animation logic + AppNexus logic
    });
  </script>
</body>
```

**Target Structure:**
```html
<head>
  <!-- No scripts in head -->
</head>
<body>
  <!-- Content -->
  
  <!-- Single consolidated script -->
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      // All JavaScript logic here (including AppNexus handling)
      var clickTag = "...";
      // Animation logic
      // Simplified AppNexus logic (if needed)
    });
  </script>
</body>
```

### 2. Remove External Script Dependencies
**Task:** Eliminate the AppNexus external script library
- Remove: `<script type="text/javascript" src="https://acdn.adnxs.com/html5-lib/1.3.0/appnexus-html5-lib.min.js"></script>`
- **Important:** Keep AppNexus functionality but implement it with simple JavaScript instead of external library

### 3. Move Variable Declarations
**Task:** Move `clickTag` and `clickTags` variable declarations from `<head>` to the consolidated script
- Remove the inline script in `<head>` that declares variables
- Declare variables inside the `DOMContentLoaded` event handler

### 4. Simplify Click Tag Logic (Keep AppNexus Support)
**Current AppNexus Logic (Complex):**
```javascript
// Relies on external APPNEXUS library
onClick="window.open(APPNEXUS.getClickTag('clickTAG'), '_blank');"
```

**Target Logic (Simple but still supports AppNexus):**
```javascript
// Simple approach that works for both regular and AppNexus
href="javascript:void(window.open(clickTag))"
// Where clickTag contains the appropriate URL based on isAppNexus flag
```

### 5. Update Link Generation (Preserve AppNexus Conditional Logic)
**Task:** Simplify how links are generated while keeping AppNexus support

**Current (Complex):**
```javascript
${isAppNexus 
  ? `<a href="javascript:void(0)" onClick="window.open(APPNEXUS.getClickTag('clickTAG_PI'), '_blank');">...`
  : `<a href="${fullPrescribingInfoLink}" target="_blank" rel="noopener noreferrer">...`
}
```

**Target (Simple but conditional):**
```javascript
// For Full Prescribing Info link - always simple
<a href="${fullPrescribingInfoLink}" target="_blank" rel="noopener noreferrer">Full Prescribing Information</a>

// For main click area - simple but still conditional
<a href="javascript:void(window.open(clickTag))" style="...">
// Where clickTag is set appropriately based on isAppNexus
```

### 6. Maintain AppNexus Conditional Logic (Simplified Implementation)
**Task:** Keep `isAppNexus` functionality but implement without external dependencies
- **Keep the AppNexus toggle in the UI** - users still need this option
- Modify the implementation to work without external APPNEXUS library
- Set appropriate URLs and parameters based on `isAppNexus` flag
- Use simple JavaScript variables instead of APPNEXUS.getClickTag() calls

**Example Implementation:**
```javascript
// Inside the consolidated script
document.addEventListener("DOMContentLoaded", function() {
  // Set clickTag based on whether this is AppNexus or not
  var clickTag = "${clickTag}"; // This would be set by the template based on isAppNexus
  
  // Animation logic (same as before)
  // ... scrolling text logic ...
});
```

## Implementation Steps

### Step 1: Backup Current Implementation
- [x] Copy current `src/Ad.js` to `src/Ad_backup.js`

### Step 2: Modify handleExport Function
- [x] Remove external script inclusion from `<head>`
- [x] Remove inline variable script from `<head>`
- [x] Consolidate all JavaScript into single script at end of `<body>`
- [x] Move variable declarations inside `DOMContentLoaded`

### Step 3: Simplify Link Generation (Keep AppNexus Logic)
- [x] Update Full Prescribing Information link generation (remove AppNexus complexity)
- [x] Update main click tag link generation (keep simple conditional logic)
- [x] **Keep `isAppNexus` conditional logic but implement without external library**

### Step 4: Test and Validate
- [ ] Test with AppNexus toggle OFF (regular mode)
- [ ] Test with AppNexus toggle ON (AppNexus mode)
- [ ] Test with different ad sizes
- [ ] Test IRI/ISI toggle functionality
- [ ] Test scrolling animation
- [ ] Validate HTML structure matches working example
- [ ] Test generated ZIP file

### Step 5: Document AppNexus Changes
- [ ] Document how AppNexus functionality now works without external library
- [ ] Test that AppNexus tracking still functions correctly
- [ ] Verify DSPs accept the new AppNexus implementation

## Files to Modify
1. `src/Ad.js` - Main implementation file
2. **Keep the AppNexus toggle in the UI** - just change how it's implemented

## Success Criteria
- Generated HTML has exactly one `<script>` tag
- Script tag is placed at the end of `<body>`
- No external script dependencies
- All functionality (scrolling, links) works as before
- **AppNexus functionality preserved but implemented without external library**
- HTML structure matches `_examples/300x600/index.html` pattern

## Notes
- DSPs prefer simple, predictable script structures
- External dependencies can cause security and performance concerns
- Single script at end of body ensures DOM is ready and doesn't block rendering
- **AppNexus support is maintained but simplified to work without external libraries** 