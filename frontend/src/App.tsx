// import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
// import { Header } from "@/components/layout/Header";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { ProjectProvider } from "@/contexts/ProjectContext";
// import { TaskProvider } from "@/contexts/TaskContext";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import TaskBoard from "./pages/TaskBoard";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <ProjectProvider>
//         <TaskProvider>
//           <TooltipProvider>
//             <Toaster />
//             <Sonner />
//             <BrowserRouter>
//               <div className="min-h-screen bg-background">
//                 <Header />
//                 <Routes>
//                   <Route path="/" element={<Index />} />
//                   <Route
//                     path="/project/:projectId"
//                     element={
//                       <ProtectedRoute>
//                         <TaskBoard />
//                       </ProtectedRoute>
//                     }
//                   />
//                   {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//                   <Route path="*" element={<NotFound />} />
//                 </Routes>
//               </div>
//             </BrowserRouter>
//           </TooltipProvider>
//         </TaskProvider>
//       </ProjectProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;



import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Footer } from './components/layout/Footer';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { TaskProvider } from './contexts/TaskContext';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import TaskBoard from './pages/TaskBoard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <TaskProvider>
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/board"
                    element={
                      <ProtectedRoute>
                        <TaskBoard />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </div>
              <Footer />
              <Toaster />
            </div>
          </TaskProvider>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;