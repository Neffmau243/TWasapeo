import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <aside className="sidebar">
      {children}
    </aside>
  );
};

export default Sidebar;
