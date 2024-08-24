import './Header.css';

function Header() {
    return (
        <header className="header-container">
            <div className="header-content">
                <div className="site-logo-name">NovelType</div>
                <nav className="header-nav">
                    <ul>
                        <li><a href="www.google.com">Home</a></li>
                        <li><a href="www.google.com">Typing Test</a></li>
                        <li><a href="www.google.com">About</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
