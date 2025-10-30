import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShortcutsHelp({ open, onOpenChange }: ShortcutsHelpProps) {
  const shortcuts = [
    { keys: ["Ctrl", "K"], description: "Open command palette" },
    { keys: ["Ctrl", "N"], description: "Add new stock item" },
    { keys: ["Ctrl", "E"], description: "Export current view to CSV" },
    { keys: ["Ctrl", "P"], description: "Print current view" },
    { keys: ["Ctrl", "S"], description: "Manual save data" },
    { keys: ["Ctrl", "F"], description: "Focus search box" },
    { keys: ["/"], description: "Quick search" },
    { keys: ["?"], description: "Show this help" },
    { keys: ["Esc"], description: "Close dialogs/cancel" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Navigate faster with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <Badge key={keyIndex} variant="outline" className="font-mono text-xs">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
