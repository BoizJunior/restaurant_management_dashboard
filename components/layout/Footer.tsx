export function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Restaurant Management Dashboard &copy; 2025. 
          <span className="ml-2 italic text-xs">
            Estimates only — not accounting, tax, or business advice.
          </span>
        </p>
      </div>
    </footer>
  );
}
