# Agent Rules — JMC Inventory App

## Mandatory Rules

### 1. Commit & Push on Every Task
- **Setiap task wajib commit dan push segera setelah selesai**
- Gunakan conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Format: `git add -A && git commit -m "<type>: <deskripsi>" && git push`

### 2. File Per Component
- **Setiap file harus dipecah per component/fungsi tunggal**
- Struktur frontend (Vue 3):
  ```
  src/
  ├── components/
  │   ├── ui/           # Base UI components (Button, Input, Modal, Table, dll)
  │   ├── forms/        # Form-specific components
  │   ├── layout/       # Layout components (Header, Sidebar, Footer)
  │   └── features/     # Feature-specific components
  ├── views/            # Page-level components
  ├── composables/      # Reusable logic (useAuth, useApi, dll)
  ├── stores/           # Pinia stores (per module)
  ├── services/         # API services (per endpoint group)
  ├── utils/            # Helper functions
  ├── types/            # TypeScript interfaces
  └── router/           # Route definitions
  ```
- Struktur backend:
  ```
  src/
  ├── modules/
  │   ├── auth/
  │   ├── users/
  │   ├── categories/
  │   ├── sub-categories/
  │   └── incoming-goods/
  │       ├── incoming-goods.controller.ts
  │       ├── incoming-goods.service.ts
  │       ├── incoming-goods.repository.ts
  │       ├── dto/
  │       └── entities/
  ├── common/
  │   ├── guards/
  │   ├── interceptors/
  │   ├── pipes/
  │   └── decorators/
  ├── config/
  └── main.ts
  ```

### 3. Component Granularity
- **Satu file = satu tanggung jawab (Single Responsibility)**
- Component UI reusable maksimal ~100 baris
- Service/Repository maksimal ~150 baris
- Hindari file "god" yang berisi banyak logic tidak terkait

### 4. Pre-commit Checklist
Sebelum commit, pastikan:
- [ ] Lint pass (`npm run lint`)
- [ ] Type check pass (`npm run typecheck` atau `tsc --noEmit`)
- [ ] Test pass (`npm run test`)
- [ ] Build success (`npm run build`)

### 5. Branch Strategy
- `main` — production ready
- `develop` — integration branch
- `feature/*` — fitur baru (dari `develop`)
- `fix/*` — bug fix (dari `develop` atau `main`)
- Merge via PR dengan review minimal 1 orang

---

**Enforcement**: Agent wajib menolak melanjutkan task jika aturan di atas tidak dipenuhi.