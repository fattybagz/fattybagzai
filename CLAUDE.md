# Claude AI Coding Instructions

This document provides instructions for Claude Code when working on this Next.js + shadcn/ui project.

## Project Overview

This is a modern web application built with:

- **Next.js 14** (App Router)
- **React 19**
- **TypeScript**
- **shadcn/ui** components
- **Tailwind CSS**
- **Framer Motion** for animations
- **Web3/Blockchain** integration (Solana, Ethereum)
- **Chartreuse Green (#7fff00)** as primary brand color

## Core Development Principles

### TypeScript-First Approach

- Use `interface` over `type` for object definitions
- Strict type checking enabled
- No `any` types unless absolutely necessary
- Use proper type inference

### React & Next.js Best Practices

- Prefer Server Components (default in App Router)
- Only use `"use client"` when necessary (for interactivity, hooks, browser APIs)
- Use Next.js App Router patterns for routing
- Implement proper loading and error states

### Component Development

- Use functional components with TypeScript
- Use the `function` keyword instead of `const` for component declarations
- Follow declarative JSX patterns
- Implement proper prop interfaces

## shadcn/ui Component System

### Always Use shadcn/ui Components

Never create custom implementations of components that shadcn/ui provides. Instead:

```typescript
// ✅ Correct - Use shadcn/ui
import { Button } from "@/components/ui/button"

// ❌ Wrong - Don't create custom buttons
function CustomButton() { ... }
```

### Component Import Patterns

```typescript
// Buttons
import { Button } from "@/components/ui/button";

// Forms
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Cards
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Dialogs
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
```

### Using the cn() Utility

Always use the `cn()` utility from `@/lib/utils` for className composition:

```typescript
import { cn } from "@/lib/utils";

function Component({ className }: { className?: string }) {
  return (
    <div className={cn("base-classes", "conditional-classes", className)} />
  );
}
```

## Styling with Tailwind CSS

### Use Tailwind Utilities

- Apply styles using Tailwind utility classes
- Use responsive modifiers: `sm:`, `md:`, `lg:`, `xl:`
- Use state modifiers: `hover:`, `focus:`, `active:`, `disabled:`

### Theme Colors

Use CSS variables for theming (defined in `app/globals.css`):

```typescript
// ✅ Use theme colors
<div className="bg-background text-foreground border-border" />

// ✅ Use chartreuse accent
<div className="bg-chartreuse text-black" />
<div className="text-[#7fff00] border-[#7fff00]" />

// Primary color values:
// - Hex: #7fff00
// - HSL: hsl(84, 100%, 50%)
```

## Form Handling

### Use react-hook-form + Zod

All forms must use react-hook-form with Zod validation:

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle form submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Server Actions

When creating server actions:

```typescript
"use server";

import { z } from "zod";

const actionSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function myAction(data: z.infer<typeof actionSchema>) {
  // Validate input
  const validated = actionSchema.parse(data);

  try {
    // Perform action
    return { success: true, data: validated };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}
```

## Animation with Framer Motion

Use Framer Motion for animations:

```typescript
"use client";

import { motion } from "framer-motion";

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

## Error Handling

Always implement proper error handling:

```typescript
// Use early returns
function processData(data: unknown) {
  if (!data) return null;
  if (typeof data !== "object") return null;

  // Process data
}

// Use try-catch for async operations
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
```

## Accessibility Guidelines

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, etc.)
- Include proper ARIA labels when needed
- Ensure keyboard navigation works
- Maintain color contrast ratios (WCAG AA minimum)
- Add focus indicators for interactive elements

## Performance Optimization

1. **Image Optimization**

   - Use Next.js `<Image>` component
   - Specify width and height
   - Use WebP format
   - Implement lazy loading

2. **Code Splitting**

   - Use dynamic imports for large components
   - Implement Suspense boundaries
   - Load non-critical code lazily

3. **Minimize Client-Side JavaScript**
   - Prefer Server Components
   - Only use `"use client"` when necessary
   - Avoid large client-side dependencies

## File Organization Rules

### Critical: Do Not Create New Files

- **NEVER** create new files or folders unless explicitly asked
- Work within existing `app/` directory structure
- Check existing files before suggesting new ones
- Ask for confirmation if a new file is absolutely necessary

### File Naming Conventions

- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Directories: kebab-case (e.g., `user-profile/`)

## Common Patterns

### Button Patterns

```typescript
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight } from "lucide-react"

// Primary action
<Button>Click me</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Loading state
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>

// With icon
<Button>
  Next
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
```

### Card Patterns

```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
</Card>;
```

### Dialog Patterns

```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>;
```

## Blockchain Integration

### Solana

```typescript
import { Connection, PublicKey } from "@solana/web3.js";

// Use environment variables for RPC endpoints
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC!);
```

### Ethereum (Web3.js)

```typescript
import Web3 from "web3";

// Secure wallet handling
const web3 = new Web3(window.ethereum);
```

## Testing Considerations

- Write testable, pure functions
- Separate business logic from UI components
- Use proper TypeScript types for better type checking
- Implement error boundaries for React components

## Key Reminders

1. ✅ Always use shadcn/ui components
2. ✅ Use `cn()` utility for className composition
3. ✅ Validate forms with Zod + react-hook-form
4. ✅ Prefer Server Components
5. ✅ Use chartreuse green (#7fff00) for accents
6. ✅ Implement proper TypeScript types
7. ✅ Handle errors gracefully
8. ✅ Ensure accessibility
9. ✅ Optimize for performance
10. ❌ Don't create new files without permission

## Installing New shadcn/ui Components

When you need a component that isn't installed:

```bash
npx shadcn add button
npx shadcn add card
npx shadcn add dialog
npx shadcn add form
npx shadcn add input
npx shadcn add label
npx shadcn add table
npx shadcn add dropdown-menu
```

## Resources

- [shadcn/ui Docs](https://ui.shadcn.com)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [Zod Validation](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)

---

**Remember**: This is a production application. Write clean, maintainable, type-safe code that follows modern best practices.
