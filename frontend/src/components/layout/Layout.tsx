import NavigationBar from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8f0 100%)' }}>
            <NavigationBar />
            <main className="pb-12">{children}</main>
        </div>
    );
};

export default MainLayout;

