import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ScriptEditorProps {
  script: string;
  onScriptChange: (script: string) => void;
}

const sampleScripts = [
  "A young woman with brown hair smiles warmly at the camera, waves hello, then points to the right with excitement. She nods and gives a thumbs up with both hands.",
  "A person looks directly at the camera with a friendly expression, slowly raises their hand to wave, then makes a welcoming gesture with both arms open wide.",
  "The character starts with a neutral expression, then breaks into a big smile, claps their hands together excitedly, and points upward with enthusiasm.",
  "A friendly character tilts their head slightly, smiles, then makes a 'come here' gesture with their hand before giving an encouraging nod.",
];

export default function ScriptEditor({ script, onScriptChange }: ScriptEditorProps) {
  const characterCount = script.length;
  const maxLength = 500;

  const generateSampleScript = () => {
    const randomScript = sampleScripts[Math.floor(Math.random() * sampleScripts.length)];
    onScriptChange(randomScript);
  };

  const clearScript = () => {
    onScriptChange("");
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={script}
        onChange={(e) => onScriptChange(e.target.value)}
        className="w-full h-32 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground resize-none focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
        placeholder="Describe what you want your character to do in the video...

Example: 'The character waves hello with a bright smile, then points excitedly towards something off-camera. They nod approvingly and give a thumbs up.'"
        maxLength={maxLength}
        data-testid="textarea-script"
      />
      
      <div className="flex justify-between items-center text-sm">
        <div className="text-muted-foreground">
          <span data-testid="text-character-count">{characterCount}</span> / {maxLength} characters
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={generateSampleScript}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-get-ideas"
          >
            <i className="fas fa-lightbulb mr-1"></i>
            Get Ideas
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearScript}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-clear-script"
          >
            <i className="fas fa-eraser mr-1"></i>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
