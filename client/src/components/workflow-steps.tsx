export default function WorkflowSteps() {
  return (
    <section className="py-8 border-t border-border bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="workflow-step text-center" data-testid="step-upload">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-upload text-white text-lg"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">1. Upload Character</h3>
            <p className="text-muted-foreground text-sm">Upload a clear image of your character for consistent video generation</p>
          </div>
          
          <div className="workflow-step text-center" data-testid="step-script">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-edit text-white text-lg"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">2. Write Script</h3>
            <p className="text-muted-foreground text-sm">Describe the actions and movements you want your character to perform</p>
          </div>
          
          <div className="workflow-step text-center" data-testid="step-generate">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-magic text-white text-lg"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">3. Generate Video</h3>
            <p className="text-muted-foreground text-sm">AI creates your video with consistent character appearance throughout</p>
          </div>
        </div>
      </div>
    </section>
  );
}
