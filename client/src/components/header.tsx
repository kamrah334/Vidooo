export default function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <i className="fas fa-play text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold gradient-text" data-testid="text-logo">AI Video Generator</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-gallery">Gallery</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">Pricing</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">About</a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors md:block hidden" data-testid="button-profile">
              <i className="fas fa-user-circle text-xl"></i>
            </button>
            <button className="md:hidden" data-testid="button-menu">
              <i className="fas fa-bars text-muted-foreground"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
