import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { resetAllTasks } from '../../store/slices/taskSlice';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const dispatchAction = useAppDispatch();
    const redirectTo = useNavigate();
    const { user: currentUser } = useAppSelector((state) => state.auth);

    const performLogout = () => {
        dispatchAction(logout());
        dispatchAction(resetAllTasks());
        redirectTo('/login');
    };

    const getUserInitial = () => {
        return currentUser?.username?.slice(0, 1).toUpperCase() || '?';
    };

    return (
        <nav className="gradient-bg shadow-xl">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="flex justify-between items-center py-5">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl backdrop-blur-sm">
                            <svg
                                className="w-7 h-7 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">TaskFlow</h1>
                    </div>

                    <div className="flex items-center space-x-5">
                        <div className="hidden sm:flex items-center space-x-3 bg-white bg-opacity-10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-sm font-bold text-white">
                                    {getUserInitial()}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-white">
                                {currentUser?.username}
                            </span>
                        </div>
                        <button
                            onClick={performLogout}
                            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-full transition-all duration-200 backdrop-blur-sm"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;

