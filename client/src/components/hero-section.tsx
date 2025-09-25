export default function HeroSection() {
  return (
    <section className="py-12 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Create AI Videos with
            <span className="gradient-text"> Consistent Characters</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Transform your character images into engaging AI videos. Upload an image, write your script, and watch your character come to life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2" data-testid="feature-free">
              <i className="fas fa-check text-accent"></i>
              <span>100% Free</span>
            </div>
            <div className="flex items-center space-x-2" data-testid="feature-no-registration">
              <i className="fas fa-check text-accent"></i>
              <span>No Registration Required</span>
            </div>
            <div className="flex items-center space-x-2" data-testid="feature-hugging-face">
              <i className="fas fa-check text-accent"></i>
              <span>Powered by Hugging Face</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
