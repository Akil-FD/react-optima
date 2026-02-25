import Header from "./Header";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="dashboard-layout">
            <Header />
            <main className="main">
                <div className="auth-layout">
                    {children}
                </div>
            </main>
        </div>
    );
}
