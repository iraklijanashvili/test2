import { Button } from "@/components/ui/button";

type MobileNavProps = {
  active: 'utilities' | 'information' | 'content';
  onChange: (section: 'utilities' | 'information' | 'content') => void;
};

export default function MobileNav({ active, onChange }: MobileNavProps) {
  return (
    <div className="flex rounded-md shadow-sm" role="group">
      <Button
        type="button"
        variant={active === 'utilities' ? 'default' : 'outline'}
        className="w-1/3 rounded-l-lg rounded-r-none"
        onClick={() => onChange('utilities')}
      >
        Utilities
      </Button>
      <Button
        type="button"
        variant={active === 'information' ? 'default' : 'outline'}
        className="w-1/3 rounded-none border-x-0"
        onClick={() => onChange('information')}
      >
        Information
      </Button>
      <Button
        type="button"
        variant={active === 'content' ? 'default' : 'outline'}
        className="w-1/3 rounded-r-lg rounded-l-none"
        onClick={() => onChange('content')}
      >
        Content
      </Button>
    </div>
  );
}
