import Header from "./Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="dashboard-layout">
            <Header/>
            <main className="main">
                {children}
            </main>
        </div>
    );
}
