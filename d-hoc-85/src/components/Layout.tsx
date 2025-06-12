
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Home, FileText, Clock, Users, LogOut, CheckCircle, XCircle, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: React.ReactNode;
  userRole: 'employee' | 'recruiter' | null;
  availableRoles?: ('employee' | 'recruiter')[];
  onRoleSwitch?: (role: 'employee' | 'recruiter') => void;
  onLogout: () => void;
}

const Layout = ({ children, userRole, availableRoles = [], onRoleSwitch, onLogout }: LayoutProps) => {
  const employeeMenuItems = [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "Add New Claim", icon: FileText, id: "new-claim" },
    { title: "Track Claims", icon: Clock, id: "track-claims" }
  ];

  const recruiterMenuItems = [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "View All Claims", icon: Users, id: "all-claims" },
    { title: "Pending Approvals", icon: Clock, id: "pending-claims" },
    { title: "Approved Claims", icon: CheckCircle, id: "approved-claims" },
    { title: "Rejected Claims", icon: XCircle, id: "rejected-claims" }
  ];

  const menuItems = userRole === 'employee' ? employeeMenuItems : recruiterMenuItems;

  if (!userRole) {
    return <div className="w-full">{children}</div>;
  }

  const canSwitchRoles = availableRoles.length > 1;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="bg-slate-50 border-r border-slate-200">
          <SidebarHeader className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">DASI Claims</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {userRole === 'recruiter' ? 'Recruiter' : 'Employee'}
                  </Badge>
                  {canSwitchRoles && (
                    <UserCog className="h-3 w-3 text-slate-500" />
                  )}
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            {/* Role Switcher */}
            {canSwitchRoles && onRoleSwitch && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Switch Role</h3>
                <div className="flex gap-2">
                  {availableRoles.includes('employee') && (
                    <Button
                      size="sm"
                      variant={userRole === 'employee' ? 'default' : 'outline'}
                      onClick={() => onRoleSwitch('employee')}
                      className="flex-1"
                    >
                      Employee
                    </Button>
                  )}
                  {availableRoles.includes('recruiter') && (
                    <Button
                      size="sm"
                      variant={userRole === 'recruiter' ? 'default' : 'outline'}
                      onClick={() => onRoleSwitch('recruiter')}
                      className="flex-1"
                    >
                      Recruiter
                    </Button>
                  )}
                </div>
              </div>
            )}

            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton className="w-full justify-start hover:bg-blue-50 hover:text-blue-700">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <div className="mt-auto pt-4">
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <SidebarTrigger className="mb-4" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
