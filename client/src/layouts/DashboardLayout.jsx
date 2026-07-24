import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

export default function DashboardLayout({

    children,

}) {

    return (

        <div className="layout">

            <Sidebar />

            <div className="content">

                <Navbar />

                <main>

                    {children}

                </main>

            </div>

        </div>

    );

}