---
name: mobile-first-rule
description: Enforces mobile-first responsive architecture, screen-by-screen sliding navigation, tactile 4-folder organization, and sticky breadcrumb trails across the application.
trigger: always_on
---

# Mobile-First Design & Screen Sliding Standard

Whenever designing, creating, or modifying UI components and pages:

1. **Mobile-First Viewport Principle**:
   - Prioritize mobile screen dimensions (`100dvh`, compact layouts, clean typography, comfortable one-thumb reach zones).
   - On desktop screens, render within a sleek centered mobile-first container / frame with responsive adaptivity.

2. **Screen-by-Screen Sliding Mechanism**:
   - Replace long vertical scroll pages with discrete full-screen slides (`100dvh`).
   - Enable horizontal swipe gestures (`touchstart`, `touchmove`, `touchend`), navigation pills, and keyboard navigation (`ArrowLeft`, `ArrowRight`).
   - When a deep topic card's content exceeds the screen height, allow internal vertical scrolling within that specific view while preserving the global horizontal slide container.

3. **4-Folder Hierarchical Structure & Deep Exploration**:
   - Structure core knowledge into **4 Tactile Folders** (Bảo mật, Thân chủ, Nhà tham vấn, Quyền thân chủ).
   - Support drill-down navigation: `Root Folders` -> `Subfolders/Categories` -> `Topic Reading Cards`.

4. **Mandatory Sticky Breadcrumbs**:
   - Every view at depth >= 1 MUST display a sticky breadcrumb bar at the top (`📁 Thư mục > 🧠 Nhà tham vấn > 🚫 8 Điều cấm kỵ`) with an accessible 1-tap back button.

5. **Touch Ergonomics & Svelte 5 Runes**:
   - Maintain minimum 48px touch targets.
   - Use Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`) for high-performance reactive animations and state transitions.
