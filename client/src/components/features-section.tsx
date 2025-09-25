export default function FeaturesSection() {
  return (
    <section className="py-20 border-t border-border bg-card/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
            Powered by <span className="gradient-text">Advanced AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-subtitle">
            Built with cutting-edge Stable Video Diffusion technology for professional results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass-morphism rounded-2xl p-8 text-center" data-testid="feature-consistency">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-brain text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-4">Character Consistency</h3>
            <p className="text-muted-foreground">Advanced embedding technology ensures your character looks identical across all generated frames.</p>
          </div>

          <div className="glass-morphism rounded-2xl p-8 text-center" data-testid="feature-speed">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-bolt text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
            <p className="text-muted-foreground">Optimized Hugging Face inference endpoints deliver your videos in minutes, not hours.</p>
          </div>

          <div className="glass-morphism rounded-2xl p-8 text-center" data-testid="feature-privacy">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-shield-alt text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-4">Privacy First</h3>
            <p className="text-muted-foreground">Your images and videos are processed securely and never stored permanently on our servers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
