# AI Coding Assistant Prompts

This project includes specialized prompts for AI coding assistants to ensure consistent, high-quality code generation following shadcn/ui and Next.js best practices.

## Available Prompt Files

### 1. `.cursorrules` (Cursor AI)
For users of Cursor AI editor. Automatically loaded when you use Cursor in this project.

### 2. `CLAUDE.md` (Claude Code)
For users of Claude Code (Anthropic). Claude will read this file and follow the instructions.

### 3. `.windsurfrules` (Windsurf AI)
For users of Windsurf AI editor. Automatically applied to all AI suggestions.

## What These Prompts Cover

### Core Development
- ✅ TypeScript best practices
- ✅ React & Next.js 14 App Router patterns
- ✅ Functional component development
- ✅ Server Component optimization

### shadcn/ui Integration
- ✅ Proper component usage
- ✅ `cn()` utility for className composition
- ✅ Theme color variables
- ✅ Component patterns (Button, Card, Dialog, Form)

### Form Handling
- ✅ react-hook-form integration
- ✅ Zod validation schemas
- ✅ Server Actions
- ✅ Error handling

### Styling
- ✅ Tailwind CSS utilities
- ✅ Responsive design patterns
- ✅ Chartreuse green (#7fff00) accent color
- ✅ Dark theme support

### Performance
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Server/Client component separation

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast

### Blockchain
- ✅ Solana development patterns
- ✅ Ethereum/Web3.js integration
- ✅ Secure wallet handling

## How to Use

### Cursor Users
1. The `.cursorrules` file is automatically detected
2. Start coding - Cursor will follow these rules automatically
3. All AI suggestions will align with the project standards

### Claude Code Users
1. Claude automatically reads `CLAUDE.md` in your project root
2. The AI assistant will follow these instructions for all responses
3. Ensures consistent code generation

### Windsurf Users
1. The `.windsurfrules` file is automatically loaded
2. All AI completions follow these guidelines
3. Project-wide consistency maintained

### GitHub Copilot Users
You can reference the patterns from any of these files in your code comments.

## Key Principles Enforced

### 1. Always Use shadcn/ui Components
```typescript
// ✅ Correct
import { Button } from "@/components/ui/button"

// ❌ Wrong - Don't create custom components
const MyButton = () => { ... }
```

### 2. Use cn() for Styling
```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-classes", "conditional", className)} />
```

### 3. Validate with Zod
```typescript
const schema = z.object({
  email: z.string().email(),
})
```

### 4. Server Components First
```typescript
// Default - Server Component (no "use client")
export default function Page() {
  return <div>Server rendered</div>
}

// Only when needed
"use client"
export function Interactive() {
  const [state, setState] = useState()
  return <div>Client component</div>
}
```

## Installing New shadcn/ui Components

When you need a new component:

```bash
npx shadcn add button
npx shadcn add card
npx shadcn add dialog
npx shadcn add form
npx shadcn add input
npx shadcn add label
npx shadcn add table
npx shadcn add dropdown-menu
npx shadcn add select
npx shadcn add textarea
npx shadcn add checkbox
npx shadcn add radio-group
npx shadcn add switch
```

## Project-Specific Settings

### Brand Color
- **Primary**: Chartreuse Green `#7fff00`
- **HSL**: `hsl(84, 100%, 50%)`
- **Usage**: Accents, buttons, highlights, active states

### File Organization
- **Components**: `app/components/`
- **UI Components**: `components/ui/`
- **Utilities**: `lib/`
- **Types**: Colocated with components or in `types/`

### Important Rules
1. **Never create new files** without explicit permission
2. Work within existing structure
3. Follow established patterns
4. Maintain type safety
5. Ensure accessibility
6. Optimize performance

## Troubleshooting

### AI Not Following Prompts?
- **Cursor**: Restart Cursor to reload `.cursorrules`
- **Claude**: Ensure `CLAUDE.md` is in project root
- **Windsurf**: Check that `.windsurfrules` is present

### Need to Customize?
Feel free to edit these files to match your specific needs. They're designed to be project-specific.

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Framer Motion](https://www.framer.com/motion)

---

**Note**: These prompts are living documents. Update them as your project evolves and new patterns emerge.

