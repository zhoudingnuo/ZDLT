import React, { createContext, useContext, useState } from 'react';

// 创建Context
const UserListContext = createContext();

// Provider组件
export const UserListProvider = ({ children }) => {
  const [userListVisible, setUserListVisible] = useState(false);

  const value = {
    userListVisible,
    setUserListVisible,
    showUserList: () => setUserListVisible(true),
    hideUserList: () => setUserListVisible(false)
  };

  return (
    <UserListContext.Provider value={value}>
      {children}
    </UserListContext.Provider>
  );
};

// 自定义Hook
export const useUserList = () => {
  const context = useContext(UserListContext);
  if (!context) {
    throw new Error('useUserList must be used within a UserListProvider');
  }
  return context;
}; 