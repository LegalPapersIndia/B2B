# TODO - Fix Subcategory Image Display Issue

## Task Summary:
- Subcategory images uploaded by Super Admin are not showing in the user panel
- Currently showing product images instead of subcategory reference images
- Need to show subcategory referenceImage from category data, fallback to product image

## Steps:

### Step 1: Backend - Include referenceImage in category API response
- [x] Edit Backend/routes/category.js to include referenceImage field in subcategories

### Step 2: Frontend - Update CategoryShowcase.jsx
- [ ] Use subcategory referenceImage from category data
- [ ] Add fallback to product image if no referenceImage

### Step 3: Frontend - Update Categorypage.jsx
- [ ] Add subcategory grid section showing referenceImage from category data

## Progress:
- [ ] Not Started
- [x] In Progress
- [ ] Completed
