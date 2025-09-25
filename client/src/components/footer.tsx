export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <i className="fas fa-play text-white text-sm"></i>
              </div>
              <h3 className="text-xl font-bold gradient-text" data-testid="text-footer-logo">AI Video Generator</h3>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md" data-testid="text-footer-description">
              Create stunning AI videos with consistent characters using free, open-source technology. No registration required.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-github">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-twitter">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-discord">
                <i className="fab fa-discord text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-resources-title">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-documentation">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-api">API Reference</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-examples">Examples</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-community">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-technology-title">Technology</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-svd">Stable Video Diffusion</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-huggingface">Hugging Face</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-stack">React + FastAPI</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors" data-testid="link-opensource">Open Source</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm mb-4 md:mb-0" data-testid="text-copyright">
            © 2024 AI Video Generator. Released under MIT License.
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-terms">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-support">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
