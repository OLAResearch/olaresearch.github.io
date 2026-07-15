# OLAResearch Website Maintenance Guide

This guide explains how to add new research papers to the Omni Language AI Research website while maintaining the premium "Nature Distilled" aesthetic and interactive functionality.

## Adding a New Paper

### 1. Create the Paper Page

1.  Open `paper-template/index.html` and copy its entire content.
2.  Create a new folder in the root directory (e.g., `my-new-paper/`).
3.  Create an `index.html` file inside that folder.
4.  Paste the template content into your new `index.html` file.
5.  Add materials such as figures under the newly created paper folder. 

### 2. Populate Metadata
Fill in the following placeholders in your new HTML file:
*   `{{PAPER_TITLE}}`: The full title of your research.
*   `{{AUTHORS}}`: List of authors (comma-separated).
*   `{{VENUE}}`: Conference or Journal name (e.g., EACL 2026).
*   `{{PUBLICATION_DATE}}`: Month and Year of publication.
*   `{{PDF_URL}}`: Link to the paper's PDF file.
*   `{{EXTERNAL_URL}}`: Link to the official publication (e.g., ACL Anthology, ArXiv).
*   `{{ABSTRACT}}`: The paper's summary.
*   `{{BIBTEX}}`: The BibTeX citation for the paper.

**Paper Hero**: Includes institutional logos below the action buttons (PDF/Official Link).
To update affiliations, look for the `<div class="hero-affiliations">` container. Logos use the `.hero-affiliation-logo` class which provides a premium grayscale-to-color hover effect.

### 3. Add to Homepage (optional)
To make the new paper visible on the main page:
1.  Open `index.html`.
2.  Find the `<div class="research-grid">` section.
3.  Add a new research card using this structure:
    ```html
    <a href="my-new-paper/" class="research-card">
      <span class="tag">VENUE 202X</span>
      <h3>Full Paper Title</h3>
      <p>A short one or two-sentence description of the research impact.</p>
      <div class="card-arrow">Read Paper <i class="fas fa-arrow-right"></i></div>
    </a>
    ```

---

## Adding a Personal Page

To add a personal bio page for a team member:

### 1. Create the Personal Directory and File
1. Create a new subdirectory in the root directory named after the member's username or identifier (e.g., `sji/`).
2. Create an `index.html` file inside this new subdirectory.
3. You can copy the layout from `jis/index.html` to use as a starting template for personal bio pages or make your own.

### 2. Configure Relative Paths
Since the page is nested inside a subdirectory, make sure all relative asset paths in your HTML file point back to the root correctly:
*   Main stylesheet: `<link rel="stylesheet" href="../static/css/index.css">`
*   Brand logo: `<img src="../images/logos/olar.svg" ...>`
*   Main JavaScript file: `<script src="../static/js/main.js"></script>`

### 3. Add to the Homepage Team Grid
To link the personal page from the team section of the homepage:
1. Open the root `index.html`.
2. Locate the `<div class="team-grid">` section under `<section id="people">`.
3. Locate the member's card and update the anchor links (`href`) on the profile photo and name to point to your directory (e.g., `href="sji/"` or `href="sji/index.html"`).

---

## Adding Customized Styles

To add new custom CSS styling to pages while keeping the design cohesive:

### 1. Page-Scoped Custom Styling (Recommended)
If your styling is specific to a single page (such as a paper or a personal bio page), add it directly inside a `<style>` block within the `<head>` of that page's HTML file. This keeps the global styles clean and avoids stylesheet bloat.

### 2. Design System Variables
When writing custom CSS rules, always reference the design system's CSS variables to ensure consistency with the overall visual identity (such as colors and typography).

Key variables defined in `static/css/index.css`:
*   `var(--bg-color)`: Primary page background color (`#fdfcf9`)
*   `var(--text-primary)`: Primary text color (`#292826`)
*   `var(--text-secondary)`: Secondary text color (`#6e6b66`)
*   `var(--border-color)`: Neutral border color (`#ebe7df`)
*   `var(--surface-color)`: Background for cards and containers (`#ffffff`)
*   `var(--accent-earth)`: Primary earth tone accent color (`#b39371`)
*   `var(--accent-sage)`: Secondary sage green accent color (`#758273`)
*   `var(--font-serif)`: Serif font stack (`'Castoro', 'Georgia', serif`)
*   `var(--font-sans)`: Sans-serif font stack (`'Inter', 'Noto Sans', -apple-system, sans-serif`)
*   `var(--transition-smooth)`: Default smooth CSS transition curve

---

## Dependencies
*   **Styles**: `static/css/index.css` (Bespoke premium styles) and `static/css/bulma.min.css` (Grid system).
*   **Icons**: Loaded via FontAwesome 5 CDN in the `<head>`.
*   **Interactivity**: `static/js/main.js`.
